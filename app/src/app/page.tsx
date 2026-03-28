import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'

const metrics = [
  { value: '≈30s', label: 'to create a song' },
  { value: '∞', label: 'possibilities' },
  { value: '1:1', label: 'fine-tuned feed just for you' },
]

export default async function LandingPage() {
  const { userId } = auth()

  return (
    <div className="page-wrap" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
      <nav className="surface top-nav">
        <div className="brand">myTrack</div>
        <div className="nav-links">
          <Link href="/dashboard" aria-label="Navigate to dashboard">Dashboard</Link>
          <Link href="/library" aria-label="Navigate to library">Library</Link>
          <Link href="/generate" aria-label="Navigate to generate">Generate</Link>
          <Link href="/playlists" aria-label="Navigate to playlists">Playlists</Link>
          <Link href="/sign-up" aria-label="Navigate to sign up">Sign up</Link>
          {!userId && (
            <Link href="/sign-in" className="btn btn-primary">
              Sign in
            </Link>
          )}
        </div>
      </nav>

      <main className="surface surface-strong landing-shell" style={{ padding: 'clamp(1.2rem, 3vw, 2.6rem)', borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: '-30% -5% auto',
            height: '78%',
            background: 'radial-gradient(50% 50% at 50% 50%, rgba(241,236,231,0.94), rgba(225,231,244,0.18) 70%, rgba(255,255,255,0))',
            filter: 'blur(30px)',
          }}
        />

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
          <span className="kicker landing-animate" style={{ animationDelay: '80ms' }}>Backed by listening data + adaptive generation</span>

          <h1 className="landing-animate" style={{ animationDelay: '140ms', fontSize: 'clamp(2.3rem, 6.6vw, 5rem)', lineHeight: 0.95, letterSpacing: '-0.04em', maxWidth: '16ch' }}>
            We rebuilt music generation
            <br />
            around your taste graph.
          </h1>

          <p className="landing-animate" style={{ animationDelay: '200ms', color: 'var(--ink-muted)', fontSize: 'clamp(1rem, 1.6vw, 1.3rem)', maxWidth: '56ch' }}>
            A premium adaptive feed: Spotify-informed profile analysis, continuous queueing, and instant feedback loops that keep every next track relevant.
          </p>

          <div className="landing-animate" style={{ animationDelay: '260ms', display: 'flex', flexWrap: 'wrap', gap: '0.7rem' }}>
            <span className="pill">profile weighted</span>
            <span className="pill">continuous queue</span>
            <span className="pill">re-surface logic</span>
            <span className="pill">playlist-ready output</span>
          </div>

          <div className="kpi-grid landing-animate" style={{ animationDelay: '320ms' }}>
            {metrics.map((metric, index) => (
              <div className="kpi-card" style={{ animationDelay: `${360 + index * 80}ms` }} key={metric.label}>
                <div className="kpi-value">{metric.value}</div>
                <div className="kpi-label">{metric.label}</div>
              </div>
            ))}
          </div>

          <div className="landing-animate" style={{ animationDelay: '420ms', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            <Link href={userId ? '/dashboard' : '/sign-up'} className="btn btn-primary">
              Enter myTrack
            </Link>
            <Link href={userId ? '/generate' : '/sign-up'} className="btn btn-secondary">
              Start a session
            </Link>
          </div>
        </div>
      </main>

      <footer className="surface" style={{ padding: '0.95rem 1.2rem', color: 'var(--ink-muted)', fontSize: '0.84rem' }}>
        your history → profile synthesis → continuously improved songs
      </footer>
    </div>
  )
}
