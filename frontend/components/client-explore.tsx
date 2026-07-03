'use client'

import React, { useState, useMemo, useCallback, Suspense, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Filter, X } from 'lucide-react'
import { Product } from '@/lib/dbProducts'
import { ProductCard } from '@/components/product-card'
import { SkeletonGrid } from '@/components/skeleton-grid'
import { useSearchParams, useRouter } from 'next/navigation'

const CATEGORIES = ['Art', 'Handmade & Crafts', 'Collectibles', 'Gaming & Hobby', 'Lifestyle & Gifts']
const BUYING_METHODS = ['Buy Now', 'Auction', 'Negotiable']
const RATINGS = [
  { label: 'Any Rating', value: 0 },
  { label: '4.5 & above', value: 4.5 },
  { label: '4.7 & above', value: 4.7 },
  { label: '4.9 & above', value: 4.9 }
]
const SORT_OPTIONS = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Highest Rated']

interface SidebarProps {
  selectedCategories: string[];
  selectedMethods: string[];
  priceMin: number;
  priceMax: number;
  selectedRating: number;
  toggleCategory: (cat: string) => void;
  toggleMethod: (method: string) => void;
  setPriceMin: (val: number) => void;
  setPriceMax: (val: number) => void;
  setSelectedRating: (val: number) => void;
}

