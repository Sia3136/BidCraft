'use client'

import { CollectionCard } from '../collection-card'
import { COLLECTIONS } from '@/lib/mock-data'

export function FeaturedCollectionsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Featured Collections</h2>
            <p className="text-muted-foreground mt-1">Curated collections for every taste</p>
          </div>
          <button className="px-4 py-2 text-primary font-semibold hover:bg-primary/10 rounded-lg transition-colors">
            View All →
          </button>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 no-scrollbar">
          {COLLECTIONS.map((collection) => (
            <div key={collection.id} className="snap-start shrink-0 w-[280px] md:w-[350px]">
              <CollectionCard {...collection} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
