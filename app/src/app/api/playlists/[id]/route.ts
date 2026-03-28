export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '../../../../lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    const { id } = params
    const supabase = getSupabaseAdmin()

    const { data: playlist, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !playlist) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 })
    }

    if (!playlist.is_public && playlist.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(playlist)
  } catch (error: any) {
    console.error('Playlist GET Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = params
    const body = await req.json()
    const { name, is_public } = body

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

    const updates: any = {}
    if (name !== undefined) updates.name = name
    if (is_public !== undefined) updates.is_public = is_public

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('playlists')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Playlist PATCH Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = params
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

    // Delete playlist (and rely on DB cascade for playlist_songs, or delete explicitly)
    await supabase.from('playlist_songs').delete().eq('playlist_id', id)

    const { error } = await supabase
      .from('playlists')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Playlist DELETE Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
