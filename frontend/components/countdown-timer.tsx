'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  timeString: string
  size?: 'sm' | 'md' | 'lg'
}

export function CountdownTimer({ timeString, size = 'md' }: CountdownTimerProps) {
  const [displayTime, setDisplayTime] = useState(timeString)

  useEffect(() => {
    setDisplayTime(timeString)
    const timer = setInterval(() => {
      setDisplayTime(timeString)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeString])

  const sizeClasses = {
    sm: 'text-xs font-semibold',
    md: 'text-sm font-semibold',
    lg: 'text-base font-bold',
  }

  return (
    <div className={`inline-flex items-center gap-1 text-primary ${sizeClasses[size]}`}>
      <span>⏱</span>
      <span>{displayTime}</span>
    </div>
  )
}
