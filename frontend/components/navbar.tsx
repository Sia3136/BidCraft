'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, Heart, ShoppingBag, Bell, MapPin, X, User, Store, Package, LogOut } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { CloudinaryImage } from '@/components/CloudinaryImage'

const categories = ['Art', 'Handmade & Crafts', 'Collectibles', 'Gaming & Hobby', 'Lifestyle & Gifts']

const megaMenuData: Record<string, string[]> = {
  'Art': ['Paintings', 'Sketches & Drawings', 'Digital Art', 'Illustrations', 'Prints & Posters', 'Sculptures'],
  'Handmade & Crafts': ['Handmade Decor', 'Crochet & Knitting', 'Resin Art', 'Clay & Pottery', 'DIY Creations', 'Candles & Soaps', 'Paper Crafts'],
  'Collectibles': ['Action Figures', 'Trading Cards', 'Coins', 'Stamps', 'Funko Pops', 'LEGO Collectibles', 'Hot Wheels'],
  'Gaming & Hobby': ['Gaming Merchandise', 'Board Games', 'Model Kits', 'Anime Merchandise', 'Cosplay Props', 'Trading Card Games', 'Puzzle Collections'],
  'Lifestyle & Gifts': ['Jewelry', 'Home Decor', 'Keychains', 'Accessories', 'Stationery', 'Personalized Gifts', 'Miniatures']
}

const exploreData = [
  { label: 'Trending This Week', route: '/explore/trending' },
  { label: "Editor's Picks", route: '/explore/editors-picks' },
  { label: 'New Arrivals', route: '/explore/new-arrivals' },
  { label: 'Most Wishlisted', route: '/explore/most-wishlisted' },
  { label: 'Auctions Ending Soon', route: '/explore/auctions-ending' },
  { label: 'Rare Finds', route: '/explore/rare-finds' },
  { label: 'Gift Ideas', route: '/explore/gift-ideas' },
  { label: 'Featured Creators', route: '/explore/featured-creators' },
  { label: 'Creator Spotlights', route: '/explore/creator-spotlights' },
  { label: 'Seasonal Collections', route: '/explore/seasonal' },
]

