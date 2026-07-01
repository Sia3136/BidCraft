'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, Heart, ShoppingBag, Bell, MapPin, ChevronDown, User, Store, Package, LogOut } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { CloudinaryImage } from '@/components/CloudinaryImage'

const categories = ['Art', 'Crafts', 'Hot Wheels', 'Collectibles', 'Handmade & Lifestyle', 'Hobby & Gaming']

const megaMenuData: Record<string, string[]> = {
  'Art': ['Drawing & Illustration', 'Painting (Oil/Watercolour/Acrylic)', 'Digital Art Prints', 'Sculpture', 'Photography Prints', 'Mixed Media', 'Commissioned Portraits'],
  'Crafts': ['Crochet & Knitting', 'Resin Art', 'Macramé', 'Candle Making', 'Pottery & Ceramics', 'Paper Crafts', 'Embroidery'],
  'Hot Wheels': ['Treasure Hunts', 'Super Treasure Hunts', 'Mainline Series', 'Premium Cars', 'Custom Hot Wheels', 'Vintage Redlines', 'Case & Display Accessories'],
  'Collectibles': ['Action Figures', 'Trading Cards', 'Stamps & Coins', 'Vintage Toys', 'Anime Figurines', 'Movie Memorabilia', 'Sports Collectibles'],
  'Handmade & Lifestyle': ['Handmade Jewellery', 'Home Décor', 'Personalised Gifts', 'Organic & Natural Products', 'Stationery', 'Bags & Accessories', 'Festive & Seasonal'],
  'Hobby & Gaming': ['Board Games', 'Miniatures & Wargaming', 'Puzzles', 'RC Models', 'Vintage Video Games', 'Comic Books', 'DIY & Craft Kits']
}

