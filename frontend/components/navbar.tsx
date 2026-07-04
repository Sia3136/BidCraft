'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, Heart, ShoppingBag, Bell, MapPin, X, User, Store, Package, LogOut, Menu } from 'lucide-react'
import { useStore } from '@/lib/store'
import { slugify } from '@/lib/slugify'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { CloudinaryImage } from '@/components/CloudinaryImage'
import Image from 'next/image'

const categories = [
  { name: 'Art', slug: 'art', subcategories: ['Paintings', 'Sketches & Drawings', 'Digital Art & Illustrations', 'Prints & Posters', 'Sculptures'] },
  { name: 'Handmade & Crafts', slug: 'handmade-crafts', subcategories: ['Crochet & Knitting', 'Resin Art', 'Clay & Pottery', 'Candles & Soaps', 'Paper Crafts'] },
  { name: 'Collectibles', slug: 'collectibles', subcategories: ['Action Figures', 'Trading Cards', 'Funko Pops', 'Hot Wheels', 'Rare Collectibles'] },
  { name: 'Gaming & Hobby', slug: 'gaming-hobby', subcategories: ['Board Games', 'Anime Merchandise', 'Cosplay Props', 'Puzzle Collections'] },
  { name: 'Lifestyle & Gifts', slug: 'lifestyle-gifts', subcategories: ['Home Decor', 'Jewellery & Accessories', 'Miniatures', 'Stationery'] }
]