const SidebarContent = React.memo(function SidebarContent({
  selectedCategories,
  selectedMethods,
  priceMin,
  priceMax,
  selectedRating,
  toggleCategory,
  toggleMethod,
  setPriceMin,
  setPriceMax,
  setSelectedRating
}: SidebarProps) {
  return (
    <div className="space-y-6">

      {/* Category Filter */}
      <div>
        <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">Category</h3>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="w-4 h-4 rounded-[var(--radius-sm)] border-[var(--color-border-subtle)] text-[var(--color-terracotta-600)] focus:ring-[var(--color-terracotta-600)]"
              />
              <span className="text-body-md text-[var(--color-ink-700)]">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-[var(--color-border-subtle)]" />

      {/* Buying Method Filter */}
      <div>
        <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">Buying Method</h3>
        <div className="space-y-2">
          {BUYING_METHODS.map(method => (
            <label key={method} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedMethods.includes(method)}
                onChange={() => toggleMethod(method)}
                className="w-4 h-4 rounded-[var(--radius-sm)] border-[var(--color-border-subtle)] text-[var(--color-terracotta-600)] focus:ring-[var(--color-terracotta-600)]"
              />
              <span className="text-body-md text-[var(--color-ink-700)]">{method}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-[var(--color-border-subtle)]" />

      {/* Price Range */}
      <div>
        <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">Price Range</h3>
        <p className="text-body-md text-[var(--color-ink-700)] mb-3">₹{priceMin} — ₹{priceMax}</p>
        <div className="relative h-6 flex items-center">
          <div className="absolute w-full h-1 bg-[var(--color-cream-deep)] rounded-full"></div>
          <div
            className="absolute h-1 bg-[var(--color-terracotta-600)] rounded-full"
            style={{
              left: `${(priceMin / 5000) * 100}%`,
              right: `${100 - (priceMax / 5000) * 100}%`
            }}
          ></div>
          <input
            type="range"
            min={0} max={5000} step={50}
            value={priceMin}
            onChange={(e) => {
              const val = Number(e.target.value)
              if (val <= priceMax - 50) setPriceMin(val)
            }}
            className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--color-terracotta-600)] [&::-webkit-slider-thumb]:rounded-full"
          />
          <input
            type="range"
            min={0} max={5000} step={50}
            value={priceMax}
            onChange={(e) => {
              const val = Number(e.target.value)
              if (val >= priceMin + 50) setPriceMax(val)
            }}
            className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--color-terracotta-600)] [&::-webkit-slider-thumb]:rounded-full"
          />
        </div>
      </div>

      <div className="h-px w-full bg-[var(--color-border-subtle)]" />

      {/* Rating Filter */}
      <div>
        <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">Rating</h3>
        <div className="space-y-2">
          {RATINGS.map(rating => (
            <label key={rating.label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="ratingFilter"
                checked={selectedRating === rating.value}
                onChange={() => setSelectedRating(rating.value)}
                className="w-4 h-4 rounded-full border-[var(--color-border-subtle)] text-[var(--color-terracotta-600)] focus:ring-[var(--color-terracotta-600)]"
              />
              <span className="text-body-md text-[var(--color-ink-700)]">{rating.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
})

function ExploreContent({ allProducts = [] }: { allProducts?: Product[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchQuery = searchParams.get('search')
  const typeQuery = searchParams.get('type')
  const categoryQuery = searchParams.get('category')
  const subcategoryQuery = searchParams.get('subcategory')
  const sortQuery = searchParams.get('sort')
  const collectionQuery = searchParams.get('collection')
  const giftQuery = searchParams.get('gift')
  const errorQuery = searchParams.get('error')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Format category slugs back to titles for the state if they come from URL
  const formatCategory = (slug: string) => {
    if (slug === 'art') return 'Art'
    if (slug === 'handmade-crafts') return 'Handmade & Crafts'
    if (slug === 'collectibles') return 'Collectibles'
    if (slug === 'gaming-hobby') return 'Gaming & Hobby'
    if (slug === 'lifestyle-gifts') return 'Lifestyle & Gifts'
    return slug
  }

  // Filters State
  const initialCategory = categoryQuery ? [formatCategory(categoryQuery)] : []
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory)
  const [selectedMethods, setSelectedMethods] = useState<string[]>([])
  const [priceMin, setPriceMin] = useState<number>(0)
  const [priceMax, setPriceMax] = useState<number>(5000)
  const [selectedRating, setSelectedRating] = useState<number>(0)
  
  const initialSort = sortQuery === 'newest' ? 'Newest' : 'Newest' // Default to Newest
  const [sortBy, setSortBy] = useState<string>(initialSort)

  useEffect(() => {
    if (typeQuery === 'auction' && !selectedMethods.includes('Auction')) {
      setSelectedMethods(prev => [...prev, 'Auction'])
    }
  }, [typeQuery])

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    router.push(`/explore?${params.toString()}`)
  }

  const toggleCategory = useCallback((cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }, [])

  const toggleMethod = useCallback((method: string) => {
    setSelectedMethods(prev => prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method])
  }, [])

  const clearAllFilters = useCallback(() => {
    setSelectedCategories([])
    setSelectedMethods([])
    setPriceMin(0)
    setPriceMax(5000)
    setSelectedRating(0)
  }, [])

  const activeFiltersCount = selectedCategories.length + selectedMethods.length + (priceMin > 0 || priceMax < 5000 ? 1 : 0) + (selectedRating > 0 ? 1 : 0)

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!p.title.toLowerCase().includes(query) && !(p.description && p.description.toLowerCase().includes(query))) {
          return false
        }
      }
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false
      
      // If a subcategory is provided via URL and matches the selected category, filter by it
      if (subcategoryQuery && selectedCategories.length === 1 && selectedCategories[0] === formatCategory(categoryQuery || '')) {
        // Here we just do a loose include match on title/description since we don't have subcategory in exploreProducts properly sometimes
        const subq = subcategoryQuery.toLowerCase().replace(/-/g, ' ');
        const text = (p.title + ' ' + (p.description || '')).toLowerCase();
        if (!text.includes(subq) && (p.subcategory || '').toLowerCase() !== subq) {
          return false;
        }
      }
      
      if (selectedMethods.length > 0 && !selectedMethods.includes(p.buyingMethod)) return false
      if (p.price < priceMin || p.price > priceMax) return false
      if (selectedRating > 0 && p.rating < selectedRating) return false

      if (collectionQuery) {
        // Just mock collection logic: filter based on some text matching
        const q = collectionQuery.toLowerCase().replace(/-/g, ' ');
        const text = (p.title + ' ' + (p.description || '') + ' ' + p.category).toLowerCase();
        if (!text.includes(q) && p.category.toLowerCase() !== q) return false;
      }

      if (giftQuery) {
        // Mock gift logic: e.g. for-her might match certain subcategories or titles
        const q = giftQuery.toLowerCase().replace(/-/g, ' ');
        const text = (p.title + ' ' + (p.description || '') + ' ' + p.category).toLowerCase();
        if (!text.includes(q) && p.category.toLowerCase() !== 'lifestyle & gifts') return false;
      }

      return true
    }).sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price
      if (sortBy === 'Price: High to Low') return b.price - a.price
      if (sortBy === 'Highest Rated') return b.rating - a.rating
      return 0 // Default array order for Newest
    })
  }, [selectedCategories, selectedMethods, priceMin, priceMax, selectedRating, sortBy])

  return (
    <div className="w-full max-w-[var(--container-max)] mx-auto px-[var(--space-4)] md:px-[var(--space-6)] xl:px-[var(--space-8)] py-[var(--space-8)]">
          {errorQuery === 'not-found' && (
            <div className="mb-[var(--space-6)] bg-[var(--color-urgent-100)] p-4 rounded-[var(--radius-md)] border border-[var(--color-urgent-600)] flex items-center justify-between">
              <p className="text-body-md text-[var(--color-urgent-700)] font-medium">That listing wasn't found. It may have been removed.</p>
              <button onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete('error');
                router.replace(`/explore?${params.toString()}`);
              }} className="text-[var(--color-urgent-700)] hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {searchQuery && (
            <div className="mb-[var(--space-6)] flex items-center justify-between bg-[var(--color-cream-deep)] p-4 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]">
              <h2 className="text-heading-md text-[var(--color-ink-900)]">
                Showing results for "<span className="font-bold">{searchQuery}</span>"
              </h2>
              <button onClick={clearSearch} className="flex items-center gap-2 text-body-md font-medium text-[var(--color-ink-700)] hover:text-[var(--color-terracotta-600)] transition-colors">
                <X className="w-4 h-4" /> Clear Search
              </button>
            </div>
          )}
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-[var(--space-5)] flex items-center justify-between">
            <h2 className="text-heading-md text-[var(--color-ink-900)]">{filteredProducts.length} items</h2>
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border-subtle)] rounded-[var(--radius-pill)] bg-[var(--color-white)] text-body-md font-medium text-[var(--color-ink-900)]"
            >
              <Filter className="w-4 h-4" /> Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-[var(--space-8)]">
            
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block sticky top-[160px] h-[calc(100vh-160px)] overflow-y-auto pr-4 hide-scrollbar">
              <SidebarContent 
                selectedCategories={selectedCategories}
                selectedMethods={selectedMethods}
                priceMin={priceMin}
                priceMax={priceMax}
                selectedRating={selectedRating}
                toggleCategory={toggleCategory}
                toggleMethod={toggleMethod}
                setPriceMin={setPriceMin}
                setPriceMax={setPriceMax}
                setSelectedRating={setSelectedRating}
              />
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
                    <SidebarContent 
                      selectedCategories={selectedCategories}
                      selectedMethods={selectedMethods}
                      priceMin={priceMin}
                      priceMax={priceMax}
                      selectedRating={selectedRating}
                      toggleCategory={toggleCategory}
                      toggleMethod={toggleMethod}
                      setPriceMin={setPriceMin}
                      setPriceMax={setPriceMax}
                      setSelectedRating={setSelectedRating}
                    />
                  </div>
                  <div className="p-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-white)] sticky bottom-0 z-10 flex gap-3">
                    <button onClick={clearAllFilters} className="flex-1 py-3 text-body-md font-medium text-[var(--color-ink-700)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)]">Clear All</button>
                    <button onClick={() => setIsMobileFilterOpen(false)} className="flex-1 py-3 text-body-md font-medium text-white bg-[var(--color-terracotta-600)] rounded-[var(--radius-md)]">Show {filteredProducts.length} Results</button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div className="flex flex-col gap-[var(--space-6)]">
              
              <div className="hidden lg:flex items-center justify-between">
                <h2 className="text-heading-md text-[var(--color-ink-900)]">{filteredProducts.length} items</h2>
                <div className="flex items-center gap-2">
                  <span className="text-body-md text-[var(--color-ink-700)]">Sort by:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-[36px] bg-transparent border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] px-2 text-body-md font-medium text-[var(--color-ink-900)] outline-none cursor-pointer"
                  >
                    {SORT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              {/* Active Filters Chips */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {selectedCategories.map(cat => (
                    <div key={cat} className="flex items-center gap-1.5 bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)] px-3 py-1.5 rounded-[var(--radius-pill)]">
                      <span className="text-body-md font-medium">{cat}</span>
                      <button onClick={() => toggleCategory(cat)} className="hover:text-[var(--color-terracotta-900)] transition-colors"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                  {selectedMethods.map(method => (
                    <div key={method} className="flex items-center gap-1.5 bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)] px-3 py-1.5 rounded-[var(--radius-pill)]">
                      <span className="text-body-md font-medium">{method}</span>
                      <button onClick={() => toggleMethod(method)} className="hover:text-[var(--color-terracotta-900)] transition-colors"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                  {(priceMin > 0 || priceMax < 5000) && (
                    <div className="flex items-center gap-1.5 bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)] px-3 py-1.5 rounded-[var(--radius-pill)]">
                      <span className="text-body-md font-medium">₹{priceMin} - ₹{priceMax}</span>
                      <button onClick={() => { setPriceMin(0); setPriceMax(5000); }} className="hover:text-[var(--color-terracotta-900)] transition-colors"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                  {selectedRating > 0 && (
                    <div className="flex items-center gap-1.5 bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)] px-3 py-1.5 rounded-[var(--radius-pill)]">
                      <span className="text-body-md font-medium">{selectedRating} & above</span>
                      <button onClick={() => setSelectedRating(0)} className="hover:text-[var(--color-terracotta-900)] transition-colors"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                  <button onClick={clearAllFilters} className="text-body-md text-[var(--color-ink-500)] hover:text-[var(--color-terracotta-600)] transition-colors ml-2 font-medium">
                    Clear All
                  </button>
                </div>
              )}

              {/* Product Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map(p => (
                    <ProductCard 
                      key={p.id}
                      product={p as any}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <h3 className="text-heading-lg text-[var(--color-ink-900)] mb-3">No items match your filters</h3>
                  <p className="text-body-md text-[var(--color-ink-500)] mb-6">Try adjusting your filters or clearing them.</p>
                  <button 
                    onClick={clearAllFilters}
                    className="px-6 py-2 bg-[var(--color-ink-900)] text-white font-medium rounded-[var(--radius-pill)] hover:bg-[var(--color-terracotta-600)] transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
    </div>
  )
}

export default function ClientExplore({ allProducts = [] }: { allProducts?: Product[] }) {
  // Use a wrapper component to use searchParams
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <ClientExploreInner allProducts={allProducts} />
    </Suspense>
  )
}

function ClientExploreInner({ allProducts = [] }: { allProducts?: Product[] }) {
  const searchParams = useSearchParams()
  
  return (
    <div className="bg-[var(--color-cream-base)] flex flex-col">

      <main className="flex-1 w-full">
        {/* Page Header */}
        <section className="w-full h-[280px] bg-[var(--color-cream-raised)] border-b border-[var(--color-border-subtle)] flex flex-col items-center justify-center text-center px-[var(--space-5)]">
          <h1 className="text-display-xl font-display text-[var(--color-ink-900)] mb-[var(--space-2)] capitalize">
            {searchParams.get('subcategory') ? searchParams.get('subcategory')?.replace(/-/g, ' ') : (searchParams.get('category') ? searchParams.get('category')?.replace(/-/g, ' ') : (searchParams.get('collection') ? searchParams.get('collection')?.replace(/-/g, ' ') : (searchParams.get('gift') ? searchParams.get('gift')?.replace(/-/g, ' ') : 'Explore All')))}
          </h1>
          <p className="text-body-lg text-[var(--color-ink-700)] max-w-[600px]">
            Discover handcrafted goods, rare collectibles, and live auctions — all in one place.
          </p>
        </section>

        <ExploreContent allProducts={allProducts} />
      </main>
    </div>
  )
}
