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
      
      if (d > 0) {
        setTimeLeft(`${d}d ${h}h ${m}m`)
      } else {
        setTimeLeft(`${h}h ${m}m ${s}s`)
      }
    }
    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [endTime])

  if (!timeLeft) return null;

  return (
    <span className="font-[family-name:var(--font-jakarta)] text-[11px] bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)] px-2 py-0.5 rounded-[var(--radius-sm)] font-bold flex items-center gap-1 w-fit">
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-terracotta-500)] animate-pulse" />
      {timeLeft}
    </span>
  )
}
