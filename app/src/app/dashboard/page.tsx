'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import type { SoundProfile, Song } from '../../lib/types'
import SongCard from '../../components/SongCard'
import LyricsPlayer from '../../components/LyricsPlayer'

const AudioFeatureBar = ({ label, value }: { label: string; value: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', width: '100%' }}>
    <span style={{ width: '110px', fontSize: '0.74rem', textAlign: 'right', color: 'var(--ink-muted)', textTransform: 'capitalize' }}>{label}</span>
    <div style={{ flex: 1, height: '8px', background: 'rgba(22, 28, 40, 0.14)', borderRadius: '999px', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          borderRadius: '999px',
          width: `${(label === 'tempo' ? value / 200 : value) * 100}%`,
          background: 'linear-gradient(90deg, #54668d 0%, #1f2737 100%)',
        }}
      />
    </div>
    <span style={{ width: '48px', fontSize: '0.72rem', textAlign: 'right', color: 'var(--ink-muted)' }}>
      {label === 'tempo' ? Math.round(value) : `${Math.round(value * 100)}%`}
    </span>
  </div>
)

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<SoundProfile | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/spotify/sync', { method: 'POST' })
      if (res.status === 400 || res.status === 401) return
      if (!res.ok) throw new Error('Failed to fetch profile')
      const data = await res.json()
      setProfile(data.profile || data)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
  }

  const fetchRecentSongs = async () => {
    try {
      const res = await fetch('/api/songs?limit=3')
      if (!res.ok) throw new Error('Failed to fetch songs')
      const data = await res.json()
      setSongs(data)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchProfile(), fetchRecentSongs()])
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <div className="page-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <nav className="surface top-nav">
        <div className="brand">myTrack dashboard</div>
        <div className="nav-links" style={{ alignItems: 'center' }}>
          <Link href="/library" className="btn btn-secondary">Library</Link>
          <Link href="/playlists" className="btn btn-secondary">Playlists</Link>
          <button onClick={fetchProfile} className="btn btn-ghost">Sync profile</button>
          <UserButton appearance={{ elements: { avatarBox: { borderRadius: '999px' } } }} />
        </div>
      </nav>

      {loading ? (
        <div className="panel notice">Loading dashboard...</div>
      ) : error ? (
        <div className="panel notice error"><strong>Error:</strong> {error}</div>
      ) : (
        <div className="app-grid">
          <section className="panel">
            <div className="panel-header">
              <h2 className="section-title" style={{ marginBottom: 0 }}>Your sound profile</h2>
              <span className="tag">Spotify-derived</span>
            </div>

            {!profile ? (
              <div className="notice" style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', alignItems: 'flex-start' }}>
                <p>Connect Spotify to build your profile.</p>
                <button onClick={fetchProfile} className="btn btn-primary">Sync now</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  <h3 className="kicker">Audio features</h3>
                  <AudioFeatureBar label="tempo" value={profile.features.tempo} />
                  <AudioFeatureBar label="energy" value={profile.features.energy} />
                  <AudioFeatureBar label="valence" value={profile.features.valence} />
                  <AudioFeatureBar label="danceability" value={profile.features.danceability} />
                  <AudioFeatureBar label="acousticness" value={profile.features.acousticness} />
                  <AudioFeatureBar label="instrumentalness" value={profile.features.instrumentalness} />
                  <AudioFeatureBar label="speechiness" value={profile.features.speechiness} />
                  <AudioFeatureBar label="liveness" value={profile.features.liveness} />
                </div>

                <hr className="separator" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <h3 className="kicker">Top genres</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {profile.top_genres.slice(0, 6).map((genre) => (
                      <span key={genre} className="tag">{genre}</span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h3 className="kicker">Top artists</h3>
                  {profile.top_artists.slice(0, 5).map((artist, idx) => (
                    <div key={artist} style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                      <span className="tag" style={{ minWidth: '30px', justifyContent: 'center' }}>{idx + 1}</span>
                      <span style={{ fontWeight: 600 }}>{artist}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--ink-muted)' }}>
                    Last synced: {profile.synced_at ? new Date(profile.synced_at).toLocaleTimeString() : 'Never'}
                  </span>
                  <button onClick={fetchProfile} className="btn btn-secondary">Sync Spotify</button>
                </div>
              </div>
            )}
          </section>

          <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button onClick={() => router.push('/generate')} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
              Generate new song
            </button>

            <div className="panel" style={{ background: 'rgba(255,255,255,0.66)' }}>
              <h2 className="section-title">Recent songs</h2>
              <div className="song-list">
                {songs.map((song) => (
                  <div key={song.id} onClick={() => setSelectedSong(song)} style={{ cursor: 'pointer' }}>
                    <SongCard song={song} compact />
                  </div>
                ))}
                {songs.length === 0 && <div className="notice">No recent songs yet. Generate your first song.</div>}
              </div>
            </div>
          </section>
        </div>
      )}

      {selectedSong && <LyricsPlayer song={selectedSong} onClose={() => setSelectedSong(null)} />}
    </div>
  )
}
