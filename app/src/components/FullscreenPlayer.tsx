'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import type { Song } from '../lib/types';
import RatingSlider from './RatingSlider';
import { shouldSkipLyricLine } from '../lib/lyrics';

const LYRICS_FONT_SIZE = '48px';
const LRC_INLINE_PREFIX_TAG = '[:]';
const ABBREVIATION_CONTEXT_LENGTH = 12;
const ABBREVIATION_TAIL_PATTERN = /(?:\b[A-Z]\.|(?:Mr|Mrs|Ms|Dr|Prof|St|Jr|Sr|vs|etc))\.$/;

function parseLRC(lrcText: string) {
  const normalizedText = lrcText
    .replace(/\r\n?/g, '\n')
    .replace(/\\n/g, '\n');

  // 1. Add newlines before AND after any timestamp tag
  let text = normalizedText.replace(/(\[\d{1,2}:\d{2}(?:\.\d+)?(?: - \d{1,2}:\d{2})?\])/g, '\n$1\n');
  
  // 2. Add newlines before AND after Lyria timestamp tags [15.0:]
  text = text.replace(/(\[\d+(?:\.\d+)?:\])/g, '\n$1\n');
  
  // 3. Add newlines before AND after structural tags
  text = text.replace(/(\[[a-zA-Z\s0-9]+\])/g, '\n$1\n');

  // 4. Split sentence-clumped lyric paragraphs into readable lyric lines,
  // while avoiding common abbreviation/acronym patterns.
  text = text.replace(/([.?!])\s+(?=[A-Z])/g, (match, punctuation, offset, source) => {
    const precedingContext = source.slice(Math.max(0, offset - ABBREVIATION_CONTEXT_LENGTH), offset + 1);
    if (ABBREVIATION_TAIL_PATTERN.test(precedingContext)) return match;
    return `${punctuation}\n `;
  });
  
  const lines = text.split('\n').map(l => l.trim());
  
  const parsed: { time: number; text: string }[] = [];
  const lrcRegex = /^\[(\d+):(\d+(?:\.\d+)?)\]$/;
  const timestampRegex = /^\[(\d+):(\d+)(?:\s*-\s*\d+:\d+)?\]$/;
  const lyriaRegex = /^\[(\d+(?:\.\d+)?):\]$/;
  const structureRegex = /^\[[a-zA-Z\s0-9]+\]$/;

  let hasTags = false;
  let lastTime = 0;

  for (const line of lines) {
    // Skip Lyria structural tags like [[A0]]
    if (/^\[\[.*\]\]$/.test(line)) continue;
    // Skip mosic, bpm, duration_secs
    if (/^(mosic|bpm|duration_secs|good_crop):\s*[\d.]+/.test(line)) continue;

    let match = lrcRegex.exec(line);
    if (match) {
      hasTags = true;
      lastTime = parseInt(match[1], 10) * 60 + parseFloat(match[2]);
      continue;
    }

    match = timestampRegex.exec(line);
    if (match) {
      hasTags = true;
      lastTime = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
      continue;
    }
    
    match = lyriaRegex.exec(line);
    if (match) {
      hasTags = true;
      lastTime = parseFloat(match[1]);
      continue;
    }

    if (structureRegex.test(line)) {
      parsed.push({ time: lastTime, text: line });
      continue;
    }

    // It's actual lyric text
    let cleanText = line;
    if (cleanText.startsWith('[:]')) {
      cleanText = cleanText.substring(3).trim();
    }
    // Drop non-lyric SFX/stage-direction lines from Lyria output
    if (cleanText !== '' && shouldSkipLyricLine(cleanText)) continue;
    
    if (hasTags) {
      parsed.push({ time: lastTime, text: cleanText });
    } else {
      // If we haven't seen a tag yet, assume time 0
      parsed.push({ time: 0, text: cleanText });
      hasTags = true; // So we don't treat it as a pure raw-text file later
    }
  }

  if (parsed.length === 0) {
    // Fallback if no tags at all
    const textLines = normalizedText
      .split('\n')
      .map(l => l.trim())
      .map((line) => (line.startsWith(LRC_INLINE_PREFIX_TAG) ? line.substring(LRC_INLINE_PREFIX_TAG.length).trim() : line))
      .filter((line) => line === '' || !shouldSkipLyricLine(line))
      .join('\n');
    return [{ time: 0, text: textLines }];
  }

  // Group lines with same timestamp to avoid overlapping
  const grouped: { time: number; text: string }[] = [];
  for (const entry of parsed) {
    const existing = grouped.find(g => g.time === entry.time);
    if (existing) {
      existing.text += '\n' + entry.text;
    } else {
      grouped.push(entry);
    }
  }

  // trim the grouped texts
  grouped.forEach(g => {
    // replace 3+ newlines with 2 newlines to avoid massive gaps
    g.text = g.text.replace(/\n{3,}/g, '\n\n').trim();
  });

  return grouped.sort((a, b) => a.time - b.time);
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
    
    // Explicitly handle song change auto-play
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

  // Parse lyrics
  const lyricsText = song?.lyrics || "No lyrics available.";
  const parsedLyrics = useMemo(() => parseLRC(lyricsText), [lyricsText]);

  const lastTargetLineRef = useRef<number>(-1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      // Auto-scroll lyrics
      if (scrollRef.current && parsedLyrics.length > 0) {
        let targetLine = -1;
        for (let i = parsedLyrics.length - 1; i >= 0; i--) {
          if (audio.currentTime >= parsedLyrics[i].time) {
            targetLine = i;
            break;
          }
        }
        if (targetLine === -1) targetLine = 0;
        
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
    const newTime = parsedLyrics[idx].time;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  let activeLineIndex = -1;
  for (let i = parsedLyrics.length - 1; i >= 0; i--) {
    if (currentTime >= parsedLyrics[i].time) {
      activeLineIndex = i;
      break;
    }
  }
  if (activeLineIndex === -1 && parsedLyrics.length > 0) {
    activeLineIndex = 0;
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
      
      {/* Background with Glassmorphism */}
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

      {/* Main Content: Lyrics and Player */}
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
        
        {/* Left Side: Cover Art and Player Controls */}
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
            
            {/* Scrubber */}
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

            {/* Play Button */}
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
          padding: '40vh 0', // Padding to allow scrolling past viewport
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }} ref={scrollRef}>
          {parsedLyrics.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '32px', fontWeight: 'bold' }}>
              {isWaitingForQueueStart ? 'Generating the next track...' : 'No lyrics available for this track.'}
            </div>
          ) : (
            parsedLyrics.map((line, idx) => {
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