const promoTiles: Record<string, { img: string, title: string }> = {
  'Art': { img: 'cat-art', title: 'Curated Masterpieces' },
  'Crafts': { img: 'cat-crafts', title: 'Handcrafted With Love' },
  'Hot Wheels': { img: 'cat-hotwheels', title: 'Rare Finds' },
  'Collectibles': { img: 'cat-collectibles', title: 'Vintage Wonders' },
  'Handmade & Lifestyle': { img: 'cat-handmade', title: 'Everyday Essentials' },
  'Hobby & Gaming': { img: 'cat-hobby', title: 'Level Up Your Game' }
}

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const isHomepage = pathname === '/'
  
  const { user, location, cart, wishlist, notifications, logout, setLocation } = useStore()
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [openDropdown, setOpenDropdown] = useState<'notifications' | 'profile' | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const megaMenuRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (user && !location) {
      const cachedLocation = localStorage.getItem('bidcraft_user_location')
      if (cachedLocation) {
        setLocation(cachedLocation)
      } else {
        setLocation('Detecting...')
        fetch('https://ipapi.co/json/')
          .then((res) => res.json())
          .then((data) => {
            if (data.city) {
              const city = data.city
              localStorage.setItem('bidcraft_user_location', city)
              setLocation(city)
            } else {
              setLocation('Unknown')
            }
          })
          .catch(() => setLocation('Unknown'))
      }
    }
  }, [user, location, setLocation])

  const handleCategoryMouseEnter = (cat: string) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    setActiveCategory(cat)
  }

  const handleCategoryMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null)
    }, 120)
  }

  // Text is always dark as per latest UI requirement
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
        className={cn(
          "w-full fixed top-0 z-50 transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] border-b",
          (isHomepage && !isScrolled)
            ? "bg-transparent border-transparent" 
            : "bg-[rgba(253,251,247,0.92)] backdrop-blur-[12px] saturate-[1.4] shadow-[0_1px_0_var(--color-border-subtle),0_4px_16px_rgba(43,42,40,0.08)] border-transparent"
        )}
        onMouseLeave={handleCategoryMouseLeave}
      >
        {/* Row 1 */}
        <div className="h-[80px] flex items-center px-[var(--space-5)] xl:px-[var(--space-8)] border-b border-[var(--color-border-subtle)]/30">
          <div className="w-full max-w-[var(--container-max)] mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            
            {/* Left Zone */}
            <div className="flex items-center gap-6 justify-self-start">
              <Link href="/our-story" className={cn("text-body-md font-medium transition-colors duration-fast", textClass)}>
                Our Story
              </Link>
              <Link href="/contact" className={cn("text-body-md font-medium transition-colors duration-fast", textClass)}>
                Contact
              </Link>
              {user && location && (
                <div className={cn("flex items-center gap-1.5 text-body-md transition-colors hidden sm:flex", textClass)}>
                  <MapPin className="w-4 h-4" strokeWidth={1.5} />
                  <span>{location}</span>
                </div>
              )}
            </div>

            {/* Center Zone */}
            <div className="justify-self-center">
              <Link href="/" className="text-display-lg font-display text-[var(--color-ink-900)] transition-colors">
                BidCraft
              </Link>
            </div>

            {/* Right Zone */}
            <div className="flex items-center justify-self-end relative" ref={dropdownRef}>
              
              <div className="flex flex-col items-end">
                {/* Action Icons */}
                <div className="flex items-center gap-2 xl:gap-3">
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

              </div>

            </div>
          </div>
        </div>
        
        {/* Row 2 / Sub-nav container */}
        <div className="relative hidden md:block border-b border-[var(--color-border-subtle)]/30 bg-[var(--color-cream-base)]">
          <div className="w-full max-w-[var(--container-max)] mx-auto flex items-center justify-between px-[var(--space-5)] xl:px-[var(--space-8)] h-[56px]">
            
            {/* Centered Categories - Needs to be absolute to be truly centered if right side has width */}
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              <div className="flex items-center gap-[40px] pointer-events-auto h-full">
                {categories.map((category) => (
                  <div 
                    key={category} 
                    className="h-[56px] flex items-center group relative cursor-pointer"
                    onMouseEnter={() => handleCategoryMouseEnter(category)}
                  >
                    <Link href={`/category/${category.toLowerCase().replace(/ /g, '-')}`} className={cn("text-body-md font-medium transition-colors duration-fast", activeCategory === category ? "text-[var(--color-terracotta-600)]" : textClass)}>
                      {category}
                    </Link>
                    <span className={cn("absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[var(--color-terracotta-600)] transition-all duration-fast ease-out", activeCategory === category ? "w-full" : "w-0 group-hover:w-full")} />
                  </div>
                ))}
              </div>
            </div>

            {/* Empty Left Placeholder to balance flex */}
            <div className="w-[200px]" />

            {/* Right side - Search bar directly under action buttons */}
            <div className="w-[300px] xl:w-[320px] pointer-events-auto z-10 flex justify-end">
              <div className={cn(
                "flex items-center w-full h-[40px] bg-[var(--color-white)] border rounded-[var(--radius-pill)] px-4 transition-all duration-fast",
                isSearchFocused ? "border-[var(--color-terracotta-600)] shadow-[0_0_0_3px_rgba(200,100,58,0.12)]" : "border-[var(--color-border-subtle)]"
              )}>
                <Search className="w-4 h-4 text-[var(--color-ink-500)] shrink-0" strokeWidth={1.5} />
                <input 
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-transparent border-none outline-none ml-2 text-body-md text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)]"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

          </div>

          {/* Autocomplete absolute positioned */}
          <AnimatePresence>
            {isSearchFocused && searchQuery.length >= 2 && (
              <motion.div 
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute top-[60px] right-[var(--space-5)] xl:right-[var(--space-8)] w-[320px] bg-[var(--color-white)] rounded-[var(--radius-md)] shadow-[var(--shadow-modal)] border border-[var(--color-border-subtle)] overflow-hidden z-[100]"
              >
                <div className="p-2">
                  <div className="flex items-center gap-3 p-2 hover:bg-[var(--color-cream-raised)] rounded-[var(--radius-sm)] cursor-pointer transition-colors">
                    <div className="w-10 h-10 bg-[var(--color-cream-deep)] rounded-[var(--radius-sm)] animate-pulse" />
                    <div>
                      <p className="text-body-md text-[var(--color-ink-900)] line-clamp-1">Mock Product for "{searchQuery}"</p>
                      <p className="text-caption text-[var(--color-ink-500)]">Art</p>
                    </div>
                  </div>
                </div>
                <Link href={`/explore?q=${searchQuery}`} className="block w-full p-3 text-center text-body-md font-medium text-[var(--color-terracotta-600)] border-t border-[var(--color-border-subtle)] hover:bg-[var(--color-cream-base)] transition-colors">
                  See all results
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Search Bar - Collapsed under header on mobile */}
        <div className="md:hidden bg-[var(--color-cream-base)] p-3 border-b border-[var(--color-border-subtle)]">
          <div className={cn(
            "flex items-center h-[44px] bg-[var(--color-white)] border rounded-[var(--radius-pill)] px-4 transition-all duration-fast",
            isSearchFocused ? "border-[var(--color-terracotta-600)] shadow-[0_0_0_3px_rgba(200,100,58,0.12)]" : "border-[var(--color-border-subtle)]"
          )}>
            <Search className="w-5 h-5 text-[var(--color-ink-500)] shrink-0" strokeWidth={1.5} />
            <input 
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent border-none outline-none ml-2 text-body-md text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)]"
            />
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeCategory && (
            <motion.div
              ref={megaMenuRef}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="absolute top-[136px] left-1/2 -translate-x-1/2 w-full max-w-[var(--container-max)] bg-[var(--color-white)] rounded-b-[var(--radius-lg)] shadow-[var(--shadow-modal)] z-[100] overflow-hidden border-t border-[var(--color-border-subtle)]"
              onMouseEnter={() => handleCategoryMouseEnter(activeCategory)}
              onMouseLeave={handleCategoryMouseLeave}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-[var(--space-6)] gap-[var(--space-5)]">
                {/* 3 Columns of links - distributing items */}
                {Array.from({ length: 3 }).map((_, colIndex) => {
                  const links = megaMenuData[activeCategory] || []
                  const itemsPerCol = Math.ceil(links.length / 3)
                  const colLinks = links.slice(colIndex * itemsPerCol, (colIndex + 1) * itemsPerCol)
                  
                  return (
                    <div key={colIndex} className="flex flex-col">
                      {colIndex === 0 && <h3 className="text-heading-sm text-[var(--color-ink-900)] font-semibold mb-4">{activeCategory}</h3>}
                      {colIndex !== 0 && <div className="h-[40px] hidden lg:block" />}
                      <div className="flex flex-col gap-[10px]">
                        {colLinks.map(link => (
                          <Link key={link} href={`/category/${activeCategory.toLowerCase().replace(/ /g, '-')}/${link.toLowerCase().replace(/ /g, '-')}`} className="text-body-md text-[var(--color-ink-700)] hover:text-[var(--color-terracotta-600)] transition-colors">
                            {link}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                })}
                
                {/* Promo Tile (Column 4) */}
                <div className="hidden lg:block relative rounded-[var(--radius-md)] overflow-hidden aspect-[4/5]">
                  <CloudinaryImage publicId={promoTiles[activeCategory]?.img || 'cat-art'} width={300} height={400} alt={activeCategory} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-caption uppercase tracking-wider text-white/90 mb-1">Featured</p>
                    <h4 className="text-heading-sm text-white">{promoTiles[activeCategory]?.title}</h4>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
