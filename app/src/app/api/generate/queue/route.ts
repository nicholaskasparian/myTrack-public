import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import ai, { MODELS } from '../../../../lib/gemini';
import { getSupabaseAdmin } from '../../../../lib/supabase';
import { Concept, SoundProfile, Song } from '../../../../lib/types';
import { nanoid } from 'nanoid';

export const maxDuration = 120;

const SYSTEM_INSTRUCTION_IDEAS = `You are a music director for a personalized AI music platform. Given a user's Sound Profile, generate exactly 9 distinct song concepts. 

Respond ONLY with valid JSON — no markdown, no preamble.

Return:
[
  {
    "title": "Short evocative song title (2-4 words)",
    "genre": "Primary genre",
    "secondary_genre": "Secondary genre or null",
    "mood": "One or two adjectives",
    "bpm": 88,
    "key_instruments": ["..."],
    "structure_hint": "Short description of sonic arc",
    "why": "One sentence explaining why this fits this user's Sound Profile"
  }
]`;

const SYSTEM_INSTRUCTION_PROMPT = `You are a creative director and expert prompt engineer. Given a song concept and a user's Sound Profile, write the complete lyrics and a single Lyria generation prompt that will produce a high-quality, personalized music track.

Respond ONLY with valid JSON — no markdown, no preamble.

Return:
{
  "lyrics": "Full song lyrics with sections like [Verse], [Chorus] and optional timestamps [00:15]",
  "lyria_prompt": "80-150 word technical description of the music. Start with the primary genre and tempo. Describe instrumentation concretely. Specify mood and energy arc. Include production style cues. Integrate themes from the lyrics."
}`;

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const mixType = body.mixType || 'Default Mix'; // 'Default Mix' or 'Custom Vibe'
    const vibePrompt = body.vibePrompt || '';

    const supabase = getSupabaseAdmin();

    // 1. Fetch user's Sound Profile
    const { data: profileData, error: profileError } = await supabase
      .from('sound_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError || !profileData) {
      console.error('Error fetching sound profile:', profileError);
      return NextResponse.json({ error: 'Sound profile not found' }, { status: 404 });
    }
    const sound_profile = profileData as SoundProfile;

    // 2. Generate 9 concepts via Flash
    let userPromptIdeas = `Sound Profile: ${JSON.stringify(sound_profile)}`;
    if (mixType === 'Custom Vibe' && vibePrompt) {
        userPromptIdeas += `\n\nGenerate concepts tailored to this specific vibe/mood hint: "${vibePrompt}". Still keep the user's general sound profile in mind, but heavily lean into the requested vibe.`;
    }
    
    const ideasResponse = await ai.models.generateContent({
      model: MODELS.FLASH,
      contents: userPromptIdeas,
      config: { 
        responseMimeType: 'application/json',
        systemInstruction: SYSTEM_INSTRUCTION_IDEAS
      }
    });

    const text = ideasResponse.text || "";
    const allConcepts: Concept[] = JSON.parse(text);

    // Pick 3 best by diversity (different genres)
    const selectedConcepts: Concept[] = [];
    const seenGenres = new Set<string>();

    for (const concept of allConcepts) {
      if (selectedConcepts.length >= 3) break;
      const genreKey = concept.genre.toLowerCase();
      if (!seenGenres.has(genreKey)) {
        selectedConcepts.push(concept);
        seenGenres.add(genreKey);
      }
    }
    // If we didn't get 3 distinct genres, fill up the rest
    for (const concept of allConcepts) {
      if (selectedConcepts.length >= 3) break;
      if (!selectedConcepts.includes(concept)) {
        selectedConcepts.push(concept);
      }
    }

    // 3. Check for resurface=true
    if (mixType === 'Default Mix') {
      const { data: resurfaceData } = await supabase
        .from('songs')
        .select('*')
        .eq('user_id', userId)
        .eq('resurface', true)
        .gte('rating', 8) // Ensure rating is >= 8 for resurfacing
        .order('rating', { ascending: false })
        .limit(1);

      if (resurfaceData && resurfaceData.length > 0) {
        const resurfaceSong = resurfaceData[0] as Song;
        if (resurfaceSong.concept_json) {
          selectedConcepts[0] = resurfaceSong.concept_json;
        }
      }
    }

    // 4. For each of 3 concepts: call prompt, music, cover generation in parallel
    const generateTrack = async (concept: Concept, position: number) => {
      const songId = nanoid();

      // a. Prompt & Lyrics Generation
      const promptResponse = await ai.models.generateContent({
        model: MODELS.PRO,
        contents: `Concept: ${JSON.stringify(concept)}\nSound Profile: ${JSON.stringify(sound_profile)}`,
        config: { 
          responseMimeType: 'application/json',
          systemInstruction: SYSTEM_INSTRUCTION_PROMPT 
        }
      });
      
      const responseText = promptResponse.text?.trim() || "{}";
      const { lyrics: proLyrics = "", lyria_prompt = "" } = JSON.parse(responseText);

      // b. Music & Cover in Parallel
      const coverPrompt = `Album cover art for "${concept.title}", a ${concept.genre} track. ${concept.mood} atmosphere.\nMinimal, editorial. Black and white with one accent color.\nNo faces. No text. Square format.\nStyle: abstract, modern, influenced by ${concept.genre} aesthetics`;

      const [musicResponse, coverResponse] = await Promise.all([
        ai.models.generateContent({
          model: MODELS.LYRIA,
          contents: `Prompt: ${lyria_prompt}\nLyrics: ${proLyrics}\n\nCreate a song between 2 minutes 45 seconds and 3 minutes long. Ensure you return the raw lyrics in the TEXT response modality.`,
          config: { responseModalities: ["AUDIO", "TEXT"] }
        }),
        ai.models.generateContent({
          model: MODELS.NANO_BANANA,
          contents: coverPrompt,
        })
      ]);

      // Extract Music
      let audioBuffer: Buffer | null = null;
      let lyriaLyrics = '';
      const mCandidate = musicResponse.candidates?.[0];
      if (mCandidate?.content?.parts) {
        for (const part of mCandidate.content.parts) {
          if (part.text) lyriaLyrics += part.text + '\n';
          if (part.inlineData && part.inlineData.mimeType?.startsWith('audio/') && part.inlineData.data) {
            audioBuffer = Buffer.from(part.inlineData.data, 'base64');
          }
        }
      }

      if (!proLyrics.trim()) {
        console.warn("No lyrics generated by Pro for", concept.title);
      }

      // Extract Cover
      let imageBuffer: Buffer | null = null;
      let imageExt = 'jpg';
      let imageMime = 'image/jpeg';
      const cCandidate = coverResponse.candidates?.[0];
      if (cCandidate?.content?.parts) {
        for (const part of cCandidate.content.parts) {
          if (part.inlineData && part.inlineData.mimeType?.startsWith('image/') && part.inlineData.data) {
            imageBuffer = Buffer.from(part.inlineData.data, 'base64');
            imageMime = part.inlineData.mimeType;
            imageExt = imageMime.split('/')[1] || 'jpg';
          }
        }
      }

      // Upload files
      let audioUrl = null;
      if (audioBuffer) {
        const { error: auErr } = await supabase.storage
          .from('audio')
          .upload(`${userId}/${songId}.mp3`, audioBuffer, { contentType: 'audio/mpeg', upsert: true });
        if (!auErr) {
          const { data: uData } = supabase.storage.from('audio').getPublicUrl(`${userId}/${songId}.mp3`);
          audioUrl = uData.publicUrl;
        }
      }

      let coverUrl = null;
      if (imageBuffer) {
        const { error: cuErr } = await supabase.storage
          .from('covers')
          .upload(`${userId}/${songId}.${imageExt}`, imageBuffer, { contentType: imageMime, upsert: true });
        if (!cuErr) {
          const { data: uData } = supabase.storage.from('covers').getPublicUrl(`${userId}/${songId}.${imageExt}`);
          coverUrl = uData.publicUrl;
        }
      }

      // 5. Store with status='queued', queue_position
      const newSong: Partial<Song> = {
        id: songId,
        user_id: userId,
        title: concept.title,
        genre: concept.genre,
        mood: concept.mood,
        bpm: concept.bpm,
        vibe: mixType === 'Custom Vibe' ? vibePrompt : concept.mood,
        lyria_prompt: lyria_prompt,
        lyrics: proLyrics.trim(),
        audio_url: audioUrl,
        cover_url: coverUrl,
        status: position === 1 ? 'ready' : 'queued',
        queue_position: position,
        concept_json: concept,
        profile_snapshot: sound_profile,
        is_public: false,
        play_count: 0,
        resurface: false,
      };

      await supabase.from('songs').insert([newSong]);
    };

    // Process all 3 in parallel
    await Promise.all(selectedConcepts.map((concept, index) => generateTrack(concept, index + 1)));

    // 6. Return queued count
    return NextResponse.json({ queued: 3 });

  } catch (error) {
    console.error('Error generating queue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
