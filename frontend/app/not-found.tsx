import Link from 'next/link'
import { EmptyState } from '@/components/empty-state'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <EmptyState
        title="This page wandered off"
        description="We couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place."
        actionLabel="Back to Home"
        actionHref="/"
        illustration={
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 85L25 100M80 85L95 100" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            <path d="M60 40C60 40 45 40 45 55C45 70 60 85 60 85C60 85 75 70 75 55C75 40 60 40 60 40Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M48 60C48 60 55 50 60 60" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M72 60C72 60 65 50 60 60" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
      />
      <div className="mt-4">
        <Link href="/collections" className="text-terracotta-600 hover:text-terracotta-700 font-medium">
          Browse Collections
        </Link>
      </div>
    </div>
  )
}
