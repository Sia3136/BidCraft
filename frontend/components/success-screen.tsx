'use client'

import React from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

interface SuccessScreenProps {
  title: string
  description: string
  primaryActionLabel: string
  primaryActionHref?: string
  primaryActionOnClick?: () => void
  secondaryActionLabel?: string
  secondaryActionHref?: string
  secondaryActionOnClick?: () => void
  icon?: React.ReactNode
}

export function SuccessScreen({
  title,
  description,
  primaryActionLabel,
  primaryActionHref,
  primaryActionOnClick,
  secondaryActionLabel,
  secondaryActionHref,
  secondaryActionOnClick,
  icon
}: SuccessScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-[420px] mx-auto min-h-[400px]">
      <div className="mb-6 text-success-600 animate-in fade-in zoom-in duration-500">
        {icon || <CheckCircle2 className="w-20 h-20" />}
      </div>
      
      <h2 className="text-display-md text-foreground mb-3 font-display">
        {title}
      </h2>
      
      <p className="text-body-lg text-ink-500 mb-8">
        {description}
      </p>
      
      <div className="flex gap-4 w-full">
        {secondaryActionLabel && (
          secondaryActionHref ? (
            <Link href={secondaryActionHref} className="w-full">
              <button className="w-full bg-cream-raised text-ink-700 hover:bg-slate-100 px-6 py-3 rounded-lg font-semibold transition-colors border border-border-subtle">
                {secondaryActionLabel}
              </button>
            </Link>
          ) : (
            <button 
              onClick={secondaryActionOnClick}
              className="w-full bg-cream-raised text-ink-700 hover:bg-slate-100 px-6 py-3 rounded-lg font-semibold transition-colors border border-border-subtle"
            >
              {secondaryActionLabel}
            </button>
          )
        )}
        
        {primaryActionHref ? (
          <Link href={primaryActionHref} className="w-full">
            <button className="w-full bg-terracotta-600 text-white hover:bg-terracotta-700 px-6 py-3 rounded-lg font-semibold transition-colors">
              {primaryActionLabel}
            </button>
          </Link>
        ) : (
          <button 
            onClick={primaryActionOnClick}
            className="w-full bg-terracotta-600 text-white hover:bg-terracotta-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {primaryActionLabel}
          </button>
        )}
      </div>
    </div>
  )
}
