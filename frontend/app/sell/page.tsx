'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'

export default function Page() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream-base)]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-24 px-[var(--space-5)]">
        
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-8">Ready to start selling on BidCraft?</h1>
        <p className="text-body-lg text-[var(--color-ink-700)] mb-10">
          Join a community of Indian artisans, creators, and collectors who value authentic craftsmanship.
        </p>
        
        {isAuthenticated ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/sell/new" className="bg-[var(--color-terracotta-600)] text-white text-body-lg font-bold px-10 py-4 rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors inline-block w-full sm:w-auto">
              Create a New Listing
            </Link>
            <Link href="/seller/listings" className="bg-white border-2 border-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)] text-body-lg font-bold px-10 py-4 rounded-[var(--radius-md)] hover:bg-[var(--color-cream-raised)] transition-colors inline-block w-full sm:w-auto">
              Manage Your Listings
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <Link href="/auth?returnTo=/sell/new" className="bg-[var(--color-terracotta-600)] text-white text-body-lg font-bold px-10 py-4 rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors inline-block">
              Sign In to Start Selling
            </Link>
            <Link href="/auth?tab=register" className="text-body-md text-[var(--color-terracotta-600)] font-medium hover:underline">
              Don't have an account? Create one →
            </Link>
          </div>
        )}
      </div>
    
      </main>
      <Footer />
    </div>
  )
}
