import React from 'react'
import { notFound } from 'next/navigation'
import { getSupabaseAdmin } from '../../../lib/supabase'
import AudioPlayer from '../../../components/AudioPlayer'
import Link from 'next/link'

export default async function SharePage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseAdmin()

  const { data: song, error } = await supabase.from('songs').select('*').eq('id', params.id).eq('is_public', true).single()

  if (error || !song) notFound()

  return (
    <div className="page-wrap" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <section className="panel" style={{ maxWidth: '860px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <span className="kicker">Shared from myTrack</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 300px) 1fr', gap: '1rem', alignItems: 'start' }}>
          <div
            style={{
              width: '100%',
              aspectRatio: '1',
              borderRadius: '16px',
              background: 'var(--bg-deep)',
              backgroundImage: song.cover_url ? `url(${song.cover_url})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-md)',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4.8vw, 2.8rem)', lineHeight: 1, letterSpacing: '-0.03em' }}>{song.title || 'Untitled'}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {song.genre && <span className="tag">{song.genre}</span>}
              {song.bpm && <span className="tag">{song.bpm} BPM</span>}
            </div>
            {song.vibe && <p style={{ fontStyle: 'italic', color: 'var(--ink-muted)' }}>&quot;{song.vibe}&quot;</p>}
            {song.audio_url ? <AudioPlayer src={song.audio_url} /> : <div className="notice">Audio not available yet.</div>}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {song.lyrics && (
            <details className="panel" style={{ background: 'rgba(255,255,255,0.65)' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Lyrics</summary>
              <pre style={{ whiteSpace: 'pre-wrap', marginTop: '0.6rem', color: 'var(--ink-muted)', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '0.82rem' }}>
                {song.lyrics}
              </pre>
            </details>
          )}
          {song.prompt && (
            <details className="panel" style={{ background: 'rgba(255,255,255,0.65)' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Lyria prompt</summary>
              <pre style={{ whiteSpace: 'pre-wrap', marginTop: '0.6rem', color: 'var(--ink-muted)', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '0.82rem' }}>
                {song.prompt}
              </pre>
            </details>
          )}
        </div>

        <footer style={{ textAlign: 'center', color: 'var(--ink-muted)', fontSize: '0.84rem' }}>
          Made with <strong>myTrack</strong> —{' '}
          <Link href="/sign-up" style={{ textDecoration: 'underline', color: 'var(--ink)' }}>
            generate your own →
          </Link>
        </footer>
      </section>
    </div>
  )
}
