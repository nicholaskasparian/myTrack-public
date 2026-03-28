'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import type { Song } from '../lib/types';
import { parseTimedLyrics } from '../lib/lyrics';

const LYRICS_FONT_SIZE = '48px';

export default function LyricsPlayer({
  song,
  onClose,
  onNext
}: {
  song: Song;
  onClose?: () => void;
  onNext?: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(song.duration_seconds || 180);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && song.audio_url) {
      setIsPlaying(false);
      audioRef.current.load();
      audioRef.current.play().catch(e => console.log('Auto-play prevented:', e));
    }
  }, [song]);

  const lyricsText = song.lyrics || "No lyrics available.";
  const parsedLyrics = useMemo(() => parseTimedLyrics(lyricsText), [lyricsText]);

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
  }, [parsedLyrics, onNext]);

  const togglePlay = () => {
    if (!audioRef.current) return;
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
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      fontFamily: 'var(--font-ibm-plex-sans)',
      overflow: 'hidden',
      animation: 'glassFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
    }}>
      
      {song.cover_url && (
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
            Close
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
            background: 'var(--ink)'
          }}>
            {song.cover_url ? (
              <img src={song.cover_url} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>
                No Cover Art
              </div>
            )}
          </div>
          
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>{song.title}</h2>
            <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)' }}>
              {song.genre || 'Unknown Genre'} • {song.bpm ? `${song.bpm} BPM` : 'Unknown BPM'}
            </div>
          </div>

          {/* Player controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 'auto' }}>
            <audio ref={audioRef} src={song.audio_url || ''} />
            
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

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
               <button 
                onClick={togglePlay}
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
                  cursor: 'pointer',
                  transition: 'background 0.2s ease, transform 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
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
              No lyrics available for this track.
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
