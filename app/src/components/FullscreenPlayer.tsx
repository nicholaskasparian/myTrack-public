'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import type { Song } from '../lib/types';
import RatingSlider from './RatingSlider';
import { shouldSkipLyricLine } from '../lib/lyrics';

const LYRICS_FONT_SIZE = '48px';

type LyricLine = { time: number; text: string; isSection?: boolean };

// Parse lyrics line-by-line — no destructive pre-replacement that corrupts timestamps.
// Handles: [mm:ss], [mm:ss.ms], inline [mm:ss] text, Lyria [15.0:], and [Section] tags.
function parseLRC(lrcText: string): LyricLine[] {
  const normalized = lrcText.replace(/\r\n?/g, '\n').replace(/\\n/g, '\n');
  const lines = normalized.split('\n').map(l => l.trim());

  // [mm:ss] or [mm:ss.ms], optionally followed by inline lyric text
  const mmssRegex = /^\[(\d{1,2}):(\d{2}(?:\.\d+)?)\](.*)$/;
  // Lyria-style [15.0:] timestamps
  const lyriaTimeRegex = /^\[(\d+(?:\.\d+)?):\](.*)$/;
  // Section tags: [Chorus], [Verse 1], [Bridge], etc.
  const sectionRegex = /^\[([A-Za-z][A-Za-z0-9 ]*)\]$/;
  const metaRegex = /^(music|bpm|duration_secs|good_crop):/i;

  const result: LyricLine[] = [];
  let currentTime = 0;

  for (const line of lines) {
    if (!line) continue;
    if (metaRegex.test(line)) continue;
    // Skip Lyria internal structural tags [[A0]]
    if (/^\[\[.*\]\]$/.test(line)) continue;

    // mm:ss timestamp (with optional inline lyric)
    const mmssMatch = mmssRegex.exec(line);
    if (mmssMatch) {
      currentTime = parseInt(mmssMatch[1], 10) * 60 + parseFloat(mmssMatch[2]);
      const inline = mmssMatch[3].trim();
      if (inline && !shouldSkipLyricLine(inline)) {
        result.push({ time: currentTime, text: inline });
      }
      continue;
    }

    // Lyria [15.0:] timestamp (with optional inline lyric)
    const lyriaMatch = lyriaTimeRegex.exec(line);
    if (lyriaMatch) {
      currentTime = parseFloat(lyriaMatch[1]);
      const inline = lyriaMatch[2].trim();
      if (inline && !shouldSkipLyricLine(inline)) {
        result.push({ time: currentTime, text: inline });
      }
      continue;
    }

    // Section tag — kept for visual context but excluded from sync logic
    if (sectionRegex.test(line)) {
      result.push({ time: currentTime, text: line, isSection: true });
      continue;
    }

    if (shouldSkipLyricLine(line)) continue;

    // Regular lyric line
    result.push({ time: currentTime, text: line });
  }

  if (result.length === 0) {
    return [{ time: 0, text: normalized.trim() }];
  }

  return result.sort((a, b) => a.time - b.time);
}

