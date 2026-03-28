import React from 'react';
import { notFound } from 'next/navigation';
import { getSupabaseAdmin } from '@/lib/supabase';
import AudioPlayer from '@/components/AudioPlayer';
import Link from 'next/link';

export default async function SharePage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseAdmin();

  const { data: song, error } = await supabase
    .from('songs')
    .select('*')
    .eq('id', params.id)
    .eq('is_public', true)
    .single();

  if (error || !song) {
    notFound();
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', padding: '4rem 2rem', fontFamily: 'var(--font-ibm-plex-sans)' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Cover Art */}
        <div style={{ 
          width: '300px', 
          height: '300px', 
          margin: '0 auto', 
          background: 'var(--border)', 
          backgroundImage: song.cover_url ? `url(${song.cover_url})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid var(--border)'
        }} />

        {/* Title & Badges */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 1rem 0', letterSpacing: '-0.02em' }}>
            {song.title || 'Untitled'}
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 'bold' }}>
            {song.genre && (
              <span style={{ border: '1px solid var(--border)', padding: '4px 8px', background: 'var(--card-bg)' }}>
                {song.genre}
              </span>
            )}
            {song.bpm && (
              <span style={{ border: '1px solid var(--border)', padding: '4px 8px', background: 'var(--card-bg)' }}>
                {song.bpm} BPM
              </span>
            )}
          </div>
        </div>

        {/* Vibe */}
        {song.vibe && (
          <div style={{ textAlign: 'center', color: 'var(--ink-muted)', fontSize: '1.125rem', fontStyle: 'italic' }}>
            "{song.vibe}"
          </div>
        )}

        {/* Player */}
        {song.audio_url ? (
          <div style={{ margin: '1rem 0' }}>
            <AudioPlayer src={song.audio_url} />
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--ink-muted)', padding: '2rem', border: '1px solid var(--border)' }}>
            Audio not available yet.
          </div>
        )}

        {/* Collapsibles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {song.lyrics && (
            <details style={{ border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
              <summary style={{ padding: '1rem', cursor: 'pointer', fontWeight: 'bold', listStyle: 'none' }}>
                Lyrics
              </summary>
              <div style={{ 
                padding: '1rem', 
                borderTop: '1px solid var(--border)', 
                fontFamily: 'var(--font-ibm-plex-mono), monospace',
                whiteSpace: 'pre-wrap',
                fontSize: '0.875rem',
                lineHeight: 1.6
              }}>
                {song.lyrics}
              </div>
            </details>
          )}

          {song.prompt && (
            <details style={{ border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
              <summary style={{ padding: '1rem', cursor: 'pointer', fontWeight: 'bold', listStyle: 'none' }}>
                Lyria Prompt
              </summary>
              <div style={{ 
                padding: '1rem', 
                borderTop: '1px solid var(--border)', 
                fontFamily: 'var(--font-ibm-plex-mono), monospace',
                whiteSpace: 'pre-wrap',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                color: 'var(--ink-muted)'
              }}>
                {song.prompt}
              </div>
            </details>
          )}
        </div>

        {/* Footer */}
        <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '0.875rem' }}>
          Made with <span style={{ fontWeight: 'bold' }}>myTrack</span> &mdash; {' '}
          <Link href="/sign-up" style={{ color: 'var(--ink)', textDecoration: 'underline', fontWeight: 500 }}>
            Generate your own &rarr;
          </Link>
        </footer>

      </div>
    </div>
  );
}