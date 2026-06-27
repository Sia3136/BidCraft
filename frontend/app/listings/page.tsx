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
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  
  const [sortBy, setSortBy] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')
  const [condition, setCondition] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    async function fetchListings() {
      setLoading(true)
      try {
        const queryParams = new URLSearchParams()
        if (search) queryParams.set('search', search)
        if (sortBy) queryParams.set('sort_by', sortBy)
        if (sortDir) queryParams.set('sort_dir', sortDir)
        if (condition) queryParams.set('condition', condition)
        if (minPrice) queryParams.set('min_price', minPrice)
        if (maxPrice) queryParams.set('max_price', maxPrice)
        queryParams.set('page', String(pagination.page))
        
        const data = await listingsApi.list(queryParams.toString())
        setItems(data.listings || [])
        if (data.pagination) setPagination(data.pagination)
      } catch (err) {
        console.error("Failed to fetch listings:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [search, sortBy, sortDir, condition, minPrice, maxPrice, pagination.page])

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {search ? `Search Results for "${search}"` : "All Listings"}
          </h1>
          <p className="text-muted-foreground mt-1">Explore items from our creators ({pagination.total} results)</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select 
            value={condition} 
            onChange={e => { setCondition(e.target.value); setPagination(p => ({...p, page: 1})) }}
            className="px-3 py-2 bg-card border border-border rounded-lg text-sm"
          >
            <option value="">All Conditions</option>
            <option value="new">Brand New</option>
            <option value="like_new">Like New</option>
            <option value="used">Used</option>
          </select>
          
          <div className="flex items-center gap-1">
            <input type="number" placeholder="Min $" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-20 px-3 py-2 bg-card border border-border rounded-lg text-sm" />
            <span>-</span>
            <input type="number" placeholder="Max $" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-20 px-3 py-2 bg-card border border-border rounded-lg text-sm" />
          </div>

          <select 
            value={`${sortBy}-${sortDir}`} 
            onChange={e => {
              const [b, d] = e.target.value.split('-')
              setSortBy(b)
              setSortDir(d)
              setPagination(p => ({...p, page: 1}))
            }}
            className="px-3 py-2 bg-card border border-border rounded-lg text-sm"
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
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

      {!loading && pagination.totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          <button 
            disabled={pagination.page <= 1}
            onClick={() => handlePageChange(pagination.page - 1)}
            className="px-4 py-2 border border-border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button 
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => handlePageChange(pagination.page + 1)}
            className="px-4 py-2 border border-border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
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