export default function FullscreenPlayer({
  song,
  onClose,
  onNext,
  onPrev,
  onAddToPlaylist,
  moodHint,
  onMoodHintChange,
  onUpdateVibe,
  isUpdatingVibe,
  vibeFeedback,
  isWaitingForQueueStart
}: {
  song: Song | null;
  onClose?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onAddToPlaylist?: (songId: string) => void;
  moodHint?: string;
  onMoodHintChange?: (nextMoodHint: string) => void;
  onUpdateVibe?: () => void;
  isUpdatingVibe?: boolean;
  vibeFeedback?: string | null;
  isWaitingForQueueStart?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(song?.duration_seconds || 180);
  const [rating, setRating] = useState<number>(song?.rating || 0);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!onClose) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (song) setRating(song.rating || 0);
    
    if (audioRef.current && song?.audio_url) {
      setIsPlaying(false);
      audioRef.current.load();
      audioRef.current.play().catch(e => console.log('Auto-play prevented:', e));
    }
  }, [song]);

  const handleRate = async (val: number) => {
    setRating(val);
    if (!song) return;
    try {
      await fetch(`/api/songs/${song.id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: val }),
      });
    } catch (err) {
      console.error('Error rating song', err);
    }
  };

  const lyricsText = song?.lyrics || "No lyrics available.";
  const parsedLyrics = useMemo(() => parseLRC(lyricsText), [lyricsText]);

  const lastTargetLineRef = useRef<number>(-1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      if (scrollRef.current && parsedLyrics.length > 0) {
        // Find the last non-section lyric line at or before current time
        let targetLine = 0;
        for (let i = 0; i < parsedLyrics.length; i++) {
          if (!parsedLyrics[i].isSection && parsedLyrics[i].time <= audio.currentTime) {
            targetLine = i;
          }
        }
        
        if (targetLine !== lastTargetLineRef.current) {
          lastTargetLineRef.current = targetLine;
          const lineElements = scrollRef.current.children;
          if (lineElements && lineElements[targetLine]) {
            lineElements[targetLine].scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        }
      }
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      audio.play().catch(e => console.log('Auto-play prevented:', e));
    };
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onNext) onNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [parsedLyrics, onNext, song]);

  const togglePlay = () => {
    if (!audioRef.current || !song) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || !audioRef.current || duration === 0) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleLyricClick = (idx: number) => {
    if (!audioRef.current || parsedLyrics.length === 0) return;
    audioRef.current.currentTime = parsedLyrics[idx].time;
    setCurrentTime(parsedLyrics[idx].time);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  // Active line = last non-section lyric whose timestamp has passed
  let activeLineIndex = 0;
  for (let i = 0; i < parsedLyrics.length; i++) {
    if (!parsedLyrics[i].isSection && parsedLyrics[i].time <= currentTime) {
      activeLineIndex = i;
    }
  }

  return (
    <>
    <style dangerouslySetInnerHTML={{__html: `
      @keyframes glassFadeIn {
        from { opacity: 0; backdrop-filter: blur(0px); }
        to { opacity: 1; backdrop-filter: blur(80px); }
      }
      @keyframes contentFadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}} />
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      background: 'radial-gradient(120% 120% at 15% 0%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 40%), linear-gradient(180deg, rgba(16, 19, 26, 0.94), rgba(16, 19, 26, 0.98))',
      color: 'var(--accent-inverse)',
      fontFamily: "Inter, 'IBM Plex Sans', 'SF Pro Text', 'Segoe UI', system-ui, -apple-system, sans-serif",
      overflow: 'hidden',
      animation: 'glassFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
    }}>
      
      {song?.cover_url && (
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '120%',
          height: '120%',
          backgroundImage: `url(${song.cover_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(80px) brightness(0.4)',
          zIndex: 0,
          animation: 'glassFadeIn 0.8s ease forwards',
          opacity: 0,
        }} />
      )}
      
      {/* Header */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        padding: '24px 32px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: 0,
        animation: 'contentFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.2s'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px', letterSpacing: '2px' }}>myTrack</div>
        {onClose && (
          <button 
            onClick={onClose}
            aria-label="Exit fullscreen player"
            title="Exit fullscreen (Esc)"
            style={{ 
              color: 'white', 
              fontSize: '14px', 
              fontWeight: 'bold', 
              background: 'rgba(255,255,255,0.1)', 
              padding: '8px 16px', 
              borderRadius: '0',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            Exit fullscreen
          </button>
        )}
      </div>

      {/* Main Content */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        flex: 1, 
        display: 'flex', 
        padding: '0 32px 32px 32px',
        gap: '48px',
        height: 'calc(100vh - 80px)',
        opacity: 0,
        animation: 'contentFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.3s'
      }}>
        
        {/* Left Side */}
        <div style={{ 
          flex: '0 0 400px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          gap: '32px'
        }}>
          <div style={{ 
            width: '100%', 
            aspectRatio: '1 / 1', 
            borderRadius: '0', 
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'var(--ink)'
          }}>
            {song?.cover_url ? (
              <img src={song.cover_url} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>
                {isWaitingForQueueStart ? 'Generating next track...' : 'No Cover Art'}
              </div>
            )}
          </div>
          
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>{song?.title || (isWaitingForQueueStart ? 'Preparing your next track...' : 'No active track')}</h2>
            <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)' }}>
              {song?.genre || 'Generated session'} • {song?.bpm ? `${song.bpm} BPM` : (isWaitingForQueueStart ? 'Queue building' : 'Unknown BPM')}
            </div>
            {onClose && <div style={{ marginTop: '8px', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Press Esc to exit</div>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(0,0,0,0.5)', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
             <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Rate (0-10)</div>
             <RatingSlider value={rating} onChange={handleRate} />
           </div>

          {onAddToPlaylist && song && (
            <button
              onClick={() => onAddToPlaylist(song.id)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              + Add to Playlist
            </button>
          )}

          {onMoodHintChange && onUpdateVibe && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(0,0,0,0.5)', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Guide session</div>
              <input
                value={moodHint || ''}
                onChange={(e) => onMoodHintChange(e.target.value)}
                placeholder="e.g. warm analog house, rain-soaked synth pop"
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  padding: '10px 12px',
                  outline: 'none',
                  borderRadius: 0
                }}
              />
              <button
                onClick={onUpdateVibe}
                disabled={isUpdatingVibe}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: isUpdatingVibe ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: isUpdatingVibe ? 'not-allowed' : 'pointer'
                }}
              >
                {isUpdatingVibe ? 'Updating...' : 'Update vibe'}
              </button>
              {vibeFeedback && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>{vibeFeedback}</div>}
            </div>
          )}

          {/* Player controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 'auto' }}>
            <audio ref={audioRef} src={song?.audio_url || ''} />
            
            <div 
              ref={trackRef}
              onClick={handleSeek}
              style={{ 
                width: '100%', 
                padding: '16px 0', 
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '0', position: 'relative' }}>
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${progressPercent}%`,
                    background: 'white',
                    borderRadius: '0',
                    transition: 'width 0.1s linear'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', marginTop: '16px' }}>
              {onPrev ? (
                <button
                  onClick={onPrev}
                  style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', opacity: 0.8 }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
                >
                  ⏮
                </button>
              ) : <div style={{width: '24px'}}></div>}
              
              <button 
                onClick={togglePlay}
                disabled={!song}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '0',
                  background: 'white',
                  color: 'black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: song ? 'pointer' : 'not-allowed',
                  opacity: song ? 1 : 0.5,
                  transition: 'background 0.2s ease, transform 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (!song) return;
                  e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  if (!song) return;
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>

              {onNext ? (
                <button
                  onClick={onNext}
                  style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', opacity: 0.8 }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
                >
                  ⏭
                </button>
              ) : <div style={{width: '24px'}}></div>}
            </div>
          </div>
        </div>

        {/* Right Side: Scrolling Lyrics */}
        <div style={{ 
          flex: 1, 
          height: '100%', 
          overflowY: 'auto', 
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: '-webkit-linear-gradient(top, transparent, black 10%, black 90%, transparent)',
          padding: '40vh 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }} ref={scrollRef}>
          {parsedLyrics.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '32px', fontWeight: 'bold' }}>
              {isWaitingForQueueStart ? 'Generating the next track...' : 'No lyrics available for this track.'}
            </div>
          ) : (
            parsedLyrics.map((line, idx) => {
              // Section header — styled as a small label, not highlighted for sync
              if (line.isSection) {
                return (
                  <div key={idx} style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)',
                    paddingTop: '16px',
                    userSelect: 'none',
                  }}>
                    {line.text.replace(/^\[|\]$/g, '')}
                  </div>
                );
              }

              const isActive = idx === activeLineIndex;
              const isPast = idx < activeLineIndex;
              return (
                <div 
                  key={idx} 
                  onClick={() => handleLyricClick(idx)}
                  style={{ 
                    fontSize: LYRICS_FONT_SIZE, 
                    fontWeight: 'bold', 
                    lineHeight: '1.2',
                    whiteSpace: 'pre-line',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease, transform 0.3s ease',
                    color: isActive ? 'white' : (isPast ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'),
                    transform: isActive ? 'scale(1.02)' : 'scale(1)',
                    transformOrigin: 'left center'
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) e.currentTarget.style.color = isPast ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)';
                  }}
                >
                  {line.text || '♪'}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
    </>
  );
}
