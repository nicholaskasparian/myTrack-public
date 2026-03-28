/*
  To support vector search, the following Supabase database function is required.
  Please run this SQL query via Supabase SQL Editor or a migration:

  create or replace function search_songs(query_embedding vector(768), match_user_id text, match_count int)
  returns table (id text, title text, cover_url text, genre text, bpm int, mood text, vibe text, rating int, created_at timestamptz, audio_url text, similarity float)
  language sql stable
  as $$
    select id, title, cover_url, genre, bpm, mood, vibe, rating, created_at, audio_url,
           1 - (embedding <=> query_embedding) as similarity
    from songs
    where user_id = match_user_id
      and status = 'ready'
      and embedding is not null
    order by embedding <=> query_embedding
    limit match_count;
  $$;
*/

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
    const { query } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid query' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Step 1: Attempt semantic search via embeddings + pgvector RPC
    try {
      const result = await ai.models.embedContent({
        model: MODELS.EMBEDDING,
        contents: query,
        config: {
          taskType: 'RETRIEVAL_QUERY',
        },
      });

      if (!result.embeddings || result.embeddings.length === 0) {
        throw new Error('No embeddings returned from the model.');
      }

      const queryVector = result.embeddings[0].values;
      if (!queryVector) {
        throw new Error('No values in the embedding vector.');
      }
      const vectorStr = `[${queryVector.join(',')}]`;

      const { data, error } = await supabase.rpc('search_songs', {
        query_embedding: vectorStr,
        match_user_id: userId,
        match_count: 20,
      });

      if (error) {
        throw error;
      }

      return NextResponse.json({ results: data || [] });
    } catch (semanticError) {
      console.warn('Semantic search unavailable, falling back to text search:', semanticError);
    }

    // Step 2 fallback: text search (works without embedding API or RPC setup)
    const escapedQuery = query.replace(/[%_]/g, (match) => `\\${match}`);
    const ilike = `%${escapedQuery}%`;
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('songs')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.${ilike},genre.ilike.${ilike},mood.ilike.${ilike},vibe.ilike.${ilike},lyrics.ilike.${ilike}`)
      .order('created_at', { ascending: false })
      .limit(20);

    if (fallbackError) {
      console.error('Fallback text search error:', fallbackError);
      return NextResponse.json({ error: 'Failed to search songs' }, { status: 500 });
    }

    return NextResponse.json({ results: fallbackData || [] });
  } catch (error) {
    console.error('Error searching songs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
