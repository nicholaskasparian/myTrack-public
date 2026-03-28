'use client'

import React, { useState, useEffect, useRef } from 'react'
import SongCard from '../../components/SongCard'
import type { Song } from '../../lib/types'
import Link from 'next/link'
import FullscreenPlayer from '../../components/FullscreenPlayer'

export default function LibraryPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Song[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [playingSong, setPlayingSong] = useState<Song | null>(null)

  const [addingToPlaylist, setAddingToPlaylist] = useState<string | null>(null)
  const [playlists, setPlaylists] = useState<any[]>([])
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false)
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')

  const searchTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    fetchSongs()
  }, [])

  const fetchSongs = async () => {
    try {
      const res = await fetch('/api/songs')
      if (res.ok) {
        const data = await res.json()
        setSongs(data)
      }
    } catch (err) {
      console.error('Error fetching songs', err)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)

    if (searchTimeout.current) clearTimeout(searchTimeout.current)

    if (!val.trim()) {
      setSearchResults(null)
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/songs/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: val }),
        })
        if (res.ok) {
          const data = await res.json()
          setSearchResults(data.results)
        } else {
          setSearchResults([])
        }
      } catch (err) {
        console.error('Error searching', err)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300)
  }

  const handlePlay = async (song: Song) => {
    setPlayingSong(song)
    try {
      await fetch(`/api/songs/${song.id}/play`, { method: 'POST' })
    } catch (err) {
      console.error('Failed to record play', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this song?')) return
    try {
      const res = await fetch(`/api/songs/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSongs((prev) => prev.filter((s) => s.id !== id))
        if (searchResults) setSearchResults((prev) => prev!.filter((s) => s.id !== id))
      }
    } catch (err) {
      console.error('Error deleting song', err)
    }
  }

  const handleShare = async (song: Song) => {
    try {
      if (!song.is_public) {
        await fetch(`/api/songs/${song.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_public: true }),
        })
      }
      const url = `${window.location.origin}/share/${song.id}`
      await navigator.clipboard.writeText(url)
      alert('Share link copied to clipboard!')
    } catch (err) {
      console.error('Error sharing song', err)
    }
  }

  const openPlaylistModal = async (songId: string) => {
    setAddingToPlaylist(songId)
    setIsLoadingPlaylists(true)
    try {
      const res = await fetch('/api/playlists')
      if (res.ok) setPlaylists(await res.json())
    } catch (err) {
      console.error('Failed to fetch playlists', err)
    } finally {
      setIsLoadingPlaylists(false)
    }
  }

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return
    setIsCreatingPlaylist(true)
    try {
      const res = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPlaylistName, song_id: addingToPlaylist }),
      })
      if (res.ok) {
        const newPlaylist = await res.json()
        setPlaylists([...playlists, newPlaylist])
        setNewPlaylistName('')
        alert('Playlist created and song added!')
        setAddingToPlaylist(null)
      }
    } catch (err) {
      console.error('Error creating playlist', err)
    } finally {
      setIsCreatingPlaylist(false)
    }
  }

  const selectPlaylist = async (playlistId: string) => {
    try {
      await fetch(`/api/playlists/${playlistId}/songs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ song_id: addingToPlaylist }),
      })
      alert('Added to playlist!')
      setAddingToPlaylist(null)
    } catch (err) {
      console.error('Error adding to playlist', err)
    }
  }

  const displaySongs = searchResults !== null ? searchResults : songs

  const handleNext = () => {
    if (!playingSong) return
    const idx = displaySongs.findIndex((s) => s.id === playingSong.id)
    if (idx >= 0 && idx < displaySongs.length - 1) handlePlay(displaySongs[idx + 1])
  }

  const handlePrev = () => {
    if (!playingSong) return
    const idx = displaySongs.findIndex((s) => s.id === playingSong.id)
    if (idx > 0) handlePlay(displaySongs[idx - 1])
  }

  return (
    <div className="page-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <nav className="surface top-nav">
        <div className="brand">myTrack library</div>
        <div className="nav-links">
          <Link href="/dashboard" className="btn btn-secondary">Dashboard</Link>
          <Link href="/playlists" className="btn btn-secondary">Playlists</Link>
          <Link href="/generate" className="btn btn-primary">Generate</Link>
        </div>
      </nav>

      <section className="panel">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <input
            className="input"
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search by vibe, mood, lyrics..."
          />
          {isSearching && <div style={{ color: 'var(--ink-muted)', fontSize: '0.84rem' }}>Searching...</div>}
          {searchResults !== null && !isSearching && (
            <div style={{ color: 'var(--ink-muted)', fontSize: '0.84rem' }}>
              {searchResults.length} results for &apos;{query}&apos;
            </div>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2 className="section-title" style={{ marginBottom: 0 }}>Your songs</h2>
          <span className="tag">{displaySongs.length} tracks</span>
        </div>

        {displaySongs.length === 0 ? (
          <div className="notice">
            No songs yet.{' '}
            <Link href="/generate" style={{ textDecoration: 'underline', color: 'var(--ink)' }}>
              Generate your first song →
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(1, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))',
              gap: '0.8rem',
            }}
          >
            {displaySongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                onPlay={() => handlePlay(song)}
                onDelete={() => handleDelete(song.id)}
                onShare={() => handleShare(song)}
                onAddToPlaylist={() => openPlaylistModal(song.id)}
              />
            ))}
          </div>
        )}
      </section>

      {playingSong && playingSong.audio_url && (
        <FullscreenPlayer song={playingSong} onClose={() => setPlayingSong(null)} onNext={handleNext} onPrev={handlePrev} onAddToPlaylist={openPlaylistModal} />
      )}

      {addingToPlaylist && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3 className="section-title">Add to playlist</h3>
            {isLoadingPlaylists ? (
              <p className="notice">Loading playlists...</p>
            ) : playlists.length === 0 ? (
              <p className="notice">No playlists found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '300px', overflowY: 'auto' }}>
                {playlists.map((p) => (
                  <button key={p.id} onClick={() => selectPlaylist(p.id)} className="btn btn-secondary" style={{ justifyContent: 'flex-start', borderRadius: '12px' }}>
                    {p.name}
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.9rem' }}>
              <input className="input" type="text" value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} placeholder="New playlist name..." />
              <button onClick={handleCreatePlaylist} disabled={isCreatingPlaylist || !newPlaylistName.trim()} className="btn btn-primary">
                Create
              </button>
            </div>

            <button onClick={() => setAddingToPlaylist(null)} className="btn btn-ghost" style={{ marginTop: '0.8rem', width: '100%' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
