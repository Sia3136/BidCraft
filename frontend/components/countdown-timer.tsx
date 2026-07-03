'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  listingId: string | number
  size?: 'sm' | 'md' | 'lg'
  endTime?: string
}

export function CountdownTimer({ listingId, size = 'md', endTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    let targetTime = 0;
    
    if (endTime) {
      targetTime = new Date(endTime).getTime();
    } else {
      const id = typeof listingId === 'string' ? parseInt(listingId.replace(/\D/g, '') || '0', 10) : listingId;
      const days = (id % 7) + 1;
      const hours = (id % 24);
      const minutes = (id % 60);
      const offsetMs = (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
      targetTime = Date.now() + offsetMs;
    }

    const updateTimer = () => {
      const remaining = targetTime - Date.now();
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
