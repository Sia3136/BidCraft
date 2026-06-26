'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/sections/footer'
import { creatorsApi } from '@/lib/api'

type SortMode = 'followers' | 'rating' | 'newest'

export default function CreatorsPage() {
  const [creators, setCreators] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<SortMode>('followers')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const PAGE_SIZE = 20

  const loadCreators = async (newSort: SortMode = sort, newPage = 0, append = false) => {
    try {
      setLoading(true)
      const data = await creatorsApi.discover(newSort, PAGE_SIZE, newPage * PAGE_SIZE)
      const list = data.creators || []
      setCreators(prev => append ? [...prev, ...list] : list)
      setHasMore(list.length === PAGE_SIZE)
      setPage(newPage)
    } catch (err) {
      console.error('Failed to load creators', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCreators(sort, 0, false)
  }, [sort])

  const handleSortChange = (newSort: SortMode) => {
    setSort(newSort)
  }

  const handleLoadMore = () => {
    loadCreators(sort, page + 1, true)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-primary py-20 text-white text-center">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Creator Discover</h1>
        <p className="text-lg text-white/80 max-w-xl mx-auto">
          Browse top-rated BidCraft sellers. Follow creators you love to get notified of their new listings.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Sort Controls */}
        <div className="flex flex-wrap gap-3 mb-10 items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">All Creators</h2>
          <div className="flex gap-2">
            {([
              { key: 'followers', label: '🔥 Most Followed' },
              { key: 'rating', label: '⭐ Top Rated' },
              { key: 'newest', label: '🆕 Newest' },
            ] as { key: SortMode; label: string }[]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleSortChange(key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  sort === key
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Creator Grid */}
        {loading && creators.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            Loading creators...
          </div>
        ) : creators.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground border border-border border-dashed rounded-2xl">
            No creators found yet. Be the first to list something!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {creators.map((creator) => (
              <Link
                key={creator.id}
                href={`/creator/${creator.id}`}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-5">
                  {creator.avatar_url ? (
                    <img
                      src={creator.avatar_url}
                      alt={creator.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-border group-hover:border-primary transition-colors"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white font-bold flex items-center justify-center text-xl">
                      {creator.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {creator.name}
                      </span>
                      {creator.is_verified && (
                        <span className="shrink-0 px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {creator.bio || 'BidCraft Creator'}
                    </p>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 text-center py-3 border-y border-border mb-4">
                  <div>
                    <p className="text-base font-bold text-primary">
                      {(creator.follower_count || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground">
                      {creator.active_listing_count || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Listings</p>
                  </div>
                  <div>
                    <p className="text-base font-bold text-yellow-500">
                      {Number(creator.average_rating || 0).toFixed(1)} ⭐
                    </p>
                    <p className="text-xs text-muted-foreground">{creator.total_reviews || 0} reviews</p>
                  </div>
                </div>

                {/* Trust score */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    🛡️ Trust Score:&nbsp;
                    <span className="font-semibold text-primary">
                      {Math.round((Number(creator.trust_score) || 0) * 100)}%
                    </span>
                  </span>
                  <span className="text-xs text-primary font-semibold group-hover:underline">
                    View Profile →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && !loading && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
            >
              Load More Creators
            </button>
          </div>
        )}

        {loading && creators.length > 0 && (
          <div className="text-center mt-8 text-muted-foreground text-sm">Loading more...</div>
        )}
      </div>

      <Footer />
    </main>
  )
}
