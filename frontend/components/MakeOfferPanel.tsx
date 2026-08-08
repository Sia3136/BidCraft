'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { submitOffer } from '@/lib/api'
import { formatPrice } from '@/lib/formatPrice'

type Props = { listingId: string; price: number; minimumOfferPercent?: number }

export function MakeOfferPanel({ listingId, price, minimumOfferPercent }: Props) {
  const { isAuthenticated, token } = useAuthStore()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Default to 60% of original price if minimumOfferPercent is not provided
  const effectivePercent = minimumOfferPercent && minimumOfferPercent > 0 ? minimumOfferPercent : 60
  const minimumOffer = Math.ceil(price * (effectivePercent / 100))

  const handleSubmit = async () => {
    const parsed = parseInt(amount)
    if (!parsed || parsed < minimumOffer) {
      setError(`Minimum offer is ${formatPrice(minimumOffer)} (${effectivePercent}% of price)`)
      return
    }
    setLoading(true)
    setError('')
    try {
      await submitOffer(listingId, parsed, token!)
      setSuccess(true)
      setOpen(false)
    } catch (err: any) {
      setError(err.message || 'Failed to submit offer')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full mt-2 p-4 bg-[var(--color-cream-raised)] border border-[var(--color-terracotta-600)] rounded-[var(--radius-md)] text-[var(--color-ink-900)] text-sm">
        <p className="font-bold text-[var(--color-terracotta-600)] mb-1">Offer Submitted Successfully!</p>
        <p className="text-xs text-[var(--color-ink-700)] leading-relaxed">
          The seller has 48 hours to accept or reject your offer. If accepted, you will receive a notification to complete checkout at your offer price. If the seller does not respond within 48 hours, the offer automatically expires.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full mt-2">
      <button
        type="button"
        onClick={() => {
          if (!isAuthenticated) {
            router.push(`/auth?returnTo=${encodeURIComponent(window.location.pathname)}`)
            return
          }
          setOpen(!open)
        }}
        className="w-full h-11 bg-transparent border border-[#B06A42] text-[#B06A42] rounded-full text-sm font-semibold cursor-pointer font-ui transition-colors duration-200 hover:bg-[#B06A42]/10"
      >
        {isAuthenticated ? 'Make an Offer' : 'Sign In to Make an Offer'}
      </button>

      {open && (
        <div className="mt-3 p-4 bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]">
          <p className="text-sm text-[var(--color-ink-500)] mb-3">
            Minimum offer: <span className="font-bold text-[var(--color-ink-900)]">{formatPrice(minimumOffer)}</span> ({effectivePercent}% of asking price)
          </p>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder={`Min ${formatPrice(minimumOffer)}`}
              value={amount}
              min={minimumOffer}
              max={price}
              onChange={e => setAmount(e.target.value)}
              className="flex-1 h-12 px-4 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-white font-ui text-base"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`h-12 px-6 bg-[var(--color-terracotta-600)] text-white border-none rounded-[var(--radius-sm)] font-bold transition-opacity ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[var(--color-terracotta-700)] cursor-pointer'}`}
            >
              {loading ? '...' : 'Submit'}
            </button>
          </div>
          <p className="text-[11px] text-[var(--color-ink-500)] leading-normal">
            Seller has 48 hours to accept or reject. If accepted, you will be notified to pay. If unhandled within 48 hours, the offer is cancelled.
          </p>
          {error && (
            <p className="text-[var(--color-urgent-600)] text-sm mt-2 font-medium">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
