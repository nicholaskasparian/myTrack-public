import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '../../../../../lib/supabase';
import { nanoid } from 'nanoid';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { rating } = body;

    if (typeof rating !== 'number' || rating < 0 || rating > 10) {
      return NextResponse.json({ error: 'Invalid rating. Must be an integer between 0 and 10.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Upsert into song_ratings
    const { data: existingRating, error: fetchError } = await supabase
      .from('song_ratings')
      .select('id')
      .eq('user_id', userId)
      .eq('song_id', id)
      .single();

    if (existingRating) {
      const { error: updateError } = await supabase
        .from('song_ratings')
        .update({ rating })
        .eq('id', existingRating.id);

      if (updateError) {
        console.error('Failed to update song_ratings:', updateError);
        return NextResponse.json({ error: 'Failed to update rating' }, { status: 500 });
      }
    } else {
      const { error: insertError } = await supabase
        .from('song_ratings')
        .insert({
          id: nanoid(10),
          user_id: userId,
          song_id: id,
          rating
        });

      if (insertError) {
        console.error('Failed to insert into song_ratings:', insertError);
        return NextResponse.json({ error: 'Failed to insert rating' }, { status: 500 });
      }
    }

    // Update songs.rating and resurface
    const songUpdateData: any = { rating };

    if (rating >= 8) {
      songUpdateData.resurface = true;
    } else if (rating <= 4) {
      songUpdateData.resurface = false;
    }

    const { data: updatedSong, error: songUpdateError } = await supabase
      .from('songs')
      .update(songUpdateData)
      .eq('id', id)
      .select('resurface')
      .single();

    if (songUpdateError) {
      console.error('Failed to update song record:', songUpdateError);
      return NextResponse.json({ error: 'Failed to update song with rating' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, resurface: !!updatedSong?.resurface });
  } catch (error) {
    console.error('Error submitting rating:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}