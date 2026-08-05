'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import { CheckCircle, ArrowRight, Star } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import { ProductCard } from '@/components/product-card'
import { Listing } from '@/lib/api'

const heroImages = [
  'https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785939436/bidcraft_homepage/tnh13yhuimkuemtdazgx.jpg',
  'https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785939437/bidcraft_homepage/vitgez1gyc4x8p7q0xud.jpg',
  'https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785939438/bidcraft_homepage/yrxoyuhplywepgs65jbp.jpg',
  'https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785939439/bidcraft_homepage/vcjozgmijfss1d0ubr8t.jpg'
]

const featuredCreators = [
  { id: 1, name: 'Sneha Agarwal', specialty: 'Oil & Watercolour Paintings · Pune', bio: 'Capturing monsoons, marigolds, and memories through layered oil and watercolour canvases.', rating: '4.9', reviews: 91, followers: '142', verified: true, avatarInitials: 'SA', avatarBg: 'bg-[var(--color-terracotta-600)]', cover: 'https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785939448/bidcraft_homepage/fezquh2czx7rsbkhjlhu.jpg' },
  { id: 2, name: 'Vikram Rao', specialty: 'Stone & Clay Sculpture · Jaipur', bio: 'Shaping raw stone and clay into forms that carry the weight of Indian craft traditions.', rating: '4.8', reviews: 43, followers: '89', verified: true, avatarInitials: 'VR', avatarBg: 'bg-[var(--color-slate-700)]', cover: 'https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785939449/bidcraft_homepage/sz90uzcbjyv4udf6vzbz.jpg' },
  { id: 3, name: 'Aisha Malik', specialty: 'Handmade Jewellery · Hyderabad', bio: 'Crafting delicate silver and beadwork pieces rooted in Hyderabadi craft heritage.', rating: '5.0', reviews: 118, followers: '175', verified: true, avatarInitials: 'AM', avatarBg: 'bg-[var(--color-success-600)]', cover: 'https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785939450/bidcraft_homepage/s6kpek5qhs9kc4ofahvi.jpg' },
  { id: 4, name: 'Karan Sethi', specialty: 'Rare Collectibles & Vintage Finds · Mumbai', bio: 'Sourcing forgotten treasures — from vintage die-cast cars to first-edition comics — for serious collectors.', rating: '4.7', reviews: 67, followers: '112', verified: false, avatarInitials: 'KS', avatarBg: 'bg-[var(--color-ink-700)]', cover: 'https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785939451/bidcraft_homepage/vl9xjni87r6wyhityuuw.jpg' }
]

const revealVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
}