export const Navbar = React.memo(function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const isHomepage = pathname === '/'
  
  const { user, location, cart, wishlist, logout } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [openDropdown, setOpenDropdown] = useState<'notifications' | 'profile' | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const wishlistCount = wishlist.length

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null)
        setIsMobileSearchExpanded(false)
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    // Close dropdowns on route change
    setOpenDropdown(null)
    setIsMobileSearchExpanded(false)
    setIsMobileMenuOpen(false)
  }, [pathname])

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
        <button className="text-caption text-[var(--color-ink-500)] hover:text-[var(--color-terracotta-600)]">Mark all read</button>
      </div>
      
      <div className="flex flex-col">
        {/* Mock Notification 1 */}
        <Link href="/product/art-018" className="p-4 flex gap-3 hover:bg-[var(--color-cream-raised)] transition-colors border-b border-[var(--color-border-subtle)] cursor-pointer relative bg-[var(--color-cream-raised)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-terracotta-600)]" />
          <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--color-cream-deep)] overflow-hidden shrink-0">
            <CloudinaryImage publicId="bidcraft/art/digital-art/cyberpunk_cityscape" width={40} height={40} alt="Cyberpunk Cityscape" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-body-md text-[var(--color-ink-900)] leading-snug">Someone outbid you on Cyberpunk Cityscape</p>
            <p className="text-caption text-[var(--color-ink-500)] mt-1">Current bid: ₹4,400 · 2 hours ago</p>
          </div>
        </Link>
        
        {/* Mock Notification 2 */}
        <Link href="/product/art-020" className="p-4 flex gap-3 hover:bg-[var(--color-cream-raised)] transition-colors border-b border-[var(--color-border-subtle)] cursor-pointer relative bg-[var(--color-cream-raised)]">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-terracotta-600)]" />
          <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--color-cream-deep)] overflow-hidden shrink-0">
            <CloudinaryImage publicId="bidcraft/art/digital-art/geometric_abstraction" width={40} height={40} alt="Geometric Abstraction" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-body-md text-[var(--color-ink-900)] leading-snug">Your wishlist item is on sale</p>
            <p className="text-caption text-[var(--color-ink-500)] mt-1">Geometric Abstraction — now ₹1,260 (10% off) · 5 hours ago</p>
          </div>
        </Link>
        
        {/* Mock Notification 3 */}
        <Link href="/product/art-027" className="p-4 flex gap-3 hover:bg-[var(--color-cream-raised)] transition-colors border-b border-[var(--color-border-subtle)] cursor-pointer relative">
          <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--color-cream-deep)] overflow-hidden shrink-0">
            <CloudinaryImage publicId="bidcraft/art/sculptures/modern_abstract_sculpture" width={40} height={40} alt="Serenity in Stone" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-body-md text-[var(--color-ink-900)] leading-snug">New arrival in Art you might like</p>
            <p className="text-caption text-[var(--color-ink-500)] mt-1">Serenity in Stone by Vikram Rao · Just listed</p>
          </div>
        </Link>
      </div>
      <div className="p-3 text-center border-t border-[var(--color-border-subtle)]">
        <button onClick={() => setOpenDropdown(null)} className="text-caption font-medium text-[var(--color-terracotta-600)] hover:underline">
          View all notifications
        </button>
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
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden w-[44px] h-[44px] flex items-center justify-center -ml-2"
                aria-label="Menu"
              >
                <Menu className="w-6 h-6 text-[var(--color-ink-900)]" strokeWidth={1.5} />
              </button>
              
              <div className="hidden md:flex items-center gap-6">
                <Link href="/#our-story" className={cn("text-body-md font-medium transition-colors duration-fast", textClass)}>
                  Our Story
                </Link>
                <a href="mailto:hello@bidcraft.in" className={cn("text-body-md font-medium transition-colors duration-fast", textClass)}>
                  Contact
                </a>
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
                  className={cn("w-[44px] h-[44px] flex items-center justify-center transition-colors relative", textClass)}
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
                  className={cn("w-[44px] h-[44px] flex items-center justify-center transition-colors relative", textClass)}
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
                    className={cn("w-[44px] h-[44px] flex items-center justify-center transition-colors relative", textClass)}
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" strokeWidth={1.5} />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[var(--color-urgent-600)] rounded-full border-[1.5px] border-transparent" />
                  </button>
                  <AnimatePresence>
                    {openDropdown === 'notifications' && <NotificationsDropdown />}
                  </AnimatePresence>
                </div>

                {user ? (
                  <div className="relative ml-1">
                    <button 
                      onClick={() => setOpenDropdown(openDropdown === 'profile' ? null : 'profile')}
                      className="w-[44px] h-[44px] rounded-full bg-[var(--color-terracotta-600)] text-white flex items-center justify-center text-heading-sm font-display ring-2 ring-transparent focus:ring-[rgba(200,100,58,0.3)] transition-all"
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
                        if (e.key === 'Enter' && searchQuery.trim()) {
                          router.push(`/explore?search=${encodeURIComponent(searchQuery.trim())}`)
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
        
        {/* Row 2 - Categories Nav */}
        <div className="relative hidden md:block border-b border-[var(--color-border-subtle)]/30 bg-[var(--color-cream-base)]">
          <div className="w-full max-w-[var(--container-max)] mx-auto flex items-center justify-between h-[56px] px-[var(--space-5)]">
            <div className="flex items-center gap-[32px] h-full pl-[48px]">
              
              {/* Categories */}
              {categories.map((category) => (
                <div key={category.slug} className="relative h-full flex items-center">
                  <button 
                    onClick={() => {
                      if (openDropdown === category.slug) {
                        setOpenDropdown(null);
                      } else {
                        setOpenDropdown(category.slug);
                      }
                    }}
                    className={cn("h-full flex items-center text-body-md font-medium transition-colors relative", textClass, openDropdown === category.slug && "text-[var(--color-terracotta-600)]")}
                  >
                    {category.name}
                  </button>
                </div>
              ))}

              <div className="h-[16px] w-[1px] bg-[var(--color-border-subtle)]" />

              <Link href="/explore" className="text-caption font-medium text-[var(--color-ink-500)] hover:text-[var(--color-terracotta-600)] transition-colors">
                Explore All →
              </Link>
            </div>

            {/* Search Bar (Row 2 Desktop) */}
            <div className="flex items-center lg:w-[200px] xl:w-[260px] h-[36px] bg-[var(--color-cream-deep)] border border-[var(--color-border-subtle)] rounded-[var(--radius-pill)] px-3 transition-all duration-fast focus-within:border-[var(--color-terracotta-600)] focus-within:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] shrink-0 mr-[48px]">
              <Search className="w-4 h-4 text-[var(--color-ink-500)] shrink-0" strokeWidth={1.5} />
              <input 
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent border-none outline-none text-body-sm text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)] ml-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    router.push(`/explore?search=${encodeURIComponent(searchQuery.trim())}`)
                    setSearchQuery('')
                  }
                }}
              />
            </div>
          </div>

          {/* Horizontal Subcategory Panel */}
          <AnimatePresence>
            {openDropdown && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="absolute top-full left-0 w-full bg-[var(--color-cream-raised)] border-b border-[var(--color-border-subtle)] shadow-sm z-40 overflow-hidden"
              >
                <div className="w-full max-w-[var(--container-max)] mx-auto px-[var(--space-5)] py-6 pl-[48px]">
                  <Link 
                    href={`/explore?category=${openDropdown}`}
                    onClick={() => setOpenDropdown(null)}
                    className="text-body-md font-bold text-[var(--color-terracotta-600)] hover:text-[var(--color-terracotta-700)] transition-colors mb-4 block"
                  >
                    All {categories.find(c => c.slug === openDropdown)?.name} →
                  </Link>
                  <div className="grid grid-cols-3 gap-y-4 gap-x-8">
                    {categories.find(c => c.slug === openDropdown)?.subcategories.map(sub => {
                      const subSlug = slugify(sub);
                      return (
                        <Link 
                          key={sub}
                          href={`/explore?category=${openDropdown}&subcategory=${subSlug}`}
                          onClick={() => setOpenDropdown(null)}
                          className="text-body-md font-medium text-[var(--color-ink-700)] hover:text-[var(--color-terracotta-600)] transition-colors"
                        >
                          {sub}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
      
      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] md:hidden bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute left-0 top-0 bottom-0 w-[80%] max-w-[320px] bg-[var(--color-white)] shadow-xl overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
                <span className="text-heading-md font-display text-[var(--color-ink-900)]">BidCraft</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 -mr-3 text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-caption font-bold text-[var(--color-ink-500)] uppercase tracking-wider mb-2">Shop</h3>
                  {categories.map((category) => (
                    <Link 
                      key={category.slug} 
                      href={`/explore?category=${category.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-body-lg text-[var(--color-ink-900)] hover:text-[var(--color-terracotta-600)] py-2 font-medium"
                    >
                      {category.name}
                    </Link>
                  ))}
                  <Link 
                    href="/explore"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-body-lg text-[var(--color-terracotta-600)] font-semibold py-2"
                  >
                    Explore All
                  </Link>
                </div>
                
                <div className="h-px bg-[var(--color-border-subtle)] my-2" />
                
                <div className="flex flex-col gap-2">
                  <h3 className="text-caption font-bold text-[var(--color-ink-500)] uppercase tracking-wider mb-2">About</h3>
                  <Link 
                    href="/#our-story"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-body-lg text-[var(--color-ink-900)] hover:text-[var(--color-terracotta-600)] py-2 font-medium"
                  >
                    Our Story
                  </Link>
                  <a 
                    href="mailto:hello@bidcraft.in"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-body-lg text-[var(--color-ink-900)] hover:text-[var(--color-terracotta-600)] py-2 font-medium"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
})
