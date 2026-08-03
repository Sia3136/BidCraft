'use client'

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import { ShieldCheck, CheckCircle, Package, ArrowRight, Star, TrendingUp, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import { ProductCard } from '@/components/product-card'
import { Listing } from '@/lib/api'
import { slugify } from '@/lib/slugify'

const heroImages = [
  '/images/crochet-flowers-blue-pot.jpeg',
  '/images/968355308d40d83a2e1f59daa61c5089.jpg',
  '/images/d400a85bd9cd68c5a2d8cda063dac7e0.jpg',
  '/images/586fa4c05a4543d441ec3c2bf877f807.jpg'
]

const featuredCreators = [
  { id: 1, name: 'Sneha Agarwal', specialty: 'Oil & Watercolour Paintings · Pune', bio: 'Capturing monsoons, marigolds, and memories through layered oil and watercolour canvases.', rating: '4.9', reviews: 91, followers: '142', verified: true, avatarInitials: 'SA', avatarBg: 'bg-[var(--color-terracotta-600)]', cover: '/images/dd5d9d9aaf49d3fac48af9d1b80001bb.jpg' },
  { id: 2, name: 'Vikram Rao', specialty: 'Stone & Clay Sculpture · Jaipur', bio: 'Shaping raw stone and clay into forms that carry the weight of Indian craft traditions.', rating: '4.8', reviews: 43, followers: '89', verified: true, avatarInitials: 'VR', avatarBg: 'bg-[var(--color-slate-700)]', cover: '/images/8891723f370ddd55a88b322a622406a2.jpg' },
  { id: 3, name: 'Aisha Malik', specialty: 'Handmade Jewellery · Hyderabad', bio: 'Crafting delicate silver and beadwork pieces rooted in Hyderabadi craft heritage.', rating: '5.0', reviews: 118, followers: '175', verified: true, avatarInitials: 'AM', avatarBg: 'bg-[var(--color-success-600)]', cover: '/images/d00d6edd9a33d14ce95b39d402b4e865.jpg' },
  { id: 4, name: 'Karan Sethi', specialty: 'Rare Collectibles & Vintage Finds · Mumbai', bio: 'Sourcing forgotten treasures — from vintage die-cast cars to first-edition comics — for serious collectors.', rating: '4.7', reviews: 67, followers: '112', verified: false, avatarInitials: 'KS', avatarBg: 'bg-[var(--color-ink-700)]', cover: '/images/1f92888deb74023c26ec86c954a18188.jpg' }
]

const revealVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
}

