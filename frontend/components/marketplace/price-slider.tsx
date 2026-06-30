'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
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
      <SliderPrimitive.Root
        className="relative flex w-full touch-none select-none items-center mt-2"
        min={min}
        max={max}
        step={step}
        value={localValue}
        onValueChange={handleSliderChange}
      >
        <SliderPrimitive.Track className="relative h-[4px] w-full grow overflow-hidden rounded-full bg-[var(--color-cream-deep)]">
          <SliderPrimitive.Range className="absolute h-full bg-[var(--color-terracotta-600)]" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb 
          className="block h-[20px] w-[20px] rounded-full border border-[var(--color-border-strong)] bg-white transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:shadow-[var(--shadow-card)] cursor-grab active:cursor-grabbing" 
        />
        <SliderPrimitive.Thumb 
          className="block h-[20px] w-[20px] rounded-full border border-[var(--color-border-strong)] bg-white transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:shadow-[var(--shadow-card)] cursor-grab active:cursor-grabbing" 
        />
      </SliderPrimitive.Root>
    </div>
  )
}
