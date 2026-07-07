'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { submitOffer } from '@/lib/api'
import { formatPrice } from '@/lib/formatPrice'

type Props = { listingId: string; price: number; minimumOfferPercent: number }

export function MakeOfferPanel({ listingId, price, minimumOfferPercent }: Props) {
  const { isAuthenticated, token } = useAuthStore()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const minimumOffer = Math.ceil(price * (1 - ((minimumOfferPercent || 30) / 100)))

  const handleSubmit = async () => {
    const parsed = parseInt(amount)
    if (!parsed || parsed < minimumOffer) {
      setError(`Minimum offer is ${formatPrice(minimumOffer)}`)
      return
    }
    setLoading(true)
    setError('')
    try {
      await submitOffer(listingId, parsed, token!)
      setSuccess(true)
      setOpen(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="p-4 bg-[var(--color-success-100)] border border-[var(--color-success-600)] rounded-[var(--radius-md)] text-[var(--color-success-600)] font-medium text-sm text-center">
        Offer submitted. The seller will respond within 48 hours.
      </div>
    )
  }

  return (
    <div className="w-full mt-2">
      <button
        onClick={() => {
          if (!isAuthenticated) {
            router.push(`/auth?returnTo=${encodeURIComponent(window.location.pathname)}`)
            return
          }
          setOpen(!open)
        }}
        className="w-full h-12 bg-transparent border-2 border-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)] rounded-[var(--radius-md)] text-base font-bold cursor-pointer font-ui transition-colors hover:bg-[var(--color-cream-raised)]"
      >
        {isAuthenticated ? 'Make an Offer' : 'Sign In to Make an Offer'}
      </button>

      {open && (
        <div className="mt-3 p-4 bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]">
          <p className="text-sm text-[var(--color-ink-500)] mb-3">
            Minimum offer: <span className="font-bold text-[var(--color-ink-900)]">{formatPrice(minimumOffer)}</span> ({minimumOfferPercent || 70}% of price)
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder={`₹${minimumOffer}`}
              value={amount}
              min={minimumOffer}
              max={price}
              onChange={e => setAmount(e.target.value)}
              className="flex-1 h-12 px-4 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-white font-ui text-base"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`h-12 px-6 bg-[var(--color-terracotta-600)] text-white border-none rounded-[var(--radius-sm)] font-bold transition-opacity ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[var(--color-terracotta-700)] cursor-pointer'}`}
            >
              {loading ? '...' : 'Submit'}
            </button>
          </div>
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
