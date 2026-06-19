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

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLLECTIONS.map((collection) => (
            <CollectionCard key={collection.id} {...collection} />
          ))}
        </div>
      </div>
    </section>
  )
}
