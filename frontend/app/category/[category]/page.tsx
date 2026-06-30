'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Filter, ChevronDown, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { PriceSlider } from '@/components/marketplace/price-slider'
import { MobileFilterDrawer } from '@/components/marketplace/mobile-filter-drawer'
import { cn } from '@/lib/utils'

// Mock Data
const PRODUCTS = [
  { id: 1, title: 'Hand-thrown Ceramic Match Striker', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=400&auto=format&fit=crop', creator: { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop' }, price: '₹1,200', method: 'BUY NOW', isAuction: false },
  { id: 2, title: '1971 Datsun 510 Bluebird Wagon', image: 'https://images.unsplash.com/photo-1596727289524-7dae28d052a3?q=80&w=400&auto=format&fit=crop', creator: { name: 'The Vintage Vault', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=100&auto=format&fit=crop' }, price: '₹3,400', currentBid: '₹3,400', bidCount: 12, timeLeft: '02:14:33', method: 'AUCTION', isAuction: true },
  { id: 3, title: 'Resin Ocean Wave Charcuterie Board', image: 'https://images.unsplash.com/photo-1611142998399-52e46d3eb808?q=80&w=400&auto=format&fit=crop', creator: { name: 'David Chen', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop' }, price: '₹4,500', method: 'BUY NOW', isAuction: false },
  { id: 4, title: 'Hand-dyed Indigo Linen Scarf', image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=400&auto=format&fit=crop', creator: { name: 'Studio Noor', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop' }, price: '₹2,800', method: 'NEGOTIABLE', isAuction: false },
  { id: 5, title: 'Abstract Minimalist Print', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400&auto=format&fit=crop', creator: { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop' }, price: '₹1,500', method: 'BUY NOW', isAuction: false },
  { id: 6, title: 'Vintage Silver Ring', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=400&auto=format&fit=crop', creator: { name: 'Priya Crafts', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop' }, price: '₹850', method: 'TRADEABLE', isAuction: false },
]

// Custom Checkbox
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