export default function ClientHome({ newArrivals = [], liveAuctions = [], trendingListings = [] }: { newArrivals?: Listing[], liveAuctions?: Listing[], trendingListings?: Listing[] }) {
  const { user } = useAuthStore()
  const [activeHeroIndex, setActiveHeroIndex] = useState(0)

  // Using realistic curated counts instead of scanning mock data
  const vintageRetroCount = 142;
  const modernMinimalistCount = 86;
  const traditionalArtsCount = 215;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[var(--color-cream-base)]">
      <main>
        {/* 1. Hero */}
        <section className="relative w-full h-[640px] bg-[var(--color-slate-900)] overflow-hidden">
          {heroImages.map((src, index) => (
            <div 
              key={src} 
              style={{
                position: 'absolute',
                inset: 0,
                opacity: index === activeHeroIndex ? 1 : 0,
                transition: 'opacity 800ms var(--ease-default)'
              }}
            >
              <Image 
                src={src}
                fill
                style={{ objectFit: 'cover' }}
                priority={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                alt={`Hero image ${index + 1}`}
              />
            </div>
          ))}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to top, rgba(43,42,40,0.55) 0%, rgba(43,42,40,0) 60%)' }} />
          
          <div className="absolute inset-0 w-full max-w-[var(--container-max)] mx-auto px-[var(--space-5)] xl:px-[var(--space-8)] flex flex-col justify-end pb-24 z-[2]">
            <motion.div initial="hidden" animate="visible" variants={revealVariant} className="max-w-3xl">
              <span className="text-sm font-semibold tracking-widest text-white/90 uppercase mb-4 block font-[family-name:var(--font-jakarta)]">India's Premier Artisan Marketplace</span>
              <h1 className="text-5xl md:text-display-2xl text-white mb-6 leading-tight font-[family-name:var(--font-playfair)]">Where creativity becomes opportunity.</h1>
              <p className="text-xl text-white/85 mb-8 max-w-xl font-[family-name:var(--font-jakarta)]">
                Discover unique handcrafted goods, bid on rare collectibles, and support independent creators in India's premier marketplace.
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <Link href="/explore" className="bg-[var(--color-terracotta-600)] text-white text-body-md font-semibold px-8 py-3.5 rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors duration-fast text-center font-[family-name:var(--font-jakarta)]">
                  Explore Collection
                </Link>
                <Link href="/explore?type=auction" className="h-[52px] px-6 bg-white text-[var(--color-ink-900)] text-body-lg font-bold rounded-[var(--radius-md)] flex items-center justify-center hover:bg-opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg text-center font-[family-name:var(--font-jakarta)]">
                  Watch Live Auctions
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. Explore by Category */}
        <section className="py-20 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-base)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-lg text-[var(--color-ink-900)] text-center mb-12 font-[family-name:var(--font-playfair)]">
              Explore by Category
            </motion.h2>
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:justify-center md:overflow-visible md:pb-0"
            >
              {[
                { name: 'Art', img: '/images/4cf20961ee9c8dccc7dfb51c2f561af8.jpg', slug: 'art' },
                { name: 'Handmade & Crafts', img: '/images/04809f445775b05edf65772b67c139d9.jpg', slug: 'handmade-crafts' },
                { name: 'Collectibles', img: '/images/4256f8dcb8f244ba618721219f550054.jpg', slug: 'collectibles' },
                { name: 'Gaming & Hobby', img: '/images/5139a72a8fd930206d06b40689c6e35c.jpg', slug: 'gaming-hobby' },
                { name: 'Lifestyle & Gifts', img: '/images/7f69e85a737d75f85a041d457c9be525.jpg', slug: 'lifestyle-gifts' }
              ].map((cat) => (
                <motion.div key={cat.name} variants={revealVariant} className="shrink-0 w-[42vw] min-w-[160px] md:min-w-0 md:w-[calc(33.333%-11px)] lg:w-[calc(20%-13px)] snap-start">
                  <Link href={`/explore?category=${cat.slug}`} className="group block relative aspect-[4/5] rounded-[var(--radius-md)] overflow-hidden cursor-pointer bg-[var(--color-cream-deep)]">
                    <Image 
                      src={cat.img}
                      fill
                      style={{ objectFit: 'cover' }}
                      alt={cat.name}
                      className="transition-transform duration-[400ms] ease-default group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(43,42,40,0.70) 0%, rgba(43,42,40,0) 55%)' }} />
                    <div className="absolute bottom-0 left-0 p-[var(--space-4)] z-10">
                      <h3 className="text-heading-lg font-[var(--)] font-semibold text-white font-[family-name:var(--font-playfair)]">{cat.name}</h3>
                      <div className="w-0 h-[1.5px] bg-white mt-1 transition-all duration-[250ms] ease-out group-hover:w-[24px]" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>


        {/* 3. Live Auctions */}
        {liveAuctions.length > 0 && (
          <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-raised)]">
            <div className="max-w-[var(--container-max)] mx-auto">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-display-lg text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)]">Live Auctions</h2>
                <span className="flex items-center gap-2 text-sm font-medium font-[family-name:var(--font-jakarta)] bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Live Now
                </span>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-10">
                {liveAuctions.map((p, idx) => (
                  <ProductCard key={p.id} product={p} priority={idx < 4} />
                ))}
              </div>
              
              <div className="flex justify-center">
                <Link href="/explore?type=auction" className="inline-flex items-center gap-2 text-[var(--color-terracotta-600)] font-semibold hover:gap-3 transition-all text-body-lg font-[family-name:var(--font-jakarta)]">
                  Explore More Live Auctions <span>→</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 4. Trending Now */}
        {trendingListings.length > 0 && (
          <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-base)] border-t border-[var(--color-border-subtle)]">
            <div className="max-w-[var(--container-max)] mx-auto">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-display-lg text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)]">Trending Now</h2>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-10">
                {trendingListings.map((p, idx) => (
                  <ProductCard key={p.id} product={p} priority={idx < 4} />
                ))}
              </div>
              
              <div className="flex justify-center">
                <Link href="/explore?type=trending" className="inline-flex items-center gap-2 text-[var(--color-terracotta-600)] font-semibold hover:gap-3 transition-all text-body-lg font-[family-name:var(--font-jakarta)]">
                  View All Trending <span>→</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 5. New Arrivals */}
        {newArrivals.length > 0 && (
          <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-raised)] border-t border-[var(--color-border-subtle)]">
            <div className="max-w-[var(--container-max)] mx-auto">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-display-lg text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)]">New Arrivals</h2>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-10">
                {newArrivals.map((p, idx) => (
                  <ProductCard key={p.id} product={p} priority={idx < 4} />
                ))}
              </div>
              
              <div className="flex justify-center">
                <Link href="/explore?sort=newest" className="inline-flex items-center gap-2 text-[var(--color-terracotta-600)] font-semibold hover:gap-3 transition-all text-body-lg font-[family-name:var(--font-jakarta)]">
                  Explore More New Arrivals <span>→</span>
                </Link>
              </div>
            </div>
          </section>
        )}


        {/* 6. Editorial Feature: The BidCraft Philosophy */}
        <section className="py-32 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-base)] overflow-hidden">
          <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
            <div className="md:w-1/2 order-2 md:order-1 flex flex-col items-start text-left">
              <span className="font-[family-name:var(--font-jakarta)] uppercase tracking-[0.25em] text-[11px] text-[var(--color-terracotta-600)] mb-6 font-bold">
                THE BIDCRAFT PHILOSOPHY
              </span>
              
              <h2 className="text-[40px] md:text-[56px] text-[var(--color-ink-900)] leading-[1.1] mb-8 flex flex-col">
                <span className="font-[family-name:var(--font-playfair)] italic text-[var(--color-ink-600)] font-normal mb-1">
                  We don't celebrate mass production.
                </span>
                <span className="font-[family-name:var(--font-playfair)] font-bold tracking-tight">
                  We celebrate originality.
                </span>
              </h2>
              
              <p className="font-[family-name:var(--font-jakarta)] text-lg text-[var(--color-ink-700)] leading-relaxed mb-10">
                Whether it's an original painting, handcrafted jewellery, home décor, a vintage timepiece or a rare collectible, every listing exists because someone cared enough to create it—or preserve it.
              </p>
              
              <ul className="space-y-4 font-[family-name:var(--font-jakarta)] text-sm text-[var(--color-ink-600)] tracking-wide uppercase font-semibold mb-10">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[var(--color-terracotta-400)] rounded-full"></span> Original Creations
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[var(--color-terracotta-400)] rounded-full"></span> Rare Collectibles
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[var(--color-terracotta-400)] rounded-full"></span> Verified Creators & Curators
                </li>
              </ul>

              <Link href="/our-story" className="inline-flex items-center gap-2 text-[var(--color-terracotta-600)] font-semibold hover:gap-3 transition-all text-body-lg font-[family-name:var(--font-jakarta)] border-b border-[var(--color-terracotta-600)] pb-1">
                Read our manifesto <span>→</span>
              </Link>
            </div>

            <div className="md:w-1/2 order-1 md:order-2 w-full">
              <div className="relative aspect-[3/4] w-full max-w-[400px] mx-auto md:ml-auto md:mr-0 p-4 bg-white shadow-[0_20px_40px_rgb(0,0,0,0.06)] transform rotate-2">
                <div className="relative w-full h-full border border-[var(--color-border-subtle)] overflow-hidden bg-[var(--color-cream-deep)]">
                  {/* TODO: Replace with final Cloudinary editorial product-adjacent image */}
                  <Image src="/images/4cf20961ee9c8dccc7dfb51c2f561af8.jpg" fill style={{ objectFit: 'cover' }} alt="Artisan detail" className="sepia-[0.15] contrast-[1.05]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Editorial Diptych: Choose Your Journey */}
        <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-raised)]">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <span className="font-[family-name:var(--font-jakarta)] uppercase tracking-[0.2em] text-[11px] text-[var(--color-terracotta-600)] font-bold block mb-4">Discovery Paths</span>
              <h2 className="text-display-lg text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)]">Find what speaks to you</h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
              
              {/* Left Path: Crafted with Intention */}
              <div className="flex-1 flex flex-col group cursor-pointer">
                <Link href="/explore?category=handmade-crafts" className="block relative w-full aspect-[4/5] bg-[var(--color-cream-deep)] mb-8 overflow-hidden">
                  <Image src="/images/d400a85bd9cd68c5a2d8cda063dac7e0.jpg" fill style={{ objectFit: 'cover' }} alt="Crafted with Intention" className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03] sepia-[0.1]" />
                </Link>
                <div className="px-2">
                  <h3 className="text-[32px] text-[var(--color-ink-900)] mb-3 font-[family-name:var(--font-playfair)]">Crafted with Intention</h3>
                  <p className="text-body-lg text-[var(--color-ink-700)] mb-6 font-[family-name:var(--font-jakarta)] leading-relaxed">
                    Discover original art, handcrafted jewellery, ceramics, home décor and unique creations made by independent makers who value quality over quantity.
                  </p>
                  <Link href="/explore?category=handmade-crafts" className="inline-flex items-center gap-2 text-[var(--color-ink-900)] font-bold hover:gap-3 transition-all font-[family-name:var(--font-jakarta)] uppercase tracking-wider text-sm border-b-2 border-[var(--color-ink-900)] pb-1">
                    Explore Handmade
                  </Link>
                </div>
              </div>

              {/* Right Path: Preserved with Purpose */}
              <div className="flex-1 flex flex-col group cursor-pointer md:mt-24">
                <Link href="/explore?category=collectibles-vintage" className="block relative w-full aspect-[4/5] bg-[var(--color-cream-deep)] mb-8 overflow-hidden">
                  <Image src="/images/1f92888deb74023c26ec86c954a18188.jpg" fill style={{ objectFit: 'cover' }} alt="Preserved with Purpose" className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03] sepia-[0.1]" />
                </Link>
                <div className="px-2">
                  <h3 className="text-[32px] text-[var(--color-ink-900)] mb-3 font-[family-name:var(--font-playfair)]">Preserved with Purpose</h3>
                  <p className="text-body-lg text-[var(--color-ink-700)] mb-6 font-[family-name:var(--font-jakarta)] leading-relaxed">
                    Discover vintage treasures, timeless décor, rare memorabilia and collectible pieces that continue their journey with someone new.
                  </p>
                  <Link href="/explore?category=collectibles-vintage" className="inline-flex items-center gap-2 text-[var(--color-ink-900)] font-bold hover:gap-3 transition-all font-[family-name:var(--font-jakarta)] uppercase tracking-wider text-sm border-b-2 border-[var(--color-ink-900)] pb-1">
                    Explore Collectibles
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* 8. Our Story */}
        <section id="our-story" className="w-full min-h-[480px] flex flex-col md:flex-row bg-[var(--color-slate-900)]">
          <div className="w-full md:w-1/2 h-[320px] md:h-auto relative bg-[var(--color-cream-deep)]">
            <Image src="/images/4cf20961ee9c8dccc7dfb51c2f561af8.jpg" fill style={{ objectFit: 'cover', borderRadius: '0' }} alt="Our Story" />
          </div>
          <div className="w-full md:w-1/2 p-12 lg:p-24 flex flex-col justify-center text-left">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="max-w-md mx-auto md:mx-0">
              <h2 className="text-display-lg text-[var(--color-cream-base)] mb-6 font-[family-name:var(--font-playfair)]">Our Story</h2>
              <p className="text-body-lg text-[var(--color-cream-base)]/80 mb-6 font-[family-name:var(--font-jakarta)]">
                Every creation has a story. Every creator deserves a platform that values it.
              </p>
              <p className="text-body-lg text-[var(--color-cream-base)]/80 mb-6 font-[family-name:var(--font-jakarta)]">
                BidCraft was built to bridge the gap between talented creators and people who truly appreciate their work. In a world where selling online often means uncertainty, we envisioned a marketplace where creativity is backed by trust, transparency, and opportunity—not risk.
              </p>
              <p className="text-body-lg text-[var(--color-cream-base)]/80 mb-10 font-[family-name:var(--font-jakarta)]">
                Whether it's an artist's first handmade piece, a student's passion project, or a collector searching for something rare, BidCraft brings them together in one secure ecosystem.
              </p>
              <Link href="/our-story" className="inline-block bg-[var(--color-terracotta-600)] text-white text-body-md font-semibold px-8 py-3.5 rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors duration-fast font-[family-name:var(--font-jakarta)]">
                Read Our Full Story
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 9. Curated Collections (Clickable) */}
        <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-base)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-lg text-[var(--color-ink-900)] text-center mb-16 font-[family-name:var(--font-playfair)]">
              Curated Collections
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 h-auto lg:h-[600px]">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="md:col-span-2 lg:col-span-2 relative rounded-[var(--radius-lg)] overflow-hidden group h-[300px] lg:h-full cursor-pointer bg-[var(--color-cream-deep)]">
                <Link href="/explore?collection=vintage-retro" className="absolute inset-0 z-20"></Link>
                <Image src="/images/ed2af0776b49fdea863a1ead90dadf19.jpg" fill style={{ objectFit: 'cover' }} alt="Vintage & Retro" className="transition-transform duration-slow group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <div className="absolute bottom-8 left-8 z-20">
                  <h3 className="text-display-md text-white mb-2 font-[family-name:var(--font-playfair)]">Vintage & Retro</h3>
                  <p className="text-body-md text-white/80 font-[family-name:var(--font-jakarta)]">{vintageRetroCount} Items</p>
                </div>
              </motion.div>
              
              <div className="md:col-span-2 lg:col-span-1 grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-4 lg:gap-6 h-full">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="relative rounded-[var(--radius-lg)] overflow-hidden group h-[250px] lg:h-[calc(50%-12px)] cursor-pointer bg-[var(--color-cream-deep)]">
                  <Link href="/explore?collection=modern-minimalist" className="absolute inset-0 z-20"></Link>
                  <Image src="/images/1572725d1d0bf7fa3ab6b92974a3fdfd.jpg" fill style={{ objectFit: 'cover' }} alt="Modern Minimalist" className="transition-transform duration-slow group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <div className="absolute bottom-6 left-6 z-20">
                    <h3 className="text-heading-lg text-white mb-1 font-[family-name:var(--font-playfair)]">Modern Minimalist</h3>
                    <p className="text-caption text-white/80 font-[family-name:var(--font-jakarta)]">{modernMinimalistCount} Items</p>
                  </div>
                </motion.div>
                
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="relative rounded-[var(--radius-lg)] overflow-hidden group h-[250px] lg:h-[calc(50%-12px)] cursor-pointer bg-[var(--color-cream-deep)]">
                  <Link href="/explore?collection=traditional-arts" className="absolute inset-0 z-20"></Link>
                  <Image src="/images/3599c4c65b94b61ec21a8d070cd401fe.jpg" fill style={{ objectFit: 'cover' }} alt="Traditional Arts" className="transition-transform duration-slow group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <div className="absolute bottom-6 left-6 z-20">
                    <h3 className="text-heading-lg text-white mb-1 font-[family-name:var(--font-playfair)]">Traditional Arts</h3>
                    <p className="text-caption text-white/80 font-[family-name:var(--font-jakarta)]">{traditionalArtsCount} Items</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. Featured Creators */}
        <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-raised)] border-t border-[var(--color-border-subtle)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-lg text-[var(--color-ink-900)] text-center mb-16 font-[family-name:var(--font-playfair)]">
              {user ? 'Creators You Follow' : 'Featured Creators'}
            </motion.h2>
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 sm:gap-6 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 pb-8 -mx-[var(--space-5)] px-[var(--space-5)] md:mx-0 md:px-0 md:pb-0 mb-8 md:mb-0">
              {featuredCreators.map((creator) => (
                <motion.div key={creator.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="shrink-0 w-[280px] sm:w-[320px] md:w-auto snap-start bg-white rounded-[var(--radius-lg)] overflow-hidden shadow-sm border border-[var(--color-border-subtle)] text-center pb-6">
                  <div className="h-40 bg-[var(--color-cream-deep)] relative">
                    <Image src={creator.cover} fill style={{ objectFit: 'cover' }} alt="Cover" />
                  </div>
                  <h3 className="text-heading-lg mt-6 mb-1 flex items-center justify-center gap-1 font-[family-name:var(--font-playfair)]">
                    {creator.name}
                    {creator.verified && <CheckCircle className="w-4 h-4 text-[var(--color-success-600)]" strokeWidth={2} />}
                  </h3>
                  <p className="text-caption text-[var(--color-terracotta-600)] mb-3 uppercase tracking-wider font-[family-name:var(--font-jakarta)]">{creator.specialty}</p>
                  <p className="text-body-md text-[var(--color-ink-500)] px-6 line-clamp-3 mb-4 h-[66px] font-[family-name:var(--font-jakarta)]">{creator.bio}</p>
                  <div className="flex justify-center items-center gap-1 text-[var(--color-ink-900)] mb-2">
                    <span className="text-caption font-bold font-[family-name:var(--font-jakarta)]">{creator.rating}</span>
                    <span className="text-[var(--color-terracotta-600)] text-sm font-[family-name:var(--font-jakarta)]">★★★★★</span>
                    <span className="text-caption text-[var(--color-ink-300)] font-[family-name:var(--font-jakarta)]">({creator.reviews})</span>
                  </div>
                  <p className="text-caption text-[var(--color-ink-500)] font-[family-name:var(--font-jakarta)]">{creator.followers} followers</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* 11. Gifts With a Story */}
        <section className="py-24 bg-[var(--color-cream-base)] px-[var(--space-5)] xl:px-[var(--space-8)] overflow-hidden">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-lg text-[var(--color-ink-900)] text-center mb-12 font-[family-name:var(--font-playfair)]">
              Gifts With a Story
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { occ: 'Birthdays', slug: 'birthdays', image: '/images/a344e75529581e9f43f2c00dc233dea4.webp' },
                { occ: 'Anniversaries', slug: 'anniversaries', image: '/images/d156289ab52040263f59b16d6f3f5f2c.jpg' },
                { occ: 'Housewarming', slug: 'housewarming', image: '/images/27c1a7020f1f1ae13757444e6e302582.jpg' },
                { occ: 'Just Because', slug: 'just-because', image: '/images/4472fc60307774b77a3457158adcd98c.webp' },
                { occ: 'All Occasions', slug: 'all-occasions', image: '/images/417caba42ec36fd9ba441b33afd74e7c.jpg', colSpanMobile: true }
              ].map((item, i) => (
                <motion.div key={item.occ} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className={cn("relative rounded-[var(--radius-md)] overflow-hidden group cursor-pointer bg-[var(--color-cream-deep)] min-h-[220px]", item.colSpanMobile && "col-span-2 md:col-span-1 lg:col-span-1")}>
                  <Link href={item.occ === 'All Occasions' ? '/explore' : `/explore?occasion=${item.slug}`} className="absolute inset-0 z-20"></Link>
                  <Image src={item.image} fill style={{ objectFit: 'cover' }} alt={item.occ} className="transition-transform duration-slow group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                  <h3 className="absolute bottom-6 w-full text-center text-heading-lg text-white px-2 z-20 font-[family-name:var(--font-playfair)]">{item.occ}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* 12. Community Voices */}
        <section className="py-24 bg-[var(--color-cream-raised)] px-[var(--space-5)] xl:px-[var(--space-8)] border-y border-[var(--color-border-subtle)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-lg text-[var(--color-ink-900)] text-center mb-16 font-[family-name:var(--font-playfair)]">
              Community Voices
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="bg-white p-10 rounded-[var(--radius-md)] shadow-sm border border-[var(--color-border-subtle)] flex flex-col justify-between">
                  <div>
                    <span className="text-display-xl text-[var(--color-terracotta-600)] leading-none mb-2 block font-[family-name:var(--font-playfair)]">"</span>
                    <p className="text-body-lg italic text-[var(--color-ink-900)] mb-8 font-[family-name:var(--font-jakarta)] leading-relaxed">
                      {i === 1 ? "I finally found a platform that values the time it takes to handcraft furniture." : i === 2 ? "The live auctions are thrilling. Won an amazing antique clock last week!" : "Best place to discover hidden artistic talent across India."}
                    </p>
                  </div>
                  <div>
                    <div className="h-px w-full bg-[var(--color-border-subtle)] mb-6" />
                    <div className="flex items-center gap-4">
                      <Image 
                        src={i === 1 ? "/images/5ac5f5ecddd67235241297452010a237.jpg" : i === 2 ? "/images/1da0c6767e60f79b79148794732a305f.jpg" : "/images/71d0457823cf94b6f1003b8c50253c61.webp"}
                        width={64} 
                        height={64} 
                        style={{ objectFit: 'cover' }}
                        alt={`User ${i}`}
                        className="rounded-full bg-[var(--color-ink-300)] w-[64px] h-[64px] min-w-[64px]"
                      />
                      <div>
                        <p className="text-heading-sm text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)]">
                          {i === 1 ? "Priya S." : i === 2 ? "Arjun M." : "Nandita R."}
                        </p>
                        <div className="flex gap-1 text-[var(--color-terracotta-600)] text-xs mt-1 font-bold font-[family-name:var(--font-jakarta)]">
                          {i === 1 ? "4.5 ★" : i === 2 ? "4.0 ★" : "5.0 ★"}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* 13. Become a Seller CTA */}
        <section className="relative w-full min-h-[420px] md:min-h-[520px] flex items-center justify-center overflow-hidden py-24 px-[var(--space-5)] xl:px-[var(--space-8)]">
          {/* Background image */}
          <Image
            src="https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785784387/bidcraft_homepage/craft-livelihood-hero.jpg"
            alt="Artisan at work"
            fill
            className="object-cover object-center"
            priority={false}
          />
          {/* Dark gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />

          {/* Content — centered over image */}
          <div className="relative z-10 text-center px-6 max-w-2xl mx-auto flex flex-col items-center">
            <span className="text-xs text-orange-300 tracking-widest uppercase mb-4 block font-semibold font-[family-name:var(--font-jakarta)]">FOR CREATORS & CURATORS</span>
            <h2 className="text-3xl md:text-4xl text-white mb-4 font-[family-name:var(--font-playfair)]">Turn your passion into a livelihood</h2>
            <p className="text-sm text-white/85 mb-10 leading-relaxed max-w-md font-[family-name:var(--font-jakarta)]">
              Join independent creators, curators, and collectors selling on BidCraft. List for free. Set your own prices. Reach buyers who truly value the rare and original.
            </p>
            <Link href="/sell" className="bg-[var(--color-terracotta-600)] text-white text-body-lg font-bold px-10 py-4 rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors inline-flex items-center gap-2 group font-[family-name:var(--font-jakarta)] shadow-xl">
              Start Selling <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

      
        </main>
    </div>
  )
}
