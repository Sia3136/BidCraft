'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from '../product-card'
import { auctionsApi } from '@/lib/api'

export function LiveAuctionsSection() {
  const [auctions, setAuctions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAuctions() {
      try {
        const data = await auctionsApi.list('status=active')
        setAuctions(data.auctions || [])
      } catch (err) {
        console.error('Failed to load active auctions:', err)
      } finally {
        setLoading(false)
      }
    }
    loadAuctions()
  }, [])

  if (loading) {
    return (
      <div className="py-16 text-center text-muted-foreground bg-background">
        Loading live auctions...
      </div>
    )
  }

  if (auctions.length === 0) return null

  const getRemainingTime = (endTime: string) => {
    const diff = new Date(endTime).getTime() - Date.now()
    if (diff <= 0) return 'Ended'
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const mins = Math.floor((diff / (1000 * 60)) % 60)
    return `${hours}h ${mins}m`
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Live Auctions</h2>
            <p className="text-muted-foreground mt-1">Active bids happening right now</p>
          </div>
          <button className="px-4 py-2 text-primary font-semibold hover:bg-primary/10 rounded-lg transition-colors">
            View All →
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.slice(0, 6).map((auc) => {
            let photos = []
            try {
              photos = typeof auc.photos === 'string' ? JSON.parse(auc.photos) : auc.photos
            } catch (e) {
              photos = auc.photos || []
            }
            const image = (photos && photos.length > 0) ? photos[0] : '/placeholder.png'
            return (
              <ProductCard
                key={auc.id}
                id={auc.listing_id ? String(auc.listing_id) : String(auc.id)}
                title={auc.title}
                image={image}
                creator="Verified Creator"
                creatorImage="/creator-1.png"
                price={Number(auc.current_bid || auc.start_bid)}
                rating={4.9}
                reviews={12}
                methods={['AUCTION']}
                badge="LIVE"
                currentBid={Number(auc.current_bid || auc.start_bid)}
                bidCount={auc.total_bids}
                endsIn={getRemainingTime(auc.end_time)}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
