'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Playlist } from '../../lib/types'

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
      if (res.ok) setPlaylists(await res.json())
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
        body: JSON.stringify({ name: newPlaylistName, is_public: newPlaylistIsPublic }),
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
    <div className="page-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <nav className="surface top-nav">
        <div className="brand">myTrack playlists</div>
        <div className="nav-links">
          <Link href="/dashboard" className="btn btn-secondary">Dashboard</Link>
          <Link href="/library" className="btn btn-secondary">Library</Link>
          <Link href="/metrics" className="btn btn-secondary">Metrics</Link>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">+ New playlist</button>
        </div>
      </nav>

      <section className="panel">
        <div className="panel-header">
          <h1 className="section-title" style={{ marginBottom: 0 }}>Your playlists</h1>
          <span className="tag">{playlists.length} total</span>
        </div>

        {isLoading ? (
          <div className="notice">Loading playlists...</div>
        ) : playlists.length === 0 ? (
          <div className="notice">No playlists yet. Create one to organize your songs.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.9rem' }}>
            {playlists.map((playlist) => (
              <article key={playlist.id} className="panel" style={{ background: 'rgba(255,255,255,0.74)', padding: '0.8rem', gap: '0.7rem', display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridTemplateRows: '1fr 1fr',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-deep)',
                  }}
                >
                  {[0, 1, 2, 3].map((idx) => {
                    const url = playlist.cover_urls?.[idx]
                    return (
                      <div
                        key={idx}
                        style={{
                          borderRight: idx % 2 === 0 ? '1px solid var(--border)' : 'none',
                          borderBottom: idx < 2 ? '1px solid var(--border)' : 'none',
                          backgroundImage: url ? `url(${url})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    )
                  })}
                </div>

                <div>
                  <h3 style={{ marginBottom: '0.28rem', fontSize: '1.1rem' }}>{playlist.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
                    {playlist.song_count} songs • {playlist.is_public ? 'Public' : 'Private'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.45rem' }}>
                  <button onClick={() => router.push(`/playlists/${playlist.id}`)} className="btn btn-secondary" style={{ flex: 1 }}>
                    Open
                  </button>
                  {playlist.is_public && (
                    <button onClick={() => handleShare(playlist.id)} className="btn btn-secondary">
                      Share
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h2 className="section-title">Create playlist</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input className="input" type="text" value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} placeholder="Playlist name" />
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--ink-muted)' }}>
                <input type="checkbox" checked={newPlaylistIsPublic} onChange={(e) => setNewPlaylistIsPublic(e.target.checked)} />
                Public playlist
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
                <button onClick={handleCreatePlaylist} className="btn btn-primary">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
