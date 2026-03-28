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
    const { error: updateError } = await supabase
      .from('songs')
      .update({ play_count: currentCount + 1 })
      .eq('id', songId);

    if (updateError) {
      console.error('Failed to increment shared song play count:', updateError);
      return NextResponse.json({ error: 'Failed to record play' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, play_count: currentCount + 1 });
  } catch (error) {
    console.error('Error recording shared song play:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
