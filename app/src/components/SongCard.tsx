'use client';

import React from 'react';
import type { Song } from '../lib/types';

export default function SongCard({ 
  song, 
  onPlay, 
  onDelete, 
  onShare,
  onAddToPlaylist,
  compact 
}: { 
  song: Song; 
  onPlay?: () => void; 
  onDelete?: () => void; 
  onShare?: () => void;
  onAddToPlaylist?: () => void;
  compact?: boolean;
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: compact ? '8px' : '16px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg)',
      gap: '16px'
    }}>
      <div 
        style={{
          width: compact ? '48px' : '64px',
          height: compact ? '48px' : '64px',
          background: 'var(--border)',
          backgroundImage: song.cover_url ? `url(${song.cover_url})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flexShrink: 0
        }}
      />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ 
          fontWeight: 'bold', 
          fontSize: compact ? '14px' : '16px', 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis' 
        }}>
          {song.title || 'Untitled'}
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          fontSize: '12px', 
          color: 'var(--ink-muted)' 
        }}>
          {song.genre && <span>{song.genre}</span>}
          {song.bpm && <span>{song.bpm} BPM</span>}
          {song.rating !== null && (
            <span style={{ 
              padding: '2px 6px', 
              border: '1px solid var(--border)', 
              fontSize: '10px', 
              fontWeight: 'bold' 
            }}>
              {song.rating}/10
            </span>
          )}
        </div>
        {!compact && (
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            {onPlay && (
              <button onClick={onPlay} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0, fontWeight: 'bold', fontSize: '12px' }}>[Play]</button>
            )}
            <button onClick={onAddToPlaylist} style={{ background: 'none', border: 'none', color: 'var(--ink)', cursor: 'pointer', padding: 0, fontSize: '12px' }}>[+ Playlist]</button>
            <button onClick={onShare} style={{ background: 'none', border: 'none', color: 'var(--ink)', cursor: 'pointer', padding: 0, fontSize: '12px' }}>[Share]</button>
            {onDelete && (
              <button onClick={onDelete} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', padding: 0, fontSize: '12px' }}>[Delete]</button>
            )}
          </div>
        )}
      </div>
      {song.created_at && !compact && (
        <div style={{ fontSize: '12px', color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
          {new Date(song.created_at).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
