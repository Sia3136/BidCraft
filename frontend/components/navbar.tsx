'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { AuthModal } from '@/components/auth-modal'
import { NotificationBell } from '@/components/notification-bell'

const categoriesData = [
  {
    name: 'Art',
    href: '/category/art',
    subcategories: ['Paintings', 'Sketches & Drawings', 'Digital Art', 'Illustrations', 'Prints & Posters', 'Sculptures', 'Calligraphy']
  },
  {
    name: 'Crafts',
    href: '/category/crafts',
    subcategories: ['Handmade Decor', 'Crochet & Knitting', 'Resin Art', 'Clay & Pottery', 'DIY Creations', 'Candles & Soaps', 'Paper Crafts']
  },
  {
    name: 'Hot Wheels',
    href: '/category/hot-wheels',
    subcategories: ['Premium Series', 'Mainline', 'Treasure Hunts', 'Super Treasure Hunts', 'Limited Editions', 'Vintage Models', 'Custom Hot Wheels']
  },
  {
    name: 'Collectibles',
    href: '/category/collectibles',
    subcategories: ['Action Figures', 'Trading Cards', 'Coins', 'Stamps', 'Funko Pops', 'LEGO Collectibles', 'Vintage Memorabilia']
  },
  {
    name: 'Handmade & Lifestyle',
    href: '/category/handmade-lifestyle',
    subcategories: ['Jewelry', 'Home Decor', 'Keychains', 'Accessories', 'Stationery', 'Personalized Gifts', 'Miniatures']
  },
  {
    name: 'Hobby & Gaming',
    href: '/category/hobby-gaming',
    subcategories: ['Gaming Merchandise', 'Board Games', 'Model Kits', 'Anime Merchandise', 'Cosplay Props', 'Trading Card Games', 'Puzzle Collections']
  }
];

function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const q = searchParams.get('search')
    if (q) {
      setSearchQuery(q)
    }
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
    <form onSubmit={handleSearch} className="relative w-full max-w-2xl group">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search art, crafts, collectibles and more..."
        className="w-full pl-5 pr-12 py-2.5 bg-muted/40 text-[14px] text-foreground placeholder:text-muted-foreground rounded-full border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all group-hover:border-foreground/20 shadow-sm"
      />
      <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-white rounded-full hover:bg-[#2B2B2B] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </button>
    </form>
  )
}

function CategoryNav() {
  const pathname = usePathname()
  
  return (
    <div className="border-t border-border bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center justify-center gap-8 overflow-x-auto py-1 no-scrollbar">
          {categoriesData.map((category) => {
            const isActive = pathname.startsWith(category.href)
            return (
              <li key={category.name} className="group">
                <Link 
                  href={category.href}
                  className={`inline-block py-2 text-[14px] font-medium transition-colors relative ${isActive ? 'text-foreground' : 'text-secondary-foreground hover:text-foreground'}`}
                >
                  {category.name}
                  <div className={`absolute bottom-0 left-0 h-[2px] bg-foreground transition-all duration-300 ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'}`}></div>
                </Link>

                {/* Mega Dropdown */}
                <div className="absolute left-0 top-full w-full bg-card border-b border-border shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pt-8 pb-10 px-8 origin-top scale-95 group-hover:scale-100">
                  <div className="max-w-7xl mx-auto flex justify-center">
                    <div className="w-full max-w-5xl">
                      <h3 className="text-left font-brand text-xl mb-6 tracking-wide text-foreground">{category.name}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-4 text-left">
                        {category.subcategories.map(sub => (
                          <Link 
                            key={sub} 
                            href={`${category.href}?subcategory=${encodeURIComponent(sub.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'))}`}
                            className="text-[13px] text-secondary-foreground hover:text-foreground hover:translate-x-0.5 transition-all block"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export function Navbar() {
  const { user, logout } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 flex flex-col bg-background">
      {/* Top Layer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-20 gap-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-3xl font-medium text-foreground font-brand tracking-[0.05em]">BidCraft</span>
          </Link>

          {/* Search Bar - Center */}
          <div className="flex-1 hidden md:flex justify-center px-4">
            <Suspense fallback={<div className="h-10 bg-muted rounded-full animate-pulse w-full max-w-2xl"></div>}>
              <SearchBar />
            </Suspense>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Sign In / User Menu */}
            {user ? (
              <div className="flex items-center gap-3">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-border" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-foreground text-white font-bold flex items-center justify-center text-[11px]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col items-start hidden xl:flex mr-2">
                  <span className="text-[13px] font-semibold text-foreground">{user.name}</span>
                </div>
                <button 
                  onClick={logout}
                  className="text-[13px] font-medium text-secondary-foreground hover:text-foreground transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="text-[14px] font-medium text-foreground hover:opacity-80 transition-opacity whitespace-nowrap"
              >
                Sign In
              </button>
            )}

            {/* Location (Compact) */}
            <div className="hidden lg:flex items-center gap-1.5 text-[14px] font-medium text-secondary-foreground hover:text-foreground cursor-pointer transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>New York</span>
            </div>

            {/* Wishlist */}
            <button className="text-secondary-foreground hover:text-foreground transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>

            {/* Cart */}
            <button className="text-secondary-foreground hover:text-foreground transition-colors relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </button>
            
            <div className="hidden sm:block">
              <NotificationBell />
            </div>
          </div>
        </div>
      </div>

      {/* Second Layer - Category Nav */}
      <CategoryNav />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  )
}
