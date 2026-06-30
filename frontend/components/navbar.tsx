'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { AuthModal } from '@/components/auth-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Heart, ShoppingBag, Search, Menu, X, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const categoriesData = [
  {
    name: 'Art',
    href: '/category/art',
    subcategories: ['Paintings', 'Sketches & Drawings', 'Digital Art', 'Illustrations', 'Prints & Posters', 'Sculptures']
  },
  {
    name: 'Crafts',
    href: '/category/crafts',
    subcategories: ['Handmade Decor', 'Crochet & Knitting', 'Resin Art', 'Clay & Pottery', 'Candles & Soaps']
  },
  {
    name: 'Hot Wheels',
    href: '/category/hot-wheels',
    subcategories: ['Premium Series', 'Mainline', 'Treasure Hunts', 'Super Treasure Hunts', 'Vintage Models']
  },
  {
    name: 'Collectibles',
    href: '/category/collectibles',
    subcategories: ['Action Figures', 'Trading Cards', 'Coins', 'Stamps', 'Vintage Memorabilia']
  },
  {
    name: 'Handmade & Lifestyle',
    href: '/category/handmade-lifestyle',
    subcategories: ['Jewelry', 'Home Decor', 'Accessories', 'Stationery', 'Personalized Gifts']
  },
  {
    name: 'Hobby & Gaming',
    href: '/category/hobby-gaming',
    subcategories: ['Gaming Merchandise', 'Board Games', 'Model Kits', 'Anime Merchandise', 'Cosplay Props']
  }
];

