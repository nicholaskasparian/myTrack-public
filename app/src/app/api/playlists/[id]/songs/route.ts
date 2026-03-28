export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '../../../../../lib/supabase'
import { nanoid } from 'nanoid'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    const { id } = params
    const supabase = getSupabaseAdmin()

    // Get playlist info to check visibility/ownership
    const { data: playlist, error: fetchError } = await supabase
      .from('playlists')
      .select('is_public, user_id')
      .eq('id', id)
      .single()

    if (fetchError || !playlist) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 })
    }

    if (!playlist.is_public && playlist.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get ordered songs
    const { data, error } = await supabase
      .from('playlist_songs')
      .select(`
        id,
        playlist_id,
        song_id,
        position,
        added_at,
        songs:song_id (*)
      `)
      .eq('playlist_id', id)
      .order('position', { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Playlist Songs GET Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = params
    const body = await req.json()
    const { song_id } = body

    if (!song_id) return NextResponse.json({ error: 'song_id is required' }, { status: 400 })

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

    // Get current max position
    const { data: maxPosData, error: maxError } = await supabase
      .from('playlist_songs')
      .select('position')
      .eq('playlist_id', id)
      .order('position', { ascending: false })
      .limit(1)

    const nextPos = (maxPosData && maxPosData.length > 0) ? maxPosData[0].position + 1 : 0

    // Insert new song
    const newEntry = {
      id: nanoid(10),
      playlist_id: id,
      song_id,
      position: nextPos
    }

    const { data, error } = await supabase
      .from('playlist_songs')
      .insert(newEntry)
      .select('id, playlist_id, song_id, position, added_at, songs:song_id (*)')
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Playlist Songs POST Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = params
    const body = await req.json()
    // Body should be an array of playlist_song ids in the new order
    // Wait, the instructions say "Body: { ordered_song_ids: string[] }" but
    // usually we drag by the playlist_song.id or song.id. 
    // Let's assume it's playlist_song.id because a song might be duplicated in a playlist.
    const { ordered_song_ids } = body

    if (!Array.isArray(ordered_song_ids)) {
      return NextResponse.json({ error: 'ordered_song_ids must be an array' }, { status: 400 })
    }

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

    // Update positions
    // Supabase doesn't have an easy bulk update. We can do Promise.all or an upsert.
    // Given the array isn't massive usually, Promise.all on updates is okay,
    // but upsert is better if we have the playlist_songs ids.
    
    // We update each playlist_song id by its index
    const updatePromises = ordered_song_ids.map((playlist_song_id, index) => 
      supabase
        .from('playlist_songs')
        .update({ position: index })
        .eq('id', playlist_song_id)
        .eq('playlist_id', id)
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Playlist Songs PATCH Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
