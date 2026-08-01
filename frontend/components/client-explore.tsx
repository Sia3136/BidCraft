'use client'

import React, { useState, useMemo, useCallback, Suspense, useEffect } from 'react'
import { Filter, X } from 'lucide-react'
import { Listing } from '@/lib/api'
import { ProductCard } from '@/components/product-card'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { slugify } from '@/lib/slugify'

import { CATEGORIES, COLLECTIONS, OCCASIONS, resolveDisplayTitle } from '@/lib/categories'

const BUYING_METHODS = ['Buy Now', 'Auction', 'Negotiable']
const TYPES = [{ label: 'New Arrivals', value: 'new-arrivals' }, { label: 'Live Auctions', value: 'auction' }]

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' }
]

function ExploreContent({ initialListings = [], total = 0 }: { initialListings?: Listing[], total?: number }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const searchQuery = searchParams.get('search')
  const sortQuery = searchParams.get('sort') || 'newest'
  const page = parseInt(searchParams.get('page') || '1', 10)
  const itemsPerPage = 28
  const totalPages = Math.ceil(total / itemsPerPage)
  
  // Array parameters
  const categoriesParam = searchParams.getAll('category')
  const subcategoriesParam = searchParams.getAll('subcategory')
  const methodsParam = searchParams.getAll('method')
  
  // Single parameters
  const collectionParam = searchParams.get('collection')
  const occasionParam = searchParams.get('occasion')
  const typeParam = searchParams.get('type')
  const priceMinParam = searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : 50
  const priceMaxParam = searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : 5000
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [priceMin, setPriceMin] = useState<string>(String(priceMinParam))
  const [priceMax, setPriceMax] = useState<string>(String(priceMaxParam))

  // Helper to update URL
  const updateUrl = useCallback((updates: Record<string, string | string[] | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      params.delete(key)
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v))
      } else if (value !== null) {
        params.set(key, value)
      }
    })
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [searchParams, pathname, router])

  useEffect(() => {
    setPriceMin(String(priceMinParam))
    setPriceMax(String(priceMaxParam))
  }, [priceMinParam, priceMaxParam])

  const applyPriceFilter = () => {
    let min = Number(priceMin);
    let max = Number(priceMax);
    
    if (isNaN(min) || min < 50) min = 50;
    if (isNaN(max) || max > 5000) max = 5000;
    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }
    
    setPriceMin(String(min));
    setPriceMax(String(max));

    const updates: Record<string, string | null> = {}
    if (min > 50) updates.priceMin = String(min)
    else updates.priceMin = null
    
    if (max < 5000) updates.priceMax = String(max)
    else updates.priceMax = null

    updateUrl(updates)
  };

  const clearAllFilters = () => {
    router.push(pathname)
  }

  // Derived visible subcategories
  const visibleSubcategories = useMemo(() => {
    if (categoriesParam.length === 0) {
      return CATEGORIES.flatMap(c => c.subcategories)
    }
    return CATEGORIES.filter(c => categoriesParam.includes(slugify(c.name))).flatMap(c => c.subcategories)
  }, [categoriesParam])

  // Handlers
  const toggleArrayParam = (paramName: string, currentValues: string[], itemValue: string) => {
    const newValues = currentValues.includes(itemValue)
      ? currentValues.filter(v => v !== itemValue)
      : [...currentValues, itemValue]
    updateUrl({ [paramName]: newValues })
  }

  const toggleSingleParam = (paramName: string, currentValue: string | null, itemValue: string) => {
    updateUrl({ [paramName]: currentValue === itemValue ? null : itemValue })
  }

  const handlePriceUpdate = () => {
    // Legacy function, replaced by debounce
  }

  // Active Filters for Pills
  const activeFilters = useMemo(() => {
    const filters: { label: string, onRemove: () => void }[] = []
    
    categoriesParam.forEach(catSlug => {
      const cat = CATEGORIES.find(c => slugify(c.name) === catSlug)
      if (cat) filters.push({ label: cat.name, onRemove: () => toggleArrayParam('category', categoriesParam, catSlug) })
    })
    
    subcategoriesParam.forEach(subSlug => {
      const sub = CATEGORIES.flatMap(c => c.subcategories).find(s => slugify(s) === subSlug)
      if (sub) filters.push({ label: sub, onRemove: () => toggleArrayParam('subcategory', subcategoriesParam, subSlug) })
    })

    methodsParam.forEach(methodSlug => {
      const method = BUYING_METHODS.find(m => slugify(m) === methodSlug)
      if (method) filters.push({ label: method, onRemove: () => toggleArrayParam('method', methodsParam, methodSlug) })
    })

    if (collectionParam) {
      const col = COLLECTIONS.find(c => slugify(c) === collectionParam)
      if (col) filters.push({ label: col, onRemove: () => updateUrl({ collection: null }) })
    }

    if (occasionParam) {
      const occ = OCCASIONS.find(o => slugify(o) === occasionParam)
      if (occ) filters.push({ label: occ, onRemove: () => updateUrl({ occasion: null }) })
    }

    if (typeParam) {
      const type = TYPES.find(t => t.value === typeParam)
      if (type) filters.push({ label: type.label, onRemove: () => updateUrl({ type: null }) })
    }

    if (priceMinParam > 50 || priceMaxParam < 5000) {
      filters.push({ 
        label: `₹${priceMinParam} - ₹${priceMaxParam}${priceMaxParam === 5000 ? '+' : ''}`, 
        onRemove: () => updateUrl({ priceMin: null, priceMax: null }) 
      })
    }

    return filters
  }, [categoriesParam, subcategoriesParam, methodsParam, collectionParam, occasionParam, typeParam, priceMinParam, priceMaxParam, updateUrl])

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return initialListings.filter(p => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!p.title.toLowerCase().includes(query) && !(p.description && p.description.toLowerCase().includes(query))) {
          return false
        }
      }

      if (categoriesParam.length > 0) {
        if (!categoriesParam.includes(slugify(p.category))) return false;
      }

      if (subcategoriesParam.length > 0) {
        if (!p.subcategory || !subcategoriesParam.includes(slugify(p.subcategory))) return false;
      }

      if (methodsParam.length > 0) {
        if (!methodsParam.includes(slugify(p.buyingMethod))) return false;
      }

      if (typeParam === 'new-arrivals') {
        if (!(p as any).newArrival) return false;
      } else if (typeParam === 'auction') {
        if (p.buyingMethod !== 'Auction') return false;
      }

      if (collectionParam) {
        const orig = COLLECTIONS.find(c => slugify(c) === collectionParam);
        if (orig && (!p.collections || !p.collections.includes(orig))) return false;
      }

      if (occasionParam) {
        const orig = OCCASIONS.find(o => slugify(o) === occasionParam);
        if (orig && (!p.occasions || !p.occasions.includes(orig))) return false;
      }

      if (p.price < priceMinParam) return false
      if (priceMaxParam < 5000 && p.price > priceMaxParam) return false

      return true
    }).sort((a, b) => {
      if (sortQuery === 'price-asc') return a.price - b.price
      if (sortQuery === 'price-desc') return b.price - a.price
      return 0 
    })
  }, [initialListings, searchQuery, categoriesParam, subcategoriesParam, methodsParam, collectionParam, occasionParam, typeParam, priceMinParam, priceMaxParam, sortQuery])

  const sidebarContent = (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">Category</h3>
        <div className="space-y-2">
          {CATEGORIES.map(cat => {
            const slug = slugify(cat.name)
            return (
              <label key={slug} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={categoriesParam.includes(slug)}
                  onChange={() => toggleArrayParam('category', categoriesParam, slug)}
                  className="w-4 h-4 rounded-[var(--radius-sm)] border-[var(--color-border-subtle)] text-[var(--color-terracotta-600)] focus:ring-[var(--color-terracotta-600)]"
                />
                <span className="text-body-md text-[var(--color-ink-700)]">{cat.name}</span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="h-px w-full bg-[var(--color-border-subtle)]" />

      {/* Subcategory */}
      <div>
        <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">Subcategory</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {visibleSubcategories.map(sub => {
            const slug = slugify(sub)
            return (
              <label key={slug} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={subcategoriesParam.includes(slug)}
                  onChange={() => toggleArrayParam('subcategory', subcategoriesParam, slug)}
                  className="w-4 h-4 rounded-[var(--radius-sm)] border-[var(--color-border-subtle)] text-[var(--color-terracotta-600)] focus:ring-[var(--color-terracotta-600)]"
                />
                <span className="text-body-md text-[var(--color-ink-700)]">{sub}</span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="h-px w-full bg-[var(--color-border-subtle)]" />

      {/* Buying Method */}
      <div>
        <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">Buying Method</h3>
        <div className="space-y-2">
          {BUYING_METHODS.map(method => {
            const slug = slugify(method)
            return (
              <label key={slug} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={methodsParam.includes(slug)}
                  onChange={() => toggleArrayParam('method', methodsParam, slug)}
                  className="w-4 h-4 rounded-[var(--radius-sm)] border-[var(--color-border-subtle)] text-[var(--color-terracotta-600)] focus:ring-[var(--color-terracotta-600)]"
                />
                <span className="text-body-md text-[var(--color-ink-700)]">{method}</span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="h-px w-full bg-[var(--color-border-subtle)]" />

      {/* Price Range */}
      <div>
        <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-3)] flex justify-between items-center">
          Price Range
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 relative min-w-0">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-500)] text-body-sm">₹</span>
            <input 
              type="text" 
              inputMode="numeric"
              pattern="[0-9]*"
              value={priceMin}
              onChange={(e) => {
                const val = parseInt(e.target.value.replace(/\D/g, ''), 10) || 0;
                setPriceMin(String(val));
              }}
              onBlur={() => { if (Number(priceMin) < 50) setPriceMin('50'); }}
              className="w-full min-w-0 h-[40px] pl-7 pr-3 border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-body-sm text-[var(--color-ink-900)] outline-none focus:border-[var(--color-terracotta-600)]"
            />
          </div>
          <span className="text-[var(--color-ink-500)] shrink-0">—</span>
          <div className="flex-1 relative min-w-0">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-500)] text-body-sm">₹</span>
            <input 
              type="text" 
              inputMode="numeric"
              pattern="[0-9]*"
              value={priceMax}
              onChange={(e) => {
                const val = parseInt(e.target.value.replace(/\D/g, ''), 10) || 0;
                setPriceMax(String(val));
              }}
              onBlur={() => { if (Number(priceMax) > 5000) setPriceMax('5000'); }}
              className="w-full min-w-0 h-[40px] pl-7 pr-3 border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-body-sm text-[var(--color-ink-900)] outline-none focus:border-[var(--color-terracotta-600)]"
            />
          </div>
        </div>
        <button 
          onClick={applyPriceFilter}
          className="w-full h-[40px] bg-[var(--color-cream-deep)] hover:bg-[var(--color-terracotta-600)] text-[var(--color-ink-900)] hover:text-white text-body-sm font-bold rounded-[var(--radius-sm)] transition-colors"
        >
          Apply
        </button>
      </div>

      <div className="h-px w-full bg-[var(--color-border-subtle)]" />

      {/* Collection */}
      <div>
        <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">Collection</h3>
        <div className="space-y-2">
          {COLLECTIONS.map(col => {
            const slug = slugify(col)
            return (
              <label key={slug} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="collection"
                  checked={collectionParam === slug}
                  onChange={() => toggleSingleParam('collection', collectionParam, slug)}
                  className="w-4 h-4 rounded-full border-[var(--color-border-subtle)] text-[var(--color-terracotta-600)] focus:ring-[var(--color-terracotta-600)]"
                />
                <span className="text-body-md text-[var(--color-ink-700)]">{col}</span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="h-px w-full bg-[var(--color-border-subtle)]" />

      {/* Occasion */}
      <div>
        <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">Occasion</h3>
        <div className="space-y-2">
          {OCCASIONS.map(occ => {
            const slug = slugify(occ)
            return (
              <label key={slug} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="occasion"
                  checked={occasionParam === slug}
                  onChange={() => toggleSingleParam('occasion', occasionParam, slug)}
                  className="w-4 h-4 rounded-full border-[var(--color-border-subtle)] text-[var(--color-terracotta-600)] focus:ring-[var(--color-terracotta-600)]"
                />
                <span className="text-body-md text-[var(--color-ink-700)]">{occ}</span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="h-px w-full bg-[var(--color-border-subtle)]" />

      {/* Type */}
      <div>
        <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">Type</h3>
        <div className="space-y-2">
          {TYPES.map(type => (
            <label key={type.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                checked={typeParam === type.value}
                onChange={() => toggleSingleParam('type', typeParam, type.value)}
                className="w-4 h-4 rounded-full border-[var(--color-border-subtle)] text-[var(--color-terracotta-600)] focus:ring-[var(--color-terracotta-600)]"
              />
              <span className="text-body-md text-[var(--color-ink-700)]">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

    </div>
  )

  return (
    <div className="w-full max-w-[var(--container-max)] mx-auto px-[var(--space-4)] md:px-[var(--space-6)] xl:px-[var(--space-8)] py-[var(--space-8)]">
          {searchQuery && (
            <div className="mb-[var(--space-6)] flex items-center justify-between bg-[var(--color-cream-deep)] p-4 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]">
              <h2 className="text-heading-md text-[var(--color-ink-900)]">
                Showing results for "<span className="font-bold">{searchQuery}</span>"
              </h2>
              <button onClick={() => updateUrl({ search: null })} className="flex items-center gap-2 text-body-md font-medium text-[var(--color-ink-700)] hover:text-[var(--color-terracotta-600)] transition-colors">
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
              <Filter className="w-4 h-4" /> Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-[var(--space-8)]">
            
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block sticky top-[160px] h-[calc(100vh-160px)] overflow-y-auto pr-4 hide-scrollbar">
              {sidebarContent}
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
                    {sidebarContent}
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
                <h2 className="text-heading-md text-[var(--color-ink-900)]">
                  Showing {Math.min((page - 1) * 24 + 1, total)}–{Math.min(page * 24, total)} of {total} listings
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-body-md text-[var(--color-ink-700)]">Sort by:</span>
                  <select 
                    value={sortQuery}
                    onChange={(e) => updateUrl({ sort: e.target.value })}
                    className="h-[36px] bg-transparent border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] px-2 text-body-md font-medium text-[var(--color-ink-900)] outline-none cursor-pointer"
                  >
                    {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Active Filters Chips */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {activeFilters.map((filter, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)] px-3 py-1.5 rounded-[var(--radius-pill)]">
                      <span className="text-body-md font-medium">{filter.label}</span>
                      <button onClick={filter.onRemove} className="hover:text-[var(--color-terracotta-900)] transition-colors"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
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
              
              {/* Pagination Controls */}
              {total > itemsPerPage && (
                <div className="flex justify-center items-center gap-4 mt-8 mb-4">
                  <button
                    disabled={page === 1}
                    onClick={() => updateUrl({ page: String(page - 1) })}
                    className="px-4 py-2 border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-cream-deep)] transition-colors text-body-md font-medium text-[var(--color-ink-900)]"
                  >
                    Previous
                  </button>
                  <span className="text-body-md font-medium text-[var(--color-ink-900)]">
                    Page {page} of {Math.ceil(total / itemsPerPage)}
                  </span>
                  <button
                    disabled={page >= Math.ceil(total / itemsPerPage)}
                    onClick={() => updateUrl({ page: String(page + 1) })}
                    className="px-4 py-2 border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-cream-deep)] transition-colors text-body-md font-medium text-[var(--color-ink-900)]"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
    </div>
  )
}

export default function ClientExplore({ initialListings = [], total = 0, initialParams }: { initialListings?: Listing[], total?: number, initialParams?: any }) {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <ClientExploreInner initialListings={initialListings} total={total} />
    </Suspense>
  )
}

function ClientExploreInner({ initialListings = [], total = 0 }: { initialListings?: Listing[], total?: number }) {
  const searchParams = useSearchParams()
  const rawSlug = searchParams.get('subcategory') || searchParams.get('category') || searchParams.get('collection') || searchParams.get('occasion')
  const title = resolveDisplayTitle(rawSlug) || 'Explore All'
  
  return (
    <div className="bg-[var(--color-cream-base)] flex flex-col">
      <main className="flex-1 w-full">
        <section className="w-full h-[280px] bg-[var(--color-cream-raised)] border-b border-[var(--color-border-subtle)] flex flex-col items-center justify-center text-center px-[var(--space-5)]">
          <h1 className="text-display-xl font-display text-[var(--color-ink-900)] mb-[var(--space-2)] capitalize">
            {title}
          </h1>
          <p className="text-body-lg text-[var(--color-ink-700)] max-w-[600px]">
            Discover handcrafted goods, rare collectibles, and live auctions — all in one place.
          </p>
        </section>
        <ExploreContent initialListings={initialListings} total={total} />
      </main>
    </div>
  )
}
