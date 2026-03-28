import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '../../../../lib/supabase';

export const dynamic = 'force-dynamic';

type SongStatsRow = {
  id: string;
  created_at: string;
  genre: string | null;
  status: 'queued' | 'ready' | 'played';
  rating: number | null;
  resurface: boolean;
};

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    const [
      { data: songs, error: songsError },
      { data: playlists, error: playlistsError },
      { count: playEventsCount, error: playEventsError },
    ] = await Promise.all([
      supabase
        .from('songs')
        .select('id, created_at, genre, status, rating, resurface')
        .eq('user_id', userId),
      supabase
        .from('playlists')
        .select('id', { count: 'exact' })
        .eq('user_id', userId),
      supabase
        .from('play_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
    ]);

    if (songsError || playlistsError || playEventsError) {
      console.error('Failed to fetch stats:', songsError || playlistsError || playEventsError);
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }

    const safeSongs: SongStatsRow[] = (songs || []) as SongStatsRow[];
    const ratings = safeSongs
      .map((song) => song.rating)
      .filter((v): v is number => typeof v === 'number');
    const avgRating = ratings.length ? Number((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1)) : null;

    const genreCounts = new Map<string, number>();
    const dailyCounts = new Map<string, number>();

    safeSongs.forEach((song) => {
      const genre = song.genre || 'Unknown';
      genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);

      const day = song.created_at ? new Date(song.created_at).toISOString().split('T')[0] : 'unknown';
      dailyCounts.set(day, (dailyCounts.get(day) || 0) + 1);
    });

    const topGenres = [...genreCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genre, count]) => ({ genre, count }));

    const generationByDay = [...dailyCounts.entries()]
      .filter(([day]) => day !== 'unknown')
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([day, count]) => ({ day, count }));

    const resurfacedCount = safeSongs.filter((song) => song.resurface).length;
    const queuedCount = safeSongs.filter((song) => song.status === 'queued').length;
    const playedCount = safeSongs.filter((song) => song.status === 'played').length;

    return NextResponse.json({
      total_songs: safeSongs.length,
      total_playlists: playlists?.length || 0,
      total_plays: playEventsCount || 0,
      avg_rating: avgRating,
      resurfaced_count: resurfacedCount,
      queued_count: queuedCount,
      played_count: playedCount,
      avg_generation_seconds: null,
      top_genres: topGenres,
      generation_by_day: generationByDay,
    });
  } catch (error) {
    console.error('Error loading song stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
