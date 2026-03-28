'use client'

import React from 'react'
import AudioPlayer from './AudioPlayer'

export default function SharedSongPlayer({ songId, src }: { songId: string; src: string }) {
  return (
    <AudioPlayer
      src={src}
      onPlay={async () => {
        await fetch('/api/share/play', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ songId }),
        }).catch(() => null)
      }}
    />
  )
}
