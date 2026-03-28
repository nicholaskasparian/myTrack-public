'use client'

import React from 'react'
import type { Song } from '../lib/types'

export default function SongCard({
  song,
  onPlay,
  onDelete,
  onShare,
  onAddToPlaylist,
  compact,
}: {
  song: Song
  onPlay?: () => void
  onDelete?: () => void
  onShare?: () => void
  onAddToPlaylist?: () => void
  compact?: boolean
}) {
  return (
    <article
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: compact ? '0.7rem' : '1rem',
        padding: compact ? '0.65rem' : '0.9rem',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        background: 'rgba(255,255,255,0.72)',
      }}
    >
      <div
        style={{
          width: compact ? '50px' : '68px',
          height: compact ? '50px' : '68px',
          borderRadius: '10px',
          background: 'var(--bg-deep)',
          backgroundImage: song.cover_url ? `url(${song.cover_url})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flexShrink: 0,
          boxShadow: 'var(--shadow-sm)',
        }}
      />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <div
          style={{
            fontWeight: 650,
            fontSize: compact ? '0.92rem' : '1rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            letterSpacing: '-0.01em',
          }}
        >
          {song.title || 'Untitled'}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', color: 'var(--ink-muted)', fontSize: '0.75rem' }}>
          {song.genre && <span className="tag">{song.genre}</span>}
          {song.bpm && <span className="tag">{song.bpm} BPM</span>}
          {song.rating !== null && <span className="tag">{song.rating}/10</span>}
        </div>

        {!compact && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.2rem' }}>
            {onPlay && (
              <button onClick={onPlay} className="btn btn-primary" style={{ padding: '0.42rem 0.72rem', fontSize: '0.76rem' }}>
                Play
              </button>
            )}
            {onAddToPlaylist && (
              <button onClick={onAddToPlaylist} className="btn btn-secondary" style={{ padding: '0.42rem 0.72rem', fontSize: '0.76rem' }}>
                Add to playlist
              </button>
            )}
            {onShare && (
              <button onClick={onShare} className="btn btn-secondary" style={{ padding: '0.42rem 0.72rem', fontSize: '0.76rem' }}>
                Share
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="btn btn-ghost"
                style={{
                  padding: '0.42rem 0.72rem',
                  fontSize: '0.76rem',
                  color: 'var(--danger)',
                  borderColor: 'rgba(192, 58, 77, 0.35)',
                }}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {song.created_at && !compact && (
        <div style={{ fontSize: '0.73rem', color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
          {new Date(song.created_at).toLocaleDateString()}
        </div>
      )}
    </article>
  )
}
