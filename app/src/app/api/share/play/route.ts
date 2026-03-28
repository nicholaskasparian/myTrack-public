import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../../lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const songId = body.songId;
    if (!songId || typeof songId !== 'string') {
      return NextResponse.json({ error: 'songId is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: song, error: fetchError } = await supabase
      .from('songs')
      .select('id, play_count, is_public')
      .eq('id', songId)
      .eq('is_public', true)
      .single();

    if (fetchError || !song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    const currentCount = song.play_count || 0;
    let observedCount = currentCount;
    let succeeded = false;

    for (let attempt = 0; attempt < 3 && !succeeded; attempt++) {
      const { error: updateError } = await supabase
        .from('songs')
        .update({ play_count: observedCount + 1 })
        .eq('id', songId)
        .eq('play_count', observedCount);

      if (!updateError) {
        succeeded = true;
        observedCount = observedCount + 1;
        break;
      }

      const { data: latestSong, error: latestFetchError } = await supabase
        .from('songs')
        .select('play_count')
        .eq('id', songId)
        .single();

      if (latestFetchError || !latestSong) {
        console.error('Failed to read shared song play count after conflict:', latestFetchError || updateError);
        return NextResponse.json({ error: 'Failed to record play' }, { status: 500 });
      }

      observedCount = latestSong.play_count || 0;
      await new Promise((resolve) => setTimeout(resolve, 20 * (attempt + 1)));
    }

    if (!succeeded) {
      return NextResponse.json({ error: 'Failed to record play' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, play_count: observedCount });
  } catch (error) {
    console.error('Error recording shared song play:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
