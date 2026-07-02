'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Shield, CheckCircle, Package, Heart } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CloudinaryImage } from '@/components/CloudinaryImage'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { ProductCard } from '@/components/product-card'
import { Product } from '@/lib/dbProducts'
// Mock Data removed


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



export default function ClientHome({ allProducts }: { allProducts: Product[] }) {
  const { user } = useStore()
  const [activeHeroIndex, setActiveHeroIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const products = allProducts;
  const activeAuctions = allProducts.filter((p) => p.buyingMethod === 'Auction').slice(0, 4);

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
          <div 
            style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to top, rgba(43,42,40,0.55) 0%, rgba(43,42,40,0) 60%)' }} 
          />
          
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
                <Link href="/auctions" className="border border-white/30 text-white text-body-md font-semibold px-8 py-3.5 rounded-[var(--radius-md)] hover:bg-white/10 transition-colors duration-fast">
                  Watch Live Auctions
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. Resume Where You Left Off (Logged in) */}
        {user && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={revealVariant} className="py-16 px-[var(--space-5)] xl:px-[var(--space-8)] max-w-[var(--container-max)] mx-auto">
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-6">Recently Viewed</h2>
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar">
              {products.slice(0,4).map(p => (
                <div key={p.id} className="min-w-[200px] md:min-w-[240px] snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* 3. Featured Categories */}
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
                  <Link href={`/category/${cat.slug}`} className="group block relative aspect-[4/5] rounded-[var(--radius-md)] overflow-hidden cursor-pointer bg-[var(--color-cream-deep)]">
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

        {/* 4. Live Auctions Rail */}
        {activeAuctions.length > 0 && (
          <section className="py-20 bg-[var(--color-cream-raised)] border-y border-[var(--color-border-subtle)] overflow-hidden">
            <div className="max-w-[var(--container-max)] mx-auto px-[var(--space-5)] xl:px-[var(--space-8)]">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="flex items-center gap-4 mb-10">
                <h2 className="text-display-lg text-[var(--color-ink-900)]">Live Auctions</h2>
                <div className="flex items-center gap-2 bg-[var(--color-urgent-100)] border border-[var(--color-urgent-600)] px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-urgent-600)] animate-pulse" />
                  <span className="text-caption text-[var(--color-urgent-700)] uppercase font-bold tracking-wider">Live Now</span>
                </div>
              </motion.div>
              
              <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                {activeAuctions.map((auction) => (
                  <motion.div key={auction.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="min-w-[280px] md:min-w-[320px] snap-start hover-card bg-white rounded-[var(--radius-lg)] p-3">
                    <div className="relative aspect-[4/5] rounded-[var(--radius-md)] overflow-hidden mb-4 bg-[var(--color-cream-deep)]">
                      <Image src={auction.image} fill style={{ objectFit: 'cover' }} alt={auction.title} className="transition-transform duration-slow" />
                      <div className={cn("absolute top-3 right-3 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm text-caption font-bold flex items-center gap-1.5", auction.end?.startsWith("00:") ? "bg-[var(--color-urgent-600)] text-white" : "bg-white/90 text-[var(--color-ink-900)]")}>
                        <span className={cn(auction.end?.startsWith("00:") ? "text-white" : "text-[var(--color-urgent-600)]")}>⏱</span> {auction.end || '48:00:00'}
                      </div>
                    </div>
                    <div className="px-1">
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
            </div>
          </section>
        )}

        {/* 5. Featured Creators */}
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

        {/* 6. New Arrivals */}
        <section className="py-20 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-base)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="flex items-end justify-between mb-12">
              <h2 className="text-display-lg text-[var(--color-ink-900)]">{user ? 'Picked For You' : 'New Arrivals'}</h2>
              <Link href="/explore" className="text-body-md font-medium text-[var(--color-terracotta-600)] hover:underline mb-2 hidden sm:block">View All →</Link>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-6 lg:gap-8">
              {products.map((p, i) => (
                <motion.div key={p.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Curated Collections */}
        <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-raised)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-lg text-[var(--color-ink-900)] text-center mb-16">
              Curated Collections
            </motion.h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 h-auto lg:h-[600px]">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="lg:col-span-2 relative rounded-[var(--radius-lg)] overflow-hidden group h-[300px] lg:h-full cursor-pointer bg-[var(--color-cream-deep)]">
                <Image src="/images/ed2af0776b49fdea863a1ead90dadf19.jpg" fill style={{ objectFit: 'cover' }} alt="Vintage & Retro" className="transition-transform duration-slow group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <div className="absolute bottom-8 left-8 z-20">
                  <h3 className="text-display-md text-white mb-2">Vintage & Retro</h3>
                  <p className="text-body-md text-white/80">240 Items</p>
                </div>
              </motion.div>
              
              <div className="flex flex-col gap-4 lg:gap-6 h-full">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="relative rounded-[var(--radius-lg)] overflow-hidden group h-[250px] lg:h-[calc(50%-12px)] cursor-pointer bg-[var(--color-cream-deep)]">
                  <Image src="/images/1572725d1d0bf7fa3ab6b92974a3fdfd.jpg" fill style={{ objectFit: 'cover' }} alt="Modern Minimalist" className="transition-transform duration-slow group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <div className="absolute bottom-6 left-6 z-20">
                    <h3 className="text-heading-lg text-white mb-1">Modern Minimalist</h3>
                    <p className="text-caption text-white/80">120 Items</p>
                  </div>
                </motion.div>
                
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="relative rounded-[var(--radius-lg)] overflow-hidden group h-[250px] lg:h-[calc(50%-12px)] cursor-pointer bg-[var(--color-cream-deep)]">
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

        {/* 8. Collector Spotlight */}
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

        {/* 9. Handmade Gifts */}
        <section className="py-24 bg-[var(--color-cream-raised)] px-[var(--space-5)] xl:px-[var(--space-8)] overflow-hidden">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-lg text-[var(--color-ink-900)] text-center mb-12">
              Gifts With a Story
            </motion.h2>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {[
                { occ: 'Birthdays', image: '/images/3331bf8da919ff1b47c345584f0f91a3.jpg' },
                { occ: 'Anniversaries', image: '/images/4134888be62cfb9c24de55ff67ed1ff6.jpg' },
                { occ: 'Housewarming', image: '/images/491b292e10db0e5fc502847a9ffec01a.jpg' },
                { occ: 'Just Because', image: '/images/674d816aef7f339f4d7629dd08bd2f11.jpg' },
                { occ: 'All Occasions', image: '/images/a9497e74360e224e75618fce1b4447dd.jpg' }
              ].map((item, i) => (
                <motion.div key={item.occ} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="min-w-[200px] aspect-[3/4] relative rounded-[var(--radius-md)] overflow-hidden group snap-start cursor-pointer bg-[var(--color-cream-deep)]">
                  <Image src={item.image} fill style={{ objectFit: 'cover' }} alt={item.occ} className="transition-transform duration-slow group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                  <h3 className="absolute bottom-6 w-full text-center text-heading-lg text-white px-2 z-20">{item.occ}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. Trust Section */}
        <section className="py-24 bg-[var(--color-slate-900)] text-center px-[var(--space-5)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-lg text-white mb-6">
              Buy and sell with confidence
            </motion.h2>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-body-lg text-white/80 max-w-2xl mx-auto mb-16">
              Our comprehensive protection programs ensure every transaction is secure, from the moment you bid to the moment it arrives.
            </motion.p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 max-w-4xl mx-auto">
              {[
                { icon: Shield, title: 'Escrow Protection', desc: 'Funds are held securely until you receive and approve your item.' },
                { icon: CheckCircle, title: 'Verified Creators', desc: 'Every seller undergoes strict KYC and quality checks before joining.' },
                { icon: Package, title: 'Insured Shipping', desc: 'All high-value collectibles are shipped with full transit insurance.' }
              ].map((item, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-6">
                    <item.icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-heading-sm text-white mb-3">{item.title}</h3>
                  <p className="text-caption text-white/70 max-w-xs">{item.desc}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.button initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="border border-white/30 text-white px-8 py-3 rounded-[var(--radius-md)] text-body-md font-semibold hover:bg-white/10 transition-colors">
              Learn How Escrow Works
            </motion.button>
          </div>
        </section>

        {/* 11. Testimonials */}
        <section className="py-24 bg-[var(--color-cream-base)] px-[var(--space-5)] xl:px-[var(--space-8)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-lg text-[var(--color-ink-900)] text-center mb-16">
              Community Voices
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="bg-[var(--color-cream-raised)] p-8 rounded-[var(--radius-md)]">
                  <span className="text-display-xl text-[var(--color-terracotta-600)] font-display leading-none mb-2 block">"</span>
                  <p className="text-body-lg font-display italic text-[var(--color-ink-900)] mb-8">
                    {i === 1 ? "I finally found a platform that values the time it takes to handcraft furniture." : i === 2 ? "The live auctions are thrilling. Won an amazing antique clock last week!" : "Best place to discover hidden artistic talent across India."}
                  </p>
                  <div className="h-px w-full bg-[var(--color-border-subtle)] mb-6" />
                  <div className="flex items-center gap-3">
                    <Image 
                      src={i === 1 ? "/images/03b5f7e44b827e8574483a31c50400cc.jpg" : i === 2 ? "/images/3eb29e504c405aefb1ba27f80db61db7.jpg" : "/images/7c4ab5f2316e16cf7d86f78f85f3bc7a.jpg"}
                      width={40} 
                      height={40} 
                      style={{ objectFit: 'cover' }}
                      alt={`User ${i}`}
                      className="rounded-full bg-[var(--color-ink-300)]"
                    />
                    <div>
                      <p className="text-heading-sm text-[var(--color-ink-900)]">User {i}</p>
                      <p className="text-caption text-[var(--color-ink-500)]">{i === 1 ? 'Creator' : 'Collector'}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 12. Newsletter (Non-logged-in) */}
        {!user && (
          <section className="py-24 bg-[var(--color-cream-raised)] px-[var(--space-5)] border-t border-[var(--color-border-subtle)]">
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
