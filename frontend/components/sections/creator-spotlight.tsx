'use client'

import { useState, useEffect } from 'react'
import { CreatorCard } from '../creator-card'
import { listingsApi } from '@/lib/api'

export function CreatorSpotlightSection() {
  const [creators, setCreators] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCreators() {
      try {
        const data = await listingsApi.list()
        const items = data.listings || []
        
        const sellerMap = new Map()
        items.forEach((item: any) => {
          if (item.seller_id && !sellerMap.has(item.seller_id)) {
            sellerMap.set(item.seller_id, {
              id: String(item.seller_id),
              name: item.seller_name || item.seller?.name || `Creator #${item.seller_id}`,
              image: item.seller?.avatar_url || `/creator-${(item.seller_id % 8) + 1}.png`,
              trustScore: 98,
              rating: 5.0,
              followers: Math.floor(Math.random() * 5000),
              products: 1,
              verified: true,
            })
          } else if (item.seller_id) {
            const creator = sellerMap.get(item.seller_id)
            creator.products += 1
          }
        })
        setCreators(Array.from(sellerMap.values()).slice(0, 6))
      } catch (e) {
        console.error("Failed to load creators", e)
      } finally {
        setLoading(false)
      }
    }
    loadCreators()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          Loading Spotlight Creators...
        </div>
      </section>
    )
  }

  if (creators.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Creator Spotlight</h2>
            <p className="text-muted-foreground mt-1">Meet our top verified creators</p>
          </div>
          <button className="px-4 py-2 text-primary font-semibold hover:bg-primary/10 rounded-lg transition-colors">
            View All →
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} {...creator} />
          ))}
        </div>
      </div>
    </section>
  )
}
