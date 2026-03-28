export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '../../../../lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    const { id } = params;

    const supabase = getSupabaseAdmin();

    const { data: song, error } = await supabase
      .from('songs')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    if (song.user_id !== userId && !song.is_public) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(song);
  } catch (error) {
    console.error('Error fetching song:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
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
    const { is_public, title } = body;

    const supabase = getSupabaseAdmin();

    // Verify ownership
    const { data: song, error: fetchError } = await supabase
      .from('songs')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    if (song.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData: any = {};
    if (typeof is_public === 'boolean') updateData.is_public = is_public;
    if (typeof title === 'string') updateData.title = title;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const { data: updatedSong, error: updateError } = await supabase
      .from('songs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update song' }, { status: 500 });
    }

    return NextResponse.json(updatedSong);
  } catch (error) {
    console.error('Error updating song:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const supabase = getSupabaseAdmin();

    // Verify ownership and get URLs
    const { data: song, error: fetchError } = await supabase
      .from('songs')
      .select('user_id, audio_url, cover_url')
      .eq('id', id)
      .single();

    if (fetchError || !song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    if (song.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Extract paths and delete from Storage
    const extractPath = (url: string, bucket: string) => {
      if (!url) return null;
      const parts = url.split(`/${bucket}/`);
      return parts.length > 1 ? parts[1] : null;
    };

    const audioPath = extractPath(song.audio_url, 'audio');
    if (audioPath) {
      await supabase.storage.from('audio').remove([audioPath]);
    }

    const coverPath = extractPath(song.cover_url, 'covers');
    if (coverPath) {
      await supabase.storage.from('covers').remove([coverPath]);
    }

    // Delete DB row
    const { error: deleteError } = await supabase
      .from('songs')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete song record' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting song:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}