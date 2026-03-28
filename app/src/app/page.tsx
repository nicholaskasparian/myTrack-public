import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

export default async function LandingPage() {
  const { userId } = auth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)', color: 'var(--ink)' }}>
      {/* Top Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.25rem', letterSpacing: '-0.02em' }}>myTrack</div>
        {!userId && (
          <Link href="/sign-in" style={{ textDecoration: 'none', color: 'var(--ink)', fontWeight: 500 }}>
            [Sign In]
          </Link>
        )}
      </nav>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 2rem' }}>
        <div style={{ width: '100%', maxWidth: '800px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.04em', margin: '0 0 1rem 0' }}>
              Music made for you.
            </h1>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 400, color: 'var(--ink-muted)', margin: 0, letterSpacing: '-0.02em' }}>
              Not the algorithm. You.
            </h2>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <Link 
              href={userId ? "/dashboard" : "/sign-up"} 
              style={{
                display: 'flex',
                width: '100%',
                backgroundColor: 'var(--accent)',
                color: 'var(--accent-inverse)',
                textDecoration: 'none',
                padding: '1rem 2rem',
                minHeight: '56px',
                fontSize: '1.25rem',
                fontWeight: 600,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Enter the web app
            </Link>
          </div>
        </div>
      </main>

      {/* Feature Strip */}
      <footer style={{ 
        borderTop: '1px solid var(--border)', 
        padding: '2rem', 
        textAlign: 'center',
        color: 'var(--ink-muted)',
        fontSize: '1rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase'
      }}>
        Your listening history &rarr; Your Sound Profile &rarr; Your songs
      </footer>
    </div>
  );
}