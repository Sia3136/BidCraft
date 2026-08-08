'use client'

import Link from 'next/link'
import { ProductCard } from '@/components/product-card'
import { Listing } from '@/lib/api'

interface TrendingSectionProps {
  listings: Listing[]
}

export function TrendingSection({ listings }: TrendingSectionProps) {
  if (!listings || listings.length === 0) return null

  return (
    <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-base)]">
      <div className="max-w-[var(--container-max)] mx-auto relative group">
        <div className="mb-12">
          <h2 className="text-display-lg text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)]">Trending Now</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {listings.map((listing, idx) => (
            <ProductCard key={listing.id} product={listing} priority={idx < 4} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/explore?sort=trending"
            className="text-body-lg text-[#B06A42] hover:underline underline-offset-2 font-medium"
          >
            Explore All Trending Items →
          </Link>
        </div>
      </div>
    </section>
  )
}
