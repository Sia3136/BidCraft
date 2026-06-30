'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button' // Assuming Button component exists, let me just check... wait, I'll use standard button classes if standard Button is missing. Wait, Shadcn is installed, so Button should exist.

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  actionOnClick?: () => void
  illustration?: React.ReactNode
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  actionOnClick,
  illustration
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-[360px] mx-auto min-h-[400px]">
      {illustration && (
        <div className="mb-8 w-[120px] h-[120px] text-terracotta-600 flex items-center justify-center">
          {illustration}
        </div>
      )}
      
      <h3 className="text-2xl font-bold font-display text-foreground mb-2">
        {title}
      </h3>
      
      <p className="text-base text-ink-500 mb-8">
        {description}
      </p>
      
      {actionLabel && (
        actionHref ? (
          <Link href={actionHref}>
            <button className="bg-terracotta-600 text-white hover:bg-terracotta-700 px-6 py-3 rounded-lg font-semibold transition-colors">
              {actionLabel}
            </button>
          </Link>
        ) : (
          <button 
            onClick={actionOnClick}
            className="bg-terracotta-600 text-white hover:bg-terracotta-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  )
}

// Example illustrations
export const EmptyWishlistIllustration = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 102.5C60 102.5 20 72.5 20 42.5C20 28.6929 31.1929 17.5 45 17.5C53.0722 17.5 60 22.5 60 22.5C60 22.5 66.9278 17.5 75 17.5C88.8071 17.5 100 28.6929 100 42.5C100 72.5 60 102.5 60 102.5Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M95 25L98 22M105 35L108 35M90 10L90 7" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 6"/>
  </svg>
)

export const EmptyOrdersIllustration = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="25" y="45" width="70" height="60" rx="4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 45H100V35C100 32.2386 97.7614 30 95 30H25C22.2386 30 20 32.2386 20 35V45Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M60 30V105" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M60 30C60 30 50 15 40 15C34.4772 15 30 19.4772 30 25C30 30 60 30 60 30Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M60 30C60 30 70 15 80 15C85.5228 15 90 19.4772 90 25C90 30 60 30 60 30Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
