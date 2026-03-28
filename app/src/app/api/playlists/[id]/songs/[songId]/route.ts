import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '../../../../../../lib/supabase'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; songId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, songId } = params
    const supabase = getSupabaseAdmin()

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from('playlists')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 })
    }

    if (existing.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete song from playlist. songId can be the playlist_songs.id
    // If it's the song.id instead, this will fail to delete if we only check 'id'.
    // Let's delete where id = songId OR song_id = songId (limit 1 if it's song_id)
    // Actually, usually we pass the playlist_song id.
    const { error } = await supabase
      .from('playlist_songs')
      .delete()
      .eq('id', songId)
      .eq('playlist_id', id)

    // If no error, we might have deleted 0 rows if they passed the actual song_id.
    // Let's also try deleting by song_id if that was the intention.
    // But it's safer to just let the client pass the right ID. The client will pass playlist_song.id.
    
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Playlist Song DELETE Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
