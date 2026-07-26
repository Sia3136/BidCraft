'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Filter, ChevronDown, ChevronLeft, ChevronRight, Heart, SearchX } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { PriceSlider } from '@/components/marketplace/price-slider'
import { MobileFilterDrawer } from '@/components/marketplace/mobile-filter-drawer'
import { cn } from '@/lib/utils'

const PRODUCTS = [
  { id: 1, title: 'Hand-thrown Ceramic Match Striker', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=400&auto=format&fit=crop', creator: { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop' }, price: '₹1,200', method: 'BUY NOW', isAuction: false },
  { id: 3, title: 'Resin Ocean Wave Charcuterie Board', image: 'https://images.unsplash.com/photo-1611142998399-52e46d3eb808?q=80&w=400&auto=format&fit=crop', creator: { name: 'David Chen', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop' }, price: '₹4,500', method: 'BUY NOW', isAuction: false },
]

function FilterCheckbox({ label, count, checked, onChange }: { label: string, count?: number, checked: boolean, onChange: () => void }) {
  return (
    <label className="flex items-center justify-between py-[var(--space-2)] cursor-pointer group">
      <div className="flex items-center gap-[var(--space-3)]">
        <div 
          className={cn(
            "w-[18px] h-[18px] rounded-[var(--radius-sm)] border flex items-center justify-center transition-colors",
            checked ? "bg-[var(--color-terracotta-600)] border-[var(--color-terracotta-600)]" : "border-[var(--color-border-subtle)] bg-transparent group-hover:border-[var(--color-terracotta-600)]"
          )}
        >
          {checked && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <span className="text-body-md text-[var(--color-ink-900)]">{label}</span>
      </div>
      {count !== undefined && (
        <span className="text-caption text-[var(--color-ink-500)]">({count})</span>
      )}
      <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
    </label>
  )
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  // Simulate an empty state if query is "empty"
  const isEmpty = query.toLowerCase() === 'empty'
  const resultCount: number = isEmpty ? 0 : 2
  
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({})

  const toggleWishlist = (e: React.MouseEvent, id: number) => {
    e.preventDefault()
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <main className="min-h-screen bg-[var(--color-cream-base)]">
      <Navbar />

      {/* Shorter Header Block */}
      <div className="w-[var(--container-full-bleed)] h-[160px] bg-[var(--color-cream-raised)] flex items-center">
        <div className="max-w-[var(--container-max)] w-full mx-auto px-4 md:px-6 xl:px-6">
          <h1 className="text-display-md text-[var(--color-ink-900)] mb-[var(--space-2)]">
            Results for "{query}"
          </h1>
          <p className="text-body-md text-[var(--color-ink-700)]">
            {resultCount} {resultCount === 1 ? 'item' : 'items'} found
          </p>
        </div>
      </div>

      <div className="max-w-[var(--container-max)] mx-auto px-4 md:px-6 xl:px-6 py-[var(--space-8)] flex flex-col lg:flex-row gap-[var(--space-8)] relative items-start">
        
        {isEmpty ? (
          // Empty State
          <div className="w-full flex flex-col items-center justify-center py-[var(--space-10)] text-center animate-fade-up">
            <div className="w-[64px] h-[64px] rounded-full bg-[var(--color-cream-deep)] flex items-center justify-center mb-[var(--space-5)] text-[var(--color-ink-500)]">
              <SearchX size={32} />
            </div>
            <h2 className="text-display-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">
              No results found
            </h2>
            <p className="text-body-lg text-[var(--color-ink-700)] max-w-[480px] mb-[var(--space-8)]">
              We couldn't find any items matching "{query}". Check your spelling or try exploring these popular categories instead.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--space-4)] w-full max-w-[880px]">
              {[
                { name: 'Clay & Pottery', img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=300&auto=format&fit=crop', slug: 'clay-and-pottery' },
                { name: 'Hot Wheels', img: 'https://images.unsplash.com/photo-1596727289524-7dae28d052a3?q=80&w=300&auto=format&fit=crop', slug: 'hot-wheels' },
                { name: 'Crochet & Knitting', img: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=300&auto=format&fit=crop', slug: 'crochet-and-knitting' },
                { name: 'Resin Art', img: 'https://images.unsplash.com/photo-1611142998399-52e46d3eb808?q=80&w=300&auto=format&fit=crop', slug: 'resin-arts' },
              ].map(cat => (
                <Link key={cat.name} href={`/explore?subcategory=${cat.slug}`} className="group relative aspect-[4/5] rounded-[var(--radius-md)] overflow-hidden">
                  <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-slow group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                  <span className="absolute bottom-[var(--space-4)] left-[var(--space-4)] text-heading-sm text-white">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          // Populated State (Sidebar + Grid)
          <>
            {/* Mobile Filter Trigger */}
            <div className="w-full flex lg:hidden items-center justify-between mb-4">
              <Button variant="secondary" onClick={() => setIsMobileDrawerOpen(true)} className="flex items-center gap-2">
                <Filter size={16} /> Filters
              </Button>
              <div className="flex items-center gap-2 text-body-md text-[var(--color-ink-700)]">
                Sort by: <span className="font-semibold text-[var(--color-ink-900)]">Relevance</span> <ChevronDown size={16} />
              </div>
            </div>

            {/* Sidebar Filters (Desktop) */}
            <aside className="hidden lg:block w-[260px] shrink-0 sticky top-[100px] h-max">
              <div className="flex items-center justify-between mb-[var(--space-6)]">
                <h3 className="text-heading-lg text-[var(--color-ink-900)]">Filters</h3>
                <Button variant="ghost" className="text-[var(--color-ink-700)] px-0 h-auto">Clear All</Button>
              </div>

              <div className="flex flex-col gap-[var(--space-6)]">
                {/* Buying Method */}
                <div className="flex flex-col">
                  <h4 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">Buying Method</h4>
                  <FilterCheckbox label="Buy Now" count={2} checked={true} onChange={() => {}} />
                  <FilterCheckbox label="Auction" count={0} checked={false} onChange={() => {}} />
                </div>

                <div className="h-[1px] w-full bg-[var(--color-border-subtle)]" />

                {/* Price Range */}
                <div className="flex flex-col">
                  <h4 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">Price Range</h4>
                  <PriceSlider min={0} max={10000} step={100} value={priceRange} onValueChange={setPriceRange} />
                </div>
              </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 w-full flex flex-col min-w-0">
              
              {/* Top Bar (Desktop) */}
              <div className="hidden lg:flex items-center justify-between mb-[var(--space-6)]">
                <span className="text-body-md text-[var(--color-ink-700)]">{resultCount} items</span>
                
                <div className="flex items-center gap-[var(--space-4)]">
                  {/* Sort Dropdown (Mock) */}
                  <div className="relative group">
                    <Button variant="ghost" className="flex items-center gap-2 pr-0">
                      Sort: <span className="text-[var(--color-ink-900)] font-medium">Relevance</span>
                      <ChevronDown size={16} className="text-[var(--color-ink-500)]" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[var(--space-4)] lg:gap-[var(--space-5)]">
                {PRODUCTS.map((product) => (
                  <div key={product.id} className="group block rounded-[var(--radius-md)] bg-[var(--color-white)] relative hover-card flex flex-col animate-fade-up">
                    <div className="w-full aspect-[4/5] rounded-[var(--radius-md)] overflow-hidden relative mb-[var(--space-3)] shrink-0">
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-slow ease-default group-hover:scale-[1.04]" />
                      <div className="absolute top-[var(--space-3)] left-[var(--space-3)] pointer-events-none">
                        <Badge variant="method">{product.method}</Badge>
                      </div>
                      <button 
                        onClick={(e) => toggleWishlist(e, product.id)}
                        className="absolute top-[var(--space-3)] right-[var(--space-3)] w-[32px] h-[32px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-105"
                      >
                        <Heart size={16} className={cn("transition-colors duration-200", wishlist[product.id] ? "fill-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)] scale-110" : "text-white")} />
                      </button>
                    </div>
                    <div className="px-1 flex flex-col flex-1 pb-1">
                      <div className="flex items-center gap-[var(--space-2)] mb-[var(--space-2)]">
                        <Avatar src={product.creator.avatar} initials={product.creator.name[0]} size="small" className="w-[24px] h-[24px]" />
                        <span className="text-caption text-[var(--color-ink-700)] line-clamp-1">{product.creator.name}</span>
                      </div>
                      <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-2)] line-clamp-2 flex-1">{product.title}</h3>
                      <div className="flex flex-col mt-auto">
                        <span className="text-price text-[var(--color-ink-900)]">{product.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </>
        )}
      </div>

      <Footer />
      
      <MobileFilterDrawer 
        isOpen={isMobileDrawerOpen} 
        onClose={() => setIsMobileDrawerOpen(false)} 
        resultCount={resultCount}
      />
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-cream-base)]" />}>
      <SearchPageContent />
    </Suspense>
  )
}
