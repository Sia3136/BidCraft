'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { ArrowRight, Flame } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { Listing } from '@/lib/api'
import { useStore } from '@/lib/store'

const revealVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
}

export default function ClientHomeAuthenticated({ user, newArrivals = [], liveAuctions = [], trendingListings = [], allListings = [] }: { user: any, newArrivals: Listing[], liveAuctions: Listing[], trendingListings: Listing[], allListings: Listing[] }) {
  const { recentlyViewedIds, wishlistIds } = useStore()
  
  const recentlyViewedListings = useMemo(() => {
    return recentlyViewedIds.map(id => allListings.find(l => l.id === String(id) || l.numericId === id)).filter(Boolean) as Listing[]
  }, [recentlyViewedIds, allListings])
  
  const watchlistListings = useMemo(() => {
    return wishlistIds.map(id => allListings.find(l => l.id === String(id) || l.numericId === id)).filter(Boolean) as Listing[]
  }, [wishlistIds, allListings])

  const recommendedListings = useMemo(() => {
    // Recommendation logic: match category of recently viewed or watchlisted
    const activeCategories = new Set<string>()
    recentlyViewedListings.forEach(l => { if (l.category) activeCategories.add(l.category) })
    watchlistListings.forEach(l => { if (l.category) activeCategories.add(l.category) })
    
    let recommendations = allListings.filter(l => l.category && activeCategories.has(l.category) && !recentlyViewedIds.includes(Number(l.numericId || l.id)) && !wishlistIds.includes(Number(l.numericId || l.id)))
    if (recommendations.length < 4) {
      recommendations = [...recommendations, ...trendingListings.filter(l => !recommendations.find(r => r.id === l.id))]
    }
    return recommendations.slice(0, 8)
  }, [allListings, recentlyViewedListings, watchlistListings, recentlyViewedIds, wishlistIds, trendingListings])

  const [activeNewCategory, setActiveNewCategory] = useState('All')
  const newArrivalCategories = ['All', 'Art', 'Collectibles', 'Gaming & Hobby', 'Handmade & Crafts', 'Lifestyle & Gifts']
  
  const filteredNewArrivals = useMemo(() => {
    if (activeNewCategory === 'All') return newArrivals.slice(0, 8)
    return allListings.filter(l => l.category === activeNewCategory).sort((a,b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 8)
  }, [newArrivals, allListings, activeNewCategory])

  const greetingTime = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, [])

  return (
    <div className="bg-[var(--color-cream-base)] min-h-screen pb-20">
      <main className="max-w-[var(--container-max)] mx-auto px-[var(--space-5)] xl:px-[var(--space-8)] py-12 md:py-16 flex flex-col gap-16 md:gap-20">
        
        {/* 1. Greeting */}
        <section className="flex flex-col justify-center border-b border-[var(--color-border-subtle)] pb-8 mb-4">
          <p className="text-body-md text-[var(--color-ink-500)] mb-1 font-[family-name:var(--font-montserrat)]">{greetingTime},</p>
          <h1 className="text-3xl font-[family-name:var(--font-playfair)] text-[var(--color-ink-900)] mb-3">Welcome back, {user?.name?.split(' ')[0] || 'Guest'}.</h1>
          <p className="text-body-md text-[var(--color-ink-700)] font-[family-name:var(--font-montserrat)]">Continue discovering unique creations.</p>
        </section>

        {/* 2. Live Auctions (Hero) */}
        {liveAuctions.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[22px] md:text-[24px] text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)] font-medium">LIVE NOW</h2>
              <Link href="/explore?type=auction" className="text-sm font-medium text-[var(--color-terracotta-600)] hover:underline underline-offset-2">
                View all auctions →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {liveAuctions.slice(0, 4).map((p, idx) => (
                <ProductCard key={p.id} product={p} priority={idx < 4} />
              ))}
            </div>
          </section>
        )}

        {/* 3. Trending This Week */}
        {trendingListings.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[22px] md:text-[24px] text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)] font-medium">Trending This Week</h2>
            </div>
            
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 sm:gap-5 lg:grid lg:grid-cols-4 lg:gap-6 pb-4 -mx-[var(--space-5)] px-[var(--space-5)] md:mx-0 md:px-0">
              {trendingListings.slice(0, 4).map((p, idx) => (
                <div key={p.id} className="shrink-0 w-[280px] sm:w-[320px] lg:w-auto snap-start">
                  <ProductCard product={p} priority={idx < 4} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. New Arrivals (with taxonomy filters) */}
        {newArrivals.length > 0 && (
          <section>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h2 className="text-[22px] md:text-[24px] text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)] font-medium">New Arrivals</h2>
              
              <div className="flex overflow-x-auto hide-scrollbar gap-2 -mx-[var(--space-5)] px-[var(--space-5)] md:mx-0 md:px-0">
                {newArrivalCategories.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveNewCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeNewCategory === cat ? 'bg-[var(--color-slate-900)] text-white' : 'bg-white text-[var(--color-ink-700)] border border-[var(--color-border-subtle)] hover:border-[var(--color-ink-300)]'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {filteredNewArrivals.length > 0 ? filteredNewArrivals.map((p, idx) => (
                <ProductCard key={p.id} product={p} priority={idx < 4} />
              )) : (
                <div className="col-span-full py-12 text-center border border-dashed border-[var(--color-border-strong)] rounded-xl">
                  <p className="text-[var(--color-ink-500)] text-sm">No new arrivals in this category right now.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 5. Recently Viewed */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[22px] md:text-[24px] text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)] font-medium">Recently Viewed</h2>
          </div>
          
          {recentlyViewedListings.length > 0 ? (
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 sm:gap-5 pb-4 -mx-[var(--space-5)] px-[var(--space-5)] md:mx-0 md:px-0">
              {recentlyViewedListings.map((p, idx) => (
                <div key={p.id} className="shrink-0 w-[240px] sm:w-[280px] snap-start">
                  <ProductCard product={p} priority={false} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-start border-t border-[var(--color-border-subtle)]">
              <p className="text-[var(--color-ink-700)] text-body-lg mb-4">You haven't explored any products yet.</p>
              <Link href="/explore" className="text-sm font-medium text-[var(--color-terracotta-600)] hover:underline underline-offset-2">
                Start browsing →
              </Link>
            </div>
          )}
        </section>

        {/* 6. Recommended For You */}
        {recommendedListings.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[22px] md:text-[24px] text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)] font-medium">Recommended For You</h2>
            </div>
            
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 sm:gap-5 pb-4 -mx-[var(--space-5)] px-[var(--space-5)] md:mx-0 md:px-0">
              {recommendedListings.map((p, idx) => (
                <div key={p.id} className="shrink-0 w-[240px] sm:w-[280px] snap-start">
                  <ProductCard product={p} priority={false} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. Watchlist */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[22px] md:text-[24px] text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)] font-medium">Your Watchlist</h2>
          </div>
          
          {watchlistListings.length > 0 ? (
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 sm:gap-5 pb-4 -mx-[var(--space-5)] px-[var(--space-5)] md:mx-0 md:px-0">
              {watchlistListings.map((p, idx) => (
                <div key={p.id} className="shrink-0 w-[240px] sm:w-[280px] snap-start">
                  <ProductCard product={p} priority={false} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-start border-t border-[var(--color-border-subtle)]">
              <p className="text-[var(--color-ink-700)] text-body-lg mb-2">Save products to your wishlist.</p>
              <p className="text-[var(--color-ink-500)] text-sm mb-4">We'll keep them here.</p>
              <Link href="/explore" className="text-sm font-medium text-[var(--color-terracotta-600)] hover:underline underline-offset-2">
                Start browsing →
              </Link>
            </div>
          )}
        </section>

      </main>
    </div>
  )
}
