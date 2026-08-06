'use client'

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import { ShieldCheck, CheckCircle, Package, ArrowRight, Star, TrendingUp, ChevronLeft, ChevronRight, Play, Gavel, Handshake } from 'lucide-react'
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
  { id: 1, name: 'Sneha Agarwal', specialty: 'Oil & Watercolour Paintings ├é┬╖ Pune', bio: 'Capturing monsoons, marigolds, and memories through layered oil and watercolour canvases.', rating: '4.9', reviews: 91, followers: '142', verified: true, avatarInitials: 'SA', avatarBg: 'bg-[var(--color-terracotta-600)]', cover: '/images/dd5d9d9aaf49d3fac48af9d1b80001bb.jpg' },
  { id: 2, name: 'Vikram Rao', specialty: 'Stone & Clay Sculpture ├é┬╖ Jaipur', bio: 'Shaping raw stone and clay into forms that carry the weight of Indian craft traditions.', rating: '4.8', reviews: 43, followers: '89', verified: true, avatarInitials: 'VR', avatarBg: 'bg-[var(--color-slate-700)]', cover: '/images/8891723f370ddd55a88b322a622406a2.jpg' },
  { id: 3, name: 'Aisha Malik', specialty: 'Handmade Jewellery ├é┬╖ Hyderabad', bio: 'Crafting delicate silver and beadwork pieces rooted in Hyderabadi craft heritage.', rating: '5.0', reviews: 118, followers: '175', verified: true, avatarInitials: 'AM', avatarBg: 'bg-[var(--color-success-600)]', cover: '/images/d00d6edd9a33d14ce95b39d402b4e865.jpg' },
  { id: 4, name: 'Karan Sethi', specialty: 'Rare Collectibles & Vintage Finds ├é┬╖ Mumbai', bio: 'Sourcing forgotten treasures ├óΓé¼ΓÇ¥ from vintage die-cast cars to first-edition comics ├óΓé¼ΓÇ¥ for serious collectors.', rating: '4.7', reviews: 67, followers: '112', verified: false, avatarInitials: 'KS', avatarBg: 'bg-[var(--color-ink-700)]', cover: '/images/1f92888deb74023c26ec86c954a18188.jpg' }
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
        <section className="py-20 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-bc-cream-light)]">
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

        {/* 2.5 New Feature Strip */}
        <section className="py-12 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-bc-cream-dark)] border-y border-[var(--color-border-strong)]">
          <div className="max-w-[var(--container-max)] mx-auto flex flex-col md:flex-row justify-center gap-8 md:gap-12">
            <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-[300px]">
              <ShieldCheck className="w-8 h-8 text-[var(--color-terracotta-600)] mb-4" />
              <h3 className="text-heading-sm font-semibold text-[var(--color-ink-900)] mb-2 font-[family-name:var(--font-ui)]">Verified Creators Only</h3>
              <p className="text-body-md text-[var(--color-ink-700)] font-[family-name:var(--font-ui)]">Every seller is reviewed before their first listing goes live.</p>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-[300px]">
              <Gavel className="w-8 h-8 text-[var(--color-terracotta-600)] mb-4" />
              <h3 className="text-heading-sm font-semibold text-[var(--color-ink-900)] mb-2 font-[family-name:var(--font-ui)]">Live Auction Bidding</h3>
              <p className="text-body-md text-[var(--color-ink-700)] font-[family-name:var(--font-ui)]">Bid in real time on rare pieces ΓÇö with anti-sniping protection.</p>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-[300px]">
              <Handshake className="w-8 h-8 text-[var(--color-terracotta-600)] mb-4" />
              <h3 className="text-heading-sm font-semibold text-[var(--color-ink-900)] mb-2 font-[family-name:var(--font-ui)]">Make an Offer</h3>
              <p className="text-body-md text-[var(--color-ink-700)] font-[family-name:var(--font-ui)]">Can't wait for an auction? Offer directly and negotiate with the maker.</p>
            </div>
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
                  Explore More Live Auctions <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>
        )}
        {/* 8. Our Story */}
        <section id="our-story" className="w-full flex flex-col lg:flex-row bg-[var(--color-slate-900)]">
          <div className="w-full lg:w-1/2 min-h-[400px] lg:min-h-[560px] relative bg-[var(--color-cream-deep)]">
            <Image src="https://res.cloudinary.com/duzlsyzwa/image/upload/v1785910327/bidcraft_homepage/vleothtzrxgybsvw0fsx.webp" fill className="object-cover object-center" alt="Our Story" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          <div className="w-full lg:w-1/2 p-12 lg:py-24 lg:px-20 xl:px-32 flex flex-col justify-center text-left">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="max-w-lg mx-auto lg:mx-0">
              <h2 className="text-display-lg text-[var(--color-cream-base)] mb-8 font-[family-name:var(--font-playfair)]">Our Story</h2>
              <p className="text-body-lg text-[var(--color-cream-base)]/80 mb-6 font-[family-name:var(--font-jakarta)] leading-relaxed">
                Every creation has a story. Every creator deserves a platform that values it.
              </p>
              <p className="text-body-lg text-[var(--color-cream-base)]/80 mb-6 font-[family-name:var(--font-jakarta)] leading-relaxed">
                BidCraft was built to bridge the gap between talented creators and people who truly appreciate their work. In a world where selling online often means uncertainty, we envisioned a marketplace where creativity is backed by trust, transparency, and opportunity├óΓé¼ΓÇ¥not risk.
              </p>
              <p className="text-body-lg text-[var(--color-cream-base)]/80 mb-10 font-[family-name:var(--font-jakarta)] leading-relaxed">
                Whether it's an artist's first handmade piece, a student's passion project, or a collector searching for something rare, BidCraft brings them together in one secure ecosystem.
              </p>
              <Link href="/our-story" className="inline-block bg-[var(--color-terracotta-600)] text-white text-body-lg font-bold px-10 py-4 rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors font-[family-name:var(--font-jakarta)] shadow-lg hover:-translate-y-0.5 whitespace-nowrap w-full sm:w-auto text-center">
                Read Our Full Story
              </Link>
            </motion.div>
          </div>
        </section>
        {/* 4. Trending Now */}
        {trendingListings.length > 0 && (
          <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-bc-cream-mid)] border-t border-[var(--color-border-subtle)]">
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
                  View All Trending <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 6. Trust Bar (NEW) */}
        <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-bc-cream-dark)]">
          <div className="max-w-[var(--container-max)] mx-auto flex flex-col items-center text-center">
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24 mb-10 text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)]">
              <div className="flex flex-col items-center">
                <Star className="w-8 h-8 text-[var(--color-ink-500)] mb-4 opacity-80" strokeWidth={1.5} />
                <span className="text-3xl lg:text-4xl font-semibold mb-3">Independent Creators</span>
                <span className="text-xs font-[family-name:var(--font-jakarta)] uppercase tracking-widest text-[var(--color-ink-600)]">Verified Makers</span>
              </div>
              <div className="hidden md:block w-px h-16 bg-[var(--color-border-subtle)]" />
              <div className="flex flex-col items-center">
                <Package className="w-8 h-8 text-[var(--color-ink-500)] mb-4 opacity-80" strokeWidth={1.5} />
                <span className="text-3xl lg:text-4xl font-semibold mb-3">Handcrafted & Curated</span>
                <span className="text-xs font-[family-name:var(--font-jakarta)] uppercase tracking-widest text-[var(--color-ink-600)]">Never Mass Produced</span>
              </div>
              <div className="hidden md:block w-px h-16 bg-[var(--color-border-subtle)]" />
              <div className="flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-[var(--color-ink-500)] mb-4 opacity-80" strokeWidth={1.5} />
                <span className="text-3xl lg:text-4xl font-semibold mb-3">Buy, Bid, Offer</span>
                <span className="text-xs font-[family-name:var(--font-jakarta)] uppercase tracking-widest text-[var(--color-ink-600)]">Flexible Purchasing</span>
              </div>
            </div>
            <p className="text-xl italic text-[var(--color-ink-700)] font-[family-name:var(--font-playfair)] opacity-90">
              Every listing is created by a real maker, or preserved by a true collector.
            </p>
          </div>
        </section>

        {/* 9. Curated Collections (Clickable) */}
        <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-bc-cream-light)]">
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
                  <h3 className="text-lg font-semibold text-white mb-2 font-[family-name:var(--font-playfair)]">Vintage & Retro</h3>
                  
                </div>
              </motion.div>
              
              <div className="md:col-span-2 lg:col-span-1 grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-4 lg:gap-6 h-full">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="relative rounded-[var(--radius-lg)] overflow-hidden group h-[250px] lg:h-[calc(50%-12px)] cursor-pointer bg-[var(--color-cream-deep)]">
                  <Link href="/explore?collection=modern-minimalist" className="absolute inset-0 z-20"></Link>
                  <Image src="/images/1572725d1d0bf7fa3ab6b92974a3fdfd.jpg" fill style={{ objectFit: 'cover' }} alt="Modern Minimalist" className="transition-transform duration-slow group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <div className="absolute bottom-6 left-6 z-20">
                    <h3 className="text-lg font-semibold text-white mb-1 font-[family-name:var(--font-playfair)]">Modern Minimalist</h3>
                    
                  </div>
                </motion.div>
                
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="relative rounded-[var(--radius-lg)] overflow-hidden group h-[250px] lg:h-[calc(50%-12px)] cursor-pointer bg-[var(--color-cream-deep)]">
                  <Link href="/explore?collection=traditional-arts" className="absolute inset-0 z-20"></Link>
                  <Image src="/images/3599c4c65b94b61ec21a8d070cd401fe.jpg" fill style={{ objectFit: 'cover' }} alt="Traditional Arts" className="transition-transform duration-slow group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <div className="absolute bottom-6 left-6 z-20">
                    <h3 className="text-lg font-semibold text-white mb-1 font-[family-name:var(--font-playfair)]">Traditional Arts</h3>
                    
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Maker's Market (NEW) */}
        <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-bc-cream-mid)]">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col lg:flex-row overflow-hidden rounded-[var(--radius-lg)] shadow-sm h-auto lg:h-[560px]">
              {/* Left Panel - Made for Everyday */}
              <div className="w-full lg:w-[55%] relative min-h-[400px] lg:min-h-0 flex items-center p-10 md:p-16 lg:p-20 bg-[var(--color-cream-deep)] group overflow-hidden">
                <Image src="/images/04809f445775b05edf65772b67c139d9.jpg" fill className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" alt="Handmade items" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 z-10" />
                <div className="relative z-20 mt-auto w-full">
                  <span className="font-[family-name:var(--font-jakarta)] uppercase tracking-[0.25em] text-[11px] text-[var(--color-cream-base)] font-bold mb-5 block">HANDMADE & CRAFTS</span>
                  <h3 className="text-3xl md:text-4xl text-white mb-6 font-[family-name:var(--font-playfair)] leading-tight">Functional everyday craftsmanship.</h3>
                  <ul className="flex flex-col gap-3 text-white/95 font-[family-name:var(--font-jakarta)] text-body-lg mb-10">
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-[var(--color-terracotta-400)] rounded-full"></span> 
                      <Link href="/explore?subcategory=clay-pottery" className="hover:underline">Clay & Pottery</Link>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-[var(--color-terracotta-400)] rounded-full"></span> 
                      <Link href="/explore?subcategory=candles-soaps" className="hover:underline">Candles & Soaps</Link>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-[var(--color-terracotta-400)] rounded-full"></span> 
                      <Link href="/explore?subcategory=crochet-knitting" className="hover:underline">Crochet & Knitting</Link>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-[var(--color-terracotta-400)] rounded-full"></span> 
                      <Link href="/explore?subcategory=resin-art" className="hover:underline">Resin Art</Link>
                    </li>
                  </ul>
                  <Link href="/explore?category=handmade-crafts" className="inline-flex items-center gap-2 text-white font-bold hover:gap-3 transition-all font-[family-name:var(--font-jakarta)] uppercase tracking-wider text-sm border-b-2 border-white pb-1">
                    Explore Collection <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right Panel - Made to Collect */}
              <div className="w-full lg:w-[45%] bg-[var(--color-terracotta-600)] text-white p-10 md:p-16 lg:p-20 flex flex-col justify-center">
                <span className="font-[family-name:var(--font-jakarta)] uppercase tracking-[0.25em] text-[11px] text-[var(--color-cream-base)] font-bold mb-5 block">COLLECTIBLES</span>
                <h3 className="text-3xl md:text-4xl text-white mb-6 font-[family-name:var(--font-playfair)] leading-tight">Rare pieces & limited editions.</h3>
                <ul className="flex flex-col gap-3 text-white/95 font-[family-name:var(--font-jakarta)] text-body-lg mb-10">
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[var(--color-cream-base)] opacity-80 rounded-full"></span> 
                    <Link href="/explore?subcategory=action-figures" className="hover:underline">Action Figures</Link>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[var(--color-cream-base)] opacity-80 rounded-full"></span> 
                    <Link href="/explore?subcategory=funko-pops" className="hover:underline">Funko Pops</Link>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[var(--color-cream-base)] opacity-80 rounded-full"></span> 
                    <Link href="/explore?subcategory=rare-collectibles" className="hover:underline">Rare Collectibles</Link>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[var(--color-cream-base)] opacity-80 rounded-full"></span> 
                    <Link href="/explore?subcategory=trading-cards" className="hover:underline">Trading Cards</Link>
                  </li>
                </ul>
                <Link href="/explore?category=collectibles" className="inline-flex items-center gap-2 text-white font-bold hover:gap-3 transition-all font-[family-name:var(--font-jakarta)] uppercase tracking-wider text-sm border-b-2 border-white pb-1">
                  Discover Rarities <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 10. Featured Creators */}
        <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-bc-cream-dark)] border-t border-[var(--color-border-subtle)]">
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
                  <h3 className="text-heading-sm mt-6 mb-1 flex items-center justify-center gap-1 font-[family-name:var(--font-playfair)]">
                    {creator.name}
                    {creator.verified && <CheckCircle className="w-4 h-4 text-[var(--color-success-600)]" strokeWidth={2} />}
                  </h3>
                  <p className="text-caption text-[var(--color-terracotta-600)] mb-3 uppercase tracking-wider font-[family-name:var(--font-jakarta)]">{creator.specialty}</p>
                  <p className="text-body-md text-[var(--color-ink-500)] px-6 line-clamp-3 mb-4 h-[66px] font-[family-name:var(--font-jakarta)]">{creator.bio}</p>
                  <div className="flex justify-center items-center gap-1 text-[var(--color-ink-900)] mb-2">
                    <span className="text-caption font-bold font-[family-name:var(--font-jakarta)]">{creator.rating}</span>
                    <div className="flex gap-0.5 text-[var(--color-terracotta-600)]">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-[var(--color-terracotta-600)]" />)}
                    </div>
                  </div>
                  
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* 5. New Arrivals */}
        {newArrivals.length > 0 && (
          <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-bc-cream-light)] border-t border-[var(--color-border-subtle)]">
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
                  Explore More New Arrivals <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>
        )}
        {/* 11. Gifts With a Story */}
        <section className="py-24 bg-[var(--color-bc-cream-mid)] px-[var(--space-5)] xl:px-[var(--space-8)] overflow-hidden">
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
                  <h3 className="absolute bottom-6 w-full text-center text-lg font-semibold text-white px-2 z-20 font-[family-name:var(--font-playfair)]">{item.occ}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* 12. Community Voices */}
        <section className="py-24 bg-[var(--color-bc-cream-dark)] px-[var(--space-5)] xl:px-[var(--space-8)] border-y border-[var(--color-border-subtle)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-lg text-[var(--color-ink-900)] text-center mb-16 font-[family-name:var(--font-playfair)]">
              Community Voices
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {[1, 2, 3].map((i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="bg-white px-8 py-8 rounded-[var(--radius-md)] shadow-sm border border-[var(--color-border-subtle)] flex flex-col justify-between h-full">
                  <div>
                    <span className="text-display-xl text-[var(--color-terracotta-600)] leading-none mb-2 block font-[family-name:var(--font-playfair)]">"</span>
                    <p className="text-body-lg italic text-[var(--color-ink-900)] mb-8 font-[family-name:var(--font-jakarta)] leading-relaxed">
                      {i === 1 ? "I finally found a platform that values the time it takes to handcraft furniture." : i === 2 ? "The live auctions are thrilling. Won an amazing antique clock last week!" : "Best place to discover hidden artistic talent across India."}
                    </p>
                  </div>
                  <div className="mt-auto">
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
                          {i === 1 ? "4.5" : i === 2 ? "4.0" : "5.0"}
                          <Star className="w-3.5 h-3.5 fill-[var(--color-terracotta-600)] -translate-y-px" />
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

          {/* Content ├óΓé¼ΓÇ¥ centered over image */}
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
