'use client'

import React from 'react'
import type { Concept } from '../lib/types'

export default function ConceptCard({
  concept,
  onSelect,
  selected,
}: {
  concept: Concept
  onSelect: () => void
  selected?: boolean
}) {
  return (
    <div
      style={{
        border: `1px solid ${selected ? 'rgba(16, 19, 26, 0.35)' : 'var(--border)'}`,
        borderRadius: '14px',
        padding: '1rem',
        background: selected ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.72)',
        boxShadow: selected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.7rem',
        cursor: 'pointer',
      }}
    >
      <div style={{ fontWeight: 650, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>{concept.title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        <span className="tag">{concept.genre}</span>
        {concept.secondary_genre && <span className="tag">{concept.secondary_genre}</span>}
        <span className="tag">{concept.bpm} BPM</span>
      </div>
      <div style={{ fontSize: '0.93rem', color: 'var(--ink)', fontStyle: 'italic' }}>{concept.mood}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>{concept.structure_hint}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>{concept.why}</div>
      <button onClick={(e) => { e.stopPropagation(); onSelect() }} className="btn btn-primary" style={{ marginTop: '0.4rem', width: '100%' }}>
        Select concept
      </button>
    </div>
  )
}
