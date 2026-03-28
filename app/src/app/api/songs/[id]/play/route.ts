import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '../../../../../lib/supabase';
import { nanoid } from 'nanoid';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const supabase = getSupabaseAdmin();

    const { data: song, error: fetchError } = await supabase
      .from('songs')
      .select('play_count, status')
      .eq('id', id)
      .single();

    if (fetchError || !song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    const currentCount = song.play_count || 0;
    const newStatus = (song.status === 'queued' || song.status === 'ready') ? 'played' : song.status;

    const { error: updateError } = await supabase
      .from('songs')
      .update({ play_count: currentCount + 1, status: newStatus })
      .eq('id', id);

    if (updateError) {
      console.error('Failed to update song play count:', updateError);
    }

    const { error: historyError } = await supabase
      .from('play_history')
      .insert({
        id: nanoid(10),
        user_id: userId,
        song_id: id
      });

    if (historyError) {
      console.error('Failed to insert play history:', historyError);
    }

    return NextResponse.json({ success: true, play_count: currentCount + 1 });
  } catch (error) {
    console.error('Error recording play event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}