function SearchBar({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(mobile)

  useEffect(() => {
    const q = searchParams.get('search')
    if (q) setSearchQuery(q)
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/listings?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push(`/listings`)
    }
  }

  if (!mobile && !isExpanded) {
    return (
      <Button variant="icon" size="icon" onClick={() => setIsExpanded(true)} className="hidden xl:flex text-[var(--color-ink-700)]">
        <Search size={20} strokeWidth={1.5} />
      </Button>
    )
  }

  return (
    <form onSubmit={handleSearch} className={cn("relative flex items-center", mobile ? "w-full" : "w-[240px] xl:flex hidden")}>
      <Search size={20} strokeWidth={1.5} className="absolute left-4 text-[var(--color-ink-500)]" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search curations..."
        className="w-full h-[44px] pl-12 pr-4 bg-[var(--color-cream-deep)] text-[var(--color-ink-900)] text-body-md placeholder:text-[var(--color-ink-500)] rounded-[var(--radius-pill)] border border-transparent focus:border-[1.5px] focus:border-[var(--color-terracotta-600)] focus:bg-[var(--color-white)] focus:outline-none focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] transition-all duration-250 ease-default"
        autoFocus={!mobile}
        onBlur={() => !searchQuery.trim() && !mobile && setIsExpanded(false)}
      />
    </form>
  )
}

export function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isHomepage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // The header logic: if homepage and not scrolled, transparent/dark text (we will just invert text if needed, spec says: "inverts to dark over imagery", but wait, "header floats transparent over it with white/light text and icons ... crossfades to solid cream ... once scrolled").
  // So:
  const isTransparent = isHomepage && !scrolled

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex flex-col transition-colors duration-400 ease-default",
        isTransparent ? "bg-transparent border-transparent text-white" : "bg-[var(--color-cream-base)] border-b border-[var(--color-border-subtle)] text-[var(--color-ink-900)]"
      )}
    >
      <div className="w-full max-w-[var(--container-max)] mx-auto px-4 md:px-6 xl:px-6 relative">
        
        {/* TOP ROW - 80px */}
        <div className="grid grid-cols-3 items-center h-[80px]">
          
          {/* Left: Sign In & Location (Desktop) / Hamburger (Mobile) */}
          <div className="flex items-center gap-[var(--space-5)] justify-start">
            <Button 
              variant="icon" 
              size="icon"
              className="lg:hidden text-inherit hover:bg-[var(--color-cream-deep)]/20"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} strokeWidth={1.5} />
            </Button>

            <div className="hidden lg:flex items-center gap-[var(--space-5)]">
              {user ? (
                <div className="flex items-center gap-3">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className="h-8 w-8 rounded-[var(--radius-pill)] object-cover" />
                  ) : (
                    <div className="h-8 w-8 rounded-[var(--radius-pill)] bg-[var(--color-slate-100)] text-[var(--color-slate-700)] flex items-center justify-center font-bold text-caption">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <Button variant="ghost" onClick={logout} className="text-inherit hover:text-[var(--color-terracotta-600)] p-0 h-auto">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-inherit hover:text-[var(--color-terracotta-600)] px-0"
                >
                  Sign In
                </Button>
              )}
              
              <div className="flex items-center gap-[var(--space-2)] text-body-md text-inherit cursor-pointer hover:text-[var(--color-terracotta-600)] transition-colors">
                <MapPin size={20} strokeWidth={1.5} />
                <span>New York</span>
              </div>
            </div>
          </div>

          {/* Center: Logo */}
          <div className="flex justify-center">
            <Link href="/" className="flex items-center">
              <span className={cn(
                "text-display-md font-semibold tracking-[-0.01em] transition-colors duration-250 ease-default",
                isTransparent ? "text-white" : "text-[var(--color-ink-900)]"
              )}>
                BidCraft
              </span>
            </Link>
          </div>

          {/* Right: Wishlist, Cart */}
          <div className="flex items-center gap-[var(--space-5)] justify-end">
            <Button variant="icon" size="icon" className="text-inherit hover:bg-black/5" aria-label="Wishlist">
              <Heart size={20} strokeWidth={1.5} />
            </Button>

            <Button variant="icon" size="icon" className="relative text-inherit hover:bg-black/5" aria-label="Cart">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <div className="absolute top-1 right-1 h-[14px] w-[14px] flex items-center justify-center bg-[var(--color-terracotta-600)] rounded-full text-white text-[9px] font-bold">
                2
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW (Desktop Only) - Category Bar - 56px */}
      <div 
        className={cn(
          "hidden lg:flex border-t border-[var(--color-border-subtle)] h-[56px] w-full transition-all duration-400 ease-default",
          isTransparent ? "bg-transparent opacity-0 pointer-events-none" : "bg-[var(--color-cream-base)] opacity-100"
        )} 
        onMouseLeave={() => setHoveredCategory(null)}
      >
        <div className="w-full max-w-[var(--container-max)] mx-auto px-6 flex items-center justify-between">
          <div className="flex-1" />
          {/* Categories Centered */}
          <div className="flex items-center gap-[40px] h-full justify-center shrink-0">
            {categoriesData.map((cat) => (
              <div 
                key={cat.name} 
                className="h-full flex items-center relative group"
                onMouseEnter={() => setHoveredCategory(cat.name)}
              >
                <Link 
                  href={cat.href}
                  className={cn(
                    "text-body-md font-medium transition-colors duration-150 ease-default relative py-[16px]",
                    hoveredCategory === cat.name ? "text-[var(--color-terracotta-600)]" : "text-[var(--color-ink-700)]"
                  )}
                >
                  {cat.name}
                  <span className={cn(
                    "absolute bottom-[8px] left-1/2 -translate-x-1/2 h-[2px] bg-[var(--color-terracotta-600)] transition-all duration-150 ease-default",
                    hoveredCategory === cat.name ? "w-full" : "w-0"
                  )} />
                </Link>
                
                {/* Mega Menu Dropdown */}
                <div 
                  className={cn(
                    "absolute top-[56px] left-1/2 -translate-x-1/2 w-[var(--container-max)] max-w-[95vw] bg-[var(--color-white)] rounded-b-[var(--radius-lg)] shadow-[var(--shadow-modal)] p-8 transition-all duration-250 ease-default z-50 overflow-hidden",
                    hoveredCategory === cat.name ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 delay-150"
                  )}
                >
                  <div className="grid grid-cols-4 gap-8">
                    {/* Columns 1-3: Subcategories (Simulated logic to split into 3 cols) */}
                    {[0, 1, 2].map((colIndex) => {
                      const itemsPerCol = Math.ceil(cat.subcategories.length / 3);
                      const items = cat.subcategories.slice(colIndex * itemsPerCol, (colIndex + 1) * itemsPerCol);
                      
                      if (items.length === 0) return <div key={colIndex} />;

                      return (
                        <div key={colIndex} className="flex flex-col gap-3">
                          <h4 className="text-heading-sm text-[var(--color-ink-900)] mb-2">{colIndex === 0 ? "Categories" : "More"}</h4>
                          {items.map(sub => (
                            <Link 
                              key={sub}
                              href={`${cat.href}?subcategory=${encodeURIComponent(sub.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'))}`}
                              className="text-body-md text-[var(--color-ink-700)] hover:text-[var(--color-terracotta-600)] transition-colors duration-150"
                            >
                              {sub}
                            </Link>
                          ))}
                        </div>
                      )
                    })}

                    {/* Column 4: Editorial Promo Tile */}
                    <div className="col-span-1">
                      <Link href={cat.href} className="block group/promo h-full min-h-[200px] w-full rounded-[var(--radius-md)] overflow-hidden relative">
                        <img src="https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=400&auto=format&fit=crop" alt="Promo" className="absolute inset-0 w-full h-full object-cover transition-transform duration-400 ease-default group-hover/promo:scale-105" />
                        <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-end">
                          <span className="text-caption text-white/80 uppercase tracking-wider mb-1">Featured</span>
                          <span className="text-heading-sm text-white">Curated {cat.name} Collection</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex-1 flex justify-end items-center h-full">
            <Suspense fallback={<div className="w-8 h-8" />}>
              <SearchBar />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Mobile Persistent Search (Shows only when not transparent and on mobile) */}
      <div className={cn(
        "lg:hidden w-full px-4 pb-3 transition-colors duration-400 ease-default",
        isTransparent ? "hidden" : "bg-[var(--color-cream-base)]"
      )}>
        <Suspense fallback={<div className="w-full h-[44px] bg-[var(--color-cream-deep)] rounded-[var(--radius-pill)]" />}>
          <SearchBar mobile={true} />
        </Suspense>
      </div>

      {/* Mobile Drawer */}
      <div className={cn(
        "fixed inset-0 z-[100] lg:hidden transition-all duration-250 ease-default",
        isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      )}>
        <div className="absolute inset-0 bg-[var(--color-ink-900)]/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={cn(
          "absolute top-0 left-0 w-[85%] max-w-[360px] h-full bg-[var(--color-cream-base)] shadow-[var(--shadow-modal)] transition-transform duration-250 ease-emphasis flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-6 flex items-center justify-between border-b border-[var(--color-border-subtle)]">
            <Button variant="ghost" onClick={() => setIsMobileMenuOpen(false)} className="px-0 text-[var(--color-ink-900)] h-auto">
              {user ? "Sign Out" : "Sign In"}
            </Button>
            <Button variant="icon" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} strokeWidth={1.5} />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {categoriesData.map((cat) => (
              <div key={cat.name} className="border-b border-[var(--color-border-subtle)]">
                <Link 
                  href={cat.href} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex items-center justify-between h-[56px] px-6 text-heading-sm text-[var(--color-ink-900)] hover:bg-[var(--color-cream-deep)]"
                >
                  {cat.name}
                  <ChevronRight size={20} strokeWidth={1.5} className="text-[var(--color-ink-500)]" />
                </Link>
              </div>
            ))}

            <div className="p-6 flex flex-col gap-4">
              <Link href="#" className="text-body-md text-[var(--color-ink-500)] hover:text-[var(--color-terracotta-600)]">Wishlist</Link>
              <Link href="#" className="text-body-md text-[var(--color-ink-500)] hover:text-[var(--color-terracotta-600)]">Help</Link>
              <Link href="#" className="text-body-md text-[var(--color-ink-500)] hover:text-[var(--color-terracotta-600)]">About</Link>
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  )
}
