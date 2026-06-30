'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { EmptyState } from '@/components/empty-state'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <EmptyState
        title="Something went wrong"
        description="We're sorry, but an unexpected error occurred. Our team has been notified."
        actionLabel="Try again"
        actionOnClick={reset}
        illustration={
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 20L20 90H100L60 20Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M60 45V65" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="60" cy="80" r="2" fill="currentColor"/>
          </svg>
        }
      />
      <div className="mt-4">
        <Link href="/" className="text-terracotta-600 hover:text-terracotta-700 font-medium">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
