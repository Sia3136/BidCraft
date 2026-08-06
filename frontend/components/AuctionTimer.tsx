'use client'
import { useState, useEffect } from 'react'

export function AuctionTimer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calc = () => {
      if (!endTime) return;
      const diff = new Date(endTime).getTime() - Date.now()
      if (diff <= 0) { setTimeLeft('Ended'); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`)
    }
    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [endTime])

  if (!timeLeft) return null;

  return (
    <span className="font-mono text-sm text-[#C4501A] font-semibold">
      ⏱ {timeLeft}
    </span>
  )
}
