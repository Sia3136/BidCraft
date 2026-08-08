'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { fetchOfferById, acceptOffer, rejectOffer } from '@/lib/api'
import { formatPrice } from '@/lib/formatPrice'
import Link from 'next/link'
import { ArrowLeft, Check, X } from 'lucide-react'

export default function SellerOfferDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { isAuthenticated, token, user } = useAuthStore()
  const [offer, setOffer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated) {
      router.push(`/auth?returnTo=/seller/offers/${params.id}`)
      return
    }

    async function loadData() {
      try {
        const data = await fetchOfferById(params.id, token!)
        // Additional protection: Only the seller should view this here
        if (data.sellerId !== user?.id) {
          setError('You are not authorized to view this offer.')
        } else {
          setOffer(data)
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load offer')
      } finally {
        setLoading(false)
      }
    }
    if (token) loadData()
  }, [isAuthenticated, router, token, params.id, user?.id])

  const handleAccept = async () => {
    if (!confirm('Are you sure you want to accept this offer? All other pending offers will be rejected.')) return
    setActionLoading(true)
    try {
      await acceptOffer(offer.id, token!)
      setOffer({ ...offer, status: 'accepted' })
      alert('Offer accepted successfully!')
    } catch (err: any) {
      alert(err.message || 'Failed to accept offer')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this offer?')) return
    setActionLoading(true)
    try {
      await rejectOffer(offer.id, token!)
      setOffer({ ...offer, status: 'rejected' })
    } catch (err: any) {
      alert(err.message || 'Failed to reject offer')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <div className="p-12 text-center text-[var(--color-ink-500)]">Loading...</div>
  
  if (error) return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen">
      <Link href="/seller/listings" className="inline-flex items-center gap-2 text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)] mb-8 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
      <div className="p-6 bg-[var(--color-urgent-100)] text-[var(--color-urgent-600)] rounded-[var(--radius-md)] text-center font-bold">
        {error}
      </div>
    </div>
  )

  if (!offer) return null

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen">
      <Link href="/seller/listings" className="inline-flex items-center gap-2 text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)] mb-8 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border-subtle)] bg-[var(--color-cream-raised)] flex justify-between items-center">
          <h1 className="text-2xl font-display font-bold text-[var(--color-ink-900)]">Offer Details</h1>
          <span className={`px-4 py-1.5 text-sm font-bold rounded-full uppercase tracking-wider inline-block text-center ${
            offer.status === 'accepted' ? 'bg-[var(--color-success-100)] text-[var(--color-success-600)]' :
            offer.status === 'rejected' ? 'bg-[var(--color-urgent-100)] text-[var(--color-urgent-600)]' :
            'bg-[#FFF3E0] text-[#E65100]'
          }`}>
            {offer.status}
          </span>
        </div>

        <div className="p-8">
          <div className="flex gap-8 items-start mb-8 pb-8 border-b border-[var(--color-border-subtle)]">
            <div className="w-32 h-32 rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-cream-deep)] shrink-0">
              {offer.listingImage && <img src={offer.listingImage} alt={offer.listingTitle} className="w-full h-full object-cover" />}
            </div>
            <div>
              <p className="text-sm text-[var(--color-ink-500)] mb-1">Listing</p>
              <h2 className="text-xl font-bold text-[var(--color-ink-900)] mb-2">{offer.listingTitle}</h2>
              <p className="text-[var(--color-ink-500)]">Original Price: <span className="font-medium text-[var(--color-ink-900)]">{formatPrice(offer.listingPrice)}</span></p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-sm text-[var(--color-ink-500)] mb-1">Offer Amount</p>
              <p className="text-3xl font-bold text-[var(--color-terracotta-600)]">{formatPrice(offer.amount)}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-ink-500)] mb-1">Buyer</p>
              <p className="text-lg font-bold text-[var(--color-ink-900)]">{offer.buyerName || 'Anonymous'}</p>
              <p className="text-sm text-[var(--color-ink-500)] mt-1">{new Date(offer.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {offer.status === 'pending' && (
            <div className="flex gap-4 pt-4">
              <button 
                onClick={handleAccept}
                disabled={actionLoading}
                className="flex-1 flex justify-center items-center gap-2 h-12 bg-[var(--color-success-600)] hover:bg-[var(--color-success-700)] text-white font-bold rounded-[var(--radius-sm)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" /> Accept Offer
              </button>
              <button 
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 flex justify-center items-center gap-2 h-12 bg-white border-2 border-[var(--color-urgent-600)] text-[var(--color-urgent-600)] hover:bg-[var(--color-urgent-50)] font-bold rounded-[var(--radius-sm)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" /> Reject
              </button>
            </div>
          )}

          {offer.status === 'accepted' && (
            <div className="mt-6 p-4 bg-[var(--color-success-100)] border border-[var(--color-success-200)] text-[var(--color-success-700)] rounded-[var(--radius-md)] font-medium">
              You have accepted this offer! The buyer has been notified and can now proceed to checkout.
            </div>
          )}
          
          {offer.status === 'rejected' && (
            <div className="mt-6 p-4 bg-[var(--color-urgent-100)] border border-[var(--color-urgent-200)] text-[var(--color-urgent-700)] rounded-[var(--radius-md)] font-medium">
              You have rejected this offer.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
