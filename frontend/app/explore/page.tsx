'use client'

import React, { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CloudinaryImage } from '@/components/CloudinaryImage'
import { ChevronDown, Heart, Filter, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const ALL_CATEGORIES = ['Art', 'Crafts', 'Hot Wheels', 'Collectibles', 'Handmade & Lifestyle', 'Hobby & Gaming']

export default function ExplorePage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Category List */}
      <div>
        <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">Categories</h3>
        <div className="flex flex-col gap-1">
          <button 
            onClick={() => setActiveCategory(null)}
            className={cn(
              "text-left text-body-md h-[36px] flex items-center px-2 rounded-[var(--radius-sm)] transition-colors w-full overflow-hidden whitespace-nowrap text-ellipsis",
              activeCategory === null 
                ? "bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)] font-medium border-l-[3px] border-[var(--color-terracotta-700)]" 
                : "text-[var(--color-ink-700)] hover:bg-[var(--color-cream-deep)]"
            )}
          >
            All Categories
          </button>
          {ALL_CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "text-left text-body-md h-[36px] flex items-center px-2 rounded-[var(--radius-sm)] transition-colors w-full overflow-hidden whitespace-nowrap text-ellipsis",
                activeCategory === cat 
                  ? "bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)] font-medium border-l-[3px] border-[var(--color-terracotta-700)]" 
                  : "text-[var(--color-ink-700)] hover:bg-[var(--color-cream-deep)]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-[var(--color-border-subtle)]" />

      {/* Subcategories (Fix 5 placeholder) */}
      {activeCategory && (
        <>
          <div>
            <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">Subcategories</h3>
            <div className="flex flex-col gap-1">
              {/* Mock subcategories */}
              {['Option 1', 'Option 2', 'Option 3'].map(sub => (
                <button 
                  key={sub}
                  className="text-left text-body-md h-[36px] flex items-center px-2 rounded-[var(--radius-sm)] text-[var(--color-ink-700)] hover:bg-[var(--color-cream-deep)] transition-colors w-full overflow-hidden whitespace-nowrap text-ellipsis"
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
          <div className="h-px w-full bg-[var(--color-border-subtle)]" />
        </>
      )}

      {/* Price Filter */}
      <div>
        <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">Price Range</h3>
        <div className="flex gap-2 items-center">
          <input type="number" placeholder="Min" className="w-full h-[40px] bg-[var(--color-white)] border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] px-3 text-body-md" />
          <span className="text-[var(--color-ink-500)]">-</span>
          <input type="number" placeholder="Max" className="w-full h-[40px] bg-[var(--color-white)] border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] px-3 text-body-md" />
        </div>
      </div>

      <div className="h-px w-full bg-[var(--color-border-subtle)]" />

      {/* Condition Filter */}
      <div>
        <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">Condition</h3>
        <div className="space-y-2">
          {['New/Mint', 'Excellent', 'Good', 'Fair'].map(cond => (
            <label key={cond} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded-[var(--radius-sm)] border-[var(--color-border-subtle)] text-[var(--color-terracotta-600)] focus:ring-[var(--color-terracotta-600)]" />
              <span className="text-body-md text-[var(--color-ink-700)]">{cond}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[var(--color-cream-base)] flex flex-col">
      <Navbar />

      <main className="flex-1 w-full">
        
        {/* Page Header */}
        <section className="w-full h-[280px] bg-[var(--color-cream-raised)] border-b border-[var(--color-border-subtle)] flex flex-col items-center justify-center text-center px-[var(--space-5)]">
          <h1 className="text-display-xl font-display text-[var(--color-ink-900)] mb-[var(--space-2)]">
            Explore BidCraft
          </h1>
          <p className="text-body-lg text-[var(--color-ink-700)] max-w-[600px]">
            Discover handcrafted goods, rare collectibles, and live auctions — all in one place.
          </p>
        </section>

        <div className="w-full max-w-[var(--container-max)] mx-auto px-[var(--space-4)] md:px-[var(--space-6)] xl:px-[var(--space-8)] py-[var(--space-8)]">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-[var(--space-5)] flex items-center justify-between">
            <h2 className="text-heading-md text-[var(--color-ink-900)]">Results (342)</h2>
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border-subtle)] rounded-[var(--radius-pill)] bg-[var(--color-white)] text-body-md font-medium text-[var(--color-ink-900)]"
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-[var(--space-8)]">
            
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block sticky top-[160px] h-[calc(100vh-160px)] overflow-y-auto pr-4 hide-scrollbar">
              <SidebarContent />
            </aside>

            {/* Mobile Filter Drawer */}
            {isMobileFilterOpen && (
              <div className="fixed inset-0 z-[100] lg:hidden flex">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
                <div className="relative w-[85%] max-w-[360px] bg-[var(--color-white)] h-full overflow-y-auto flex flex-col">
                  <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-[var(--color-cream-base)] sticky top-0 z-10">
                    <h2 className="text-heading-md text-[var(--color-ink-900)]">Filters</h2>
                    <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:bg-[var(--color-cream-deep)] rounded-full">
                      <X className="w-5 h-5 text-[var(--color-ink-900)]" />
                    </button>
                  </div>
                  <div className="p-5 flex-1">
                    <SidebarContent />
                  </div>
                  <div className="p-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-white)] sticky bottom-0 z-10 flex gap-3">
                    <button className="flex-1 py-3 text-body-md font-medium text-[var(--color-ink-700)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)]">Reset</button>
                    <button onClick={() => setIsMobileFilterOpen(false)} className="flex-1 py-3 text-body-md font-medium text-white bg-[var(--color-terracotta-600)] rounded-[var(--radius-md)]">Show Results</button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div className="flex flex-col gap-[var(--space-10)]">
              
              {/* Browse by Category - Compact 6 column */}
              <section>
                <div className="flex items-center justify-between mb-[var(--space-4)]">
                  <h2 className="text-heading-lg font-display text-[var(--color-ink-900)]">Browse Categories</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                  {[
                    { img: 'cat-art', name: 'Art' },
                    { img: 'cat-crafts', name: 'Crafts' },
                    { img: 'cat-hotwheels', name: 'Hot Wheels' },
                    { img: 'cat-collectibles', name: 'Collectibles' },
                    { img: 'cat-handmade', name: 'Handmade' },
                    { img: 'cat-hobby', name: 'Hobby & Gaming' }
                  ].map(cat => (
                    <Link key={cat.name} href={`/category/${cat.name.toLowerCase().replace(/ /g, '-')}`} className="group block relative aspect-[3/2] rounded-[var(--radius-md)] overflow-hidden">
                      <CloudinaryImage publicId={cat.img} alt={cat.name} width={200} height={133} className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-fast" />
                      <div className="absolute inset-0 flex items-center justify-center p-2 text-center">
                        <span className="text-body-md font-semibold text-white drop-shadow-md">{cat.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              <div className="w-full h-px bg-[var(--color-border-subtle)]" />

              {/* Live Right Now */}
              <section>
                <div className="flex items-center justify-between mb-[var(--space-6)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-urgent-600)] animate-pulse" />
                    <h2 className="text-heading-lg font-display text-[var(--color-ink-900)]">Live Right Now</h2>
                  </div>
                </div>
                
                <div className="flex gap-[var(--space-5)] overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="snap-start shrink-0 w-[280px] bg-[var(--color-white)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] overflow-hidden border border-[var(--color-border-subtle)] group">
                      <div className="relative aspect-square">
                        <CloudinaryImage publicId="cat-hotwheels" alt="Item" width={280} height={280} className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-105" />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-[var(--radius-sm)] text-[11px] font-bold tracking-wider uppercase text-[var(--color-urgent-700)] shadow-sm">
                          02:14:59 Left
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-1 line-clamp-1">Vintage Redline Hot Wheel</h3>
                        <p className="text-caption text-[var(--color-ink-500)] mb-3">By CollectorClub</p>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-caption text-[var(--color-ink-500)] mb-0.5">Current Bid</p>
                            <p className="text-heading-md text-[var(--color-ink-900)]">₹4,500</p>
                          </div>
                          <button className="px-4 py-1.5 bg-[var(--color-ink-900)] text-white text-caption font-semibold rounded-[var(--radius-pill)] hover:bg-[var(--color-terracotta-600)] transition-colors">
                            Bid Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="w-full h-px bg-[var(--color-border-subtle)]" />

              {/* New This Week */}
              <section>
                <div className="flex items-center justify-between mb-[var(--space-6)]">
                  <h2 className="text-heading-lg font-display text-[var(--color-ink-900)]">New This Week</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="relative aspect-square rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-cream-deep)] mb-3">
                        <CloudinaryImage publicId="cat-art" alt="Product" width={300} height={300} className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-105" />
                        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[var(--color-ink-500)] hover:text-[var(--color-terracotta-600)] hover:bg-white transition-all shadow-sm z-10 opacity-0 group-hover:opacity-100">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="px-1">
                        <h3 className="text-body-md font-medium text-[var(--color-ink-900)] line-clamp-1 mb-0.5 group-hover:text-[var(--color-terracotta-600)] transition-colors">Hand-Painted Canvas Abstract</h3>
                        <p className="text-caption text-[var(--color-ink-500)] mb-1">StudioArt • India</p>
                        <p className="text-body-md font-semibold text-[var(--color-ink-900)]">₹2,800</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-[var(--space-8)]">
                  <button className="px-6 py-2 border-[1.5px] border-[var(--color-ink-900)] text-[var(--color-ink-900)] font-semibold rounded-[var(--radius-pill)] hover:bg-[var(--color-ink-900)] hover:text-white transition-colors">
                    Load More
                  </button>
                </div>
              </section>

              <div className="w-full h-px bg-[var(--color-border-subtle)]" />

              {/* Featured Creators */}
              <section>
                <div className="flex items-center justify-between mb-[var(--space-6)]">
                  <h2 className="text-heading-lg font-display text-[var(--color-ink-900)]">Featured Creators</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[var(--space-5)]">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-[var(--color-white)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] overflow-hidden shadow-sm group">
                      <div className="h-[80px] bg-[var(--color-cream-deep)] relative">
                        <CloudinaryImage publicId="hero-bg" alt="Cover" width={300} height={80} className="w-full h-full object-cover" />
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-[var(--color-white)]">
                          <CloudinaryImage publicId="cat-crafts" alt="Avatar" width={48} height={48} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div className="pt-8 pb-5 px-4 text-center">
                        <h3 className="text-heading-sm text-[var(--color-ink-900)] line-clamp-1 mb-1">Aria Ceramics</h3>
                        <p className="text-caption text-[var(--color-ink-500)] mb-3">Handmade Pottery</p>
                        <button className="w-full py-1.5 text-caption font-semibold border border-[var(--color-border-subtle)] rounded-[var(--radius-pill)] text-[var(--color-ink-700)] hover:bg-[var(--color-cream-raised)] hover:text-[var(--color-ink-900)] transition-colors">
                          View Shop
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
