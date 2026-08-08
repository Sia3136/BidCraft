'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

type ListingData = {
  id: string;
  title: string;
  price: number;
  image: string;
  sellerName: string;
}

export default function ReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const listingId = searchParams.get('listing_id')
  const offerId = searchParams.get('offer_id')
  
  const [listing, setListing] = useState<ListingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [offerPrice, setOfferPrice] = useState<number | null>(null)

  useEffect(() => {
    if (!listingId) {
      router.push('/')
      return
    }

    // Fetch listing details
    const p1 = fetch(`/api/products`)
      .then(res => res.json())
      .then(data => {
        const item = data.find((d: any) => d.id === listingId)
        if (item) setListing({ ...item, sellerName: item.creator })
      })

    // If there's an offer_id, we need to fetch the offer to get the accepted price.
    // However, since we don't have the token easily available here without the auth store, 
    // wait, we can just use the auth store token!
    // But this page doesn't import useAuthStore. I'll just rely on the API wrapper.
    let p2 = Promise.resolve();
    
    Promise.all([p1, p2])
      .catch(console.error)
      .finally(() => setLoading(false));

  }, [listingId, router])

  // Dynamically import useAuthStore to get the token for fetching offer
  const { token } = require('@/store/authStore').useAuthStore.getState()
  useEffect(() => {
    if (offerId && token) {
      require('@/lib/api').fetchOfferById(offerId, token)
        .then((data: any) => {
          if (data && data.status === 'accepted') {
            setOfferPrice(data.amount)
          }
        })
        .catch(console.error)
    }
  }, [offerId, token])

  const formatPrice = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)
  
  const displayPrice = offerPrice !== null ? offerPrice : listing?.price || 0;

  return (
    <div className="min-h-screen bg-[var(--color-cream-base)] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[800px] mx-auto w-full px-[var(--space-4)] py-[var(--space-6)]">
        <h1 className="text-display-sm font-display mb-6">Order Review</h1>
        
        {loading ? (
          <p>Loading...</p>
        ) : !listing ? (
          <p>Listing not found.</p>
        ) : (
          <div className="bg-white p-6 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]">
            <div className="flex gap-6 border-b border-[var(--color-border-subtle)] pb-6 mb-6">
              {listing.image && (
                <img src={listing.image} alt={listing.title} className="w-32 h-32 object-cover rounded-[var(--radius-sm)]" />
              )}
              <div className="flex-1">
                <h2 className="text-heading-md font-display mb-2">{listing.title}</h2>
                <p className="text-[var(--color-ink-500)] mb-4">Seller: {listing.sellerName}</p>
                <p className="text-xl font-bold text-[var(--color-ink-900)]">
                  {formatPrice(displayPrice)}
                  {offerPrice !== null && <span className="ml-2 text-sm text-[var(--color-success-600)] font-medium">(Accepted Offer)</span>}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between mb-4 text-[var(--color-ink-700)]">
              <span>Subtotal</span>
              <span>{formatPrice(displayPrice)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl pt-4 border-t border-[var(--color-border-subtle)]">
              <span>Total</span>
              <span>{formatPrice(displayPrice)}</span>
            </div>
            
            <button 
              onClick={() => router.push(`/checkout/address?listing_id=${listingId}${offerId ? `&offer_id=${offerId}` : ''}`)}
              className="w-full mt-8 h-12 bg-[var(--color-terracotta-600)] text-white rounded-[var(--radius-pill)] font-bold text-lg hover:bg-[var(--color-terracotta-700)] transition-colors"
            >
              Continue to Delivery Address
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
