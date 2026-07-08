'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

interface PriceSliderProps {
  min: number
  max: number
  step?: number
  value: [number, number]
  onValueChange: (value: [number, number]) => void
  className?: string
}

export function PriceSlider({ min, max, step = 1, value, onValueChange, className }: PriceSliderProps) {
  const [localValue, setLocalValue] = React.useState<[number, number]>(value)

  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value) || 0
    if (newMin <= localValue[1]) {
      setLocalValue([newMin, localValue[1]])
    }
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value) || 0
    if (newMax >= localValue[0]) {
      setLocalValue([localValue[0], newMax])
    }
  }

  const handleInputBlur = () => {
    onValueChange(localValue)
  }

  const handleSliderChange = (newVal: number[]) => {
    const typedVal = newVal as [number, number]
    setLocalValue(typedVal)
    onValueChange(typedVal)
  }

  // Debounce external update when using slider
  useEffect(() => {
    const handler = setTimeout(() => {
      onValueChange(localValue)
    }, 300)
    return () => clearTimeout(handler)
  }, [localValue, onValueChange])

  return (
    <div className={cn("flex flex-col gap-[var(--space-4)]", className)}>
      {/* Inputs */}
      <div className="flex items-center gap-[var(--space-2)]">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-caption text-[var(--color-ink-500)]">₹</span>
          <Input 
            type="number"
            value={localValue[0]}
            onChange={handleMinChange}
            onBlur={handleInputBlur}
            className="pl-[24px] h-[36px]"
            min={min}
            max={localValue[1]}
          />
        </div>
        <span className="text-body-md text-[var(--color-ink-500)]">-</span>
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-caption text-[var(--color-ink-500)]">₹</span>
          <Input 
            type="number"
            value={localValue[1]}
            onChange={handleMaxChange}
            onBlur={handleInputBlur}
            className="pl-[24px] h-[36px]"
            min={localValue[0]}
            max={max}
          />
        </div>
      </div>

      {/* Slider */}
      <div className="relative h-6 w-full mt-4 flex items-center">
        <div className="absolute w-full h-1 bg-[var(--color-cream-deep)] rounded-full"></div>
        <div
          className="absolute h-1 bg-[var(--color-terracotta-600)] rounded-full"
          style={{
            left: `${((localValue[0] - min) / (max - min)) * 100}%`,
            right: `${100 - ((localValue[1] - min) / (max - min)) * 100}%`
          }}
        ></div>
        <input
          type="range" min={min} max={max} step={step}
          value={localValue[0]}
          onChange={(e) => {
            const newVal = Math.min(Number(e.target.value), localValue[1] - step);
            setLocalValue([newVal, localValue[1]]);
          }}
          className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-terracotta-600)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <input
          type="range" min={min} max={max} step={step}
          value={localValue[1]}
          onChange={(e) => {
            const newVal = Math.max(Number(e.target.value), localValue[0] + step);
            setLocalValue([localValue[0], newVal]);
          }}
          className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-terracotta-600)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>
    </div>
  )
}
