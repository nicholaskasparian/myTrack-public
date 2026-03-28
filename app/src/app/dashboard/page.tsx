'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import type { SoundProfile, Song } from '../../lib/types';
import SongCard from '../../components/SongCard';
import LyricsPlayer from '../../components/LyricsPlayer';

const AudioFeatureBar = ({ label, value }: { label: string; value: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', marginBottom: '8px' }}>
    <span style={{ width: '120px', fontSize: '12px', textAlign: 'right', fontWeight: 'bold' }}>{label}</span>
    <div style={{ flex: 1, height: '16px', background: 'var(--border)', position: 'relative' }}>
      <div 
        style={{ 
          position: 'absolute', 
          left: 0, 
          top: 0, 
          height: '100%', 
          width: `${(label === 'tempo' ? value / 200 : value) * 100}%`, 
          background: 'var(--progress)' 
        }} 
      />
    </div>
    <span style={{ width: '48px', fontSize: '12px', textAlign: 'right' }}>
      {label === 'tempo' ? Math.round(value) : `${Math.round(value * 100)}%`}
    </span>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<SoundProfile | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/spotify/sync', { method: 'POST' });
      
      // If user hasn't successfully connected OAuth, API throws 400/401; leave profile as null.
      if (res.status === 400 || res.status === 401) {
        return;
      }

      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      setProfile(data.profile || data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  const fetchRecentSongs = async () => {
    try {
      const res = await fetch('/api/songs?limit=3');
      if (!res.ok) throw new Error('Failed to fetch songs');
      const data = await res.json();
      setSongs(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProfile(), fetchRecentSongs()]);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'var(--font-ibm-plex-sans)' }}>
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '48px', 
        paddingBottom: '24px', 
        borderBottom: '1px solid var(--border)' 
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px', letterSpacing: '1px' }}>myTrack</div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="/library" style={{ color: 'var(--ink)', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Library</a>
          <a href="/playlists" style={{ color: 'var(--ink)', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Playlists</a>
          <button 
            onClick={fetchProfile}
            style={{ 
              background: 'transparent', 
              border: '1px solid var(--ink)', 
              padding: '6px 16px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              color: 'var(--ink)',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.2s ease',
              borderRadius: '0' // ZERO rounded corners
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'var(--ink)';
              e.currentTarget.style.color = 'var(--bg)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--ink)';
            }}
          >
            Sync
          </button>
          <UserButton appearance={{ elements: { avatarBox: { borderRadius: '0' } } }} />
        </div>
      </nav>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--ink-muted)' }}>Loading dashboard...</div>
      ) : error ? (
        <div style={{ color: 'red', padding: '24px', border: '1px solid red', background: '#ffebee' }}>
          <strong>Error:</strong> {error}
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '48px',
          alignItems: 'start'
        }}>
          
          {/* Left Column - Sound Profile Panel */}
          <div style={{ 
            border: '1px solid var(--border)', 
            padding: '24px', 
            background: 'var(--card-bg)' 
          }}>
            <h2 style={{ 
              fontSize: '18px', 
              marginBottom: '24px', 
              borderBottom: '1px solid var(--border)', 
              paddingBottom: '8px',
              fontWeight: 'bold'
            }}>
              YOUR SOUND PROFILE
            </h2>
            
            {!profile ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ink-muted)' }}>
                Connect Spotify to build your Sound Profile
                <button 
                  onClick={fetchProfile}
                  style={{
                    display: 'block',
                    margin: '16px auto 0',
                    background: 'var(--accent)',
                    color: 'var(--accent-inverse)',
                    border: 'none',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Sync Now
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
                  <h3 style={{ fontSize: '14px', marginBottom: '16px', fontWeight: 'bold', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Audio Features</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <AudioFeatureBar label="tempo" value={profile.features.tempo} />
                    <AudioFeatureBar label="energy" value={profile.features.energy} />
                    <AudioFeatureBar label="valence" value={profile.features.valence} />
                    <AudioFeatureBar label="danceability" value={profile.features.danceability} />
                    <AudioFeatureBar label="acousticness" value={profile.features.acousticness} />
                    <AudioFeatureBar label="instrumentalness" value={profile.features.instrumentalness} />
                    <AudioFeatureBar label="speechiness" value={profile.features.speechiness} />
                    <AudioFeatureBar label="liveness" value={profile.features.liveness} />
                  </div>
                </div>
                
                <div>
                  <h3 style={{ fontSize: '14px', marginBottom: '16px', fontWeight: 'bold', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Top Genres</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {profile.top_genres.slice(0, 5).map((genre) => (
                      <span key={genre} style={{ 
                        border: '1px solid var(--border)', 
                        padding: '6px 12px', 
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: 'var(--ink)'
                      }}>
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '14px', marginBottom: '16px', fontWeight: 'bold', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Top Artists</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                    {profile.top_artists.slice(0, 5).map((artist, idx) => (
                      <div key={artist} style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ color: 'var(--ink-muted)', width: '20px' }}>{idx + 1}.</span>
                        <span style={{ fontWeight: 'bold' }}>{artist}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginTop: '16px', 
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border)',
                  fontSize: '12px', 
                  color: 'var(--ink-muted)' 
                }}>
                  <span>Last synced: {profile.synced_at ? new Date(profile.synced_at).toLocaleTimeString() : 'Never'}</span>
                  <button 
                    onClick={fetchProfile} 
                    style={{ 
                      background: 'none', 
                      border: '1px solid var(--border)', 
                      padding: '4px 8px', 
                      cursor: 'pointer',
                      color: 'var(--ink)',
                      fontWeight: 'bold'
                    }}
                  >
                    Sync Spotify
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Recent Songs + Generate */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <button 
              onClick={() => router.push('/generate')}
              style={{ 
                background: 'var(--accent)', 
                color: 'var(--accent-inverse)', 
                padding: '24px', 
                fontSize: '20px', 
                fontWeight: 'bold', 
                border: '1px solid var(--accent)', 
                cursor: 'pointer',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'opacity 0.2s ease',
                minHeight: '48px'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              GENERATE NEW SONG
            </button>
            
            <div style={{ 
              border: '1px solid var(--border)', 
              padding: '24px', 
              background: 'var(--card-bg)' 
            }}>
              <h2 style={{ 
                fontSize: '18px', 
                marginBottom: '24px', 
                borderBottom: '1px solid var(--border)', 
                paddingBottom: '8px',
                fontWeight: 'bold'
              }}>
                RECENT SONGS
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {songs.map((song) => (
                  <div 
                    key={song.id} 
                    onClick={() => setSelectedSong(song)}
                    style={{ cursor: 'pointer', transition: 'background 0.2s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <SongCard song={song} compact />
                  </div>
                ))}
                {songs.length === 0 && (
                  <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--ink-muted)' }}>
                    No recent songs found.<br/>
                    Generate your first song above!
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      )}

      {selectedSong && (
        <LyricsPlayer 
          song={selectedSong} 
          onClose={() => setSelectedSong(null)} 
        />
      )}
    </div>
  );
}