export default function CategoryPage() {
  const params = useParams()
  const categoryStr = typeof params.category === 'string' ? params.category.replace('-', ' ') : 'Category'
  
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

      {/* Header Block */}
      <div className="relative w-[var(--container-full-bleed)] h-[200px] lg:h-[320px] bg-[var(--color-slate-900)] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2000&auto=format&fit=crop"
          alt={categoryStr}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(43,42,40,0.45) 0%, rgba(43,42,40,0) 100%)' }}
        />
        <div className="absolute inset-0 w-full max-w-[var(--container-max)] mx-auto">
          <div className="absolute bottom-[var(--space-6)] left-4 md:left-6 xl:left-6 flex flex-col">
            <h1 className="text-display-lg text-white capitalize mb-[var(--space-2)]">
              {categoryStr}
            </h1>
            <p className="text-body-md text-white/85 max-w-[600px]">
              248 items · Discover the finest handcrafted pieces and rare collectibles in this curated collection.
            </p>
          </div>
        </div>
      </div>

      {/* Body Layout */}
      <div className="max-w-[var(--container-max)] mx-auto px-4 md:px-6 xl:px-6 py-[var(--space-8)] flex flex-col lg:flex-row gap-[var(--space-8)] relative items-start">
        
        {/* Mobile Filter Trigger */}
        <div className="w-full flex lg:hidden items-center justify-between mb-4">
          <Button variant="secondary" onClick={() => setIsMobileDrawerOpen(true)} className="flex items-center gap-2">
            <Filter size={16} /> Filters
          </Button>
          <div className="flex items-center gap-2 text-body-md text-[var(--color-ink-700)]">
            Sort by: <span className="font-semibold text-[var(--color-ink-900)]">Newest</span> <ChevronDown size={16} />
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
              <FilterCheckbox label="Buy Now" count={142} checked={true} onChange={() => {}} />
              <FilterCheckbox label="Auction" count={89} checked={false} onChange={() => {}} />
              <FilterCheckbox label="Negotiable" count={34} checked={false} onChange={() => {}} />
              <FilterCheckbox label="Tradeable" count={12} checked={false} onChange={() => {}} />
            </div>

            <div className="h-[1px] w-full bg-[var(--color-border-subtle)]" />

            {/* Price Range */}
            <div className="flex flex-col">
              <h4 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">Price Range</h4>
              <PriceSlider min={0} max={20000} step={100} value={priceRange} onValueChange={setPriceRange} />
            </div>

            <div className="h-[1px] w-full bg-[var(--color-border-subtle)]" />

            {/* Subcategory */}
            <div className="flex flex-col">
              <h4 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">Subcategory</h4>
              <FilterCheckbox label="Paintings" count={45} checked={false} onChange={() => {}} />
              <FilterCheckbox label="Sketches & Drawings" count={32} checked={false} onChange={() => {}} />
              <FilterCheckbox label="Digital Art" count={23} checked={false} onChange={() => {}} />
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 w-full flex flex-col min-w-0">
          
          {/* Top Bar (Desktop) */}
          <div className="hidden lg:flex items-center justify-between mb-[var(--space-6)]">
            <span className="text-body-md text-[var(--color-ink-700)]">248 items</span>
            
            <div className="flex items-center gap-[var(--space-4)]">
              {/* Active Filter Chips */}
              <div className="flex items-center gap-[var(--space-2)]">
                <Badge variant="chip" className="flex items-center gap-1">
                  Buy Now <X size={12} className="cursor-pointer ml-1" />
                </Badge>
              </div>

              {/* Sort Dropdown (Mock) */}
              <div className="relative group">
                <Button variant="ghost" className="flex items-center gap-2 pr-0">
                  Sort: <span className="text-[var(--color-ink-900)] font-medium">Newest</span>
                  <ChevronDown size={16} className="text-[var(--color-ink-500)]" />
                </Button>
                {/* Dropdown panel would go here */}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[var(--space-4)] lg:gap-[var(--space-5)]">
            {PRODUCTS.map((product) => {
              if (product.isAuction) {
                // Render Auction Card variant
                return (
                  <div key={product.id} className="group block rounded-[var(--radius-md)] bg-[var(--color-white)] relative hover-card flex flex-col">
                    <div className="w-full aspect-[4/5] rounded-[var(--radius-md)] overflow-hidden relative mb-[var(--space-3)] shrink-0">
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-slow ease-default group-hover:scale-[1.04]" />
                      <div className="absolute top-[var(--space-3)] right-[var(--space-3)] rounded-[var(--radius-pill)] px-[12px] py-[6px] bg-[var(--color-slate-900)]/85 transition-transform duration-slow ease-default group-hover:scale-105">
                        <span className="text-caption text-white font-mono">{product.timeLeft}</span>
                      </div>
                    </div>
                    <div className="px-1 flex flex-col flex-1 pb-1">
                      <div className="flex items-center gap-[var(--space-2)] mb-[var(--space-2)]">
                        <Avatar src={product.creator.avatar} initials={product.creator.name[0]} size="small" className="w-[24px] h-[24px]" />
                        <span className="text-caption text-[var(--color-ink-700)] line-clamp-1">{product.creator.name}</span>
                      </div>
                      <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-2)] line-clamp-2 flex-1">{product.title}</h3>
                      <div className="flex items-end justify-between mt-[var(--space-2)]">
                        <div className="flex flex-col">
                          <span className="text-caption text-[var(--color-ink-500)]">Current Bid</span>
                          <span className="text-price text-[var(--color-ink-900)]">{product.currentBid}</span>
                        </div>
                        <span className="text-caption text-[var(--color-ink-500)]">{product.bidCount} bids</span>
                      </div>
                    </div>
                  </div>
                )
              }

              // Canonical Product Card
              return (
                <div key={product.id} className="group block rounded-[var(--radius-md)] bg-[var(--color-white)] relative hover-card flex flex-col">
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
              )
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-[var(--space-8)]">
            <div className="flex items-center gap-2">
              <button className="w-[32px] h-[32px] flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-ink-500)] hover:bg-[var(--color-cream-deep)] hover:text-[var(--color-ink-900)] transition-colors">
                <ChevronLeft size={20} />
              </button>
              {[1, 2, 3, '...', 12].map((page, i) => (
                <button
                  key={i}
                  className={cn(
                    "w-[32px] h-[32px] flex items-center justify-center rounded-full text-body-md transition-colors",
                    page === 1 ? "bg-[var(--color-terracotta-600)] text-white" : page === '...' ? "text-[var(--color-ink-500)] cursor-default" : "text-[var(--color-ink-700)] hover:bg-[var(--color-cream-deep)]"
                  )}
                >
                  {page}
                </button>
              ))}
              <button className="w-[32px] h-[32px] flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-ink-500)] hover:bg-[var(--color-cream-deep)] hover:text-[var(--color-ink-900)] transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

        </div>
      </div>

      <Footer />
      
      <MobileFilterDrawer 
        isOpen={isMobileDrawerOpen} 
        onClose={() => setIsMobileDrawerOpen(false)} 
        resultCount={248}
      />
    </main>
  )
}
