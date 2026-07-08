'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { formatPrice } from '@/lib/formatPrice'

export default function ConfirmAuctionWinPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { token } = useAuthStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [auction, setAuction] = useState<any>(null)

  useEffect(() => {
    if (!token) return
    const fetchAuction = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (res.ok) setAuction(data.auction)
      } catch (err) {
        console.error(err)
      }
    }
    fetchAuction()
  }, [id, token])

  const handleDecision = async (decision: 'confirm' | 'decline') => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions/${id}/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ decision })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to process decision')

      if (decision === 'confirm') {
        router.push(`/checkout/${id}`) // Or appropriate checkout page for auction order
      } else {
        router.push('/')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!auction) return <div className="p-10 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-[var(--color-cream-base)] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-[var(--radius-lg)] shadow-sm max-w-md w-full border border-[var(--color-border-subtle)]">
        <h1 className="text-display-sm font-display font-bold text-[var(--color-ink-900)] mb-4">
          You Won!
        </h1>
        <p className="text-body-md text-[var(--color-ink-700)] mb-6">
          Congratulations! You had the winning bid for <strong>{auction.title}</strong> at {formatPrice(auction.current_bid)}.
        </p>
        <div className="bg-[var(--color-cream-raised)] p-4 rounded-[var(--radius-md)] mb-6 text-left text-sm text-[var(--color-ink-700)]">
          <p className="mb-2"><strong>Please confirm your purchase within 24 hours.</strong></p>
          <p>If you decline or fail to complete the purchase, your bid deposit will be forfeited and the item may be offered to the next highest bidder.</p>
        </div>
        
        {error && <p className="text-[var(--color-urgent-600)] mb-4 text-sm font-medium">{error}</p>}
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => handleDecision('confirm')}
            disabled={loading}
            className="w-full bg-[var(--color-terracotta-600)] text-white font-bold py-3 px-6 rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Confirm & Pay'}
          </button>
          <button 
            onClick={() => handleDecision('decline')}
            disabled={loading}
            className="w-full bg-white text-[var(--color-urgent-600)] font-bold py-3 px-6 rounded-[var(--radius-md)] border border-[var(--color-urgent-200)] hover:bg-[var(--color-urgent-50)] transition-colors disabled:opacity-50"
          >
            Decline (Forfeit Deposit)
          </button>
        </div>
      </div>
    </div>
  )
}
