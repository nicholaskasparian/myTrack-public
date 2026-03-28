'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Song, GenerationStep } from '../../lib/types'
import FullscreenPlayer from '../../components/FullscreenPlayer'

const LOADING_PULSE_DURATION_MS = 420

export default function GeneratePage() {
  const router = useRouter()

  const [step, setStep] = useState<GenerationStep>('ideas')
  const [moodHint, setMoodHint] = useState('')

  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [currentStepText, setCurrentStepText] = useState('')

  const [song, setSong] = useState<Song | null>(null)
  const [queue, setQueue] = useState<Song[]>([])
  const [isQueueGenerating, setIsQueueGenerating] = useState(false)
  const [isWaitingForQueueStart, setIsWaitingForQueueStart] = useState(false)
  const [isUpdatingVibe, setIsUpdatingVibe] = useState(false)
  const [vibeFeedback, setVibeFeedback] = useState<string | null>(null)
  const [addingToPlaylist, setAddingToPlaylist] = useState<string | null>(null)
  const [playlists, setPlaylists] = useState<any[]>([])
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false)
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [inputError, setInputError] = useState<string | null>(null)
  const [loadingPulse, setLoadingPulse] = useState(0)
  const [queueStatusMessage, setQueueStatusMessage] = useState<string | null>(null)
  const [currentGenerationTiming, setCurrentGenerationTiming] = useState<{
    prompt_ms: number
    music_ms: number
    cover_ms: number
    upload_ms: number
    total_ms: number
  } | null>(null)

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
      const queueData = await response.json().catch(() => ({}))
      if (queueData?.summary?.generated > 0) {
        const avgMs = queueData?.summary?.avg_total_ms
        setQueueStatusMessage(
          avgMs
            ? `Queued ${queueData.summary.generated} new track(s) • avg ${Math.round(avgMs / 1000)}s generation`
            : `Queued ${queueData.summary.generated} new track(s)`
        )
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
      if (data.song?.generation_timing) {
        setCurrentGenerationTiming(data.song.generation_timing)
      }
      tryStartBackgroundGeneration()
    } catch (error: any) {
      console.error('Error generating:', error)
      alert(`Failed to generate your song: ${error.message || 'Please try again.'}`)
      setStep('ideas')
    }
  }

  const handleUpdateVibe = async () => {
    if (!moodHint.trim()) {
      setVibeFeedback('Enter a vibe before updating.')
      return
    }
    setIsUpdatingVibe(true)
    try {
      const started = await tryStartBackgroundGeneration()
      setVibeFeedback(
        started
          ? 'Vibe updated. Next generated tracks will follow this direction.'
          : 'Vibe saved. Queue generation is already active.'
      )
    } finally {
      setIsUpdatingVibe(false)
    }
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

      {step === 'done' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {currentGenerationTiming && (
            <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', background: 'rgba(255,255,255,0.72)' }}>
              <div className="panel-header">
                <h3 className="section-title" style={{ marginBottom: 0 }}>Generation timing</h3>
                <span className="tag">{Math.round(currentGenerationTiming.total_ms / 1000)}s total</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.55rem' }}>
                <div className="notice">Prompt: {Math.round(currentGenerationTiming.prompt_ms / 1000)}s</div>
                <div className="notice">Music: {Math.round(currentGenerationTiming.music_ms / 1000)}s</div>
                <div className="notice">Cover: {Math.round(currentGenerationTiming.cover_ms / 1000)}s</div>
                <div className="notice">Upload: {Math.round(currentGenerationTiming.upload_ms / 1000)}s</div>
              </div>
            </section>
          )}

          <FullscreenPlayer
            key={song?.id || (isWaitingForQueueStart ? 'waiting' : 'idle')}
            song={song}
            onNext={handleNextTrack}
            onAddToPlaylist={(songId) => openPlaylistModal(songId)}
            moodHint={moodHint}
            onMoodHintChange={setMoodHint}
            onUpdateVibe={handleUpdateVibe}
            isUpdatingVibe={isUpdatingVibe}
            vibeFeedback={vibeFeedback}
            isWaitingForQueueStart={isWaitingForQueueStart}
          />

          <section className="panel">
            <h3 className="section-title">Up next</h3>
            <div className="song-list">
              {queue.length === 0 && isQueueGenerating && <div className="notice">Generating next tracks...</div>}
              {queueStatusMessage && <div className="notice">{queueStatusMessage}</div>}
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
                      setIsWaitingForQueueStart(false)
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
