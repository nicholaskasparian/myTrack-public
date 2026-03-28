import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../../../lib/supabase';
import type { Song } from '../../../../../lib/types';

export const dynamic = 'force-dynamic';

type RatingRow = { rating: number | null };

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = getSupabaseAdmin();

    const { data: song, error: songError } = await supabase
      .from('songs')
      .select('id, genre, mood, play_count, rating, is_public')
      .eq('id', id)
      .eq('is_public', true)
      .single();

    if (songError || !song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    const { data: ratings } = await supabase
      .from('song_ratings')
      .select('rating')
      .eq('song_id', id);

    const ratingsValues = ((ratings || []) as RatingRow[])
      .map((entry) => entry.rating)
      .filter((r): r is number => typeof r === 'number');
    const avgRating =
      ratingsValues.length > 0
        ? Number((ratingsValues.reduce((acc: number, value: number) => acc + value, 0) / ratingsValues.length).toFixed(1))
        : song.rating ?? null;

    const relatedByGenrePromise = song.genre
      ? supabase
          .from('songs')
          .select('*')
          .eq('is_public', true)
          .neq('id', id)
          .eq('genre', song.genre)
          .order('rating', { ascending: false })
          .limit(6)
      : Promise.resolve({ data: [] as Song[] });

    const relatedByMoodPromise = song.mood
      ? supabase
          .from('songs')
          .select('*')
          .eq('is_public', true)
          .neq('id', id)
          .eq('mood', song.mood)
          .order('rating', { ascending: false })
          .limit(6)
      : Promise.resolve({ data: [] as Song[] });

    const [{ data: relatedByGenre }, { data: relatedByMood }] = await Promise.all([
      relatedByGenrePromise,
      relatedByMoodPromise,
    ]);

    const relatedSongMap = new Map<string, Song>();
    ([...(relatedByGenre || []), ...(relatedByMood || [])] as Song[]).forEach((candidate) => {
      if (candidate?.id && !relatedSongMap.has(candidate.id)) {
        relatedSongMap.set(candidate.id, candidate);
      }
    });
    const relatedSongs = [...relatedSongMap.values()]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6);

    return NextResponse.json({
      play_count: song.play_count || 0,
      avg_rating: avgRating,
      ratings_count: ratingsValues.length,
      related_songs: relatedSongs || [],
    });
  } catch (error) {
    console.error('Error loading song stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
