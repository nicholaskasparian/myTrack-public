import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import ai, { MODELS, HarmCategory, HarmBlockThreshold } from '../../../../lib/gemini';
import { getSupabaseAdmin } from '../../../../lib/supabase';
import { Concept, SoundProfile, Song } from '../../../../lib/types';
import { nanoid } from 'nanoid';

export const maxDuration = 300; // Increased timeout for multiple music gens

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

Generate lyrics with precise [mm:ss.xx] timing markers for every line. Align markers with the song's BPM and structure (e.g., Intro ends at 00:15, Verse 1 starts at 00:16). Output should be a valid LRC string.

Respond ONLY with valid JSON — no markdown, no preamble.

Return:
{
  "lyrics": "Valid LRC string with precise [mm:ss.xx] timing markers for every line",
  "lyria_prompt": "80-150 word technical description of the music. Start with the primary genre and tempo. Describe instrumentation concretely. Specify mood and energy arc. Include production style cues. Integrate themes from the lyrics."
}`;

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const moodHint = body.moodHint || '';

    const supabase = getSupabaseAdmin();

    console.log(`[QueueMusic] Starting queue generation for user ${userId}`);
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
    console.log('[QueueMusic] Generating concepts...');
    let userPromptIdeas = `Sound Profile: ${JSON.stringify(sound_profile)}`;
    if (moodHint) {
        userPromptIdeas += `\n\nGenerate concepts tailored to this specific vibe/mood hint: "${moodHint}". Still keep the user's general sound profile in mind, but heavily lean into the requested vibe.`;
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
    if (!moodHint) {
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
      try {
        const songId = nanoid();
        console.log(`[QueueMusic] Generating track ${position}: ${concept.title}`);

        // a. Prompt & Lyrics Generation
        const promptResponse = await ai.models.generateContent({
          model: MODELS.PRO,
          contents: `Concept: ${JSON.stringify(concept)}\nSound Profile: ${JSON.stringify(sound_profile)}`,
          config: { 
            responseMimeType: 'application/json',
            responseJsonSchema: { type: 'object', properties: { lyrics: { type: 'string' }, lyria_prompt: { type: 'string' } }, required: ['lyrics', 'lyria_prompt'] },
            systemInstruction: SYSTEM_INSTRUCTION_PROMPT 
          }
        });
        
        const responseText = promptResponse.text?.trim() || "{}";
        let cleanText = responseText;
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.replace(/^```json\n/, '').replace(/\n```$/, '');
        } else if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```\n/, '').replace(/\n```$/, '');
        }

        let parsedResponse: any = {};
        try {
          parsedResponse = JSON.parse(cleanText);
        } catch (e) {
          console.error('[QueueMusic] Failed to parse Gemini response', responseText);
          throw new Error('Failed to generate prompt or lyrics format');
        }
        
        const { lyrics: proLyrics = "", lyria_prompt = "" } = parsedResponse;

        if (!proLyrics || !lyria_prompt) {
          throw new Error('Failed to generate lyrics or prompt for queue track');
        }

        // Strip LRC timing markers for Stage 3 generation
        const plainLyrics = proLyrics.replace(/\[\d{2}:\d{2}\.\d{2}\]/g, '').trim();

        // b. Music & Cover in Parallel
        const coverPrompt = `Album cover art for "${concept.title}", a ${concept.genre} track. ${concept.mood} atmosphere.\nMinimal, editorial. Black and white with one accent color.\nNo faces. No text. Square format.\nStyle: abstract, modern, influenced by ${concept.genre} aesthetics`;

        const [musicResponse, coverResponse] = await Promise.all([
          ai.models.generateContent({
            model: MODELS.LYRIA,
            contents: `Generate a ${concept.genre} song. ${lyria_prompt}\n\nLyrics:\n${plainLyrics}`,
            config: { 
              responseModalities: ["AUDIO", "TEXT"],
              safetySettings: [
                { category: HarmCategory.HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
              ]
            }
          }),
          ai.models.generateContent({
            model: MODELS.NANO_BANANA,
            contents: coverPrompt,
          })
        ]);

        // Extract Music
        let audioBuffer: Buffer | null = null;
        let lyriaLyrics = '';

        if (musicResponse.promptFeedback?.blockReason) {
          console.warn(`[QueueMusic] Prompt blocked for ${concept.title}: ${musicResponse.promptFeedback.blockReason}`);
          throw new Error(`Prompt blocked: ${musicResponse.promptFeedback.blockReason}`);
        }

        const mCandidate = musicResponse.candidates?.[0];
        
        if (mCandidate && mCandidate.content && mCandidate.content.parts) {
          for (const part of mCandidate.content.parts) {
            if (part.text) lyriaLyrics += part.text + '\n';
            if (part.inlineData && part.inlineData.data) {
              const mime = part.inlineData.mimeType || '';
              if (mime.startsWith('audio/') || !mime) {
                audioBuffer = Buffer.from(part.inlineData.data, 'base64');
              }
            }
          }
        }

        if (!audioBuffer) {
          const reason = mCandidate?.finishReason || 'Unknown';
          const text = mCandidate?.content?.parts?.find(p => p.text)?.text || '';
          throw new Error(`No audio generated for queue track (Reason: ${reason}). Text: ${text.substring(0, 50)}`);
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
          vibe: moodHint ? moodHint : concept.mood,
          lyria_prompt: lyria_prompt,
          lyrics: proLyrics.trim(),
          audio_url: audioUrl,
          cover_url: coverUrl,
          status: 'ready',
          queue_position: position,
          concept_json: concept,
          profile_snapshot: sound_profile,
          is_public: false,
          play_count: 0,
          resurface: false,
        };

        await supabase.from('songs').insert([newSong]);
        console.log(`[QueueMusic] Finished track ${position}`);
      } catch (err) {
        console.error(`[QueueMusic] Failed to generate track ${position}:`, err);
        // Continue with other tracks
      }
    };

    // Process tracks. Sequential is safer for rate limits and timeouts on Vercel
    for (let i = 0; i < selectedConcepts.length; i++) {
        await generateTrack(selectedConcepts[i], i + 1);
    }

    // 6. Return queued count
    return NextResponse.json({ queued: selectedConcepts.length });

  } catch (error: any) {
    console.error('Error generating queue:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