export default function ClientHome({ newArrivals = [], liveAuctions = [], trendingListings = [] }: { newArrivals?: Listing[], liveAuctions?: Listing[], trendingListings?: Listing[] }) {
  const { user } = useAuthStore()
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
            <motion.div initial="hidden" animate="visible" variants={revealVariant} className="max-w-3xl">
              <span className="text-sm font-semibold tracking-widest text-white/90 uppercase mb-4 block font-[family-name:var(--font-montserrat)]">India's Premier Artisan Marketplace</span>
              <h1 className="text-3xl md:text-4xl text-white mb-6 leading-tight font-[family-name:var(--font-playfair)]">Where creativity becomes opportunity.</h1>
              <p className="text-body-md text-white/85 mb-8 max-w-xl font-[family-name:var(--font-montserrat)]">
                Discover unique handcrafted goods, bid on rare collectibles, and support independent creators in India's premier marketplace.
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <Link href="/explore" className="bg-[var(--color-terracotta-600)] text-white text-body-md font-semibold px-8 py-3.5 rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors duration-fast text-center font-[family-name:var(--font-montserrat)]">
                  Explore Collection
                </Link>
                <Link href="/explore?type=auction" className="h-[52px] px-6 bg-white text-[var(--color-ink-900)] text-body-md font-bold rounded-[var(--radius-md)] flex items-center justify-center hover:bg-opacity-90 transition-all shadow-lg text-center font-[family-name:var(--font-montserrat)]">
                  Watch Live Auctions
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. Categories / Explore (Base Cream) */}
        <section className="py-20 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-base)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-md text-[var(--color-ink-900)] text-center mb-12 font-[family-name:var(--font-playfair)]">
              Explore by Category
            </motion.h2>
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:justify-center md:overflow-visible md:pb-0"
            >
              {[
                { name: 'Art', img: 'https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785939323/bidcraft_homepage/qkvjdhmeswpujgongm1t.jpg', slug: 'art' },
                { name: 'Handmade & Crafts', img: 'https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785939440/bidcraft_homepage/vykreutrgzw5m84kji3y.jpg', slug: 'handmade-crafts' },
                { name: 'Collectibles', img: 'https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785939442/bidcraft_homepage/wykivrgicjaxeglghw3m.jpg', slug: 'collectibles' },
                { name: 'Gaming & Hobby', img: 'https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785939443/bidcraft_homepage/rskqxwljtdmwhjnl3fpn.jpg', slug: 'gaming-hobby' },
                { name: 'Lifestyle & Gifts', img: 'https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785939444/bidcraft_homepage/pqf3qspqnar3hcy74fex.jpg', slug: 'lifestyle-gifts' }
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
                      <h3 className="text-body-lg font-semibold text-white font-[family-name:var(--font-playfair)]">{cat.name}</h3>
                      <div className="w-0 h-[1.5px] bg-white mt-1 transition-all duration-[250ms] ease-out group-hover:w-[24px]" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 3. Live Auctions (Deep Cream) */}
        {liveAuctions.length > 0 && (
          <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-deep)]">
            <div className="max-w-[var(--container-max)] mx-auto">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-display-md text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)]">Live Auctions</h2>
                <span className="flex items-center gap-2 text-sm font-medium font-[family-name:var(--font-montserrat)] bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Live Now
                </span>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-10">
                {liveAuctions.map((p, idx) => (
                  <ProductCard key={p.id} product={p} priority={idx < 4} />
                ))}
              </div>
              
              <div className="flex justify-center">
                <Link href="/explore?type=auction" className="inline-flex items-center gap-2 text-[var(--color-terracotta-600)] font-semibold hover:gap-3 transition-all text-body-md font-[family-name:var(--font-montserrat)]">
                  Explore More Live Auctions <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 4. Our Story (Base Cream) */}
        <section id="our-story" className="py-24 bg-[var(--color-cream-base)] px-[var(--space-5)] xl:px-[var(--space-8)]">
          <div className="max-w-[var(--container-max)] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
            <div className="w-full md:w-[45%] relative aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden shadow-sm">
              <Image 
                src="https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785939323/bidcraft_homepage/qkvjdhmeswpujgongm1t.jpg"
                fill
                alt="The story behind the craft"
                className="object-cover object-center"
              />
            </div>
            <div className="w-full md:w-[55%] flex flex-col items-start text-left">
              <span className="text-sm font-bold tracking-widest text-[var(--color-terracotta-600)] uppercase mb-4 block font-[family-name:var(--font-montserrat)]">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-playfair)] text-[var(--color-ink-900)] mb-6">The story behind the craft.</h2>
              <p className="text-body-md text-[var(--color-ink-700)] font-[family-name:var(--font-montserrat)] leading-relaxed mb-6">
                We believe that every handcrafted object carries a piece of its maker's soul. BidCraft was founded to connect discerning collectors with India's finest artisans, cutting out the middlemen to ensure creators earn what they deserve.
              </p>
              <p className="text-body-md text-[var(--color-ink-700)] font-[family-name:var(--font-montserrat)] leading-relaxed mb-10">
                BidCraft exists because great work deserves to be seen. Every purchase directly supports an independent creator.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 text-[var(--color-terracotta-600)] font-semibold hover:gap-3 transition-all text-body-md font-[family-name:var(--font-montserrat)]">
                Learn more about our mission <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Trending Now (Deep Cream) */}
        {trendingListings.length > 0 && (
          <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-deep)]">
            <div className="max-w-[var(--container-max)] mx-auto">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-display-md text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)]">Trending Now</h2>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-10">
                {trendingListings.map((p, idx) => (
                  <ProductCard key={p.id} product={p} priority={idx < 4} />
                ))}
              </div>
              
              <div className="flex justify-center">
                <Link href="/explore?type=trending" className="inline-flex items-center gap-2 text-[var(--color-terracotta-600)] font-semibold hover:gap-3 transition-all text-body-md font-[family-name:var(--font-montserrat)]">
                  View All Trending <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 6. Curated Collections (Base Cream) */}
        <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-base)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-md text-[var(--color-ink-900)] text-center mb-16 font-[family-name:var(--font-playfair)]">
              Curated Collections
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 h-auto lg:h-[600px]">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="md:col-span-2 lg:col-span-2 relative rounded-[var(--radius-lg)] overflow-hidden group h-[300px] lg:h-full cursor-pointer bg-[var(--color-cream-deep)]">
                <Link href="/explore?collection=vintage-retro" className="absolute inset-0 z-20"></Link>
                <Image src="https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785939445/bidcraft_homepage/vetu2nc2pb8djst0apcy.jpg" fill style={{ objectFit: 'cover' }} alt="Vintage & Retro" className="transition-transform duration-slow group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <div className="absolute bottom-8 left-8 z-20">
                  <h3 className="text-lg font-semibold text-white mb-2 font-[family-name:var(--font-playfair)]">Vintage & Retro</h3>
                </div>
              </motion.div>
              
              <div className="md:col-span-2 lg:col-span-1 grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-4 lg:gap-6 h-full">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="relative rounded-[var(--radius-lg)] overflow-hidden group h-[250px] lg:h-[calc(50%-12px)] cursor-pointer bg-[var(--color-cream-deep)]">
                  <Link href="/explore?collection=modern-minimalist" className="absolute inset-0 z-20"></Link>
                  <Image src="https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785939446/bidcraft_homepage/qwgtb4u5mpcye4qr5h4z.jpg" fill style={{ objectFit: 'cover' }} alt="Modern Minimalist" className="transition-transform duration-slow group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <div className="absolute bottom-6 left-6 z-20">
                    <h3 className="text-lg font-semibold text-white mb-1 font-[family-name:var(--font-playfair)]">Modern Minimalist</h3>
                  </div>
                </motion.div>
                
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="relative rounded-[var(--radius-lg)] overflow-hidden group h-[250px] lg:h-[calc(50%-12px)] cursor-pointer bg-[var(--color-cream-deep)]">
                  <Link href="/explore?collection=traditional-arts" className="absolute inset-0 z-20"></Link>
                  <Image src="https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785939447/bidcraft_homepage/mgnklxymyqdrjqa3xvvs.jpg" fill style={{ objectFit: 'cover' }} alt="Traditional Arts" className="transition-transform duration-slow group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <div className="absolute bottom-6 left-6 z-20">
                    <h3 className="text-lg font-semibold text-white mb-1 font-[family-name:var(--font-playfair)]">Traditional Arts</h3>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. New Arrivals (Deep Cream) */}
        {newArrivals.length > 0 && (
          <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-deep)]">
            <div className="max-w-[var(--container-max)] mx-auto">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-display-md text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)]">New Arrivals</h2>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-10">
                {newArrivals.map((p, idx) => (
                  <ProductCard key={p.id} product={p} priority={idx < 4} />
                ))}
              </div>
              
              <div className="flex justify-center">
                <Link href="/explore?sort=newest" className="inline-flex items-center gap-2 text-[var(--color-terracotta-600)] font-semibold hover:gap-3 transition-all text-body-md font-[family-name:var(--font-montserrat)]">
                  Explore More New Arrivals <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 8. Featured Creators (Base Cream) */}
        <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-base)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-md text-[var(--color-ink-900)] text-center mb-16 font-[family-name:var(--font-playfair)]">
              {user ? 'Creators You Follow' : 'Featured Creators'}
            </motion.h2>
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 sm:gap-6 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 pb-8 -mx-[var(--space-5)] px-[var(--space-5)] md:mx-0 md:px-0 md:pb-0 mb-8 md:mb-0">
              {featuredCreators.map((creator) => (
                <motion.div key={creator.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="shrink-0 w-[280px] sm:w-[320px] md:w-auto snap-start bg-white rounded-[var(--radius-md)] overflow-hidden shadow-sm border border-[var(--color-border-subtle)] text-center pb-6">
                  <div className="h-40 bg-[var(--color-cream-deep)] relative">
                    <Image src={creator.cover} fill style={{ objectFit: 'cover' }} alt="Cover" />
                  </div>
                  <h3 className="text-heading-sm mt-6 mb-1 flex items-center justify-center gap-1 font-[family-name:var(--font-playfair)]">
                    {creator.name}
                    {creator.verified && <CheckCircle className="w-4 h-4 text-[var(--color-success-600)]" strokeWidth={2} />}
                  </h3>
                  <p className="text-xs text-[var(--color-terracotta-600)] mb-3 uppercase tracking-wider font-[family-name:var(--font-montserrat)] font-semibold">{creator.specialty}</p>
                  <p className="text-sm text-[var(--color-ink-500)] px-6 line-clamp-3 mb-4 h-[60px] font-[family-name:var(--font-montserrat)]">{creator.bio}</p>
                  <div className="flex justify-center items-center gap-1 text-[var(--color-ink-900)] mb-2">
                    <span className="text-caption font-bold font-[family-name:var(--font-montserrat)]">{creator.rating}</span>
                    <div className="flex gap-0.5 text-[var(--color-terracotta-600)]">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-[var(--color-terracotta-600)]" />)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Community Voices (Deep Cream) */}
        <section className="py-24 bg-[var(--color-cream-deep)] px-[var(--space-5)] xl:px-[var(--space-8)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-md text-[var(--color-ink-900)] text-center mb-16 font-[family-name:var(--font-playfair)]">
              Community Voices
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {[1, 2, 3].map((i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="bg-white p-8 rounded-[var(--radius-md)] shadow-sm border border-[var(--color-border-subtle)] h-auto flex flex-col">
                  <div className="mb-8">
                    <span className="text-4xl text-[var(--color-terracotta-600)] leading-none mb-4 block font-[family-name:var(--font-playfair)]">"</span>
                    <p className="text-body-md italic text-[var(--color-ink-900)] font-[family-name:var(--font-montserrat)] leading-relaxed">
                      {i === 1 ? "I finally found a platform that values the time it takes to handcraft furniture." : i === 2 ? "The live auctions are thrilling. Won an amazing antique clock last week!" : "Best place to discover hidden artistic talent across India."}
                    </p>
                  </div>
                  <div className="mt-auto">
                    <div className="h-px w-full bg-[var(--color-border-subtle)] mb-6" />
                    <div className="flex items-center gap-4">
                      <Image 
                        src={i === 1 ? "https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785939452/bidcraft_homepage/mlt57z6msgvdskvjssoi.jpg" : i === 2 ? "https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785939454/bidcraft_homepage/btrciggwjxirtiatizgt.jpg" : "https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785939455/bidcraft_homepage/fczu06ikkfxvdtqmb8zi.webp"}
                        width={48} 
                        height={48} 
                        style={{ objectFit: 'cover' }}
                        alt={`User ${i}`}
                        className="rounded-full bg-[var(--color-ink-300)] w-[48px] h-[48px] min-w-[48px]"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)]">
                          {i === 1 ? "Priya S." : i === 2 ? "Arjun M." : "Nandita R."}
                        </p>
                        <div className="flex gap-1 text-[var(--color-terracotta-600)] text-xs mt-1 font-bold font-[family-name:var(--font-montserrat)]">
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

        {/* 10. Become a Seller CTA */}
        <section className="relative w-full min-h-[420px] md:min-h-[520px] flex items-center justify-center overflow-hidden py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-slate-900)]">
          <Image
            src="https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto/v1785784387/bidcraft_homepage/craft-livelihood-hero.jpg"
            alt="Artisan at work"
            fill
            className="object-cover object-center opacity-60"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

          <div className="relative z-10 text-center px-6 max-w-2xl mx-auto flex flex-col items-center">
            <span className="text-xs text-orange-300 tracking-widest uppercase mb-4 block font-semibold font-[family-name:var(--font-montserrat)]">FOR CREATORS & CURATORS</span>
            <h2 className="text-3xl md:text-4xl text-white mb-4 font-[family-name:var(--font-playfair)]">Turn your passion into a livelihood</h2>
            <p className="text-sm text-white/85 mb-10 leading-relaxed max-w-md font-[family-name:var(--font-montserrat)]">
              Join independent creators, curators, and collectors selling on BidCraft. List for free. Set your own prices. Reach buyers who truly value the rare and original.
            </p>
            <Link href="/sell" className="bg-[var(--color-terracotta-600)] text-white text-body-md font-bold px-10 py-4 rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors inline-flex items-center gap-2 group font-[family-name:var(--font-montserrat)] shadow-xl">
              Start Selling <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      
      </main>
    </div>
  )
}
