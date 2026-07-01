'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield, CheckCircle, Package, ArrowRight, Heart } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CloudinaryImage } from '@/components/CloudinaryImage'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

// Mock Data
const activeAuctions = [
  { id: 1, title: 'Vintage Hand-carved Chess Set', bid: 15000, count: 12, creator: 'Artisan Works', avatar: 'A', image: 'collection-1', end: '02:15:00' },
  { id: 2, title: 'Rare 1999 Hot Wheels Treasure Hunt', bid: 8500, count: 8, creator: 'WheelzCollector', avatar: 'W', image: 'cat-hotwheels', end: '00:45:30' },
  { id: 3, title: 'Abstract Oil Painting "Monsoon"', bid: 45000, count: 24, creator: 'Maya Das', avatar: 'M', image: 'cat-art', end: '05:10:00' },
]

const products = [
  { id: 'p1', title: 'Handwoven Silk Saree', price: 12500, creator: 'Weaves of India', avatar: 'W', image: 'cat-handmade' },
  { id: 'p2', title: 'Limited Edition Comic #1', price: 3400, creator: 'GeekVault', avatar: 'G', image: 'cat-collectibles' },
  { id: 'p3', title: 'Terracotta Vases (Set of 3)', price: 1800, creator: 'Earth&Fire', avatar: 'E', image: 'cat-crafts' },
  { id: 'p4', title: 'Custom Mechanical Keyboard', price: 14500, creator: 'KeyMech', avatar: 'K', image: 'cat-hobby' },
]

const revealVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
}

