'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Shield, CheckCircle, Package, ArrowRight } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { ProductCard } from '@/components/product-card'
import { Product } from '@/lib/dbProducts'

const heroImages = [
  '/images/beautifully-crafted-colorful-crochet-flowers-in-a-blue-pot-on-a-dark-background-free-photo (1).jpeg',
  '/images/968355308d40d83a2e1f59daa61c5089.jpg',
  '/images/d400a85bd9cd68c5a2d8cda063dac7e0.jpg',
  '/images/586fa4c05a4543d441ec3c2bf877f807.jpg'
]

const featuredCreators = [
  { id: 1, name: 'Sneha Agarwal', specialty: 'Oil & Watercolour Paintings · Pune', bio: 'Capturing monsoons, marigolds, and memories through layered oil and watercolour canvases.', rating: '4.8', reviews: 91, followers: '634', verified: true, avatarInitials: 'SA', avatarBg: 'bg-[var(--color-terracotta-600)]', cover: '/images/dd5d9d9aaf49d3fac48af9d1b80001bb.jpg' },
  { id: 2, name: 'Vikram Rao', specialty: 'Stone & Clay Sculpture · Jaipur', bio: 'Shaping raw stone and clay into forms that carry the weight of Indian craft traditions.', rating: '4.6', reviews: 43, followers: '312', verified: true, avatarInitials: 'VR', avatarBg: 'bg-[var(--color-slate-700)]', cover: '/images/8891723f370ddd55a88b322a622406a2.jpg' },
  { id: 3, name: 'Aisha Malik', specialty: 'Handmade Jewellery · Hyderabad', bio: 'Crafting delicate silver and beadwork pieces rooted in Hyderabadi craft heritage.', rating: '4.7', reviews: 118, followers: '827', verified: true, avatarInitials: 'AM', avatarBg: 'bg-[var(--color-success-600)]', cover: '/images/d00d6edd9a33d14ce95b39d402b4e865.jpg' },
  { id: 4, name: 'Karan Sethi', specialty: 'Rare Collectibles & Vintage Finds · Mumbai', bio: 'Sourcing forgotten treasures — from vintage die-cast cars to first-edition comics — for serious collectors.', rating: '4.5', reviews: 67, followers: '489', verified: false, avatarInitials: 'KS', avatarBg: 'bg-[var(--color-ink-700)]', cover: '/images/1f92888deb74023c26ec86c954a18188.jpg' }
]

const revealVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
}

