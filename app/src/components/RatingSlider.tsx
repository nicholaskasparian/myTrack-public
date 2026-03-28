'use client'

import React, { useRef, useState, useEffect } from 'react'

export default function RatingSlider({
  value,
  onChange,
}: {
  value: number
  onChange: (val: number) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const calculateValue = (clientX: number) => {
    if (!trackRef.current) return localValue
    const rect = trackRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    return Math.round((x / rect.width) * 10)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    const newValue = calculateValue(e.clientX)
    setLocalValue(newValue)
    onChange(newValue)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    const newValue = calculateValue(e.clientX)
    setLocalValue(newValue)
    onChange(newValue)
  }

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false)

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const percentage = (localValue / 10) * 100

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', padding: '0.5rem 0' }}>
      <div style={{ flex: 1, position: 'relative', height: '30px', display: 'flex', alignItems: 'center' }}>
        <div
          ref={trackRef}
          onMouseDown={handleMouseDown}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '999px',
            background: 'rgba(22, 28, 40, 0.14)',
            position: 'relative',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${percentage}%`,
              borderRadius: '999px',
              background: 'linear-gradient(90deg, #54668d 0%, #1f2737 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: `${percentage}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '18px',
              height: '18px',
              borderRadius: '999px',
              background: '#fff',
              boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
              border: '1px solid rgba(0,0,0,0.15)',
            }}
          />
        </div>
      </div>
      <div style={{ minWidth: '60px', textAlign: 'right', fontWeight: 700, fontSize: '1rem' }}>{localValue} / 10</div>
    </div>
  )
}
