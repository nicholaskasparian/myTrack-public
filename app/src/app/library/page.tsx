'use client';

import React, { useState, useEffect, useRef } from 'react';
import SongCard from '../../components/SongCard';
import type { Song } from '../../lib/types';
import Link from 'next/link';
import AudioPlayer from '../../components/AudioPlayer';

export default function LibraryPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [playingSong, setPlayingSong] = useState<Song | null>(null);
  
  // Playlist Modal State
  const [addingToPlaylist, setAddingToPlaylist] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);

  // Debounce ref
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await fetch('/api/songs');
      if (res.ok) {
        const data = await res.json();
        setSongs(data);
      }
    } catch (err) {
      console.error('Error fetching songs', err);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (!val.trim()) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/songs/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: val }),
        });
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Error searching', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handlePlay = async (song: Song) => {
    setPlayingSong(song);
    // Record play event
    try {
      await fetch(`/api/songs/${song.id}/play`, { method: 'POST' });
    } catch (err) {
      console.error('Failed to record play', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this song?')) return;
    try {
      const res = await fetch(`/api/songs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSongs((prev) => prev.filter((s) => s.id !== id));
        if (searchResults) {
          setSearchResults((prev) => prev!.filter((s) => s.id !== id));
        }
      }
    } catch (err) {
      console.error('Error deleting song', err);
    }
  };

  const handleShare = async (song: Song) => {
    try {
      if (!song.is_public) {
        await fetch(`/api/songs/${song.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_public: true })
        });
      }
      const url = `${window.location.origin}/share/${song.id}`;
      await navigator.clipboard.writeText(url);
      alert('Share link copied to clipboard!');
    } catch (err) {
      console.error('Error sharing song', err);
    }
  };

  const openPlaylistModal = async (songId: string) => {
    setAddingToPlaylist(songId);
    setIsLoadingPlaylists(true);
    try {
      const res = await fetch('/api/playlists');
      if (res.ok) {
        const data = await res.json();
        setPlaylists(data);
      }
    } catch (err) {
      console.error('Failed to fetch playlists', err);
    } finally {
      setIsLoadingPlaylists(false);
    }
  };

  const selectPlaylist = async (playlistId: string) => {
    try {
      await fetch(`/api/playlists/${playlistId}/songs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ song_id: addingToPlaylist })
      });
      alert('Added to playlist!');
      setAddingToPlaylist(null);
    } catch (err) {
      console.error('Error adding to playlist', err);
    }
  };

  const displaySongs = searchResults !== null ? searchResults : songs;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'var(--font-ibm-plex-sans)' }}>
      {/* Search Bar */}
      <div style={{ marginBottom: '2rem', position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search your songs by vibe, mood, lyrics..."
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid var(--border)',
            borderRadius: 0,
            fontSize: '1rem',
            fontFamily: 'inherit',
            outline: 'none',
            background: 'var(--bg)',
            color: 'var(--ink)'
          }}
        />
        {isSearching && <div style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--ink-muted)' }}>Searching...</div>}
        {searchResults !== null && !isSearching && (
          <div style={{ marginTop: '8px', color: 'var(--ink-muted)', fontSize: '14px' }}>
            {searchResults.length} results for &apos;{query}&apos;
          </div>
        )}
      </div>

      {/* Header */}
      <div style={{ marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.25rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        YOUR SONGS &mdash; {displaySongs.length} songs
      </div>

      {/* Grid */}
      {displaySongs.length === 0 ? (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--ink-muted)' }}>
          No songs yet. <Link href="/generate" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>Generate your first song &rarr;</Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: '16px'
        }}>
          {displaySongs.map(song => (
            <div key={song.id} style={{ border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
              <SongCard
                song={song}
                onPlay={() => handlePlay(song)}
                onDelete={() => handleDelete(song.id)}
                onShare={() => handleShare(song)}
                onAddToPlaylist={() => openPlaylistModal(song.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Sticky Player */}
      {playingSong && playingSong.audio_url && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--card-bg)',
          borderTop: '1px solid var(--border)',
          padding: '0 2rem',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.05)',
          zIndex: 100
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ flex: '0 0 200px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {playingSong.title || 'Untitled'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <AudioPlayer src={playingSong.audio_url} />
            </div>
            <button 
              onClick={() => setPlayingSong(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1, padding: '0.5rem', flexShrink: 0 }}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Playlist Modal */}
      {addingToPlaylist && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(247, 246, 242, 0.9)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200
        }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '2rem', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>Add to Playlist</h3>
            {isLoadingPlaylists ? (
              <p>Loading playlists...</p>
            ) : playlists.length === 0 ? (
              <p style={{ color: 'var(--ink-muted)' }}>No playlists found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                {playlists.map(p => (
                  <button
                    key={p.id}
                    onClick={() => selectPlaylist(p.id)}
                    style={{
                      padding: '12px', textAlign: 'left', background: 'var(--bg)', border: '1px solid var(--border)', cursor: 'pointer',
                      borderRadius: 0, fontFamily: 'inherit'
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}
            <button 
              onClick={() => setAddingToPlaylist(null)}
              style={{ marginTop: '1rem', width: '100%', padding: '12px', background: 'var(--accent)', color: 'var(--accent-inverse)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}