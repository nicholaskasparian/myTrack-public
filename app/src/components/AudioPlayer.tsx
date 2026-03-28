'use client'

import React, { useRef, useState, useEffect } from 'react'

export default function AudioPlayer({
  src,
  onEnded,
  onTimeUpdate,
}: {
  src: string
  onEnded?: () => void
  onTimeUpdate?: (currentTime: number) => void
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      onTimeUpdate?.(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      audio.play().catch(() => undefined)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      onEnded?.()
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [onEnded, onTimeUpdate])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play()
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || !audioRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * duration
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time: number) => {
    if (Number.isNaN(time)) return '0:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="panel" style={{ width: '100%', padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <audio ref={audioRef} src={src} key={src} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <button onClick={togglePlay} className="btn btn-primary" style={{ minWidth: '90px' }}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--ink-muted)' }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div ref={trackRef} onClick={handleSeek} style={{ width: '100%', padding: '0.5rem 0', cursor: 'pointer' }}>
            <div style={{ width: '100%', height: '6px', borderRadius: '999px', background: 'rgba(22, 28, 40, 0.14)', position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: `${progressPercent}%`,
                  borderRadius: '999px',
                  background: 'linear-gradient(90deg, #54668d 0%, #1f2737 100%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
