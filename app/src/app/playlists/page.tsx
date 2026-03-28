'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Playlist } from '@/lib/types'

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [newPlaylistIsPublic, setNewPlaylistIsPublic] = useState(false)
  const router = useRouter()

  const fetchPlaylists = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/playlists')
      if (res.ok) {
        const data = await res.json()
        setPlaylists(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return

    try {
      const res = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPlaylistName, is_public: newPlaylistIsPublic })
      })
      if (res.ok) {
        const created = await res.json()
        setPlaylists([created, ...playlists])
        setNewPlaylistName('')
        setNewPlaylistIsPublic(false)
        setIsModalOpen(false)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/playlists/${id}`
    navigator.clipboard.writeText(url)
    alert('Link copied to clipboard!')
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '1rem'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>
          YOUR PLAYLISTS ({playlists.length})
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            background: 'var(--accent)',
            color: 'var(--accent-inverse)',
            border: 'none',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontWeight: 500,
            fontFamily: 'inherit'
          }}
        >
          + New Playlist
        </button>
      </header>

      {isLoading ? (
        <div style={{ color: 'var(--ink-muted)' }}>Loading playlists...</div>
      ) : playlists.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          border: '1px dashed var(--border)',
          color: 'var(--ink-muted)'
        }}>
          No playlists yet. Create one to organize your songs.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {playlists.map(playlist => (
            <div key={playlist.id} style={{
              border: '1px solid var(--border)',
              background: 'var(--card-bg)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Mosaic */}
              <div style={{
                width: '100%',
                aspectRatio: '1',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                borderBottom: '1px solid var(--border)',
                background: 'var(--bg)'
              }}>
                {[0, 1, 2, 3].map(idx => {
                  const url = playlist.cover_urls?.[idx]
                  return (
                    <div key={idx} style={{
                      borderRight: idx % 2 === 0 ? '1px solid var(--border)' : 'none',
                      borderBottom: idx < 2 ? '1px solid var(--border)' : 'none',
                      backgroundColor: url ? 'transparent' : 'var(--border)',
                      backgroundImage: url ? `url(${url})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }} />
                  )
                })}
              </div>
              
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{playlist.name}</h3>
                <div style={{ fontSize: '0.875rem', color: 'var(--ink-muted)' }}>
                  {playlist.song_count} songs • {playlist.is_public ? 'Public' : 'Private'}
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    onClick={() => router.push(`/playlists/${playlist.id}`)}
                    style={{
                      flex: 1,
                      background: 'var(--bg)',
                      color: 'var(--ink)',
                      border: '1px solid var(--border)',
                      padding: '0.5rem',
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}
                  >
                    Open
                  </button>
                  {playlist.is_public && (
                    <button
                      onClick={() => handleShare(playlist.id)}
                      style={{
                        background: 'var(--bg)',
                        color: 'var(--ink)',
                        border: '1px solid var(--border)',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        fontFamily: 'inherit'
                      }}
                    >
                      Share
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            padding: '2rem',
            width: '100%',
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Create Playlist</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Name</label>
              <input
                type="text"
                value={newPlaylistName}
                onChange={e => setNewPlaylistName(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--ink)',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={newPlaylistIsPublic}
                onChange={e => setNewPlaylistIsPublic(e.target.checked)}
              />
              Public
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--ink)',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlaylist}
                style={{
                  background: 'var(--accent)',
                  color: 'var(--accent-inverse)',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
