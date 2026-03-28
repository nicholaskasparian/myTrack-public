'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Song, GenerationStep } from '../../lib/types'
import AudioPlayer from '../../components/AudioPlayer'
import FullscreenPlayer from '../../components/FullscreenPlayer'
import RatingSlider from '../../components/RatingSlider'

const LOADING_PULSE_DURATION_MS = 420

export default function GeneratePage() {
  const router = useRouter()

  const [step, setStep] = useState<GenerationStep>('ideas')
  const [moodHint, setMoodHint] = useState('')

  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [currentStepText, setCurrentStepText] = useState('')

  const [song, setSong] = useState<Song | null>(null)
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(5)
  const [queue, setQueue] = useState<Song[]>([])
  const [isQueueGenerating, setIsQueueGenerating] = useState(false)
  const [isWaitingForQueueStart, setIsWaitingForQueueStart] = useState(false)
  const [showLyricsPlayer, setShowLyricsPlayer] = useState(false)
  const [addingToPlaylist, setAddingToPlaylist] = useState<string | null>(null)
  const [playlists, setPlaylists] = useState<any[]>([])
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false)
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [hasEnded, setHasEnded] = useState(false)
  const [inputError, setInputError] = useState<string | null>(null)
  const [loadingPulse, setLoadingPulse] = useState(0)

  useEffect(() => {
    if (!['prompting', 'lyria', 'cover', 'uploading'].includes(step)) return
    const interval = setInterval(() => setLoadingPulse((prev) => (prev + 1) % 3), LOADING_PULSE_DURATION_MS)
    return () => clearInterval(interval)
  }, [step])

  useEffect(() => {
    let interval: NodeJS.Timeout

    const fetchQueue = async () => {
      try {
        const res = await fetch('/api/songs')
        if (res.ok) {
          const songs: Song[] = await res.json()
          const queued = songs
            .filter((s) => s.status === 'queued' && s.id !== song?.id)
            .sort((a, b) => (a.queue_position || 0) - (b.queue_position || 0))
          setQueue(queued)
          if (queued.length < 2 && step === 'done' && !isQueueGenerating) tryStartBackgroundGeneration()
        }
      } catch (err) {
        console.error('Failed to fetch queue', err)
      }
    }

    if (step === 'done') {
      fetchQueue()
      interval = setInterval(fetchQueue, 5000)
    }

    return () => clearInterval(interval)
  }, [step, song?.id, isQueueGenerating])

  useEffect(() => {
    // When playback is waiting and a new queued song arrives, promote it immediately to now-playing.
    if (!isWaitingForQueueStart || queue.length === 0 || song) return
    const firstQueuedSong = queue[0]
    promoteQueuedSong(firstQueuedSong)
    setQueue((prev) => prev.slice(1))
  }, [isWaitingForQueueStart, queue, song])

  const promoteQueuedSong = (nextSong: Song) => {
    setSong(nextSong)
    setShowRating(false)
    setHasEnded(false)
    setShowLyricsPlayer(true)
    setIsWaitingForQueueStart(false)
  }

  const tryStartBackgroundGeneration = async (): Promise<boolean> => {
    if (isQueueGenerating) return false
    setIsQueueGenerating(true)
    try {
      const response = await fetch('/api/generate/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moodHint }),
      })
      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || `Failed to generate queue (status: ${response.status}). Please try again.`)
      }
      return true
    } catch (err) {
      console.error(err)
      return false
    } finally {
      setIsQueueGenerating(false)
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

  const handleNextTrack = async () => {
    if (queue.length > 0) {
      const nextSong = queue[0]
      if (song) fetch(`/api/songs/${song.id}/play`, { method: 'POST' }).catch(console.error)

      promoteQueuedSong(nextSong)
      setQueue(queue.slice(1))
    } else {
      setSong(null)
      setShowLyricsPlayer(false)
      setShowRating(false)
      setHasEnded(false)
      const started = await tryStartBackgroundGeneration()
      if (started) setIsWaitingForQueueStart(true)
    }
  }

  const runGenerationSequence = async (vibe?: string) => {
    setStep('prompting')
    setCompletedSteps(['Profile analyzed', 'Concept selected'])
    setCurrentStepText('Loading feed...')

    try {
      const response = await fetch('/api/generate/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moodHint: vibe }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to generate music')
      }

      const data = await response.json()
      setStep('done')
      setSong(data.song)
      setShowLyricsPlayer(true)
      tryStartBackgroundGeneration()
    } catch (error: any) {
      console.error('Error generating:', error)
      alert(`Failed to generate your song: ${error.message || 'Please try again.'}`)
      setStep('ideas')
    }
  }

  const handleTimeUpdate = (currentTime: number) => {
    if (currentTime >= 20 && !showRating) setShowRating(true)
  }

  const submitRating = async () => {
    if (song) {
      await fetch(`/api/songs/${song.id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      }).catch(console.error)
    }
    setShowRating(false)
    if (hasEnded) handleNextTrack()
  }

  const skipRating = () => {
    setShowRating(false)
    if (hasEnded) handleNextTrack()
  }

  return (
    <div className="page-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <nav className="surface top-nav">
        <div className="brand">myTrack radio session</div>
        <div className="nav-links">
          <Link href="/dashboard" className="btn btn-secondary">Dashboard</Link>
          <Link href="/library" className="btn btn-secondary">Library</Link>
          <button onClick={() => router.push('/dashboard')} className="btn btn-ghost">Back</button>
        </div>
      </nav>

      {step === 'ideas' && (
        <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h1 className="section-title">Start your adaptive feed</h1>
          <p style={{ color: 'var(--ink-muted)' }}>Pick the default mix or add a custom mood anchor for the next generation cycle.</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem' }}>
            <button onClick={() => runGenerationSequence()} className="btn btn-primary">Join feed</button>
            <button
              onClick={() => {
                if (!moodHint.trim()) {
                  setInputError('Enter a vibe to launch a custom session.')
                  return
                }
                setInputError(null)
                runGenerationSequence(moodHint)
              }}
              className="btn btn-secondary"
            >
              Enter custom vibe
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <input
              className="input"
              type="text"
              value={moodHint}
              onChange={(e) => {
                setMoodHint(e.target.value)
                if (e.target.value.trim()) setInputError(null)
              }}
              placeholder="e.g. late night drive, focused coding, post-club calm"
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return
                if (!moodHint.trim()) {
                  setInputError('Enter a vibe to launch a custom session.')
                  return
                }
                setInputError(null)
                runGenerationSequence(moodHint)
              }}
            />
          </div>
          {inputError && <div className="notice error">{inputError}</div>}
        </section>
      )}

      {['prompting', 'lyria', 'cover', 'uploading'].includes(step) && (
        <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <h2 className="section-title">Creating your track...</h2>
          {completedSteps.map((s, i) => (
            <div key={i} className="notice" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ color: 'var(--success)' }}>✓</span>
              <span>{s}</span>
            </div>
          ))}
          <div className="notice" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600 }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '999px',
                border: '2px solid var(--accent)',
                borderTopColor: 'transparent',
                animation: 'loading-spin 900ms linear infinite',
              }}
            />
            <span>{currentStepText}</span>
            <span style={{ display: 'inline-flex', gap: '0.18rem' }}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '999px',
                    background: 'var(--accent)',
                    opacity: loadingPulse === i ? 1 : 0.2,
                    transition: 'opacity 160ms ease',
                  }}
                />
              ))}
            </span>
          </div>
        </section>
      )}

      {step === 'done' && song && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <section className="panel" style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 220px) 1fr', gap: '1rem', alignItems: 'start' }}>
            <div
              style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: '14px',
                background: 'var(--bg-deep)',
                overflow: 'hidden',
                border: '1px solid var(--border)',
              }}
            >
              {song.cover_url ? <img src={song.cover_url} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div />}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>{song.title}</h2>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span className="tag">{song.genre}</span>
                <span className="tag">{song.bpm} BPM</span>
              </div>

              {!showLyricsPlayer && (
                <AudioPlayer
                  key={song.id}
                  src={song.audio_url || ''}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => {
                    setShowRating(true)
                    setHasEnded(true)
                  }}
                />
              )}

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button onClick={() => setShowLyricsPlayer(true)} className="btn btn-primary">Open full player + lyrics</button>
                <button onClick={() => openPlaylistModal(song.id)} className="btn btn-secondary">+ Playlist</button>
              </div>
            </div>

            {showLyricsPlayer && (
              <FullscreenPlayer
                key={song.id}
                song={song}
                onClose={() => setShowLyricsPlayer(false)}
                onNext={() => {
                  setShowRating(true)
                  setHasEnded(true)
                  handleNextTrack()
                }}
                onAddToPlaylist={(songId) => openPlaylistModal(songId)}
              />
            )}
          </section>

          <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            <h3 className="section-title" style={{ marginBottom: 0 }}>Influence the feed</h3>
            <p style={{ color: 'var(--ink-muted)', fontSize: '0.9rem' }}>Guide the next queued songs with a fresh vibe prompt.</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input className="input" type="text" value={moodHint} onChange={(e) => setMoodHint(e.target.value)} placeholder="e.g. warm analog house, rain-soaked synth pop" />
              <button onClick={() => alert('Vibe updated! This will influence upcoming tracks.')} className="btn btn-primary">Update vibe</button>
            </div>
          </section>

          {showRating && (
            <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <h3 className="section-title" style={{ marginBottom: 0 }}>How does this track fit your vibe?</h3>
              <RatingSlider value={rating} onChange={setRating} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={skipRating} className="btn btn-ghost">Skip</button>
                <button onClick={submitRating} className="btn btn-primary">Submit</button>
              </div>
            </section>
          )}

          <section className="panel">
            <h3 className="section-title">Up next</h3>
            <div className="song-list">
              {queue.length === 0 && isQueueGenerating && <div className="notice">Generating next tracks...</div>}
              {queue.map((qSong) => (
                <div key={qSong.id} className="panel" style={{ background: 'rgba(255,255,255,0.66)', display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.6rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--bg-deep)', overflow: 'hidden' }}>
                    {qSong.cover_url && <img src={qSong.cover_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{qSong.title}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--ink-muted)' }}>{qSong.genre} • {qSong.bpm} BPM</div>
                  </div>
                  <button
                    onClick={() => {
                      if (song) fetch(`/api/songs/${song.id}/play`, { method: 'POST' }).catch(console.error)
                      setSong(qSong)
                      setQueue((prev) => prev.filter((s) => s.id !== qSong.id))
                      setShowRating(false)
                      setHasEnded(false)
                      setShowLyricsPlayer(true)
                    }}
                    className="btn btn-secondary"
                  >
                    Skip to
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
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

            <div style={{ marginTop: '0.8rem', borderTop: '1px solid var(--border)', paddingTop: '0.8rem' }}>
              <input className="input" type="text" value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} placeholder="New playlist name..." />
              <button onClick={handleCreatePlaylist} disabled={isCreatingPlaylist || !newPlaylistName.trim()} className="btn btn-primary" style={{ marginTop: '0.55rem', width: '100%' }}>
                {isCreatingPlaylist ? 'Creating...' : 'Create & add'}
              </button>
            </div>

            <button onClick={() => setAddingToPlaylist(null)} className="btn btn-ghost" style={{ marginTop: '0.65rem', width: '100%' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