const LiveTimer = ({ endTime }: { endTime?: string }) => {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (!endTime) {
      setTimeLeft('Live')
      return
    }
    const update = () => {
      const distance = new Date(endTime).getTime() - new Date().getTime()
      if (distance < 0) {
        setTimeLeft('Ended')
        return
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [endTime])

  return <span>{timeLeft}</span>
}

export default function ClientHome({ newArrivals = [], liveAuctions = [] }: { newArrivals?: Product[], liveAuctions?: Product[] }) {
  const { user } = useStore()
  const [activeHeroIndex, setActiveHeroIndex] = useState(0)

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
              <span className="text-caption tracking-widest text-white/90 uppercase mb-4 block">Curated this week</span>
              <h1 className="text-display-xl text-white mb-6">Where creativity becomes opportunity.</h1>
              <p className="text-body-lg text-white/85 mb-8 max-w-xl">
                Discover unique handcrafted goods, bid on rare collectibles, and support independent creators in India's premier marketplace.
              </p>
              <div className="flex gap-4">
                <Link href="/explore" className="bg-[var(--color-terracotta-600)] text-white text-body-md font-semibold px-8 py-3.5 rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors duration-fast">
                  Explore Collection
                </Link>
                <Link href="/explore?type=auction" className="h-12 px-6 bg-white text-[var(--color-ink-900)] text-body-lg font-bold rounded-[var(--radius-md)] flex items-center justify-center hover:bg-opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg">
                  Watch Live Auctions
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. Explore by Category */}
        <section className="py-20 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-base)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-lg text-[var(--color-ink-900)] text-center mb-12">
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
                      <h3 className="text-heading-lg font-[var(--font-display)] font-semibold text-white">{cat.name}</h3>
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
              <span className="text-caption text-[var(--color-terracotta-600)] tracking-widest uppercase mb-4 block">HANDPICKED FOR YOU</span>
              <h2 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6 leading-tight">Art that tells a story before you say a word</h2>
              <p className="text-body-lg text-[var(--color-ink-700)] mb-8">
                Every piece on BidCraft is made by hand, by someone with a story. From Rajasthani block prints to Bangalore ceramicists — discover work that carries the weight of its making. No mass production. No middlemen. Just craft.
              </p>
              <Link href="/explore?category=handmade-crafts" className="flex items-center gap-2 text-body-md font-semibold text-[var(--color-terracotta-600)] hover:text-[var(--color-terracotta-700)] transition-colors group">
                Explore Handmade & Crafts <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="w-full lg:w-1/2 relative h-[400px] md:h-[500px] lg:h-[600px]">
              <div className="absolute inset-0 bg-[#C4501A]/10 z-10 mix-blend-multiply" />
              <Image src="/images/04809f445775b05edf65772b67c139d9.jpg" fill style={{ objectFit: 'cover' }} alt="Editorial Spotlight" />
            </motion.div>
          </div>
        </section>

        {/* 4. Live Auctions Rail (Rebuilt) */}
        {liveAuctions.length > 0 && (
          <section className="py-24 bg-[var(--color-cream-base)] border-y border-[var(--color-border-subtle)] overflow-hidden">
            <div className="max-w-[var(--container-max)] mx-auto px-[var(--space-5)] xl:px-[var(--space-8)]">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="flex items-center gap-4 mb-10">
                <h2 className="text-display-lg text-[var(--color-ink-900)]">Live Auctions</h2>
                <div className="flex items-center gap-2 bg-[var(--color-urgent-100)] border border-[var(--color-urgent-600)] px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-urgent-600)] animate-pulse" />
                  <span className="text-caption text-[var(--color-urgent-700)] uppercase font-bold tracking-wider">Live Now</span>
                </div>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {liveAuctions.map((auction) => (
                  <motion.div key={auction.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="snap-start hover-card bg-white rounded-[var(--radius-lg)] p-3 relative block">
                    <Link href={`/product/${auction.id}`} className="absolute inset-0 z-20" aria-label={`View ${auction.title}`}></Link>
                    <div className="relative aspect-[4/5] rounded-[var(--radius-md)] overflow-hidden mb-4 bg-[var(--color-cream-deep)]">
                      <Image 
                        src={
                          auction.image.startsWith('http') || auction.image.startsWith('/')
                            ? auction.image
                            : `https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto,w_500/${auction.image}`
                        } 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }} 
                        alt={auction.title} 
                        className="transition-transform duration-slow" 
                        loading="lazy"
                      />
                      <div className="absolute top-3 right-3 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm text-caption font-bold flex items-center gap-1.5 bg-[var(--color-urgent-600)] text-white z-10">
                        <span className="text-white">⏱</span> <LiveTimer endTime={auction.auctionEndTime} />
                      </div>
                    </div>
                    <div className="px-1 relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-[var(--color-terracotta-100)] rounded-full flex items-center justify-center text-[10px] font-bold text-[var(--color-terracotta-700)]">{auction.creator?.charAt(0)}</div>
                        <span className="text-caption text-[var(--color-ink-500)]">{auction.creator}</span>
                      </div>
                      <h3 className="text-heading-sm text-[var(--color-ink-900)] line-clamp-1 mb-4">{auction.title}</h3>
                      <div className="flex items-end justify-between pt-3 border-t border-[var(--color-border-subtle)]">
                        <div>
                          <p className="text-caption text-[var(--color-ink-500)] mb-0.5">Current Bid</p>
                          <p className="text-price text-[var(--color-ink-900)] animate-highlight-flash rounded px-1 -ml-1">₹{(auction.currentBid || auction.price).toLocaleString('en-IN')}</p>
                        </div>
                        <p className="text-caption text-[var(--color-ink-500)]">{auction.bidCount} Bids</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="flex justify-center">
                <Link href="/explore?type=auction" className="flex items-center gap-2 text-body-md font-semibold text-[var(--color-terracotta-600)] hover:text-[var(--color-terracotta-700)] transition-colors group">
                  Explore more live auctions <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        {/* 5. NEW: Editorial Spotlight 2 */}
        <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-raised)]">
          <div className="max-w-[var(--container-max)] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="w-full lg:w-1/2 relative h-[400px] md:h-[500px] lg:h-[600px] order-1">
              <div className="absolute inset-0 bg-[#C4501A]/10 z-10 mix-blend-multiply" />
              <Image src="/images/1f92888deb74023c26ec86c954a18188.jpg" fill style={{ objectFit: 'cover' }} alt="Vintage Find" loading="lazy" />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="w-full lg:w-1/2 flex flex-col items-start pl-0 lg:pl-8 order-2">
              <span className="text-caption text-[var(--color-terracotta-600)] tracking-widest uppercase mb-4 block">DID YOU KNOW</span>
              <h2 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6 leading-tight">Vintage finds. Rare pieces. Real stories.</h2>
              <p className="text-body-lg text-[var(--color-ink-700)] mb-8">
                Collectibles on BidCraft range from 1970s Bollywood memorabilia to hand-thrown terracotta from Kutch potters. Each piece arrives with provenance notes from the seller — so you know exactly what you're bringing home.
              </p>
              <Link href="/explore?category=collectibles" className="flex items-center gap-2 text-body-md font-semibold text-[var(--color-terracotta-600)] hover:text-[var(--color-terracotta-700)] transition-colors group">
                Browse Collectibles <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 6. New Arrivals (Rebuilt) */}
        <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-base)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="flex items-end justify-between mb-12">
              <h2 className="text-display-lg text-[var(--color-ink-900)]">New Arrivals</h2>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-6 lg:gap-8 mb-10">
              {newArrivals.map((p, idx) => (
                <motion.div key={p.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant}>
                  <ProductCard product={p} priority={idx < 4} />
                </motion.div>
              ))}
            </div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="flex justify-center">
              <Link href="/explore?sort=newest" className="flex items-center gap-2 text-body-md font-semibold text-[var(--color-terracotta-600)] hover:text-[var(--color-terracotta-700)] transition-colors group">
                Explore more new arrivals <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 7. Curated Collections (Clickable) */}
        <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-raised)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-lg text-[var(--color-ink-900)] text-center mb-16">
              Curated Collections
            </motion.h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 h-auto lg:h-[600px]">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="lg:col-span-2 relative rounded-[var(--radius-lg)] overflow-hidden group h-[300px] lg:h-full cursor-pointer bg-[var(--color-cream-deep)]">
                <Link href="/explore?collection=vintage-retro" className="absolute inset-0 z-20"></Link>
                <Image src="/images/ed2af0776b49fdea863a1ead90dadf19.jpg" fill style={{ objectFit: 'cover' }} alt="Vintage & Retro" className="transition-transform duration-slow group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <div className="absolute bottom-8 left-8 z-20">
                  <h3 className="text-display-md text-white mb-2">Vintage & Retro</h3>
                  <p className="text-body-md text-white/80">240 Items</p>
                </div>
              </motion.div>
              
              <div className="flex flex-col gap-4 lg:gap-6 h-full">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="relative rounded-[var(--radius-lg)] overflow-hidden group h-[250px] lg:h-[calc(50%-12px)] cursor-pointer bg-[var(--color-cream-deep)]">
                  <Link href="/explore?collection=modern-minimalist" className="absolute inset-0 z-20"></Link>
                  <Image src="/images/1572725d1d0bf7fa3ab6b92974a3fdfd.jpg" fill style={{ objectFit: 'cover' }} alt="Modern Minimalist" className="transition-transform duration-slow group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <div className="absolute bottom-6 left-6 z-20">
                    <h3 className="text-heading-lg text-white mb-1">Modern Minimalist</h3>
                    <p className="text-caption text-white/80">120 Items</p>
                  </div>
                </motion.div>
                
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="relative rounded-[var(--radius-lg)] overflow-hidden group h-[250px] lg:h-[calc(50%-12px)] cursor-pointer bg-[var(--color-cream-deep)]">
                  <Link href="/explore?collection=traditional-arts" className="absolute inset-0 z-20"></Link>
                  <Image src="/images/3599c4c65b94b61ec21a8d070cd401fe.jpg" fill style={{ objectFit: 'cover' }} alt="Traditional Arts" className="transition-transform duration-slow group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <div className="absolute bottom-6 left-6 z-20">
                    <h3 className="text-heading-lg text-white mb-1">Traditional Arts</h3>
                    <p className="text-caption text-white/80">85 Items</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Featured Creators */}
        <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-base)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-lg text-[var(--color-ink-900)] text-center mb-16">
              {user ? 'Creators You Follow' : 'Featured Creators'}
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredCreators.map((creator) => (
                <motion.div key={creator.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="bg-white rounded-[var(--radius-lg)] overflow-hidden shadow-sm border border-[var(--color-border-subtle)] text-center pb-6">
                  <div className="h-40 bg-[var(--color-cream-deep)] relative">
                    <Image src={creator.cover} fill style={{ objectFit: 'cover' }} alt="Cover" />
                  </div>
                  <h3 className="text-heading-lg mt-6 mb-1 flex items-center justify-center gap-1">
                    {creator.name}
                    {creator.verified && <CheckCircle className="w-4 h-4 text-[var(--color-success-600)]" strokeWidth={2} />}
                  </h3>
                  <p className="text-caption text-[var(--color-terracotta-600)] mb-3 uppercase tracking-wider">{creator.specialty}</p>
                  <p className="text-body-md text-[var(--color-ink-500)] px-6 line-clamp-3 mb-4 h-[66px]">{creator.bio}</p>
                  <div className="flex justify-center items-center gap-1 text-[var(--color-ink-900)] mb-2">
                    <span className="text-caption font-bold">{creator.rating}</span>
                    <span className="text-[var(--color-terracotta-600)] text-sm">★★★★★</span>
                    <span className="text-caption text-[var(--color-ink-300)]">({creator.reviews})</span>
                  </div>
                  <p className="text-caption text-[var(--color-ink-500)]">{creator.followers} followers</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Collector Spotlight */}
        <section className="w-full min-h-[480px] flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-[300px] md:h-auto relative bg-[var(--color-cream-deep)]">
            <Image src="/images/3331bf8da919ff1b47c345584f0f91a3.jpg" fill style={{ objectFit: 'cover', objectPosition: 'center' }} alt="Collector" />
          </div>
          <div className="w-full md:w-1/2 bg-[var(--color-slate-900)] p-12 lg:p-24 flex flex-col justify-center items-center text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="max-w-md">
              <span className="text-caption text-[var(--color-terracotta-600)] tracking-widest uppercase mb-4 block">Collector Spotlight</span>
              <h2 className="text-display-lg text-white mb-6">"BidCraft connected me with artisans I couldn't find anywhere else."</h2>
              <p className="text-body-lg text-white/80 mb-8">
                Discover the story behind Rahul's collection of rare Indian numismatics and antique brasswares sourced directly from village creators.
              </p>
              <button className="bg-white text-[var(--color-slate-900)] px-8 py-3 rounded-[var(--radius-md)] text-body-md font-semibold hover:bg-[var(--color-cream-raised)] transition-colors">
                Read Full Story
              </button>
            </motion.div>
          </div>
        </section>

        {/* 10. Gifts With a Story */}
        <section className="py-24 bg-[var(--color-cream-raised)] px-[var(--space-5)] xl:px-[var(--space-8)] overflow-hidden">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-lg text-[var(--color-ink-900)] text-center mb-12">
              Gifts With a Story
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { occ: 'For Her', slug: 'for-her', image: '/images/a344e75529581e9f43f2c00dc233dea4.webp' },
                { occ: 'For Him', slug: 'for-him', image: '/images/d156289ab52040263f59b16d6f3f5f2c.jpg' },
                { occ: 'Housewarming', slug: 'housewarming', image: '/images/27c1a7020f1f1ae13757444e6e302582.jpg' },
                { occ: 'Anniversary', slug: 'anniversary', image: '/images/4472fc60307774b77a3457158adcd98c.webp' },
                { occ: 'All Occasions', slug: 'all-occasions', image: '/images/417caba42ec36fd9ba441b33afd74e7c.jpg', colSpanMobile: true }
              ].map((item, i) => (
                <motion.div key={item.occ} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className={cn("relative rounded-[var(--radius-md)] overflow-hidden group cursor-pointer bg-[var(--color-cream-deep)] min-h-[220px]", item.colSpanMobile && "col-span-2 md:col-span-1 lg:col-span-1")}>
                  <Link href={`/explore?gift=${item.slug}`} className="absolute inset-0 z-20"></Link>
                  <Image src={item.image} fill style={{ objectFit: 'cover' }} alt={item.occ} className="transition-transform duration-slow group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                  <h3 className="absolute bottom-6 w-full text-center text-heading-lg text-white px-2 z-20">{item.occ}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 11. Trust Section (Buy and Sell With Confidence) */}
        <section className="py-24 bg-[var(--color-slate-900)] text-center px-[var(--space-5)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-lg text-white mb-16">
              Your money. Your art. Protected.
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
              {[
                { icon: '🔒', title: 'Escrow on Every Order', desc: 'Your payment is held securely until you confirm receipt. The seller is paid only after you approve. No exceptions.' },
                { icon: '✅', title: 'Verified Sellers', desc: 'Every seller on BidCraft goes through identity and bank verification before listing. Fake listings are flagged and removed within 24 hours.' },
                { icon: '🚚', title: 'Transparent Shipping', desc: 'Sellers commit to dispatch timelines upfront. Track your order end-to-end. If something goes wrong, our buyer protection kicks in.' }
              ].map((item, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="flex flex-col items-center text-center">
                  <div className="text-5xl mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-heading-sm text-white mb-3">{item.title}</h3>
                  <p className="text-caption text-white/70 max-w-xs">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 12. Community Voices */}
        <section className="py-24 bg-[var(--color-cream-base)] px-[var(--space-5)] xl:px-[var(--space-8)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-lg text-[var(--color-ink-900)] text-center mb-16">
              Community Voices
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="bg-[var(--color-cream-raised)] p-8 rounded-[var(--radius-md)]">
                  <span className="text-display-xl text-[var(--color-terracotta-600)] font-display leading-none mb-2 block">"</span>
                  <p className="text-body-lg font-display italic text-[var(--color-ink-900)] mb-8">
                    {i === 1 ? "I finally found a platform that values the time it takes to handcraft furniture." : i === 2 ? "The live auctions are thrilling. Won an amazing antique clock last week!" : "Best place to discover hidden artistic talent across India."}
                  </p>
                  <div className="h-px w-full bg-[var(--color-border-subtle)] mb-6" />
                  <div className="flex items-center gap-4">
                    <Image 
                      src={i === 1 ? "/images/5ac5f5ecddd67235241297452010a237.jpg" : i === 2 ? "/images/1da0c6767e60f79b79148794732a305f.jpg" : "/images/71d0457823cf94b6f1003b8c50253c61.webp"}
                      width={64} 
                      height={64} 
                      style={{ objectFit: 'cover' }}
                      alt={`User ${i}`}
                      className="rounded-full bg-[var(--color-ink-300)] border-2 border-[var(--color-terracotta-600)] w-16 h-16 min-w-[64px]"
                    />
                    <div>
                      <p className="text-heading-sm text-[var(--color-ink-900)]">User {i}</p>
                      <div className="flex gap-1 text-[var(--color-terracotta-600)] text-xs mt-1">★★★★★</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* 13. NEW: Become a Seller CTA */}
        <section className="py-24 bg-[#1C1C1C] text-center px-[var(--space-5)]">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <span className="text-caption text-[var(--color-terracotta-600)] tracking-widest uppercase mb-4 block">FOR CREATORS</span>
            <h2 className="text-display-xl font-display text-white mb-6">Turn your craft into a livelihood</h2>
            <p className="text-body-lg text-gray-300 mb-10">
              Join 2,000+ Indian artists and makers already selling on BidCraft. List for free. Set your own prices. Reach buyers who truly value handmade.
            </p>
            <Link href="/seller/register" className="bg-[var(--color-terracotta-600)] text-white text-body-lg font-bold px-10 py-4 rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors inline-flex items-center gap-2 group">
              Start Selling <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        {/* 13b. NEW: Our Story Strip */}
        <section id="our-story" className="py-16 bg-[var(--color-terracotta-100)] px-[var(--space-5)] xl:px-[var(--space-8)]">
          <div className="max-w-[var(--container-max)] mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="w-full md:w-1/2">
              <h2 className="text-display-lg font-display text-[var(--color-terracotta-900)] mb-4">The story behind the craft.</h2>
              <p className="text-body-lg text-[var(--color-terracotta-800)]">
                We believe that every handcrafted object carries a piece of its maker's soul. BidCraft was founded to connect discerning collectors with India's finest artisans, cutting out the middlemen to ensure creators earn what they deserve.
              </p>
            </div>
            <div className="w-full md:w-1/2 flex flex-col sm:flex-row justify-around gap-8 text-center md:text-left">
              <div>
                <p className="text-display-xl font-display text-[var(--color-terracotta-900)]">500+</p>
                <p className="text-body-md font-semibold text-[var(--color-terracotta-800)]">Creators</p>
              </div>
              <div>
                <p className="text-display-xl font-display text-[var(--color-terracotta-900)]">12k+</p>
                <p className="text-body-md font-semibold text-[var(--color-terracotta-800)]">Unique Items</p>
              </div>
              <div>
                <p className="text-display-xl font-display text-[var(--color-terracotta-900)]">4.9/5</p>
                <p className="text-body-md font-semibold text-[var(--color-terracotta-800)]">Average Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* 14. Newsletter (Non-logged-in) */}
        {!user && (
          <section className="py-24 bg-[var(--color-cream-raised)] px-[var(--space-5)]">
            <div className="max-w-[560px] mx-auto text-center">
              <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-lg text-[var(--color-ink-900)] mb-6">
                Never miss a masterpiece
              </motion.h2>
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-body-md text-[var(--color-ink-700)] mb-8">
                Join our newsletter for weekly curated drops, upcoming auctions, and exclusive creator interviews.
              </motion.p>
              <motion.form initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="flex gap-2 max-w-md mx-auto mb-4">
                <input type="email" placeholder="Email address" className="flex-1 h-12 rounded-[var(--radius-md)] px-4 bg-white border border-[var(--color-border-subtle)] text-body-md outline-none focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] transition-all" required />
                <button type="submit" className="h-12 px-6 bg-[var(--color-terracotta-600)] text-white text-body-md font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </motion.form>
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-caption text-[var(--color-ink-500)]">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </motion.p>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
