'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import AudioPlayer from '@/components/AudioPlayer'
import { Playlist, PlaylistSong } from '@/lib/types'

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
      if (res.ok) {
        const data = await res.json()
        setSongs(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (!id || !isLoaded) return
    setIsLoading(true)
    Promise.all([fetchPlaylist(), fetchSongs()]).finally(() => {
      setIsLoading(false)
    })
  }, [id, isLoaded])

  const isOwner = isLoaded && user && playlist?.user_id === user.id

  const handleUpdatePlaylist = async () => {
    if (!editName.trim()) return
    setIsEditing(false)
    try {
      const res = await fetch(`/api/playlists/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, is_public: editIsPublic })
      })
      if (res.ok) {
        const updated = await res.json()
        setPlaylist(updated)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeletePlaylist = async () => {
    if (!confirm('Are you sure you want to delete this playlist?')) return
    try {
      const res = await fetch(`/api/playlists/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/playlists')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    alert('Link copied to clipboard!')
  }

  const handleRemoveSong = async (songId: string) => {
    try {
      const res = await fetch(`/api/playlists/${id}/songs/${songId}`, { method: 'DELETE' })
      if (res.ok) {
        setSongs(songs.filter(s => s.id !== songId))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index)
    e.dataTransfer.effectAllowed = 'move'
    // For Firefox
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
    
    // Save new order
    setIsUpdatingOrder(true)
    try {
      await fetch(`/api/playlists/${id}/songs`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ordered_song_ids: songs.map(s => s.id) })
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
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(prev => prev + 1)
    } else {
      setIsPlayingAll(false)
    }
  }

  if (isLoading) return <div style={{ padding: '2rem', color: 'var(--ink-muted)' }}>Loading...</div>
  if (!playlist) return <div style={{ padding: '2rem', color: 'var(--ink-muted)' }}>Playlist not found.</div>

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  style={{ fontSize: '2rem', fontWeight: 'bold', padding: '0.5rem', background: 'var(--bg)', color: 'var(--ink)', border: '1px solid var(--border)', fontFamily: 'inherit' }}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={editIsPublic} onChange={e => setEditIsPublic(e.target.checked)} />
                  Public Playlist
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={handleUpdatePlaylist} style={{ padding: '0.5rem 1rem', background: 'var(--ink)', color: 'var(--bg)', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Save</button>
                  <button onClick={() => setIsEditing(false)} style={{ padding: '0.5rem 1rem', background: 'transparent', color: 'var(--ink)', border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700 }}>{playlist.name}</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--ink-muted)' }}>
                  <span>{songs.length} songs</span>
                  <span style={{ padding: '0.2rem 0.5rem', border: '1px solid var(--border)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    {playlist.is_public ? 'Public' : 'Private'}
                  </span>
                  <span>Created {new Date(playlist.created_at).toLocaleDateString()}</span>
                </div>
              </>
            )}
          </div>

          {!isEditing && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {isOwner && (
                <>
                  <button onClick={() => setIsEditing(true)} style={{ padding: '0.5rem 1rem', background: 'var(--bg)', color: 'var(--ink)', border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
                  <button onClick={handleDeletePlaylist} style={{ padding: '0.5rem 1rem', background: 'var(--bg)', color: 'var(--ink)', border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit' }}>Delete</button>
                </>
              )}
              {playlist.is_public && (
                <button onClick={handleShare} style={{ padding: '0.5rem 1rem', background: 'var(--bg)', color: 'var(--ink)', border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit' }}>Share</button>
              )}
            </div>
          )}
        </div>

        {songs.length > 0 && !isPlayingAll && (
          <button
            onClick={handlePlayAll}
            style={{
              alignSelf: 'flex-start',
              background: 'var(--accent)',
              color: 'var(--accent-inverse)',
              border: 'none',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '1rem',
              fontFamily: 'inherit'
            }}
          >
            Play All
          </button>
        )}

        {isPlayingAll && songs[currentSongIndex]?.song?.audio_url && (
          <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
            <div style={{ marginBottom: '1rem', fontWeight: 600 }}>
              Playing: {songs[currentSongIndex].song?.title || 'Unknown Song'}
            </div>
            <AudioPlayer
              src={songs[currentSongIndex].song!.audio_url!}
              onEnded={handleSongEnded}
            />
            <button
              onClick={() => setIsPlayingAll(false)}
              style={{ marginTop: '1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--ink)', padding: '0.5rem 1rem', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Stop Playback
            </button>
          </div>
        )}
      </header>

      {/* Song List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: isUpdatingOrder ? 0.5 : 1 }}>
        {songs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-muted)', border: '1px dashed var(--border)' }}>
            No songs in this playlist yet. Add songs from your library!
          </div>
        ) : (
          songs.map((ps, index) => {
            const isDragged = draggedIdx === index;
            const s = ps.song;
            
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
                  gridTemplateColumns: '40px 48px 1fr auto auto',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem',
                  border: '1px solid var(--border)',
                  background: isDragged ? 'var(--border)' : 'var(--card-bg)',
                  opacity: isDragged ? 0.5 : 1,
                  transition: 'background 0.2s'
                }}
              >
                {/* Position */}
                <div style={{ color: 'var(--ink-muted)', textAlign: 'center', fontWeight: 500 }}>
                  {index + 1}
                </div>
                
                {/* Cover */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'var(--border)',
                  backgroundImage: s?.cover_url ? `url(${s.cover_url})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />
                
                {/* Title & Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ fontWeight: 600 }}>{s?.title || 'Unknown Title'}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--ink-muted)' }}>
                    {s?.genre || 'Unknown Genre'} {s?.bpm ? `• ${s.bpm} BPM` : ''}
                  </div>
                </div>

                {/* Rating Badge */}
                {s?.rating ? (
                  <div style={{
                    padding: '0.2rem 0.5rem',
                    border: '1px solid var(--accent)',
                    color: 'var(--accent)',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {s.rating} / 100
                  </div>
                ) : <div />}
                
                {/* Actions */}
                {isOwner ? (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      onClick={() => handleRemoveSong(ps.id)}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        color: 'red',
                        padding: '0.4rem 0.8rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontFamily: 'inherit'
                      }}
                      title="Remove from Playlist"
                    >
                      Remove
                    </button>
                    
                    <div
                      onMouseDown={() => setDragEnabledIdx(index)}
                      onMouseUp={() => setDragEnabledIdx(null)}
                      onMouseLeave={() => setDragEnabledIdx(null)}
                      style={{
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'grab',
                        color: 'var(--ink-muted)'
                      }}
                      title="Drag to reorder"
                    >
                      {/* 6-dot grid icon */}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <circle cx="5" cy="4" r="1.5" />
                        <circle cx="5" cy="8" r="1.5" />
                        <circle cx="5" cy="12" r="1.5" />
                        <circle cx="11" cy="4" r="1.5" />
                        <circle cx="11" cy="8" r="1.5" />
                        <circle cx="11" cy="12" r="1.5" />
                      </svg>
                    </div>
                  </div>
                ) : <div />}
              </div>
            )
          })
        )}
      </div>

      {/* Footer for non-owners */}
      {!isOwner && playlist.is_public && (
        <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--ink-muted)', fontSize: '0.875rem' }}>
          Made with myTrack
        </div>
      )}

    </div>
  )
}
