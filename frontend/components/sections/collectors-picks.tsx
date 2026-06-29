'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from '../product-card'
import { listingsApi } from '@/lib/api'
import Link from 'next/link'

export function CollectorsPicksSection() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadListings() {
      try {
        // Simulating a curated query
        const data = await listingsApi.list('status=active')
        setListings(data.listings?.slice(0, 8) || [])
      } catch (err) {
        console.error('Failed to load picks:', err)
      } finally {
        setLoading(false)
      }
    }
    loadListings()
  }, [])

  if (loading || listings.length === 0) return null

  return (
    <section className="py-20 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-border pb-6">
          <div>
            <h2 className="text-3xl font-brand font-medium tracking-wide text-foreground">Collector's Picks</h2>
            <p className="text-muted-foreground mt-2 text-[15px]">Hand-selected rare finds and vintage treasures.</p>
          </div>
          <Link href="/category/collectibles" className="mt-6 md:mt-0 px-6 py-2 bg-transparent text-foreground border border-border rounded-full hover:bg-white transition-colors text-[14px] font-medium">
            Explore All
          </Link>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 no-scrollbar">
          {listings.map((product) => {
            let photos = []
            try { photos = typeof product.photos === 'string' ? JSON.parse(product.photos) : product.photos } catch (e) {}
            const image = (photos && photos.length > 0) ? photos[0] : '/placeholder.png'

            return (
              <div key={product.id} className="snap-start shrink-0 w-[280px] md:w-[320px]">
                <ProductCard 
                  id={String(product.id)}
                  title={product.title}
                  image={image}
                  creator="Verified Creator"
                  creatorImage="/creator-1.png"
                  price={Number(product.price || product.start_bid || 0)}
                  rating={5.0}
                  reviews={3}
                  methods={product.listing_type === 'auction' ? ['AUCTION'] : ['BUY_NOW']}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
