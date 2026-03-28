import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import ai, { MODELS } from '../../../../lib/gemini';
import { getSupabaseAdmin } from '../../../../lib/supabase';
import { Concept, SoundProfile, Song } from '../../../../lib/types';
import { nanoid } from 'nanoid';

const SYSTEM_INSTRUCTION_PROMPT = `You are a creative director and expert prompt engineer. Given a song concept and a user's Sound Profile, write the complete lyrics and a single Lyria generation prompt that will produce a high-quality, personalized music track.

Generate lyrics with precise [mm:ss.xx] timing markers for every line. Align markers with the song's BPM and structure (e.g., Intro ends at 00:15, Verse 1 starts at 00:16). Output should be a valid LRC string.

Respond ONLY with valid JSON — no markdown, no preamble.

Return:
{
  "lyrics": "Valid LRC string with precise [mm:ss.xx] timing markers for every line",
  "lyria_prompt": "80-150 word technical description of the music. Start with the primary genre and tempo. Describe instrumentation concretely. Specify mood and energy arc. Include production style cues. Integrate themes from the lyrics."
}`;

export const maxDuration = 300; // Vercel timeout increased for long music gen

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    let concept = body.concept;
    const moodHint = body.moodHint;

    if (!concept) {
      concept = {
        title: moodHint ? 'Custom Vibe' : 'Default Mix',
        genre: 'Mixed',
        secondary_genre: null,
        mood: moodHint || 'Profile Based',
        bpm: 120,
        key_instruments: [],
        structure_hint: '',
        why: moodHint ? 'Generated from custom vibe' : 'Default profile mix'
      };
    }

    const supabase = getSupabaseAdmin();

    console.log(`[GenerateMusic] Fetching profile for user ${userId}`);
    const { data: profileData, error: profileError } = await supabase
      .from('sound_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError || !profileData) {
      console.error('Error fetching sound profile:', profileError);
      return NextResponse.json({ error: 'Sound profile not found. Please sync your Spotify data on the dashboard first.' }, { status: 404 });
    }
    
    const sound_profile = profileData;

    // Stage 2: Prompt & Lyrics Generation via Gemini Pro
    console.log('[GenerateMusic] Stage 2: Generating prompt and lyrics...');
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
    let parsedResponse: any = {};
    let cleanText = responseText;
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    try {
      parsedResponse = JSON.parse(cleanText);
    } catch (e) {
      console.error('Failed to parse Gemini response', responseText);
      return NextResponse.json({ error: 'Failed to generate prompt or lyrics format' }, { status: 500 });
    }
    const { lyrics: proLyrics = "", lyria_prompt = "" } = parsedResponse;

    if (!proLyrics || !lyria_prompt) {
      return NextResponse.json({ error: 'Failed to generate prompt or lyrics content' }, { status: 500 });
    }

    // Strip LRC timing markers for Stage 3 generation to avoid confusing Lyria
    const plainLyrics = proLyrics.replace(/\[\d{2}:\d{2}\.\d{2}\]/g, '').trim();

    // Stage 3: Music and Cover Generation
    console.log('[GenerateMusic] Stage 3: Generating music and cover art...');
    const coverPrompt = `Album cover art for "${concept.title}", a ${concept.genre} track. ${concept.mood} atmosphere.\nMinimal, editorial. Black and white with one accent color.\nNo faces. No text. Square format.\nStyle: abstract, modern, influenced by ${concept.genre} aesthetics`;

    const [musicResponse, coverResponse] = await Promise.all([
      ai.models.generateContent({
        model: MODELS.LYRIA,
        contents: `Generate a ${concept.genre} song. ${lyria_prompt}\n\nLyrics:\n${plainLyrics}`,
        config: {
          responseModalities: ["AUDIO", "TEXT"],
          safetySettings: [
            { category: 'HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          ]
        },
      }),
      ai.models.generateContent({
        model: MODELS.NANO_BANANA,
        contents: coverPrompt,
      })
    ]);

    let audioBuffer: Buffer | null = null;
    let lyriaLyrics = '';
    let refusalText = '';

    if (musicResponse.promptFeedback?.blockReason) {
      return NextResponse.json({ error: `Prompt blocked by safety filters: ${musicResponse.promptFeedback.blockReason}` }, { status: 400 });
    }

    const candidate = musicResponse.candidates?.[0];
    
    if (!candidate) {
      return NextResponse.json({ error: 'Model returned no candidates. It might have been blocked or failed internally.' }, { status: 500 });
    }

    if (candidate.finishReason && candidate.finishReason !== 'STOP' && candidate.finishReason !== 'MAX_TOKENS') {
      return NextResponse.json({ error: `Model failed to finish: ${candidate.finishReason}` }, { status: 500 });
    }

    if (candidate.content && candidate.content.parts) {
      for (const part of candidate.content.parts) {
        if (part.text) {
          lyriaLyrics += part.text + '\n';
          refusalText += part.text;
        }
        if (part.inlineData && part.inlineData.data) {
          // Check for any audio-like mime type or just accept it if we have inlineData
          const mime = part.inlineData.mimeType || '';
          if (mime.startsWith('audio/') || !mime) {
            audioBuffer = Buffer.from(part.inlineData.data, 'base64');
          }
        }
      }
    }

    if (!audioBuffer) {
      console.error('[GenerateMusic] No audio buffer in Lyria response. Full response structure:', JSON.stringify({
        finishReason: candidate.finishReason,
        partsCount: candidate.content?.parts?.length,
        hasText: !!refusalText,
        text: refusalText,
        promptFeedback: musicResponse.promptFeedback
      }));
      
      const errorMsg = refusalText 
        ? `Model refused to generate audio: ${refusalText.substring(0, 200)}`
        : `No audio generated. Finish reason: ${candidate.finishReason || 'Unknown'}. Parts: ${candidate.content?.parts?.length || 0}.`;
      return NextResponse.json({ error: errorMsg }, { status: 500 });
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

    const songId = nanoid();

    console.log('[GenerateMusic] Uploading assets to Supabase...');
    const { error: uploadError } = await supabase.storage
      .from('audio')
      .upload(`${userId}/${songId}.mp3`, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload audio' }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from('audio').getPublicUrl(`${userId}/${songId}.mp3`);
    const audioUrl = urlData.publicUrl;

    let coverUrl = null;
    if (imageBuffer) {
      const { error: cuErr } = await supabase.storage
        .from('covers')
        .upload(`${userId}/${songId}.${imageExt}`, imageBuffer, { contentType: imageMime, upsert: true });
      if (!cuErr) {
        const { data: cUrlData } = supabase.storage.from('covers').getPublicUrl(`${userId}/${songId}.${imageExt}`);
        coverUrl = cUrlData.publicUrl;
      }
    }

    console.log('[GenerateMusic] Saving song to database...');
    const newSong = {
      id: songId,
      user_id: userId,
      title: concept.title,
      genre: concept.genre,
      mood: concept.mood,
      bpm: concept.bpm,
      vibe: concept.mood,
      lyria_prompt: lyria_prompt,
      lyrics: proLyrics.trim(),
      audio_url: audioUrl,
      cover_url: coverUrl,
      status: 'ready',
      concept_json: concept,
      profile_snapshot: sound_profile,
      is_public: false,
      play_count: 0,
      resurface: false,
    };

    const { error: dbError } = await supabase
      .from('songs')
      .insert([newSong]);

    if (dbError) {
      console.error('Database Error:', dbError);
      return NextResponse.json({ error: 'Failed to save song metadata' }, { status: 500 });
    }

    console.log('[GenerateMusic] Success!');
    return NextResponse.json({ song: newSong });

  } catch (error: any) {
    console.error('Error generating music:', error);
    // Return more helpful error message if possible
    const message = error.message || 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