export const Navbar = React.memo(function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const isHomepage = pathname === '/'
  
  const { user, location, cart, wishlist, notifications, logout, setLocation } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [openDropdown, setOpenDropdown] = useState<'notifications' | 'profile' | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null) // null, 'Explore', or category name
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false)
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const megaMenuRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const wishlistCount = wishlist.length
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveCategory(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveCategory(null)
        setOpenDropdown(null)
        setIsMobileSearchExpanded(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    // Close dropdowns on route change
    setActiveCategory(null)
    setOpenDropdown(null)
    setIsMobileSearchExpanded(false)
  }, [pathname])

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(prev => prev === cat ? null : cat)
  }

  const textClass = "text-[var(--color-ink-700)] hover:text-[var(--color-terracotta-600)]"
  
  const NotificationsDropdown = () => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="absolute top-full right-0 mt-2 w-[320px] max-h-[420px] overflow-y-auto bg-[var(--color-white)] rounded-[var(--radius-md)] shadow-[var(--shadow-modal)] z-50 flex flex-col border border-[var(--color-border-subtle)] hide-scrollbar"
    >
      <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between sticky top-0 bg-[var(--color-white)] z-10">
        <h3 className="text-heading-sm text-[var(--color-ink-900)]">What's Happening</h3>
        {user && <button className="text-caption text-[var(--color-ink-500)] hover:text-[var(--color-terracotta-600)]">Mark all read</button>}
      </div>
      
      <div className="flex flex-col">
        {!user && (
          <>
            <div className="p-4 flex gap-3 hover:bg-[var(--color-cream-raised)] transition-colors border-b border-[var(--color-border-subtle)] cursor-pointer">
              <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--color-cream-deep)] overflow-hidden shrink-0">
                <CloudinaryImage publicId="cat-hotwheels" width={40} height={40} alt="alert" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-body-md text-[var(--color-ink-900)] leading-snug">New Hot Wheels Treasure Hunt auction is now live!</p>
                <p className="text-caption text-[var(--color-ink-500)] mt-1">2 mins ago</p>
              </div>
            </div>
            <div className="p-4 text-center">
              <p className="text-caption text-[var(--color-ink-500)] mb-2">Sign in to get personalised alerts</p>
              <Link href="/auth" onClick={() => setOpenDropdown(null)} className="text-body-md font-medium text-[var(--color-terracotta-600)] hover:underline">
                Sign In
              </Link>
            </div>
          </>
        )}
        
        {user && (
          notifications.length > 0 ? notifications.map(n => (
            <div key={n.id} className={cn("p-4 flex gap-3 hover:bg-[var(--color-cream-raised)] transition-colors border-b border-[var(--color-border-subtle)] cursor-pointer relative", !n.read && "bg-[var(--color-cream-raised)]")}>
              {!n.read && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-terracotta-600)]" />}
              <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--color-cream-deep)] flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-[var(--color-terracotta-600)]" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-body-md text-[var(--color-ink-900)] leading-snug">{n.message}</p>
                <p className="text-caption text-[var(--color-ink-500)] mt-1">Just now</p>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-body-md text-[var(--color-ink-500)]">No new notifications</div>
          )
        )}
      </div>
    </motion.div>
  )

  const ProfileDropdown = () => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="absolute top-full right-0 mt-2 w-[240px] bg-[var(--color-white)] rounded-[var(--radius-md)] shadow-[var(--shadow-modal)] py-2 border border-[var(--color-border-subtle)] z-50 flex flex-col"
    >
      <div className="px-4 py-4 border-b border-[var(--color-border-subtle)] mb-2 flex flex-col items-center bg-[var(--color-cream-raised)] mx-2 rounded-[var(--radius-md)]">
        <div className="w-12 h-12 rounded-full bg-[var(--color-terracotta-600)] text-white flex items-center justify-center text-heading-lg font-display mb-2">
          {user?.name.charAt(0).toUpperCase()}
        </div>
        <p className="text-heading-sm text-[var(--color-ink-900)] text-center w-full truncate">{user?.name}</p>
        <p className="text-caption text-[var(--color-ink-500)] text-center w-full truncate">{user?.email}</p>
      </div>
      
      <Link href="/orders" onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 px-4 h-[44px] text-body-md text-[var(--color-ink-700)] hover:bg-[var(--color-cream-raised)] hover:text-[var(--color-terracotta-600)] transition-colors">
        <Package className="w-5 h-5" strokeWidth={1.5} />
        Previous Orders
      </Link>
      <Link href="/settings" onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 px-4 h-[44px] text-body-md text-[var(--color-ink-700)] hover:bg-[var(--color-cream-raised)] hover:text-[var(--color-terracotta-600)] transition-colors">
        <User className="w-5 h-5" strokeWidth={1.5} />
        Account Info
      </Link>
      <Link href="/sell" onClick={() => setOpenDropdown(null)} className="flex items-center gap-3 px-4 h-[44px] text-body-md text-[var(--color-ink-700)] hover:bg-[var(--color-cream-raised)] hover:text-[var(--color-terracotta-600)] transition-colors">
        <Store className="w-5 h-5" strokeWidth={1.5} />
        Be a Seller
      </Link>
      
      <div className="h-px bg-[var(--color-border-subtle)] my-2" />
      
      <button onClick={() => { logout(); setOpenDropdown(null); router.push('/') }} className="flex items-center gap-3 w-full text-left px-4 h-[44px] text-body-md text-[var(--color-urgent-700)] hover:bg-[var(--color-urgent-100)] transition-colors">
        <LogOut className="w-5 h-5" strokeWidth={1.5} />
        Sign Out
      </button>
    </motion.div>
  )

  return (
    <>
      <div className="h-[128px] md:h-[136px]" /> {/* Spacer for fixed header (80px + 56px approx) */}
      <header 
        ref={navRef}
        className={cn(
          "w-full fixed top-0 z-50 transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] border-b",
          (isHomepage && !isScrolled)
            ? "bg-transparent border-transparent" 
            : "bg-[rgba(253,251,247,0.92)] backdrop-blur-[12px] saturate-[1.4] shadow-[0_1px_0_var(--color-border-subtle),0_4px_16px_rgba(43,42,40,0.08)] border-transparent"
        )}
      >
        {/* Row 1 */}
        <div className="h-[80px] flex items-center px-[var(--space-5)] xl:px-[var(--space-8)] border-b border-[var(--color-border-subtle)]/30 relative">
          <div className="w-full max-w-[var(--container-max)] mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            
            {/* Left Zone */}
            <div className="flex items-center gap-6 justify-self-start">
              {/* Hamburger Menu (Mobile) */}
              <button 
                className="md:hidden w-[40px] h-[40px] flex items-center justify-center -ml-2"
                aria-label="Menu"
              >
                <div className="space-y-1.5">
                  <span className="block w-5 h-0.5 bg-[var(--color-ink-900)]"></span>
                  <span className="block w-5 h-0.5 bg-[var(--color-ink-900)]"></span>
                  <span className="block w-5 h-0.5 bg-[var(--color-ink-900)]"></span>
                </div>
              </button>
              
              <div className="hidden md:flex items-center gap-6">
                <Link href="/our-story" className={cn("text-body-md font-medium transition-colors duration-fast", textClass)}>
                  Our Story
                </Link>
                <Link href="/contact" className={cn("text-body-md font-medium transition-colors duration-fast", textClass)}>
                  Contact
                </Link>
                {user && location && (
                  <div className={cn("flex items-center gap-1.5 text-body-md transition-colors", textClass)}>
                    <MapPin className="w-4 h-4" strokeWidth={1.5} />
                    <span>{location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Center Zone */}
            <div className="justify-self-center">
              <Link href="/" className="text-display-lg font-display text-[var(--color-ink-900)] transition-colors">
                BidCraft
              </Link>
            </div>

            {/* Right Zone */}
            <div className="flex items-center justify-self-end gap-2 xl:gap-4 relative w-full justify-end">
              
              {/* Search Toggle (Mobile/Tablet) */}
              <button 
                onClick={() => setIsMobileSearchExpanded(!isMobileSearchExpanded)}
                className={cn("md:hidden w-[40px] h-[40px] flex items-center justify-center transition-colors", textClass)}
                aria-label="Search"
              >
                {isMobileSearchExpanded ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Search className="w-5 h-5" strokeWidth={1.5} />}
              </button>



              <div className="flex items-center gap-1 xl:gap-2 relative" ref={dropdownRef}>
                <Link 
                  href="/wishlist"
                  className={cn("w-[40px] h-[40px] flex items-center justify-center transition-colors relative", textClass)}
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5" strokeWidth={1.5} />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[var(--color-terracotta-600)] rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-scale-pulse border-[1.5px] border-transparent">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link 
                  href="/cart"
                  className={cn("w-[40px] h-[40px] flex items-center justify-center transition-colors relative", textClass)}
                  aria-label="Cart"
                >
                  <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[var(--color-terracotta-600)] rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-scale-pulse border-[1.5px] border-transparent">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <div className="relative">
                  <button 
                    onClick={() => setOpenDropdown(openDropdown === 'notifications' ? null : 'notifications')}
                    className={cn("w-[40px] h-[40px] flex items-center justify-center transition-colors relative", textClass)}
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" strokeWidth={1.5} />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[var(--color-urgent-600)] rounded-full border-[1.5px] border-transparent" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openDropdown === 'notifications' && <NotificationsDropdown />}
                  </AnimatePresence>
                </div>

                {user ? (
                  <div className="relative ml-1">
                    <button 
                      onClick={() => setOpenDropdown(openDropdown === 'profile' ? null : 'profile')}
                      className="w-[36px] h-[36px] rounded-full bg-[var(--color-terracotta-600)] text-white flex items-center justify-center text-heading-sm font-display ring-2 ring-transparent focus:ring-[rgba(200,100,58,0.3)] transition-all"
                      aria-label="User menu"
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </button>
                    <AnimatePresence>
                      {openDropdown === 'profile' && <ProfileDropdown />}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link 
                    href="/auth"
                    className="ml-2 bg-[var(--color-terracotta-600)] text-white text-body-md font-semibold px-[24px] py-[10px] rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors duration-fast whitespace-nowrap"
                  >
                    Sign In
                  </Link>
                )}
              </div>
              
              {/* Mobile Expanded Search Bar */}
              <AnimatePresence>
                {isMobileSearchExpanded && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 top-[80px] w-full h-[44px] bg-[var(--color-white)] border-b border-[var(--color-border-subtle)] px-4 flex items-center z-10 overflow-hidden md:hidden"
                  >
                    <Search className="w-4 h-4 text-[var(--color-ink-500)] shrink-0 mr-2" strokeWidth={1.5} />
                    <input 
                      type="text"
                      placeholder="Search BidCraft..."
                      autoFocus
                      className="w-full bg-transparent border-none outline-none text-body-md text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          router.push(`/explore?search=${searchQuery}`)
                          setIsMobileSearchExpanded(false)
                        }
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        {/* Row 2 - Explore + Categories Nav */}
        <div className="relative hidden md:block border-b border-[var(--color-border-subtle)]/30 bg-[var(--color-cream-base)]">
          <div className="w-full max-w-[var(--container-max)] mx-auto flex items-center justify-between h-[56px] px-[var(--space-5)]">
            <div className="flex items-center gap-[32px] h-full pl-[48px]">
              
              {/* Explore Toggle */}
              <button 
                onClick={() => handleCategoryClick('Explore')}
                className={cn("h-full flex items-center gap-1 text-body-md font-medium transition-colors relative", activeCategory === 'Explore' ? "text-[var(--color-terracotta-600)]" : textClass)}
              >
                Explore ▾
                {activeCategory === 'Explore' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-terracotta-600)]" />}
              </button>

              <div className="h-[16px] w-[1px] bg-[var(--color-border-subtle)]" />

              {/* Categories */}
              {categories.map((category) => (
                <button 
                  key={category} 
                  onClick={() => handleCategoryClick(category)}
                  className={cn("h-full flex items-center text-body-md font-medium transition-colors relative", activeCategory === category ? "text-[var(--color-terracotta-600)]" : textClass)}
                >
                  {category}
                  {activeCategory === category && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-terracotta-600)]" />}
                </button>
              ))}

              <div className="h-[16px] w-[1px] bg-[var(--color-border-subtle)]" />

              <Link href="/explore" className="text-caption font-medium text-[var(--color-ink-500)] hover:text-[var(--color-terracotta-600)] transition-colors">
                Explore All →
              </Link>
            </div>

            {/* Search Bar (Row 2 Desktop) */}
            <div className="flex items-center lg:w-[200px] xl:w-[260px] h-[36px] bg-[var(--color-cream-deep)] border border-[var(--color-border-subtle)] rounded-[var(--radius-pill)] px-3 transition-all duration-fast focus-within:border-[var(--color-terracotta-600)] focus-within:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] shrink-0">
              <Search className="w-4 h-4 text-[var(--color-ink-500)] shrink-0" strokeWidth={1.5} />
              <input 
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent border-none outline-none ml-2 text-body-md text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && router.push(`/explore?search=${searchQuery}`)}
              />
            </div>
          </div>

          {/* Mega Menu Dropdown */}
          <AnimatePresence>
            {activeCategory && (
              <motion.div
                ref={megaMenuRef}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className={cn(
                  "absolute top-[56px] left-1/2 -translate-x-1/2 bg-[var(--color-white)] rounded-b-[var(--radius-lg)] shadow-[var(--shadow-modal)] border border-t-0 border-[var(--color-border-subtle)] z-[100] overflow-hidden p-[var(--space-5)]",
                  activeCategory === 'Explore' ? "w-full max-w-[480px]" : "w-full max-w-[min(900px,100vw)]"
                )}
              >
                {activeCategory === 'Explore' ? (
                  /* Explore Menu Grid */
                  <div className="grid grid-cols-2 gap-x-[var(--space-6)] gap-y-1">
                    {exploreData.map((item) => (
                      <Link 
                        key={item.label}
                        href={item.route}
                        onClick={() => setActiveCategory(null)}
                        className="text-body-md text-[var(--color-ink-700)] h-[36px] flex items-center px-2 rounded-[var(--radius-sm)] hover:bg-[var(--color-cream-deep)] hover:text-[var(--color-terracotta-600)] transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  /* Category Menu Columns (Fix 2c) */
                  <div className="grid grid-cols-3 gap-[var(--space-6)] relative">
                    <div className="col-span-3 mb-[var(--space-3)]">
                      <h3 className="text-heading-sm font-semibold text-[var(--color-ink-900)]">{activeCategory}</h3>
                    </div>
                    
                    {Array.from({ length: 3 }).map((_, colIndex) => {
                      const links = megaMenuData[activeCategory] || []
                      const itemsPerCol = Math.ceil(links.length / 3)
                      const colLinks = links.slice(colIndex * itemsPerCol, (colIndex + 1) * itemsPerCol)
                      
                      return (
                        <div key={colIndex} className="flex flex-col gap-1">
                          {colLinks.map(link => (
                            <Link 
                              key={link} 
                              href={`/category/${activeCategory.toLowerCase().replace(/ /g, '-').replace('&-', '')}?subcategory=${link.toLowerCase().replace(/ /g, '-')}`} 
                              onClick={() => setActiveCategory(null)}
                              className="text-body-md text-[var(--color-ink-700)] h-[36px] flex items-center px-2 rounded-[var(--radius-sm)] hover:bg-[var(--color-cream-deep)] hover:text-[var(--color-terracotta-600)] transition-colors"
                            >
                              {link}
                            </Link>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  )
})
