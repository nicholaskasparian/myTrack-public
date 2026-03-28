'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Concept, Song, GenerationStep } from '../../lib/types';
import ConceptCard from '../../components/ConceptCard';
import AudioPlayer from '../../components/AudioPlayer';
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

  // Simulate concept loading on mount
  useEffect(() => {
    if (step === 'ideas') {
      fetchConcepts();
    }
  }, []);

  const fetchConcepts = async () => {
    // Simulated API call for concepts
    setConcepts([
      { title: 'Neon Midnight', genre: 'Synthwave', secondary_genre: null, mood: 'Driving, nostalgic', bpm: 110, key_instruments: ['Synthesizer', 'Drum Machine'], structure_hint: 'A-B-A', why: 'Matches your late night listening' },
      { title: 'Acoustic Sunrise', genre: 'Folk', secondary_genre: 'Acoustic Pop', mood: 'Calm, reflective', bpm: 85, key_instruments: ['Acoustic Guitar', 'Vocals'], structure_hint: 'Verse-Chorus-Verse', why: 'High acousticness preference' },
      { title: 'Hype Workout', genre: 'EDM', secondary_genre: 'House', mood: 'Energetic, driving', bpm: 128, key_instruments: ['Bass Synth', 'Drums'], structure_hint: 'Build-Drop-Build', why: 'High energy preference' }
    ]);
  };

  const startGeneration = async (concept: Concept) => {
    setSelectedConcept(concept);
    setStep('prompting');
    setCompletedSteps(['Direction selected']);
    setCurrentStepText('Engineering your track...');
    
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
          lyrics: null,
          vibe: null,
          concept_json: selectedConcept,
          profile_snapshot: null,
          audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Sample audio
          cover_url: null,
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
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>CREATE</h1>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: '1px solid var(--border)', padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold' }}>Back</button>
      </div>

      {/* STATE 1: Concept Picker */}
      {step === 'ideas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: 'var(--ink)' }}>
              Optional mood hint (e.g. "late night drive", "studying", "hype workout")
            </label>
            <div style={{ display: 'flex', gap: '16px' }}>
              <input 
                type="text" 
                value={moodHint}
                onChange={(e) => setMoodHint(e.target.value)}
                placeholder="What's the vibe?"
                style={{ 
                  flex: 1, 
                  padding: '12px 16px', 
                  border: '1px solid var(--border)', 
                  outline: 'none',
                  fontSize: '16px',
                  background: 'var(--card-bg)'
                }}
              />
              <button 
                onClick={fetchConcepts}
                style={{ 
                  background: 'none', 
                  border: '1px solid var(--border)', 
                  padding: '0 24px', 
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Regenerate
              </button>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {concepts.map((concept, idx) => (
              <ConceptCard 
                key={idx} 
                concept={concept} 
                onSelect={() => startGeneration(concept)} 
              />
            ))}
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
                borderRadius: '50%',
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
              onEnded={() => setShowRating(true)}
            />

            <div style={{ display: 'flex', gap: '16px', width: '100%', justifyContent: 'center' }}>
              <button style={{ background: 'none', border: '1px solid var(--border)', padding: '8px 24px', cursor: 'pointer', fontWeight: 'bold' }}>+ Playlist</button>
              <button style={{ background: 'none', border: '1px solid var(--border)', padding: '8px 24px', cursor: 'pointer', fontWeight: 'bold' }}>Share</button>
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
