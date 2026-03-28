export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '../../../lib/supabase'
import { nanoid } from 'nanoid'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = getSupabaseAdmin()

    // 1. Get all playlists for user
    const { data: playlists, error: playlistsError } = await supabase
      .from('playlists')
      .select('*, playlist_songs(id)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (playlistsError) throw playlistsError

    // 2. Enhance with song counts and covers
    const enrichedPlaylists = await Promise.all(
      (playlists || []).map(async (playlist) => {
        const { data: songsData, error: songsError } = await supabase
          .from('playlist_songs')
          .select('songs(cover_url)')
          .eq('playlist_id', playlist.id)
          .order('position', { ascending: true })
          .limit(4)

        let cover_urls: string[] = []
        if (!songsError && songsData) {
          cover_urls = songsData
            .map((ps: any) => ps.songs?.cover_url)
            .filter(Boolean)
        }

        return {
          ...playlist,
          song_count: playlist.playlist_songs?.length || 0,
          cover_urls
        }
      })
    )

    return NextResponse.json(enrichedPlaylists)
  } catch (error: any) {
    console.error('Playlists GET Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { name, is_public = false } = body

    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const supabase = getSupabaseAdmin()
    const newPlaylist = {
      id: nanoid(10),
      user_id: userId,
      name,
      is_public
    }

    const { data, error } = await supabase
      .from('playlists')
      .insert(newPlaylist)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ ...data, song_count: 0, cover_urls: [] })
  } catch (error: any) {
    console.error('Playlists POST Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
