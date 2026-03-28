'use client';

import React from 'react';
import type { Concept } from '../lib/types';

export default function ConceptCard({ 
  concept, 
  onSelect, 
  selected 
}: { 
  concept: Concept; 
  onSelect: () => void; 
  selected?: boolean;
}) {
  return (
    <div style={{
      border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
      padding: '16px',
      background: selected ? 'var(--accent-inverse)' : 'var(--card-bg)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      cursor: 'pointer'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{concept.title}</div>
      <div style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
        {concept.genre}
        {concept.secondary_genre ? `, ${concept.secondary_genre}` : ''}
        {' • '}
        {concept.bpm} BPM
      </div>
      <div style={{ fontSize: '14px', fontStyle: 'italic', color: 'var(--ink)' }}>{concept.mood}</div>
      <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{concept.structure_hint}</div>
      <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{concept.why}</div>
      <button 
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        style={{
          marginTop: 'auto',
          background: 'var(--accent)',
          color: 'var(--accent-inverse)',
          border: '1px solid var(--accent)',
          padding: '8px 16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'center'
        }}
      >
        Select
      </button>
    </div>
  );
}
