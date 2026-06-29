'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { AuthModal } from '@/components/auth-modal'
import { NotificationBell } from '@/components/notification-bell'

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

function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')

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

  return (
    <form onSubmit={handleSearch} className="relative w-[240px] group flex items-center">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search curations..."
        className="w-full pl-3 pr-8 py-[7px] bg-transparent text-[13px] font-light text-foreground placeholder:text-muted-foreground/60 rounded-[4px] border border-border/80 focus:outline-none focus:border-foreground/40 transition-colors shadow-sm"
      />
      <button type="submit" className="absolute right-2 p-1 text-secondary-foreground hover:text-foreground transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </button>
    </form>
  )
}

export function Navbar() {
  const { user, logout } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 flex flex-col bg-[#F7F4EE]/95 backdrop-blur-md border-b border-border/40">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 w-full">
        
        {/* TOP ROW */}
        <div className="flex items-center justify-between h-[120px] relative">
          
          {/* Left: Sign In & Location */}
          <div className="flex items-center gap-8 flex-1 justify-start">
            {/* Mobile Hamburger (Only visible on small screens) */}
            <button 
              className="lg:hidden text-foreground hover:opacity-70 transition-opacity"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>

            <div className="hidden lg:flex items-center gap-8">
              {user ? (
                <div className="flex items-center gap-3">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className="w-6 h-6 rounded-full object-cover border border-border" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#171717] text-white font-bold flex items-center justify-center text-[9px]">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button 
                    onClick={logout}
                    className="text-[13px] tracking-wide font-light text-secondary-foreground hover:text-foreground transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-[13px] tracking-wide font-light text-secondary-foreground hover:text-foreground transition-colors whitespace-nowrap"
                >
                  Sign In
                </button>
              )}
              
              <div className="flex items-center gap-2 text-[13px] tracking-wide font-light text-secondary-foreground hover:text-foreground cursor-pointer transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>New York</span>
              </div>
            </div>
          </div>

          {/* Center: Logo (Absolute Center) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex justify-center">
            <Link href="/" className="flex items-center py-6 px-8">
              <span className="text-[44px] font-normal text-foreground font-brand tracking-normal hover:opacity-80 transition-opacity duration-300">BidCraft</span>
            </Link>
          </div>

          {/* Right: Wishlist, Cart, Notifications */}
          <div className="flex items-center gap-7 flex-1 justify-end">
            <button className="text-secondary-foreground hover:text-foreground hover:-translate-y-[1px] transition-all duration-200" aria-label="Wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>

            <button className="text-secondary-foreground hover:text-foreground hover:-translate-y-[1px] transition-all duration-200 relative" aria-label="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </button>
            
            <div className="hover:-translate-y-[1px] transition-all duration-200">
               <NotificationBell />
            </div>
          </div>
        </div>

        {/* BOTTOM ROW (Desktop Only) */}
        <div className="hidden lg:flex items-center justify-between h-[60px] pb-4" onMouseLeave={() => setHoveredCategory(null)}>
          
          {/* Categories: Center aligned but offset nicely */}
          <div className="flex items-center gap-12 h-full relative">
            {categoriesData.map((cat) => (
              <div 
                key={cat.name} 
                className="h-full flex items-center group/item relative"
                onMouseEnter={() => setHoveredCategory(cat.name)}
              >
                <Link 
                  href={cat.href}
                  className="text-[13px] tracking-[0.05em] font-normal text-secondary-foreground hover:text-foreground transition-colors whitespace-nowrap"
                >
                  {cat.name}
                </Link>
                
                {/* Mega Menu Dropdown */}
                <div 
                  className={`absolute top-full left-1/2 -translate-x-1/2 w-max min-w-[280px] bg-[#FFFFFF] border border-border/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[4px] px-8 py-7 transition-all duration-300 ease-out z-50 ${
                    hoveredCategory === cat.name ? 'opacity-100 visible translate-y-1' : 'opacity-0 invisible -translate-y-1'
                  }`}
                >
                  <div className="grid grid-cols-2 gap-x-14 gap-y-3">
                    {cat.subcategories.map(sub => (
                      <Link 
                        key={sub}
                        href={`${cat.href}?subcategory=${encodeURIComponent(sub.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'))}`}
                        className="text-[13px] font-light text-secondary-foreground hover:text-foreground transition-colors inline-block whitespace-nowrap"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search Box - Directly beneath the utility icons */}
          <div className="flex justify-end items-center h-full">
             <Suspense fallback={<div className="w-[240px] h-[34px] bg-transparent rounded-[4px] border border-border/80 animate-pulse"></div>}>
               <SearchBar />
             </Suspense>
          </div>
        </div>

      </div>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute top-0 left-0 w-[85%] max-w-[360px] h-full bg-background border-r border-border shadow-xl transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-8 flex items-center justify-between border-b border-border/30">
            <span className="text-3xl font-brand tracking-wide text-foreground">BidCraft</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-secondary-foreground hover:text-foreground transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-10">
            <div className="mb-2">
              <Suspense fallback={<div className="w-full h-[34px] bg-transparent rounded-[4px] border border-border/80 animate-pulse"></div>}>
                <div className="w-full relative">
                  <SearchBar />
                </div>
              </Suspense>
            </div>
            {categoriesData.map((cat) => (
              <div key={cat.name} className="space-y-4">
                <Link href={cat.href} onClick={() => setIsMobileMenuOpen(false)} className="block text-[17px] font-medium text-foreground tracking-wide">
                  {cat.name}
                </Link>
                <div className="flex flex-col space-y-4 pl-0">
                  {cat.subcategories.map(sub => (
                    <Link 
                      key={sub}
                      href={`${cat.href}?subcategory=${encodeURIComponent(sub.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'))}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[14px] font-light text-secondary-foreground hover:text-foreground transition-colors"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="pt-10 mt-10 border-t border-border/30 flex items-center gap-8">
               <NotificationBell />
               <div className="flex items-center gap-2 text-[14px] font-light text-secondary-foreground">
                 <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                 New York
               </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  )
}
