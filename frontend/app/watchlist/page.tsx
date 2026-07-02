'use client'

import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/sections/footer'
import { ProductCard } from '@/components/product-card'
import { wishlistApi } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

export default function WatchlistPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    async function loadWatchlist() {
      try {
        const data = await wishlistApi.list()
        setItems(data.wishlist || data || [])
      } catch (err) {
        console.error("Failed to load watchlist:", err)
      } finally {
        setLoading(false)
      }
    }

    loadWatchlist()
  }, [user])

  if (!user && !loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center text-muted-foreground">
          Please sign in to view your watchlist.
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Your Watchlist</h1>
          <p className="text-muted-foreground mt-1">Saved items you are keeping an eye on</p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-muted-foreground">
            Loading your watchlist...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground bg-card border border-border border-dashed rounded-2xl">
            You haven't saved any items to your watchlist yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => {
              const listing = item.listing || item
              let photos = []
              try {
                photos = typeof listing.photos === 'string' ? JSON.parse(listing.photos) : listing.photos
              } catch (e) {
                photos = listing.photos || []
              }
              const image = (photos && photos.length > 0) ? photos[0] : '/placeholder.png'
              
              const product = {
                id: String(listing.id || item.listing_id),
                title: listing.title || 'Untitled',
                image: image,
                creator: listing.seller_name || listing.seller?.name || "Creator",
                category: listing.category || 'Art',
                subcategory: '',
                price: Number(listing.price || listing.start_bid || 0),
                buyingMethod: listing.listing_type === 'AUCTION' ? 'Auction' : 'Buy Now',
                description: listing.description || '',
                verified: false,
                offersAllowed: false,
                bidCount: 0,
                currentBid: listing.start_bid ? Number(listing.start_bid) : undefined
              }
              
              return (
                <ProductCard
                  key={listing.id || item.listing_id}
                  product={product as any}
                />
              )
            })}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
