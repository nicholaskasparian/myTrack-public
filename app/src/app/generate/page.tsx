'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Concept, Song, GenerationStep } from '../../lib/types';
import ConceptCard from '../../components/ConceptCard';
import AudioPlayer from '../../components/AudioPlayer';
import LyricsPlayer from '../../components/LyricsPlayer';
import RatingSlider from '../../components/RatingSlider';

export default function GeneratePage() {
  const router = useRouter();
  
  // -- State variables --
  const [step, setStep] = useState<GenerationStep>('ideas');
  const [moodHint, setMoodHint] = useState('');
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  
  // Generating state
  const [generatingProgress, setGeneratingProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentStepText, setCurrentStepText] = useState('');
  
  // Player state
  const [song, setSong] = useState<Song | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(5);
  const [queue, setQueue] = useState<Song[]>([]);
  const [showLyricsPlayer, setShowLyricsPlayer] = useState(false);

  // Auto-advance logic
  const handleNextTrack = () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      setQueue(queue.slice(1));
      
      // Update current song with next song's details but keep mock audio/cover for demo if missing
      setSong(prev => prev ? {
        ...prev,
        ...nextSong,
        audio_url: nextSong.audio_url || prev.audio_url,
        cover_url: nextSong.cover_url || prev.cover_url
      } : nextSong);
      
      setShowRating(false);
      triggerBackgroundGeneration();
    }
  };

  const triggerBackgroundGeneration = () => {
    fetch('/api/generate/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mixType: moodHint ? 'Custom Vibe' : 'Default Mix', vibePrompt: moodHint })
    }).catch(console.error);
  };

  // Generate functions
  const handleDefaultMix = () => {
    setStep('prompting');
    setCompletedSteps(['Profile analyzed']);
    setCurrentStepText('Engineering your mix...');
    setSelectedConcept({ title: 'Default Mix', genre: 'Mixed', secondary_genre: null, mood: 'Profile Based', bpm: 120, key_instruments: [], structure_hint: '', why: '' });
    runGenerationSequence();
  };

  const handleCustomVibe = () => {
    if (!moodHint.trim()) {
      alert("Please enter a vibe first!");
      return;
    }
    setStep('prompting');
    setCompletedSteps(['Vibe received: ' + moodHint]);
    setCurrentStepText('Engineering your track...');
    setSelectedConcept({ title: 'Custom Vibe', genre: 'Mixed', secondary_genre: null, mood: moodHint, bpm: 120, key_instruments: [], structure_hint: '', why: '' });
    runGenerationSequence();
  };

  const runGenerationSequence = () => {
    // Fire off the background generation for the next song in the queue immediately
    triggerBackgroundGeneration();

    // Simulate generation sequence
    setTimeout(() => {
      setStep('lyria');
      setCompletedSteps(prev => [...prev, 'Engineering your track...']);
      setCurrentStepText('Composing with Lyria...');
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setGeneratingProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          finishGeneration();
        }
      }, 200);
      
    }, 1500);
  };

  const finishGeneration = () => {
    setStep('cover');
    setCompletedSteps(prev => [...prev, 'Composing with Lyria...']);
    setCurrentStepText('Generating cover art...');
    
    setTimeout(() => {
      setStep('uploading');
      setCompletedSteps(prev => [...prev, 'Generating cover art...']);
      setCurrentStepText('Saving your song...');
      
      setTimeout(() => {
        setStep('done');
        setCompletedSteps(prev => [...prev, 'Saving your song...']);
        setCurrentStepText('Your song is ready');
        
        // Mock Song data
        setSong({
          id: '123',
          user_id: 'user',
          created_at: new Date().toISOString(),
          title: selectedConcept?.title || 'New Song',
          genre: selectedConcept?.genre || 'Unknown',
          mood: selectedConcept?.mood || null,
          bpm: selectedConcept?.bpm || null,
          lyria_prompt: 'prompt',
          lyrics: "[00:15] Verse 1\nWalking down these neon streets\nHeart is skipping to the beats\n\n[00:45] Chorus\nAnd we fly away into the night\nEverything is feeling so right\nYeah we touch the sky, so high\n\n[01:15] Verse 2\nShadows dancing on the wall\nI don't care if we ever fall\n\n[01:45] Chorus\nAnd we fly away into the night\nEverything is feeling so right\nYeah we touch the sky, so high",
          vibe: selectedConcept?.mood || 'Vibe',
          concept_json: selectedConcept,
          profile_snapshot: null,
          audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Sample audio
          cover_url: 'https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=800&q=80',
          duration_seconds: 180,
          is_public: true,
          play_count: 0,
          rating: null,
          resurface: false,
          status: 'ready',
          queue_position: null
        });
        
        // Mock Queue
        setQueue([
          { id: '1', title: 'Up Next 1', genre: 'Pop', bpm: 120 } as Song,
          { id: '2', title: 'Up Next 2', genre: 'Rock', bpm: 140 } as Song,
          { id: '3', title: 'Up Next 3', genre: 'Jazz', bpm: 90 } as Song
        ]);
        
      }, 1000);
    }, 1000);
  };

  const handleTimeUpdate = (currentTime: number) => {
    if (currentTime >= 20 && !showRating) {
      setShowRating(true);
    }
  };

  const submitRating = () => {
    // API call to submit rating
    console.log('Submitted rating:', rating);
    setShowRating(false);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', fontFamily: 'var(--font-ibm-plex-sans)' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '1px' }}>RADIO SESSION</h1>
        <button 
          onClick={() => router.push('/dashboard')} 
          style={{ 
            background: 'transparent', 
            border: '1px solid var(--ink)', 
            padding: '6px 16px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transition: 'all 0.2s ease',
            color: 'var(--ink)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'var(--ink)';
            e.currentTarget.style.color = 'var(--bg)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--ink)';
          }}
        >
          Back
        </button>
      </div>

      {/* STATE 1: Simplified Generation Options */}
      {step === 'ideas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', marginTop: '32px' }}>
          <button 
            onClick={handleDefaultMix}
            style={{ 
              background: 'var(--ink)', 
              color: 'var(--bg)', 
              padding: '32px', 
              fontSize: '24px', 
              fontWeight: 'bold', 
              border: 'none', 
              cursor: 'pointer',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Join Feed
            <div style={{ fontSize: '14px', fontWeight: 'normal', color: 'rgba(255,255,255,0.7)', marginTop: '8px', textTransform: 'none', letterSpacing: 'normal' }}>
              We'll auto-generate an endless stream tailored to your Sound Profile
            </div>
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '18px', color: 'var(--ink)' }}>
              Or, select a custom vibe:
            </label>
            <div style={{ display: 'flex', gap: '16px' }}>
              <input 
                type="text" 
                value={moodHint}
                onChange={(e) => setMoodHint(e.target.value)}
                placeholder="e.g. late night drive, studying..."
                style={{ 
                  flex: 1, 
                  padding: '16px 24px', 
                  border: '2px solid var(--border)', 
                  outline: 'none',
                  fontSize: '18px',
                  background: 'var(--card-bg)'
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomVibe()}
              />
              <button 
                onClick={handleCustomVibe}
                style={{ 
                  background: 'transparent', 
                  border: '2px solid var(--ink)', 
                  color: 'var(--ink)',
                  padding: '0 32px', 
                  fontSize: '18px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'var(--ink)';
                  e.currentTarget.style.color = 'var(--bg)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--ink)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Enter Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATE 2: Generating */}
      {['prompting', 'lyria', 'cover', 'uploading'].includes(step) && (
        <div style={{ 
          border: '1px solid var(--border)', 
          padding: '48px 32px', 
          background: 'var(--card-bg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>Creating your track...</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
            {completedSteps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--ink-muted)' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</span>
                <span>{s}</span>
              </div>
            ))}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontWeight: 'bold' }}>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                border: '2px solid var(--border)',
                borderTopColor: 'var(--accent)',
                borderRadius: '0',
                animation: 'spin 1s linear infinite'
              }} />
              <span>{currentStepText}</span>
            </div>
          </div>

          {step === 'lyria' && (
            <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%', height: '4px', background: 'var(--border)', position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                left: 0, 
                top: 0, 
                height: '100%', 
                width: `${generatingProgress}%`, 
                background: 'var(--progress)',
                transition: 'width 0.2s ease'
              }} />
            </div>
          )}
          
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}} />
        </div>
      )}

      {/* STATE 3: Player + Rating */}
      {step === 'done' && song && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          
          {/* Main Player Area */}
          <div style={{ 
            border: '1px solid var(--border)', 
            padding: '32px', 
            background: 'var(--card-bg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px'
          }}>
            <div style={{ 
              width: '200px', 
              height: '200px', 
              background: 'var(--border)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'var(--ink-muted)'
            }}>
              {song.cover_url ? (
                <img src={song.cover_url} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : 'Cover Art'}
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>{song.title}</h2>
              <div style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
                {song.genre} • {song.bpm} BPM
              </div>
            </div>

            <AudioPlayer 
              src={song.audio_url || ''} 
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => {
                setShowRating(true);
                handleNextTrack();
              }}
            />

            <div style={{ display: 'flex', gap: '16px', width: '100%', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowLyricsPlayer(true)}
                style={{ background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '12px 24px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Open Full Player & Lyrics
              </button>
              <button style={{ background: 'none', border: '1px solid var(--border)', padding: '12px 24px', cursor: 'pointer', fontWeight: 'bold' }}>+ Playlist</button>
            </div>

            {showLyricsPlayer && song && (
              <LyricsPlayer song={song} onClose={() => setShowLyricsPlayer(false)} onNext={() => {
                setShowRating(true);
                handleNextTrack();
              }} />
            )}
          </div>

          {/* Persistent Guidance Input */}
          <div style={{
            border: '1px solid var(--border)',
            padding: '24px',
            background: 'var(--card-bg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Influence the Feed</h3>
            <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>Enter a vibe to guide the next songs in your session.</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <input 
                type="text" 
                value={moodHint}
                onChange={(e) => setMoodHint(e.target.value)}
                placeholder="e.g. late night drive, high energy..."
                style={{ 
                  flex: 1, 
                  padding: '12px 16px', 
                  border: '1px solid var(--border)', 
                  outline: 'none',
                  fontSize: '16px',
                  background: 'var(--bg)'
                }}
              />
              <button 
                onClick={() => {
                  alert('Vibe updated! This will influence upcoming tracks.');
                }}
                style={{ 
                  background: 'var(--ink)', 
                  color: 'var(--bg)', 
                  border: 'none', 
                  padding: '0 24px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}
              >
                Update Vibe
              </button>
            </div>
          </div>

          {/* Rating Section */}
          {showRating && (
            <div style={{ 
              border: '1px solid var(--accent)', 
              padding: '24px', 
              background: 'var(--accent-inverse)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>How does this track fit your vibe?</h3>
              <RatingSlider value={rating} onChange={setRating} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <button onClick={() => setShowRating(false)} style={{ background: 'none', border: 'none', color: 'var(--ink-muted)', cursor: 'pointer', textDecoration: 'underline' }}>Skip rating</button>
                <button 
                  onClick={submitRating}
                  style={{ 
                    background: 'var(--accent)', 
                    color: 'var(--accent-inverse)', 
                    border: 'none', 
                    padding: '8px 24px', 
                    cursor: 'pointer', 
                    fontWeight: 'bold' 
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {/* Up Next Section */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>UP NEXT</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {queue.map((qSong, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--border)' }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>{qSong.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{qSong.genre} • {qSong.bpm} BPM</div>
                  </div>
                  <button style={{ background: 'none', border: '1px solid var(--border)', padding: '4px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Skip To</button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
