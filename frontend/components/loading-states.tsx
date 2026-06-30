'use client'

import React from 'react'

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-cream-deep/60 ${className}`}
      {...props}
    />
  )
}

export function InlineSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin h-4 w-4 text-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}

export function PageTransitionLoader() {
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] bg-terracotta-100 z-50 overflow-hidden">
      <div className="h-full bg-terracotta-600 transition-all duration-300 ease-in-out animate-[progress_1.5s_infinite_ease-in-out]" style={{ width: '30%' }} />
    </div>
  )
}