const ProductCard = ({ product }: { product: any }) => {
  const { toggleWishlist, wishlist, addToCart } = useStore()
  const isWishlisted = wishlist.some(w => w.productId === product.id)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addToCart({ id: Math.random().toString(), productId: product.id, title: product.title, price: product.price, quantity: 1, image: product.image })
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="group flex flex-col gap-3">
      <div className="relative aspect-[4/5] bg-[var(--color-cream-deep)] rounded-[var(--radius-md)] overflow-hidden">
        <CloudinaryImage publicId={product.image} width={400} height={500} alt={product.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-slow ease-default" />
        <button 
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart className={cn("w-4 h-4 transition-colors duration-fast", isWishlisted ? "fill-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)] scale-110" : "text-[var(--color-ink-700)]")} strokeWidth={1.5} />
        </button>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 bg-[var(--color-terracotta-100)] rounded-full flex items-center justify-center text-[10px] font-bold text-[var(--color-terracotta-700)]">{product.avatar}</div>
          <span className="text-caption text-[var(--color-ink-500)]">{product.creator}</span>
        </div>
        <h3 className="text-heading-sm text-[var(--color-ink-900)] line-clamp-2 leading-tight mb-1">{product.title}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-price text-[var(--color-ink-900)]">₹{product.price.toLocaleString('en-IN')}</span>
          <button onClick={handleAdd} className="text-caption font-semibold text-[var(--color-terracotta-600)] hover:text-[var(--color-terracotta-700)] transition-colors">
            {added ? 'Added ✓' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const { user } = useStore()

  return (
    <div className="min-h-screen bg-[var(--color-cream-base)]">
      <Navbar />

      <main>
        {/* 1. Hero */}
        <section className="relative w-full h-[640px] bg-[var(--color-slate-900)] overflow-hidden">
          <CloudinaryImage publicId="hero-main" width={1920} height={1080} alt="BidCraft Hero" priority className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute inset-0 w-full max-w-[var(--container-max)] mx-auto px-[var(--space-5)] xl:px-[var(--space-8)] flex flex-col justify-end pb-24">
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
              {products.map(p => (
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
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            >
              {[
                { name: 'Art', img: 'cat-art' },
                { name: 'Crafts', img: 'cat-crafts' },
                { name: 'Hot Wheels', img: 'cat-hotwheels' },
                { name: 'Collectibles', img: 'cat-collectibles' },
                { name: 'Handmade', img: 'cat-handmade' },
                { name: 'Hobby', img: 'cat-hobby' }
              ].map((cat) => (
                <motion.div key={cat.name} variants={revealVariant} className="group relative aspect-[4/5] rounded-[var(--radius-md)] overflow-hidden cursor-pointer snap-start">
                  <CloudinaryImage publicId={cat.img} width={300} height={400} alt={cat.name} className="w-full h-full object-cover transition-transform duration-slow ease-default group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-heading-lg text-white">{cat.name}</h3>
                    <div className="w-0 h-[2px] bg-white mt-1 transition-all duration-fast ease-out group-hover:w-full" />
                  </div>
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
                      <CloudinaryImage publicId={auction.image} width={400} height={500} alt={auction.title} className="w-full h-full object-cover transition-transform duration-slow" />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm text-caption font-bold text-[var(--color-ink-900)] flex items-center gap-1.5">
                        <span className="text-[var(--color-urgent-600)]">⏱</span> {auction.end}
                      </div>
                    </div>
                    <div className="px-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-[var(--color-terracotta-100)] rounded-full flex items-center justify-center text-[10px] font-bold text-[var(--color-terracotta-700)]">{auction.avatar}</div>
                        <span className="text-caption text-[var(--color-ink-500)]">{auction.creator}</span>
                      </div>
                      <h3 className="text-heading-sm text-[var(--color-ink-900)] line-clamp-1 mb-4">{auction.title}</h3>
                      <div className="flex items-end justify-between pt-3 border-t border-[var(--color-border-subtle)]">
                        <div>
                          <p className="text-caption text-[var(--color-ink-500)] mb-0.5">Current Bid</p>
                          <p className="text-price text-[var(--color-ink-900)] animate-highlight-flash rounded px-1 -ml-1">₹{auction.bid.toLocaleString('en-IN')}</p>
                        </div>
                        <p className="text-caption text-[var(--color-ink-500)]">{auction.count} Bids</p>
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
              {[1, 2, 3, 4].map((i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="bg-white rounded-[var(--radius-lg)] overflow-hidden shadow-sm border border-[var(--color-border-subtle)] text-center pb-6">
                  <div className="h-28 bg-[var(--color-cream-deep)] relative">
                    <CloudinaryImage publicId={`creator-cover-${i}`} width={400} height={150} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-white bg-[var(--color-terracotta-100)] mx-auto -mt-8 relative z-10 flex items-center justify-center text-heading-lg text-[var(--color-terracotta-700)] shadow-sm">
                    C{i}
                  </div>
                  <h3 className="text-heading-lg mt-3 mb-1">Creator {i}</h3>
                  <p className="text-caption text-[var(--color-terracotta-600)] mb-3 uppercase tracking-wider">Handmade Jewelry</p>
                  <p className="text-body-md text-[var(--color-ink-500)] px-6 line-clamp-2 mb-4">Crafting unique stories through ethically sourced silver and local Indian gems.</p>
                  <div className="flex justify-center items-center gap-1 text-[var(--color-ink-900)]">
                    <span className="text-caption font-bold">4.9</span>
                    <span className="text-[var(--color-terracotta-600)] text-sm">★★★★★</span>
                    <span className="text-caption text-[var(--color-ink-300)]">(120)</span>
                  </div>
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
              {products.concat(products).map((p, i) => (
                <motion.div key={`${p.id}-${i}`} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant}>
                  <ProductCard product={{...p, id: `${p.id}-${i}`}} />
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
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="lg:col-span-2 relative rounded-[var(--radius-lg)] overflow-hidden group h-[300px] lg:h-full cursor-pointer">
                <CloudinaryImage publicId="collection-1" width={800} height={600} alt="Vintage" className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-display-md text-white mb-2">Vintage & Retro</h3>
                  <p className="text-body-md text-white/80">240 Items</p>
                </div>
              </motion.div>
              
              <div className="flex flex-col gap-4 lg:gap-6 h-full">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="relative rounded-[var(--radius-lg)] overflow-hidden group h-[250px] lg:h-[calc(50%-12px)] cursor-pointer">
                  <CloudinaryImage publicId="collection-2" width={400} height={300} alt="Modern" className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-heading-lg text-white mb-1">Modern Minimalist</h3>
                    <p className="text-caption text-white/80">120 Items</p>
                  </div>
                </motion.div>
                
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="relative rounded-[var(--radius-lg)] overflow-hidden group h-[250px] lg:h-[calc(50%-12px)] cursor-pointer">
                  <CloudinaryImage publicId="collection-3" width={400} height={300} alt="Traditional" className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6">
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
          <div className="w-full md:w-1/2 h-[300px] md:h-auto relative">
            <CloudinaryImage publicId="spotlight-collector" width={800} height={800} alt="Collector" className="w-full h-full object-cover" />
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
              {['Birthdays', 'Anniversaries', 'Housewarming', 'Just Because', 'All Occasions'].map((occ, i) => (
                <motion.div key={occ} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="min-w-[200px] aspect-[3/4] relative rounded-[var(--radius-md)] overflow-hidden group snap-start cursor-pointer">
                  <CloudinaryImage publicId={`gift-${i+1}`} width={300} height={400} alt={occ} className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <h3 className="absolute bottom-6 w-full text-center text-heading-lg text-white px-2">{occ}</h3>
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
                    <div className="w-10 h-10 rounded-full bg-[var(--color-ink-300)]" />
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

      <Footer />
    </div>
  )
}
