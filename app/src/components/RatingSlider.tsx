'use client';

import React, { useRef, useState, useEffect } from 'react';

export default function RatingSlider({ 
  value, 
  onChange 
}: { 
  value: number; 
  onChange: (val: number) => void; 
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const calculateValue = (clientX: number) => {
    if (!trackRef.current) return localValue;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const newValue = Math.round(percentage * 10);
    return newValue;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const newValue = calculateValue(e.clientX);
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const newValue = calculateValue(e.clientX);
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const percentage = (localValue / 10) * 100;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', width: '100%', padding: '16px 0' }}>
      <div style={{ flex: 1, position: 'relative', height: '32px', display: 'flex', alignItems: 'center' }}>
        {/* Track */}
        <div 
          ref={trackRef}
          onMouseDown={handleMouseDown}
          style={{ 
            width: '100%', 
            height: '4px', 
            background: 'var(--border)', 
            position: 'relative',
            cursor: 'pointer'
          }}
        >
          {/* Ticks */}
          {Array.from({ length: 11 }).map((_, i) => (
            <div 
              key={i}
              style={{
                position: 'absolute',
                left: `${(i / 10) * 100}%`,
                top: '-4px',
                width: '1px',
                height: '12px',
                background: 'var(--border)',
                zIndex: 0
              }}
            />
          ))}

          {/* Thumb */}
          <div 
            style={{
              position: 'absolute',
              left: `${percentage}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
              background: 'var(--accent)',
              border: '1px solid var(--border)',
              cursor: 'grab',
              zIndex: 1
            }}
          />
        </div>
      </div>
      
      <div style={{ minWidth: '48px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px' }}>
        {localValue} / 10
      </div>
    </div>
  );
}
