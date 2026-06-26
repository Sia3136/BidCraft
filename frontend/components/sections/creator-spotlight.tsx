'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CreatorCard } from '../creator-card'
import { creatorsApi } from '@/lib/api'

export function CreatorSpotlightSection() {
  const [creators, setCreators] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCreators() {
      try {
        const data = await creatorsApi.discover('followers', 6, 0)
        setCreators(data.creators || [])
      } catch (e) {
        console.error('Failed to load creators', e)
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
          <Link href="/creators" className="px-4 py-2 text-primary font-semibold hover:bg-primary/10 rounded-lg transition-colors">
            View All →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <CreatorCard
              key={creator.id}
              id={String(creator.id)}
              name={creator.name}
              image={creator.avatar_url || `/creator-${(creator.id % 8) + 1}.png`}
              trustScore={Math.round((Number(creator.trust_score) || 0) * 100)}
              rating={Number(creator.average_rating) || 0}
              followers={Number(creator.follower_count) || 0}
              products={Number(creator.active_listing_count) || 0}
              verified={creator.is_verified || false}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
