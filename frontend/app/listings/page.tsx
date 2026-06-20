'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/sections/footer'
import { ProductCard } from '@/components/product-card'
import { listingsApi } from '@/lib/api'
import { useSearchParams } from 'next/navigation'

function SearchResults() {
  const searchParams = useSearchParams()
  const search = searchParams.get('search') || ''
  
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchListings() {
      setLoading(true)
      try {
        const queryParams = new URLSearchParams()
        if (search) queryParams.set('search', search)
        
        const data = await listingsApi.list(queryParams.toString())
        setItems(data.listings || [])
      } catch (err) {
        console.error("Failed to fetch listings:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [search])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {search ? `Search Results for "${search}"` : "All Listings"}
        </h1>
        <p className="text-muted-foreground mt-1">Explore items from our creators</p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-muted-foreground">
          Loading listings...
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground bg-card border border-border border-dashed rounded-2xl">
          No listings found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((listing) => {
            let photos = []
            try {
              photos = typeof listing.photos === 'string' ? JSON.parse(listing.photos) : listing.photos
            } catch (e) {
              photos = listing.photos || []
            }
            const image = (photos && photos.length > 0) ? photos[0] : '/placeholder.png'
            
            return (
              <ProductCard
                key={listing.id}
                id={String(listing.id)}
                title={listing.title || 'Untitled'}
                image={image}
                creator={listing.seller_name || listing.seller?.name || "Creator"}
                creatorImage={listing.seller?.avatar_url || "/creator-1.png"}
                price={Number(listing.price || listing.start_bid || 0)}
                rating={5.0}
                reviews={0}
                methods={listing.listing_type ? [listing.listing_type.toUpperCase()] : ['BUY_NOW']}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function ListingsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-muted-foreground">
          Loading...
        </div>
      }>
        <SearchResults />
      </Suspense>
      <Footer />
    </main>
  )
}
