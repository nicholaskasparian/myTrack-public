import { NextRequest, NextResponse } from 'next/server';
import ai, { MODELS } from '../../../../lib/gemini';
import { getSupabaseAdmin } from '../../../../lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { song_id } = body;

    if (!song_id) {
      return NextResponse.json({ error: 'Missing song_id' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: song, error: fetchError } = await supabase
      .from('songs')
      .select('title, genre, mood, bpm, lyria_prompt, lyrics, user_id')
      .eq('id', song_id)
      .single();

    if (fetchError || !song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    if (song.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Step 1 — Vibe generation (Gemini 3 Flash)
    const systemInstruction = `You are a music journalist writing short, evocative descriptions. Given a song's metadata, write a single sentence (max 25 words) that captures its feel. Be specific, sensory, and avoid cliches. Output the sentence only — no quotes, no preamble.`;
    
    const inputPayload = {
      title: song.title,
      genre: song.genre,
      mood: song.mood,
      bpm: song.bpm,
      lyria_prompt_excerpt: song.lyria_prompt ? song.lyria_prompt.substring(0, 100) : '',
    };

    const vibeResponse = await ai.models.generateContent({
      model: MODELS.FLASH,
      contents: JSON.stringify(inputPayload),
      config: {
        systemInstruction,
      },
    });

    const vibeText = vibeResponse.text ? vibeResponse.text.trim() : '';

    // Step 2 — Embedding (Gemini Embedding 2)
    const documentText = `${vibeText} | ${song.lyria_prompt || ''} | ${song.lyrics ? song.lyrics.substring(0, 200) : ''}`;

    const embedResult = await ai.models.embedContent({
      model: MODELS.EMBEDDING,
      contents: documentText,
      config: {
        taskType: 'RETRIEVAL_DOCUMENT',
      },
    });

    if (!embedResult.embeddings || embedResult.embeddings.length === 0) {
      throw new Error('No embeddings returned from the model.');
    }

    const embeddingVector = embedResult.embeddings[0].values;
    if (!embeddingVector) {
      throw new Error('No values in the embedding vector.');
    }

    // Store the vibe and embedding in Supabase
    const { error: updateError } = await supabase
      .from('songs')
      .update({
        vibe: vibeText,
        embedding: embeddingVector,
      })
      .eq('id', song_id);

    if (updateError) {
      console.error('Failed to update song with vibe and embedding:', updateError);
      return NextResponse.json({ error: 'Failed to update song' }, { status: 500 });
    }

    return NextResponse.json({ vibe: vibeText, embedding_stored: true });
  } catch (error) {
    console.error('Error generating embed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
