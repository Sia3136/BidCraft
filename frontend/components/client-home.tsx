'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import { ShieldCheck, CheckCircle, Package, ArrowRight, Star } from 'lucide-react'
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

const LiveTimer = ({ endTime, onUrgent }: { endTime?: string, onUrgent?: (urgent: boolean) => void }) => {
  const [timeLeft, setTimeLeft] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)

  useEffect(() => {
    if (!endTime) {
      setTimeLeft('Live')
      setIsUrgent(false)
      onUrgent?.(false)
      return
    }
    const update = () => {
      const distance = new Date(endTime).getTime() - new Date().getTime()
      if (distance < 0) {
        setTimeLeft('Ended')
        setIsUrgent(false)
        onUrgent?.(false)
        return
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      
      const urgent = distance < (1000 * 60 * 60 * 24)
      if (isUrgent !== urgent) {
        setIsUrgent(urgent)
        onUrgent?.(urgent)
      }

      if (urgent) {
        setTimeLeft(`${hours}h ${minutes}m`)
      } else {
        setTimeLeft(`${days}d ${hours}h`)
      }
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [endTime, isUrgent, onUrgent])

  return <span>{timeLeft}</span>
}

export default function ClientHome({ newArrivals = [], liveAuctions = [] }: { newArrivals?: Listing[], liveAuctions?: Listing[] }) {
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
            <motion.div initial="hidden" animate="visible" variants={revealVariant} className="max-w-2xl">
              <span className="text-caption tracking-widest text-white/90 uppercase mb-4 block font-[family-name:var(--font-jakarta)]">Curated this week</span>
              <h1 className="text-4xl md:text-display-xl text-white mb-6 leading-tight font-[family-name:var(--font-playfair)]">Where creativity becomes opportunity.</h1>
              <p className="text-body-lg text-white/85 mb-8 max-w-xl font-[family-name:var(--font-jakarta)]">
                Discover unique handcrafted goods, bid on rare collectibles, and support independent creators in India's premier marketplace.
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <Link href="/explore" className="bg-[var(--color-terracotta-600)] text-white text-body-md font-semibold px-8 py-3.5 rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors duration-fast text-center font-[family-name:var(--font-jakarta)]">
                  Explore Collection
                </Link>
                <Link href="/explore?type=auction" className="h-12 px-6 bg-white text-[var(--color-ink-900)] text-body-lg font-bold rounded-[var(--radius-md)] flex items-center justify-center hover:bg-opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg text-center font-[family-name:var(--font-jakarta)]">
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

        {/* 3. NEW: Editorial Spotlight 1 */}
        <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-raised)]">
          <div className="max-w-[var(--container-max)] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="w-full lg:w-1/2 flex flex-col items-start pr-0 lg:pr-8">
              <span className="text-caption text-[var(--color-terracotta-600)] tracking-widest uppercase mb-4 block font-[family-name:var(--font-jakarta)]">HANDPICKED FOR YOU</span>
              <h2 className="text-display-lg text-[var(--color-ink-900)] mb-6 leading-tight font-[family-name:var(--font-playfair)]">Art that tells a story before you say a word</h2>
              <p className="text-body-lg text-[var(--color-ink-700)] mb-8 font-[family-name:var(--font-jakarta)]">
                Every piece on BidCraft is made by hand, by someone with a story. From Rajasthani block prints to Bangalore ceramicists — discover work that carries the weight of its making. No mass production. No middlemen. Just craft.
              </p>
              <Link href="/explore?category=handmade-crafts" className="flex items-center gap-2 text-body-md font-semibold text-[var(--color-terracotta-600)] hover:text-[var(--color-terracotta-700)] transition-colors group font-[family-name:var(--font-jakarta)]">
                Explore Handmade & Crafts <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="w-full lg:w-1/2 relative h-[400px] md:h-[500px] lg:h-[600px]">
              <div className="absolute inset-0 bg-[#C4501A]/10 z-10 mix-blend-multiply" />
              <Image src="/images/04809f445775b05edf65772b67c139d9.jpg" fill style={{ objectFit: 'cover' }} alt="Editorial Spotlight" />
            </motion.div>
          </div>
        </section>

        {/* 4. Live Auctions Rail */}
        {liveAuctions.length > 0 && (
          <section className="px-6 lg:px-16 py-14">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-[#1C1C1C] font-[family-name:var(--font-playfair)]">Live Auctions</h2>
              <span className="flex items-center gap-2 text-sm font-medium font-[family-name:var(--font-jakarta)]">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Live Now
              </span>
            </div>

            {/* 4 auction cards in one row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {liveAuctions.map(listing => (
                <ProductCard key={listing.id} product={listing} />
              ))}
            </div>

            {/* Explore more button */}
            <div className="mt-8 text-center">
              <Link
                href="/explore?type=auction"
                className="inline-flex items-center gap-2 text-[#C4501A] font-semibold hover:gap-3 transition-all"
              >
                Explore More Live Auctions <span>→</span>
              </Link>
            </div>
          </section>
        )}

                {/* 5. Our Story */}
        <section id="our-story" className="w-full min-h-[480px] flex flex-col md:flex-row bg-[var(--color-slate-900)]">
          <div className="w-full md:w-1/2 h-[240px] md:h-auto relative bg-[var(--color-cream-deep)]">
            <Image src="/images/5f2ab26c880e06709387b842cdd1feef.webp" fill style={{ objectFit: 'cover', borderRadius: '0' }} alt="Our Story" />
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
              <p className="text-body-lg text-[var(--color-cream-base)]/80 mb-6 font-[family-name:var(--font-jakarta)]">
                Whether it's an artist's first handmade piece, a student's passion project, or a collector searching for something rare, BidCraft brings them together in one secure ecosystem. With verified creators, protected transactions, and a marketplace designed for discovery, we make buying, selling, and auctioning unique creations simple and reliable.
              </p>
              <p className="text-body-lg text-[var(--color-cream-base)]/80 mb-10 font-[family-name:var(--font-jakarta)]">
                Our vision is to become the home of India's creative economy—where every creator, regardless of size or experience, has the confidence to showcase their talent, build their identity, and turn passion into lasting opportunity.
              </p>
              <Link href="/our-story" className="inline-block bg-[var(--color-terracotta-600)] text-white text-body-md font-semibold px-8 py-3.5 rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors duration-fast font-[family-name:var(--font-jakarta)]">
                Read Our Full Story
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 6. New Arrivals (Rebuilt) */}
        <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-raised)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="flex items-end justify-between mb-12">
              <h2 className="text-display-lg text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)]">New Arrivals</h2>
            </motion.div>
            
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 sm:gap-6 lg:gap-8 pb-8 -mx-[var(--space-5)] px-[var(--space-5)] xl:mx-0 xl:px-0 mb-10">
              {newArrivals.map((p, idx) => (
                <div key={p.id} className="snap-start shrink-0 w-[280px] sm:w-[320px] lg:w-[calc(25%-24px)] min-w-[280px]">
                  <ProductCard product={p} priority={idx < 4} />
                </div>
              ))}
            </div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="flex justify-center">
              <Link href="/explore?sort=newest" className="inline-flex items-center gap-2 text-[#C4501A] font-semibold hover:gap-3 transition-all">
                Explore More New Arrivals <span>→</span>
              </Link>
            </motion.div>
          </div>
        </section>



        {/* 7. Curated Collections (Clickable) */}
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

        {/* 8. Featured Creators */}
        <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-raised)]">
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


        {/* 9. Manifesto */}
        <section className="relative overflow-hidden py-16 w-full bg-[var(--color-cream-base)]" style={{ minHeight: '380px', borderTop: '2px solid #B06A42', borderBottom: '2px solid #B06A42' }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none' }}>
            <filter id="paper"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
            <rect width="100%" height="100%" filter="url(#paper)"/>
          </svg>
          <div className="max-w-[var(--container-max)] mx-auto flex flex-col items-center justify-center h-full relative z-10 px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} viewport={{ once: true }} className="flex flex-col items-center w-full text-center">
              <div style={{ width: '120px', height: '1px', backgroundColor: '#C9B7A8', marginBottom: '32px' }} />
              <span className="font-[family-name:var(--font-jakarta)]" style={{ textTransform: 'uppercase', letterSpacing: '0.25em', fontSize: '11px', color: '#B06A42', marginBottom: '24px' }}>
                MANIFESTO
              </span>
              <h2 style={{ color: '#2B211C', lineHeight: 1.1, marginBottom: '32px' }} className="text-4xl md:text-[58px] font-medium font-[family-name:var(--font-playfair)]">
                We don't celebrate mass production.<br />We celebrate originality.
              </h2>
              <p className="font-[family-name:var(--font-jakarta)]" style={{ fontSize: '20px', color: 'rgba(43, 33, 28, 0.7)', maxWidth: '620px', marginBottom: '40px' }}>
                Whether it's an original painting, a handmade ceramic mug, or a limited-edition collectible, every listing belongs here because someone cared enough to create or preserve it.
              </p>
              <Link href="/explore" className="group inline-flex items-center font-[family-name:var(--font-jakarta)]" style={{ fontSize: '16px', color: '#B06A42', marginBottom: '32px' }}>
                Explore Marketplace <span className="transition-transform duration-200 ease-out group-hover:translate-x-[6px] inline-block ml-1">&rarr;</span>
              </Link>
              <div style={{ width: '120px', height: '1px', backgroundColor: '#C9B7A8' }} />
            </motion.div>
          </div>
        </section>

        {/* 10. Gifts With a Story */}
        <section className="py-24 bg-[var(--color-cream-raised)] px-[var(--space-5)] xl:px-[var(--space-8)] overflow-hidden">
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
        <section className="py-24 bg-[var(--color-cream-base)] px-[var(--space-5)] xl:px-[var(--space-8)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-lg text-[var(--color-ink-900)] text-center mb-16 font-[family-name:var(--font-playfair)]">
              Community Voices
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="bg-[var(--color-cream-raised)] p-8 rounded-[var(--radius-md)] flex flex-col justify-between">
                  <div>
                    <span className="text-display-xl text-[var(--color-terracotta-600)] leading-none mb-2 block font-[family-name:var(--font-playfair)]">"</span>
                    <p className="text-body-lg italic text-[var(--color-ink-900)] mb-8 font-[family-name:var(--font-jakarta)]">
                      {i === 1 ? "I finally found a platform that values the time it takes to handcraft furniture." : i === 2 ? "The live auctions are thrilling. Won an amazing antique clock last week!" : "Best place to discover hidden artistic talent across India."}
                    </p>
                  </div>
                  <div>
                    <div className="h-px w-full bg-[var(--color-border-subtle)] mb-6" />
                    <div className="flex items-center gap-4">
                      <Image 
                        src={i === 1 ? "/images/5ac5f5ecddd67235241297452010a237.jpg" : i === 2 ? "/images/1da0c6767e60f79b79148794732a305f.jpg" : "/images/71d0457823cf94b6f1003b8c50253c61.webp"}
                        width={96} 
                        height={96} 
                        style={{ objectFit: 'cover' }}
                        alt={`User ${i}`}
                        className="rounded-full bg-[var(--color-ink-300)] border-[2px] border-solid border-[var(--color-terracotta-600)] w-[96px] h-[96px] min-w-[96px]"
                      />
                      <div>
                        <p className="text-heading-sm text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)]">
                          {i === 1 ? "Priya S." : i === 2 ? "Arjun M." : "Nandita R."}
                        </p>
                        <div className="flex gap-1 text-[var(--color-terracotta-600)] text-sm mt-1 font-bold font-[family-name:var(--font-jakarta)]">
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
        
        {/* 13. NEW: Become a Seller CTA */}
        <section className="relative w-full min-h-[420px] md:min-h-[520px] flex items-center justify-center overflow-hidden py-24 px-[var(--space-5)] xl:px-[var(--space-8)]">
          {/* Background image */}
          <Image
            src="https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785425296/bidcraft/homepage/craft-livelihood-hero.jpg"
            alt="Artisan at work"
            fill
            className="object-cover object-center"
            priority={false}
          />
          {/* Dark gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />

          {/* Content — centered over image */}
          <div className="relative z-10 text-center px-6 max-w-2xl mx-auto flex flex-col items-center">
            <span className="text-xs text-orange-300 tracking-widest uppercase mb-4 block font-semibold font-[family-name:var(--font-jakarta)]">FOR CREATORS</span>
            <h2 className="text-3xl md:text-4xl text-white mb-4 font-[family-name:var(--font-playfair)]">Turn your craft into a livelihood</h2>
            <p className="text-sm text-white/85 mb-10 leading-relaxed max-w-md font-[family-name:var(--font-jakarta)]">
              Join Indian artists and makers already selling on BidCraft. List for free. Set your own prices. Reach buyers who truly value handmade.
            </p>
            <Link href="/sell" className="bg-[var(--color-terracotta-600)] text-white text-body-lg font-bold px-10 py-4 rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors inline-flex items-center gap-2 group font-[family-name:var(--font-jakarta)]">
              Start Selling <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

      
        </main>
    </div>
  )
}
