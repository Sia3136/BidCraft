'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from '../product-card'
import { fetchListings, Listing } from '@/lib/api'

export function RecentlyAddedSection() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadListings() {
      try {
        const data = await fetchListings({ status: 'active' })
        // In a real app, this would be sorted by created_at DESC from the backend
        // For now, we'll just reverse the array to simulate newest first
        setListings((data.listings || []).reverse())
      } catch (err) {
        console.error('Failed to load recent products:', err)
      } finally {
        setLoading(false)
      }
    }
    loadListings()
  }, [])

  if (loading) {
    return (
      <div className="py-16 text-center text-muted-foreground bg-background">
        Loading recent additions...
      </div>
    )
  }

  if (listings.length === 0) return null

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Recently Added</h2>
            <p className="text-muted-foreground mt-1">Discover the newest pieces on BidCraft</p>
          </div>
          <button className="px-4 py-2 text-primary font-semibold hover:bg-primary/10 rounded-lg transition-colors">
            View All →
          </button>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 no-scrollbar">
          {listings.slice(0, 8).map((product) => {
            let photos = []
            try {
              photos = typeof product.photos === 'string' ? JSON.parse(product.photos) : product.photos
            } catch (e) {
              photos = product.photos || []
            }
            const image = (photos && photos.length > 0) ? photos[0] : '/placeholder.png'
            
            const mappedProduct = {
              ...product,
              id: String(product.id),
              image: image,
              creator: "Verified Creator",
              price: Number(product.price || product.start_bid || 0),
              buyingMethod: product.listing_type === 'auction' ? 'Auction' : 'Buy Now',
            }

            return (
              <div key={product.id} className="snap-start shrink-0 w-[280px] md:w-[320px]">
                <ProductCard product={mappedProduct as unknown as Listing} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
