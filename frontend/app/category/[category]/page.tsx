'use client'

import React, { useEffect, useState, Suspense, use } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/sections/footer'
import { ProductCard } from '@/components/product-card'
import { listingsApi } from '@/lib/api'
import { useSearchParams } from 'next/navigation'

function CategoryResults({ category }: { category: string }) {
  const searchParams = useSearchParams()
  const subcategory = searchParams.get('subcategory')
  
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const displayTitle = subcategory 
    ? `${category.charAt(0).toUpperCase() + category.slice(1)} - ${subcategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}` 
    : category.charAt(0).toUpperCase() + category.slice(1);

  useEffect(() => {
    async function fetchListings() {
      setLoading(true)
      try {
        const queryParams = new URLSearchParams()
        // Fallback to search param since the backend expects category_id instead of a slug.
        // This ensures the page functions without requiring backend migrations for the UI redesign.
        const searchTerm = subcategory ? subcategory.replace(/-/g, ' ') : category;
        queryParams.set('search', searchTerm)
        
        const data = await listingsApi.list(queryParams.toString())
        setItems(data.listings || [])
      } catch (err) {
        console.error("Failed to fetch category listings:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [category, subcategory])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12 text-center animate-fade-up">
        <h1 className="text-4xl md:text-5xl font-brand font-medium tracking-wide text-foreground mb-4 capitalize">
          {displayTitle}
        </h1>
        <p className="text-[14px] text-muted-foreground max-w-2xl mx-auto">
          Discover unique {displayTitle.toLowerCase()} handcrafted by verified creators around the world.
        </p>
      </div>

      {!subcategory && (
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-up" style={{animationDelay: '100ms'}}>
           <span className="px-5 py-2 border border-border bg-card text-foreground rounded-full text-[13px] font-medium capitalize">All {category}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-80 bg-muted rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground bg-card border-2 border-border border-dashed rounded-3xl shadow-sm animate-fade-up">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-muted-foreground/50"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <h3 className="text-xl font-bold text-foreground mb-2">No items found</h3>
          <p className="text-muted-foreground">We couldn't find any listings for {displayTitle.toLowerCase()} right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-up" style={{animationDelay: '200ms'}}>
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

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params);
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 py-32 text-center flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground font-medium">Discovering creative works...</p>
        </div>
      }>
        <CategoryResults category={resolvedParams.category} />
      </Suspense>
      <Footer />
    </main>
  )
}
