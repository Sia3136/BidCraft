'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { createOrder, createPaymentOrder, verifyPayment } from '@/lib/api'

// Razorpay loads via script tag — declare type
declare global {
  interface Window { Razorpay: any }
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

type Props = {
  listingId: string
  price: number
  listingTitle: string
}

export function BuyNowButton({ listingId, price, listingTitle }: Props) {
  const { isAuthenticated, token, user } = useAuthStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleBuyNow = async () => {
    if (!isAuthenticated || !token) {
      router.push(`/auth?returnTo=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    router.push(`/checkout/review?listing_id=${listingId}`)
  }

  return (
    <div>
      <button
        onClick={handleBuyNow}
        disabled={loading}
        className="w-full h-12 rounded-[var(--radius-pill)] font-ui text-[16px] font-semibold flex items-center justify-center transition-colors bg-[var(--color-terracotta-600)] text-white hover:bg-[var(--color-terracotta-700)] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : isAuthenticated ? `Buy Now — ${formatPrice(price)}` : 'Sign In to Buy'}
      </button>
      {error && (
        <p className="text-[var(--color-urgent-600)] text-[14px] mt-2">
          {error}
        </p>
      )}
    </div>
  )
}
