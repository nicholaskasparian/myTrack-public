'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type MetricsResponse = {
  total_songs: number
  total_playlists: number
  total_plays: number
  avg_rating: number | null
  resurfaced_count: number
  queued_count: number
  played_count: number
  avg_generation_seconds: number | null
  top_genres: Array<{ genre: string; count: number }>
  generation_by_day: Array<{ day: string; count: number }>
}

const MetricCard = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
  <div className="kpi-card">
    <div className="kpi-value">{value}</div>
    <div className="kpi-label">{label}</div>
    {hint && <div style={{ marginTop: '0.35rem', color: 'var(--ink-muted)', fontSize: '0.75rem' }}>{hint}</div>}
  </div>
)

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/songs/stats')
      if (!res.ok) throw new Error('Failed to load metrics')
      const data = await res.json()
      setMetrics(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  const story = useMemo(() => {
    if (!metrics) return ''
    const topGenre = metrics.top_genres[0]?.genre || 'mixed styles'
    if (metrics.total_songs === 0) return 'Start generating to unlock your personalized performance story.'
    return `You generated ${metrics.total_songs} tracks and your strongest lane is ${topGenre}.`
  }, [metrics])

  const maxDayCount = useMemo(() => {
    if (!metrics) return 1
    return Math.max(1, ...metrics.generation_by_day.map((d) => d.count), 1)
  }, [metrics])

  return (
    <div className="page-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <nav className="surface top-nav">
        <div className="brand">myTrack metrics</div>
        <div className="nav-links">
          <Link href="/dashboard" className="btn btn-secondary">Dashboard</Link>
          <Link href="/generate" className="btn btn-primary">Generate</Link>
          <button onClick={fetchMetrics} className="btn btn-ghost">Refresh</button>
        </div>
      </nav>

      {loading ? (
        <section className="panel notice">Loading performance metrics...</section>
      ) : error ? (
        <section className="panel notice error">{error}</section>
      ) : !metrics ? (
        <section className="panel notice">No metrics available yet.</section>
      ) : (
        <>
          <section className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div className="panel-header">
              <h1 className="section-title" style={{ marginBottom: 0 }}>Performance snapshot</h1>
              <span className="tag">Hackathon-ready signal</span>
            </div>
            <p style={{ color: 'var(--ink-muted)' }}>{story}</p>

            <div className="kpi-grid">
              <MetricCard label="Songs generated" value={String(metrics.total_songs)} />
              <MetricCard label="Total plays" value={String(metrics.total_plays)} />
              <MetricCard
                label="Average rating"
                value={metrics.avg_rating !== null ? `${metrics.avg_rating}/10` : '—'}
                hint="From rated tracks"
              />
              <MetricCard
                label="Avg generation time"
                value={metrics.avg_generation_seconds ? `${metrics.avg_generation_seconds}s` : '—'}
                hint="Prompt → Music → Cover → Upload"
              />
              <MetricCard label="Playlists" value={String(metrics.total_playlists)} />
              <MetricCard label="Resurface-ready" value={String(metrics.resurfaced_count)} hint="Rated 8+ and marked to replay" />
            </div>
          </section>

          <section className="app-grid">
            <article className="panel">
              <div className="panel-header">
                <h2 className="section-title" style={{ marginBottom: 0 }}>Top generated genres</h2>
              </div>
              {metrics.top_genres.length === 0 ? (
                <div className="notice">No genre data yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {metrics.top_genres.map((genre) => (
                    <div key={genre.genre} style={{ display: 'grid', gridTemplateColumns: '140px 1fr auto', gap: '0.55rem', alignItems: 'center' }}>
                      <span style={{ color: 'var(--ink-muted)', fontSize: '0.82rem' }}>{genre.genre}</span>
                      <div style={{ height: 8, borderRadius: 0, background: 'rgba(22,28,40,0.14)', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.min(100, Math.round((genre.count / Math.max(1, metrics.total_songs)) * 100))}%`,
                            background: 'linear-gradient(90deg, #54668d 0%, #1f2737 100%)',
                          }}
                        />
                      </div>
                      <span className="tag">{genre.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="panel">
              <div className="panel-header">
                <h2 className="section-title" style={{ marginBottom: 0 }}>Generation momentum</h2>
              </div>
              {metrics.generation_by_day.length === 0 ? (
                <div className="notice">Generate songs to see daily momentum.</div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'end', gap: '0.45rem', minHeight: '160px' }}>
                  {metrics.generation_by_day.slice(-12).map((point) => (
                    <div key={point.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', flex: 1 }}>
                      <div
                        title={`${point.day}: ${point.count}`}
                        style={{
                          width: '100%',
                          maxWidth: 24,
                          height: `${Math.max(12, Math.round((point.count / maxDayCount) * 110))}px`,
                          borderRadius: 0,
                          background: 'linear-gradient(180deg, #6b7ea8 0%, #1f2737 100%)',
                        }}
                      />
                      <span style={{ fontSize: '0.65rem', color: 'var(--ink-muted)' }}>
                        {new Date(point.day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </section>
        </>
      )}
    </div>
  )
}
