'use client'

import { CreatorCard } from '../creator-card'
import { CREATORS } from '@/lib/mock-data'

export function CreatorSpotlightSection() {
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
          {CREATORS.slice(0, 6).map((creator) => (
            <CreatorCard key={creator.id} {...creator} />
          ))}
        </div>
      </div>
    </section>
  )
}
