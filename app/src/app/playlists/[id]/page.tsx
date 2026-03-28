'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import AudioPlayer from '../../../components/AudioPlayer'
import { Playlist, PlaylistSong } from '../../../lib/types'

export default function PlaylistDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, isLoaded } = useUser()

  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [songs, setSongs] = useState<PlaylistSong[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editIsPublic, setEditIsPublic] = useState(false)

  const [isPlayingAll, setIsPlayingAll] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)

  const [dragEnabledIdx, setDragEnabledIdx] = useState<number | null>(null)
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false)

  const fetchPlaylist = async () => {
    try {
      const plRes = await fetch(`/api/playlists/${id}`)
      if (plRes.ok) {
        const data = await plRes.json()
        setPlaylist(data)
        setEditName(data.name)
        setEditIsPublic(data.is_public)
      } else if (plRes.status === 404 || plRes.status === 403) {
        router.push('/playlists')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchSongs = async () => {
    try {
      const res = await fetch(`/api/playlists/${id}/songs`)
      if (res.ok) setSongs(await res.json())
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (!id || !isLoaded) return
    setIsLoading(true)
    Promise.all([fetchPlaylist(), fetchSongs()]).finally(() => setIsLoading(false))
  }, [id, isLoaded])

  const isOwner = isLoaded && user && playlist?.user_id === user.id

  const handleUpdatePlaylist = async () => {
    if (!editName.trim()) return
    setIsEditing(false)
    try {
      const res = await fetch(`/api/playlists/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, is_public: editIsPublic }),
      })
      if (res.ok) setPlaylist(await res.json())
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeletePlaylist = async () => {
    if (!confirm('Are you sure you want to delete this playlist?')) return
    try {
      const res = await fetch(`/api/playlists/${id}`, { method: 'DELETE' })
      if (res.ok) router.push('/playlists')
    } catch (e) {
      console.error(e)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied to clipboard!')
  }

  const handleRemoveSong = async (songId: string) => {
    try {
      const res = await fetch(`/api/playlists/${id}/songs/${songId}`, { method: 'DELETE' })
      if (res.ok) setSongs(songs.filter((s) => s.id !== songId))
    } catch (e) {
      console.error(e)
    }
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
  }

  const handleDragEnter = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === targetIndex) return

    const newSongs = [...songs]
    const draggedItem = newSongs[draggedIdx]
    newSongs.splice(draggedIdx, 1)
    newSongs.splice(targetIndex, 0, draggedItem)

    setSongs(newSongs)
    setDraggedIdx(targetIndex)
  }

  const handleDragEnd = async () => {
    setDraggedIdx(null)
    setDragEnabledIdx(null)
    setIsUpdatingOrder(true)
    try {
      await fetch(`/api/playlists/${id}/songs`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ordered_song_ids: songs.map((s) => s.id) }),
      })
    } catch (e) {
      console.error(e)
    } finally {
      setIsUpdatingOrder(false)
    }
  }

  const handlePlayAll = () => {
    if (songs.length === 0) return
    setCurrentSongIndex(0)
    setIsPlayingAll(true)
  }

  const handleSongEnded = () => {
    if (currentSongIndex < songs.length - 1) setCurrentSongIndex((prev) => prev + 1)
    else setIsPlayingAll(false)
  }

  if (isLoading) return <div className="page-wrap"><div className="notice">Loading...</div></div>
  if (!playlist) return <div className="page-wrap"><div className="notice">Playlist not found.</div></div>

  return (
    <div className="page-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <nav className="surface top-nav">
        <div className="brand">Playlist details</div>
        <div className="nav-links">
          <Link href="/playlists" className="btn btn-secondary">Back to playlists</Link>
          <Link href="/library" className="btn btn-secondary">Library</Link>
        </div>
      </nav>

      <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.8rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {isEditing ? (
              <>
                <input className="input" type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
                <label style={{ display: 'flex', gap: '0.4rem', color: 'var(--ink-muted)' }}>
                  <input type="checkbox" checked={editIsPublic} onChange={(e) => setEditIsPublic(e.target.checked)} /> Public playlist
                </label>
                <div style={{ display: 'flex', gap: '0.45rem' }}>
                  <button onClick={handleUpdatePlaylist} className="btn btn-primary">Save</button>
                  <button onClick={() => setIsEditing(false)} className="btn btn-ghost">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h1 className="section-title" style={{ marginBottom: 0 }}>{playlist.name}</h1>
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', color: 'var(--ink-muted)', fontSize: '0.8rem' }}>
                  <span className="tag">{songs.length} songs</span>
                  <span className="tag">{playlist.is_public ? 'Public' : 'Private'}</span>
                  <span className="tag">Created {new Date(playlist.created_at).toLocaleDateString()}</span>
                </div>
              </>
            )}
          </div>

          {!isEditing && (
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              {isOwner && (
                <>
                  <button onClick={() => setIsEditing(true)} className="btn btn-secondary">Edit</button>
                  <button onClick={handleDeletePlaylist} className="btn btn-ghost" style={{ color: 'var(--danger)' }}>Delete</button>
                </>
              )}
              {playlist.is_public && <button onClick={handleShare} className="btn btn-secondary">Share</button>}
            </div>
          )}
        </div>

        {songs.length > 0 && !isPlayingAll && <button onClick={handlePlayAll} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Play all</button>}

        {isPlayingAll && songs[currentSongIndex] && (
          <div className="panel" style={{ background: 'rgba(255,255,255,0.68)' }}>
            <div style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
              Playing: {songs[currentSongIndex].song?.title || (songs[currentSongIndex] as any).songs?.title || 'Unknown Song'}
            </div>
            <AudioPlayer src={songs[currentSongIndex].song?.audio_url || (songs[currentSongIndex] as any).songs?.audio_url || ''} onEnded={handleSongEnded} />
            <button onClick={() => setIsPlayingAll(false)} className="btn btn-ghost" style={{ marginTop: '0.6rem' }}>Stop playback</button>
          </div>
        )}
      </section>

      <section className="panel" style={{ opacity: isUpdatingOrder ? 0.55 : 1 }}>
        {songs.length === 0 ? (
          <div className="notice">No songs in this playlist yet. Add songs from your library.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {songs.map((ps, index) => {
              const isDragged = draggedIdx === index
              const s = ps.song || (ps as any).songs
              return (
                <div
                  key={ps.id}
                  draggable={dragEnabledIdx === index}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '34px 46px 1fr auto auto',
                    alignItems: 'center',
                    gap: '0.7rem',
                    padding: '0.62rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    background: isDragged ? 'rgba(84, 102, 141, 0.2)' : 'rgba(255,255,255,0.72)',
                    opacity: isDragged ? 0.65 : 1,
                  }}
                >
                  <div style={{ color: 'var(--ink-muted)', textAlign: 'center', fontWeight: 600 }}>{index + 1}</div>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '8px',
                      background: 'var(--bg-deep)',
                      backgroundImage: s?.cover_url ? `url(${s.cover_url})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div style={{ fontWeight: 600 }}>{s?.title || 'Unknown Title'}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}>
                      {s?.genre || 'Unknown Genre'} {s?.bpm ? `• ${s.bpm} BPM` : ''}
                    </div>
                  </div>

                  {s?.rating ? <span className="tag">{s.rating}/10</span> : <div />}

                  {isOwner ? (
                    <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                      <button onClick={() => handleRemoveSong(ps.id)} className="btn btn-ghost" style={{ color: 'var(--danger)' }}>Remove</button>
                      <button
                        onMouseDown={() => setDragEnabledIdx(index)}
                        onMouseUp={() => setDragEnabledIdx(null)}
                        onMouseLeave={() => setDragEnabledIdx(null)}
                        className="btn btn-secondary"
                        title="Drag to reorder"
                        style={{ paddingInline: '0.55rem' }}
                      >
                        ↕
                      </button>
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>

      {!isOwner && playlist.is_public && <div style={{ textAlign: 'center', color: 'var(--ink-muted)', fontSize: '0.8rem' }}>Made with myTrack</div>}
    </div>
  )
}
