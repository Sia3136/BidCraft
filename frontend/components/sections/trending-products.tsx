'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from '../product-card'
import { listingsApi } from '@/lib/api'

export function TrendingProductsSection() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadListings() {
      try {
        const data = await listingsApi.list('listing_type=fixed&status=active')
        setListings(data.listings || [])
      } catch (err) {
        console.error('Failed to load trending products:', err)
      } finally {
        setLoading(false)
      }
    }
    loadListings()
  }, [])

  if (loading) {
    return (
      <div className="py-16 text-center text-muted-foreground bg-muted/10">
        Loading trending items...
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
            <h2 className="text-3xl font-bold text-foreground">Trending Now</h2>
            <p className="text-muted-foreground mt-1">What collectors are buying this week</p>
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
            return (
              <div key={product.id} className="snap-start shrink-0 w-[280px] md:w-[320px]">
                <ProductCard 
                  id={String(product.id)}
                  title={product.title}
                  image={image}
                  creator="Verified Creator"
                  creatorImage="/creator-2.png"
                  price={Number(product.price)}
                  rating={4.8}
                  reviews={10}
                  methods={['BUY_NOW']}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
