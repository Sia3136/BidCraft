'use client'

import React from 'react'
import { Listing } from '@/lib/api'
import { ProductCard } from '@/components/product-card'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'
import { ArrowRight, Flame, Clock, Sparkles } from 'lucide-react'

export default function ClientHomeFeed({ 
  liveAuctions, 
  newArrivals, 
  trending, 
  picksForYou 
}: { 
  liveAuctions: Listing[], 
  newArrivals: Listing[], 
  trending: Listing[], 
  picksForYou: Listing[] 
}) {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--color-cream-base)] flex flex-col items-center justify-center p-8">
        <h1 className="text-display-md text-[var(--color-ink-900)] mb-4">Welcome to BidCraft</h1>
        <p className="text-body-lg text-[var(--color-ink-700)] mb-8 text-center max-w-[500px]">
          Please sign in to view your personalized marketplace feed, track your auctions, and discover items tailored for you.
        </p>
        <button 
          onClick={() => router.push('/auth')}
          className="bg-[var(--color-terracotta-600)] text-white px-8 py-3 rounded-[var(--radius-pill)] text-body-lg font-bold hover:bg-[var(--color-terracotta-700)] transition-colors"
        >
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="bg-[var(--color-cream-base)] min-h-screen pb-20">
      {/* Welcome Banner */}
      <section className="bg-[var(--color-ink-900)] text-white pt-32 pb-16 px-6">
        <div className="max-w-[var(--container-max)] mx-auto">
          <h1 className="text-display-lg font-display mb-4">Welcome back, {user?.name?.split(' ')[0] || 'Collector'}.</h1>
          <p className="text-body-lg text-white/80 max-w-2xl">
            Here's what's happening in the marketplace today. We've curated these pieces just for you.
          </p>
        </div>
      </section>

      <div className="max-w-[var(--container-max)] mx-auto px-6 space-y-24 mt-12">
        
        {/* Live Auctions (Horizontal) */}
        {liveAuctions.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-heading-xl font-display text-[var(--color-ink-900)] flex items-center gap-3">
                <Clock className="w-6 h-6 text-[var(--color-terracotta-600)]" />
                Live Auctions
              </h2>
              <Link href="/explore?method=auction" className="text-body-md font-bold text-[var(--color-terracotta-600)] flex items-center gap-2 hover:underline">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar snap-x">
              {liveAuctions.map(item => (
                <div key={item.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                  <ProductCard product={item as any} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-heading-xl font-display text-[var(--color-ink-900)] flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[var(--color-terracotta-600)]" />
                New Arrivals
              </h2>
              <Link href="/explore?sort=newest" className="text-body-md font-bold text-[var(--color-terracotta-600)] flex items-center gap-2 hover:underline">
                Explore <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Featured Large Card */}
              <div className="md:col-span-2 md:row-span-2 h-full">
                {newArrivals[0] && (
                  <div className="h-full [&>div]:h-full">
                    <ProductCard product={newArrivals[0] as any} />
                  </div>
                )}
              </div>
              {/* Smaller Cards */}
              {newArrivals.slice(1, 5).map(item => (
                <div key={item.id}>
                  <ProductCard product={item as any} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trending */}
        {trending.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-heading-xl font-display text-[var(--color-ink-900)] flex items-center gap-3">
                <Flame className="w-6 h-6 text-[var(--color-terracotta-600)]" />
                Trending Now
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trending.map(item => (
                <div key={item.id}>
                  <ProductCard product={item as any} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Picks for You */}
        {picksForYou.length > 0 && (
          <section className="bg-[var(--color-cream-raised)] -mx-6 px-6 py-16 border-y border-[var(--color-border-subtle)]">
            <div className="max-w-[var(--container-max)] mx-auto">
              <h2 className="text-heading-xl font-display text-[var(--color-ink-900)] mb-8">Picks for You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {picksForYou.map(item => (
                  <div key={item.id}>
                    <ProductCard product={item as any} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Browse by Category */}
        <section>
          <h2 className="text-heading-xl font-display text-[var(--color-ink-900)] mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(cat => (
              <Link 
                key={cat.name} 
                href={`/explore?category=${cat.name.toLowerCase()}`}
                className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] p-6 text-center hover:border-[var(--color-terracotta-600)] hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-[var(--color-cream-base)] rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-[var(--color-terracotta-100)] transition-colors">
                  <span className="text-xl">{cat.name.charAt(0)}</span>
                </div>
                <h3 className="text-body-md font-bold text-[var(--color-ink-900)] group-hover:text-[var(--color-terracotta-600)]">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
