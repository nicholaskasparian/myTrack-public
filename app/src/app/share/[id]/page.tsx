import React from 'react'
import { notFound } from 'next/navigation'
import { getSupabaseAdmin } from '../../../lib/supabase'
import SharedSongPlayer from '../../../components/SharedSongPlayer'
import Link from 'next/link'
import type { Song } from '../../../lib/types'

type RatingRow = { rating: number | null }

export default async function SharePage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseAdmin()

  const { data: song, error } = await supabase.from('songs').select('*').eq('id', params.id).eq('is_public', true).single()

  if (error || !song) notFound()

  const [{ data: ratings, error: ratingsError }, { data: relatedByGenre }, { data: relatedByMood }] = await Promise.all([
    supabase.from('song_ratings').select('rating').eq('song_id', params.id),
    song.genre
      ? supabase
          .from('songs')
          .select('*')
          .eq('is_public', true)
          .neq('id', params.id)
          .eq('genre', song.genre)
          .order('rating', { ascending: false })
          .limit(6)
      : Promise.resolve({ data: [] as Song[] }),
    song.mood
      ? supabase
          .from('songs')
          .select('*')
          .eq('is_public', true)
          .neq('id', params.id)
          .eq('mood', song.mood)
          .order('rating', { ascending: false })
          .limit(6)
      : Promise.resolve({ data: [] as Song[] }),
  ])

  if (ratingsError) {
    console.error('Failed to load ratings for shared song:', ratingsError)
  }

  const ratingsValues = ((ratings || []) as RatingRow[])
    .map((entry) => entry.rating)
    .filter((r): r is number => typeof r === 'number')
  const avgRating =
    ratingsValues.length > 0
      ? Number((ratingsValues.reduce((acc: number, value: number) => acc + value, 0) / ratingsValues.length).toFixed(1))
      : song.rating ?? null
  const relatedCandidates = ([...(relatedByGenre || []), ...(relatedByMood || [])] as Song[])
  const relatedSongMap = new Map<string, Song>()
  relatedCandidates.forEach((candidate) => {
    if (candidate?.id && !relatedSongMap.has(candidate.id)) relatedSongMap.set(candidate.id, candidate)
  })
  const safeRelatedSongs: Song[] = [...relatedSongMap.values()]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6)

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
              <span className="tag">{song.play_count ?? 0} plays</span>
              <span className="tag">
                {typeof avgRating === 'number' ? `${avgRating}/10 avg` : 'Unrated'}
              </span>
            </div>
            {song.vibe && <p style={{ fontStyle: 'italic', color: 'var(--ink-muted)' }}>"{song.vibe}"</p>}
            {song.audio_url ? (
              <SharedSongPlayer songId={song.id} src={song.audio_url} />
            ) : (
              <div className="notice">Audio not available yet.</div>
            )}
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

        {safeRelatedSongs.length > 0 && (
          <section className="panel" style={{ background: 'rgba(255,255,255,0.66)' }}>
            <div className="panel-header">
              <h2 className="section-title" style={{ marginBottom: 0 }}>You may also like</h2>
              <span className="tag">Similar vibe</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
              {safeRelatedSongs.slice(0, 4).map((related) => (
                <Link key={related.id} href={`/share/${related.id}`} className="panel" style={{ padding: '0.65rem', background: 'rgba(255,255,255,0.7)' }}>
                  <div style={{ width: '100%', aspectRatio: '1', borderRadius: '0', overflow: 'hidden', background: 'var(--bg-deep)', marginBottom: '0.5rem' }}>
                    {related.cover_url && (
                      <img src={related.cover_url} alt={related.title || 'Song cover'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{related.title || 'Untitled'}</div>
                  <div style={{ color: 'var(--ink-muted)', fontSize: '0.78rem' }}>
                    {related.genre || 'Genreless'} {related.bpm ? `• ${related.bpm} BPM` : ''}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

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
