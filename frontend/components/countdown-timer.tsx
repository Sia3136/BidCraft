'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  listingId: string | number
  size?: 'sm' | 'md' | 'lg'
}

export function CountdownTimer({ listingId, size = 'md' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const id = typeof listingId === 'string' ? parseInt(listingId.replace(/\D/g, '') || '0', 10) : listingId;
    
    const days = (id % 7) + 1;
    const hours = (id % 24);
    const minutes = (id % 60);
    
    const offsetMs = (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
    // Fixed anchor to avoid resetting on every single re-render, though it resets on page load.
    const endTime = Date.now() + offsetMs;

    const updateTimer = () => {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        setTimeLeft('Ended');
        return;
      }
      
      const d = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const h = Math.floor((remaining / (1000 * 60 * 60)) % 24);
      const m = Math.floor((remaining / 1000 / 60) % 60);
      const s = Math.floor((remaining / 1000) % 60);
      
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [listingId]);

  const sizeClasses = {
    sm: 'text-xs font-semibold',
    md: 'text-sm font-semibold',
    lg: 'text-base font-bold',
  }

  if (timeLeft === 'Ended') {
    return (
      <div className={`inline-flex items-center gap-1 text-[var(--color-ink-500)] ${sizeClasses[size]}`}>
        <span>Ended</span>
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-1 text-[var(--color-urgent-600)] ${sizeClasses[size]}`}>
      <span>{timeLeft || '...'}</span>
    </div>
  )
}
