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
  offerId?: string
  offerPrice?: number
}

export function BuyNowButton({ listingId, price, listingTitle, offerId, offerPrice }: Props) {
  const { isAuthenticated, token, user } = useAuthStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isOffer = !!offerId
  const displayPrice = isOffer ? offerPrice! : price

  const handleBuyNow = async () => {
    if (!isAuthenticated || !token) {
      router.push(`/auth?returnTo=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    const url = new URL(window.location.href)
    const urlOfferId = url.searchParams.get('offerId')
    const finalOfferId = offerId || urlOfferId

    if (finalOfferId) {
      router.push(`/checkout/review?listing_id=${listingId}&offer_id=${finalOfferId}`)
    } else {
      router.push(`/checkout/review?listing_id=${listingId}`)
    }
  }

  return (
    <div>
      <button
        onClick={handleBuyNow}
        disabled={loading}
        className="w-full h-11 rounded-full font-ui text-sm font-semibold flex items-center justify-center transition-colors duration-200 bg-[#B06A42] text-white hover:bg-[#8f5435] shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : isAuthenticated ? (isOffer ? `Checkout Accepted Offer — ${formatPrice(displayPrice)}` : `Buy Now — ${formatPrice(displayPrice)}`) : 'Sign In to Buy'}
      </button>
      {error && (
        <p className="text-[var(--color-urgent-600)] text-[14px] mt-2">
          {error}
        </p>
      )}
    </div>
  )
}
