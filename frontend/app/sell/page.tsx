'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { fetchSellerListings } from '@/lib/api'
import Link from 'next/link'

export default function SellPage() {
  const { isAuthenticated, token } = useAuthStore()
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function checkSellerStatus() {
      if (!isAuthenticated) {
        setChecking(false)
        return
      }

      try {
        const data = await fetchSellerListings(token!)
        if (data.listings && data.listings.length > 0) {
          router.replace('/seller/listings')
        } else {
          router.replace('/sell/new')
        }
      } catch (err) {
        console.error('Failed to check seller status', err)
        setChecking(false)
      }
    }

    if (isAuthenticated !== undefined) {
      checkSellerStatus()
    }
  }, [isAuthenticated, token, router])

  if (checking || isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[var(--color-ink-500)]">Preparing your workspace...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream-base)]">
      <main className="flex-1 flex items-center justify-center py-24 px-[var(--space-5)]">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-8">Ready to start selling on BidCraft?</h1>
          <p className="text-body-lg text-[var(--color-ink-700)] mb-10">
            Join a community of Indian artisans, creators, and collectors who value authentic craftsmanship.
          </p>
          <div className="flex flex-col items-center gap-6">
            <Link href="/auth?returnTo=/sell" className="bg-[var(--color-terracotta-600)] text-white text-body-lg font-bold px-10 py-4 rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors inline-block">
              Sign In to Start Selling
            </Link>
            <Link href="/auth?tab=register&returnTo=/sell" className="text-body-md text-[var(--color-terracotta-600)] font-medium hover:underline">
              Don't have an account? Create one →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
