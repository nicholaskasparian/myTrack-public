import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../../../../lib/supabase';

export const dynamic = 'force-dynamic';

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

    const ratingsValues = (ratings || []).map((entry: any) => entry.rating).filter((r: any) => typeof r === 'number');
    const avgRating =
      ratingsValues.length > 0
        ? Number((ratingsValues.reduce((acc: number, value: number) => acc + value, 0) / ratingsValues.length).toFixed(1))
        : song.rating ?? null;

    const { data: relatedSongs } = await supabase
      .from('songs')
      .select('*')
      .eq('is_public', true)
      .neq('id', id)
      .or(`genre.eq.${song.genre || ''},mood.eq.${song.mood || ''}`)
      .order('rating', { ascending: false })
      .limit(6);

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
