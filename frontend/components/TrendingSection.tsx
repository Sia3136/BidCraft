'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ProductCard } from '@/components/product-card'
import { Listing } from '@/lib/api'

interface TrendingSectionProps {
  listings: Listing[]
}

export function TrendingSection({ listings }: TrendingSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateArrows = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateArrows()
    el.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      el.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [updateArrows])

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
    }
  }

  if (!listings || listings.length === 0) return null

  return (
    <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-base)]">
      <div className="max-w-[var(--container-max)] mx-auto relative group">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-display-lg text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)]">Trending Now</h2>
          <Link
            href="/explore?sort=trending"
            className="text-sm text-[#B06A42] hover:underline underline-offset-2 font-medium"
          >
            Explore All Trending Items →
          </Link>
        </div>

        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="absolute left-[-20px] top-[55%] -translate-y-1/2 z-10
              w-10 h-10 rounded-full bg-white border border-[#D8C8BA] shadow-md
              flex items-center justify-center hover:border-[#B06A42] transition-colors xl:opacity-0 xl:group-hover:opacity-100"
          >
            <span className="text-[#2B211C] text-xl leading-none font-bold">ΓÇ╣</span>
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 sm:gap-6 lg:gap-8 pb-8 -mx-[var(--space-5)] px-[var(--space-5)] xl:mx-0 xl:px-0 mb-10"
        >
          {listings.map((listing, idx) => (
            <div key={listing.id} className="snap-start shrink-0 w-[280px] sm:w-[320px] lg:w-[calc(25%-24px)] min-w-[280px]">
              <ProductCard product={listing} priority={idx < 4} />
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="absolute right-[-20px] top-[55%] -translate-y-1/2 z-10
              w-10 h-10 rounded-full bg-white border border-[#D8C8BA] shadow-md
              flex items-center justify-center hover:border-[#B06A42] transition-colors xl:opacity-0 xl:group-hover:opacity-100"
          >
            <span className="text-[#2B211C] text-xl leading-none font-bold">ΓÇ║</span>
          </button>
        )}
      </div>
    </section>
  )
}
