'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CloudinaryImage } from '@/components/CloudinaryImage'
import { Filter, X, Heart } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'

const megaMenuData: Record<string, string[]> = {
  'Art': ['Paintings', 'Sketches & Drawings', 'Digital Art', 'Illustrations', 'Prints & Posters', 'Sculptures'],
  'Handmade & Crafts': ['Handmade Decor', 'Crochet & Knitting', 'Resin Art', 'Clay & Pottery', 'DIY Creations', 'Candles & Soaps', 'Paper Crafts'],
  'Collectibles': ['Action Figures', 'Trading Cards', 'Coins', 'Stamps', 'Funko Pops', 'LEGO Collectibles', 'Hot Wheels'],
  'Gaming & Hobby': ['Gaming Merchandise', 'Board Games', 'Model Kits', 'Anime Merchandise', 'Cosplay Props', 'Trading Card Games', 'Puzzle Collections'],
  'Lifestyle & Gifts': ['Jewelry', 'Home Decor', 'Keychains', 'Accessories', 'Stationery', 'Personalized Gifts', 'Miniatures']
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeSubcategorySlug = searchParams.get('subcategory')
  
  // Convert URL slugs to readable names
  const categoryName = params.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  
  // Try to find exact case match in our data to get the proper subcategory list
  const dataKey = Object.keys(megaMenuData).find(k => k.toLowerCase().replace(/ /g, '-').replace('&-', '') === params.category) || categoryName
  const subcategories = megaMenuData[dataKey] || []
  
  // Find readable subcategory name from slug
  const activeSubcategoryName = subcategories.find(sub => sub.toLowerCase().replace(/ /g, '-') === activeSubcategorySlug)

  const handleSubcategorySelect = (slug: string) => {
    router.push(`/category/${params.category}?subcategory=${slug}`, { scroll: false })
  }

  const clearSubcategory = () => {
    router.push(`/category/${params.category}`, { scroll: false })
  }

  const SidebarContent = () => (
    <div className="space-y-6">
      
      {/* Subcategories Vertical Nav */}
      <div>
        <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">Subcategories</h3>
        <div className="flex flex-col gap-1">
          {subcategories.map(sub => {
            const slug = sub.toLowerCase().replace(/ /g, '-')
            const isActive = slug === activeSubcategorySlug
            return (
              <button 
                key={sub}
                onClick={() => handleSubcategorySelect(slug)}
                className={cn(
                  "text-left text-body-md h-[36px] flex items-center px-2 rounded-[var(--radius-sm)] transition-colors w-full overflow-hidden whitespace-nowrap text-ellipsis",
                  isActive 
                    ? "bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)] font-medium border-l-[3px] border-[var(--color-terracotta-700)]" 
                    : "text-[var(--color-ink-700)] hover:bg-[var(--color-cream-deep)]"
                )}
                title={sub}
              >
                {sub}
              </button>
            )
          })}
        </div>
      </div>

      <div className="h-px w-full bg-[var(--color-border-subtle)]" />

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
    <div className="min-h-screen bg-[var(--color-cream-base)] flex flex-col overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full">
        
        {/* Full Bleed Editorial Header */}
        <section className="w-full h-[280px] bg-[var(--color-cream-raised)] border-b border-[var(--color-border-subtle)] flex flex-col items-center justify-center text-center px-[var(--space-5)]">
          <h1 className="text-display-xl font-display text-[var(--color-ink-900)] mb-[var(--space-2)]">
            {dataKey}
          </h1>
          <p className="text-body-lg text-[var(--color-ink-700)] max-w-[600px]">
            Discover the best {dataKey} crafted and curated by our community.
          </p>
        </section>

        {/* Constrained Container for Sidebar + Grid */}
        <div className="w-full max-w-[var(--container-max)] mx-auto px-[var(--space-4)] md:px-[var(--space-6)] xl:px-[var(--space-8)] py-[var(--space-8)]">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-[var(--space-5)] flex items-center justify-between">
            <h2 className="text-heading-md text-[var(--color-ink-900)]">Results (84)</h2>
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border-subtle)] rounded-[var(--radius-pill)] bg-[var(--color-white)] text-body-md font-medium text-[var(--color-ink-900)]"
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          {/* Grid Layout Container */}
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
            <div className="flex flex-col gap-[var(--space-6)]">
              
              <div className="hidden lg:flex items-center justify-between">
                <h2 className="text-heading-md text-[var(--color-ink-900)]">Results (84)</h2>
                <div className="flex items-center gap-2">
                  <span className="text-body-md text-[var(--color-ink-700)]">Sort by:</span>
                  <select className="h-[36px] bg-transparent border-none text-body-md font-medium text-[var(--color-ink-900)] outline-none cursor-pointer">
                    <option>Recommended</option>
                    <option>Newest Arrivals</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Row */}
              {activeSubcategoryName && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-body-md text-[var(--color-ink-700)] font-medium mr-1">Active Filters:</span>
                  <div className="flex items-center gap-1.5 bg-[var(--color-cream-deep)] px-3 py-1.5 rounded-[var(--radius-pill)] border border-[var(--color-border-subtle)]">
                    <span className="text-caption font-medium text-[var(--color-ink-900)]">{activeSubcategoryName}</span>
                    <button onClick={clearSubcategory} className="hover:text-[var(--color-terracotta-600)] text-[var(--color-ink-500)] transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Product Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="relative aspect-square rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-cream-deep)] mb-3">
                      <CloudinaryImage publicId={i % 2 === 0 ? "cat-crafts" : "cat-art"} alt="Product" width={300} height={300} className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-105" />
                      <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[var(--color-ink-500)] hover:text-[var(--color-terracotta-600)] hover:bg-white transition-all shadow-sm z-10 opacity-0 group-hover:opacity-100">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="px-1">
                      <h3 className="text-body-md font-medium text-[var(--color-ink-900)] line-clamp-1 mb-0.5 group-hover:text-[var(--color-terracotta-600)] transition-colors">{activeSubcategoryName || dataKey} Item {i+1}</h3>
                      <p className="text-caption text-[var(--color-ink-500)] mb-1">Creator Name • India</p>
                      <p className="text-body-md font-semibold text-[var(--color-ink-900)]">₹{1200 + i * 150}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-[var(--space-8)]">
                <button className="px-6 py-2 border-[1.5px] border-[var(--color-ink-900)] text-[var(--color-ink-900)] font-semibold rounded-[var(--radius-pill)] hover:bg-[var(--color-ink-900)] hover:text-white transition-colors">
                  Load More
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
