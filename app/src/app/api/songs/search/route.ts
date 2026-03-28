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
import type { Song } from '../../../../lib/types';

const CONTROL_CHAR_PATTERN = /[\u0000-\u001F\u007F]/g;
const MAX_QUERY_LENGTH = 200;
const MAX_QUERY_TERMS = 6;
const SAFE_TERM_PATTERN = /[^a-zA-Z0-9- ]/g;
const FALLBACK_FETCH_LIMIT = 200;
type SearchableSong = Pick<Song, 'id' | 'title' | 'genre' | 'mood' | 'vibe' | 'lyrics'>;
type SearchProjection = SearchableSong & { searchable: string };

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
    const normalizedQuery = query.trim().replace(CONTROL_CHAR_PATTERN, '').slice(0, MAX_QUERY_LENGTH);
    if (!normalizedQuery) {
      return NextResponse.json({ error: 'Missing or invalid query' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Step 1: Attempt semantic search via embeddings + pgvector RPC
    try {
      const result = await ai.models.embedContent({
        model: MODELS.EMBEDDING,
        contents: normalizedQuery,
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
    } catch (semanticSearchError) {
      console.warn('Semantic search unavailable (embedding generation or search_songs RPC failed), falling back to text search:', semanticSearchError);
    }

    // Step 2 fallback: safe in-memory text search (works without embedding API or RPC setup)
    const queryTerms = normalizedQuery
      .replace(SAFE_TERM_PATTERN, '')
      .split(/\s+/)
      .map((term) => term.trim())
      .filter(Boolean)
      .slice(0, MAX_QUERY_TERMS);

    if (queryTerms.length === 0) {
      return NextResponse.json({ results: [] });
    }

    const { data: candidateSongs, error: fallbackError } = await supabase
      .from('songs')
      .select('id,title,genre,mood,vibe,lyrics')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(FALLBACK_FETCH_LIMIT);

    if (fallbackError) {
      console.error('Fallback text search error:', fallbackError);
      return NextResponse.json({ error: 'Failed to search songs' }, { status: 500 });
    }

    const normalizedTerms = queryTerms.map((term) => term.toLowerCase());
    const candidateProjections = ((candidateSongs || []) as SearchableSong[]).map((song) => ({
      ...song,
      searchable: `${song.title || ''} ${song.genre || ''} ${song.mood || ''} ${song.vibe || ''} ${song.lyrics || ''}`.toLowerCase(),
    }));

    const fallbackMatches = candidateProjections
      .filter((song: SearchProjection) => normalizedTerms.every((term) => song.searchable.includes(term)))
      .slice(0, 20);

    if (fallbackMatches.length === 0) {
      return NextResponse.json({ results: [] });
    }

    const matchedIds = fallbackMatches.map((song) => song.id);
    const { data: fallbackData, error: fallbackDetailsError } = await supabase
      .from('songs')
      .select('*')
      .eq('user_id', userId)
      .in('id', matchedIds);

    if (fallbackDetailsError) {
      console.error('Fallback details fetch error:', fallbackDetailsError);
      return NextResponse.json({ error: 'Failed to search songs' }, { status: 500 });
    }

    const resultById = new Map((fallbackData || []).map((song) => [song.id, song]));
    const orderedResults = matchedIds
      .map((id) => resultById.get(id))
      .filter((song): song is Song => Boolean(song));
    return NextResponse.json({ results: orderedResults });
  } catch (error) {
    console.error('Error searching songs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
