const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'frontend', 'components', 'client-home.tsx');

const content = `'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Listing } from '@/lib/api'
import { ProductCard } from '@/components/product-card'
import { ArrowRight } from 'lucide-react'

// Using the same animation variants as before to maintain consistency
const revealVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

export default function ClientHome({ newArrivals = [], liveAuctions = [], trendingListings = [], user }: { newArrivals?: Listing[], liveAuctions?: Listing[], trendingListings?: Listing[], user?: any }) {
  return (
    <div className="w-full bg-[var(--color-cream-base)]">

      {/* 1. Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-[var(--color-ink-900)] z-0" />
        {/* Note: This image is a placeholder for the hero */}
        <Image 
          src="/images/2f2323e20ec4d3d20eb58b68ec2b64d0.jpg" 
          alt="BidCraft Hero" 
          fill 
          priority 
          className="object-cover opacity-60 mix-blend-overlay z-0"
        />
        
        <div className="relative z-10 max-w-[800px] mx-auto text-center px-[var(--space-5)]">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-[42px] leading-[1.1] md:text-[64px] lg:text-[72px] text-white font-[family-name:var(--font-playfair)] mb-6"
          >
            The Destination for Original Creations
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-body-lg md:text-[20px] text-[var(--color-cream-base)] mb-10 max-w-[600px] mx-auto font-[family-name:var(--font-jakarta)] font-light"
          >
            Discover handcrafted goods, rare collectibles, and timeless objects curated from independent artisans across India.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          >
            <Link 
              href="/explore" 
              className="inline-flex h-14 items-center justify-center bg-[var(--color-terracotta-600)] text-white px-8 text-body-lg font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors font-[family-name:var(--font-jakarta)]"
            >
              Explore the Marketplace
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Explore by Category */}
      <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-base)]">
        <div className="max-w-[var(--container-max)] mx-auto">
          <motion.h2 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={revealVariant} 
            className="text-display-lg text-[var(--color-ink-900)] text-center mb-16 font-[family-name:var(--font-playfair)]"
          >
            Explore by Category
          </motion.h2>
          
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 lg:gap-8"
          >
            {[
              { name: 'Handmade', icon: '🏺', slug: 'handmade' },
              { name: 'Art', icon: '🎨', slug: 'art' },
              { name: 'Home Décor', icon: '🪔', slug: 'home-decor' },
              { name: 'Jewelry', icon: '✨', slug: 'jewelry' },
              { name: 'Vintage', icon: '📻', slug: 'vintage' },
              { name: 'Collectibles', icon: '🃏', slug: 'collectibles' }
            ].map((cat) => (
              <motion.div key={cat.slug} variants={revealVariant}>
                <Link href={\`/explore?category=\${cat.slug}\`} className="group flex flex-col items-center text-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-[var(--color-cream-deep)] flex items-center justify-center text-[32px] group-hover:bg-[var(--color-terracotta-600)] group-hover:text-white transition-all duration-300 shadow-sm border border-[var(--color-border-subtle)]">
                    {cat.icon}
                  </div>
                  <span className="text-body-md font-semibold text-[var(--color-ink-900)] group-hover:text-[var(--color-terracotta-600)] transition-colors font-[family-name:var(--font-jakarta)]">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. Live Auctions (Commerce) */}
      {liveAuctions.length > 0 && (
        <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-raised)] border-t border-[var(--color-border-subtle)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-display-lg text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)] mb-2 flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#D13B3B] animate-pulse"></span>
                  Live Auctions
                </h2>
                <p className="text-body-lg text-[var(--color-ink-700)] font-[family-name:var(--font-jakarta)]">Rare finds and collectibles ending soon.</p>
              </div>
              <Link href="/explore?type=auction" className="text-body-md font-bold text-[var(--color-terracotta-600)] hover:text-[var(--color-terracotta-700)] transition-colors flex items-center gap-2 group font-[family-name:var(--font-jakarta)]">
                View All Auctions <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {liveAuctions.map((p, idx) => (
                <ProductCard key={p.id} product={p} priority={idx < 2} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. The BidCraft Philosophy (Storytelling) */}
      <section className="py-32 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-base)] relative overflow-hidden">
        {/* Subtle texture/grain can be added via CSS if desired, keeping minimal for now */}
        <div className="max-w-[var(--container-max)] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={revealVariant}
              className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1"
            >
              <h2 className="text-[40px] leading-[1.1] md:text-[56px] text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)] mb-8">
                Things that deserve to be discovered.
              </h2>
              <div className="space-y-6 text-body-lg text-[var(--color-ink-700)] font-[family-name:var(--font-jakarta)] font-light leading-relaxed">
                <p>
                  BidCraft exists to push back against a world of mass production. We believe in the power of the human hand, the permanence of raw materials, and the timelessness of original design.
                </p>
                <p>
                  Every object here carries a story—a provenance shaped by the artisan who forged it, or the collector who preserved it.
                </p>
              </div>
              <div className="mt-12">
                <Link href="/our-story" className="text-body-md font-bold uppercase tracking-widest text-[var(--color-ink-900)] border-b border-[var(--color-ink-900)] pb-1 hover:text-[var(--color-terracotta-600)] hover:border-[var(--color-terracotta-600)] transition-colors">
                  Read the Manifesto
                </Link>
              </div>
            </motion.div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-6 lg:gap-10 order-1 lg:order-2">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[3/4] w-full bg-[var(--color-cream-deep)] overflow-hidden"
              >
                {/* [TODO: Replace with elegant artisan workspace placeholder image] */}
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center border border-[var(--color-border-subtle)]">
                  <span className="text-body-sm text-[var(--color-ink-500)] uppercase tracking-widest">[Placeholder: Artisan Workspace]</span>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[3/4] w-full mt-12 lg:mt-24 bg-[var(--color-cream-deep)] overflow-hidden"
              >
                {/* [TODO: Replace with close-up texture placeholder image (e.g., pottery clay or woven fabric)] */}
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center border border-[var(--color-border-subtle)]">
                  <span className="text-body-sm text-[var(--color-ink-500)] uppercase tracking-widest">[Placeholder: Material Texture]</span>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Trending Now (Commerce) */}
      {trendingListings.length > 0 && (
        <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-raised)] border-t border-[var(--color-border-subtle)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-display-lg text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)] mb-2">Trending Now</h2>
                <p className="text-body-lg text-[var(--color-ink-700)] font-[family-name:var(--font-jakarta)]">The most sought-after pieces this week.</p>
              </div>
              <Link href="/explore?type=trending" className="text-body-md font-bold text-[var(--color-terracotta-600)] hover:text-[var(--color-terracotta-700)] transition-colors flex items-center gap-2 group font-[family-name:var(--font-jakarta)]">
                View All Trending <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {trendingListings.map((p, idx) => (
                <ProductCard key={p.id} product={p} priority={idx < 2} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Discovery Paths (Discovery) */}
      <section className="py-32 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-base)]">
        <div className="max-w-[var(--container-max)] mx-auto">
          
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={revealVariant}
            className="mb-16 text-center max-w-[700px] mx-auto"
          >
            <h2 className="text-[32px] md:text-[48px] text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)] mb-6">
              Curated Galleries
            </h2>
            <p className="text-body-lg text-[var(--color-ink-700)] font-[family-name:var(--font-jakarta)] font-light">
              Step into our specialized collections, meticulously organized for the discerning collector and art enthusiast.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group flex flex-col"
            >
              <Link href="/explore?category=art&subcategory=paintings" className="flex flex-col h-full">
                <div className="relative aspect-[4/5] w-full bg-[var(--color-cream-deep)] mb-6 overflow-hidden">
                  {/* [TODO: Replace with elegant painting gallery placeholder] */}
                  <div className="absolute inset-0 flex items-center justify-center p-6 text-center border border-[var(--color-border-subtle)] transition-transform duration-700 group-hover:scale-105">
                    <span className="text-body-sm text-[var(--color-ink-500)] uppercase tracking-widest">[Placeholder: Original Fine Art]</span>
                  </div>
                </div>
                <h3 className="text-[24px] text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)] mb-2 group-hover:text-[var(--color-terracotta-600)] transition-colors">
                  Original Fine Art
                </h3>
                <p className="text-body-md text-[var(--color-ink-700)] font-[family-name:var(--font-jakarta)] font-light leading-relaxed">
                  Canvas, oil, and watercolors straight from independent studios.
                </p>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="group flex flex-col md:mt-16"
            >
              <Link href="/explore?collection=vintage-retro" className="flex flex-col h-full">
                <div className="relative aspect-[4/5] w-full bg-[var(--color-cream-deep)] mb-6 overflow-hidden">
                  {/* [TODO: Replace with elegant vintage collection placeholder] */}
                  <div className="absolute inset-0 flex items-center justify-center p-6 text-center border border-[var(--color-border-subtle)] transition-transform duration-700 group-hover:scale-105">
                    <span className="text-body-sm text-[var(--color-ink-500)] uppercase tracking-widest">[Placeholder: Vintage Archives]</span>
                  </div>
                </div>
                <h3 className="text-[24px] text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)] mb-2 group-hover:text-[var(--color-terracotta-600)] transition-colors">
                  The Vintage Archives
                </h3>
                <p className="text-body-md text-[var(--color-ink-700)] font-[family-name:var(--font-jakarta)] font-light leading-relaxed">
                  Mid-century artifacts, antiquities, and rare collectibles holding onto history.
                </p>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="group flex flex-col"
            >
              <Link href="/explore?category=home-decor&subcategory=ceramics" className="flex flex-col h-full">
                <div className="relative aspect-[4/5] w-full bg-[var(--color-cream-deep)] mb-6 overflow-hidden">
                  {/* [TODO: Replace with elegant sculptural ceramics placeholder] */}
                  <div className="absolute inset-0 flex items-center justify-center p-6 text-center border border-[var(--color-border-subtle)] transition-transform duration-700 group-hover:scale-105">
                    <span className="text-body-sm text-[var(--color-ink-500)] uppercase tracking-widest">[Placeholder: Sculptural Ceramics]</span>
                  </div>
                </div>
                <h3 className="text-[24px] text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)] mb-2 group-hover:text-[var(--color-terracotta-600)] transition-colors">
                  Sculptural Ceramics
                </h3>
                <p className="text-body-md text-[var(--color-ink-700)] font-[family-name:var(--font-jakarta)] font-light leading-relaxed">
                  Hand-thrown pottery and raw earthy textures for the modern home.
                </p>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 7. New Arrivals (Commerce) */}
      <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-raised)] border-t border-[var(--color-border-subtle)]">
        <div className="max-w-[var(--container-max)] mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-display-lg text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)] mb-2">New Arrivals</h2>
              <p className="text-body-lg text-[var(--color-ink-700)] font-[family-name:var(--font-jakarta)]">Freshly curated pieces added today.</p>
            </div>
            <Link href="/explore?sort=newest" className="text-body-md font-bold text-[var(--color-terracotta-600)] hover:text-[var(--color-terracotta-700)] transition-colors flex items-center gap-2 group font-[family-name:var(--font-jakarta)]">
              View All Recent <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {newArrivals.map((p, idx) => (
              <ProductCard key={p.id} product={p} priority={idx < 2} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Collections & Gifts (Discovery) */}
      <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-base)]">
        <div className="max-w-[var(--container-max)] mx-auto">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={revealVariant} 
            className="mb-16 text-center max-w-[600px] mx-auto"
          >
            <h2 className="text-display-lg text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)] mb-4">
              Gifting & Themes
            </h2>
            <p className="text-body-lg text-[var(--color-ink-700)] font-[family-name:var(--font-jakarta)]">
              Find the perfect piece for any occasion or style preference.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { name: 'For Weddings', link: '/explore?occasion=weddings' },
              { name: 'Housewarming', link: '/explore?occasion=housewarming' },
              { name: 'Minimalist', link: '/explore?collection=modern-minimalist' },
              { name: 'Traditional', link: '/explore?collection=traditional-arts' }
            ].map((col, idx) => (
              <motion.div key={idx} variants={revealVariant}>
                <Link href={col.link} className="group block w-full h-[160px] relative rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-ink-900)]">
                  <div className="absolute inset-0 bg-[var(--color-cream-deep)] opacity-20 group-hover:opacity-30 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                    <span className="text-[20px] font-[family-name:var(--font-playfair)] text-white group-hover:scale-105 transition-transform duration-500">
                      {col.name}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 9. Community Voices (Community - Restored to Approved Version) */}
      <section className="py-24 bg-[var(--color-cream-raised)] px-[var(--space-5)] xl:px-[var(--space-8)] border-y border-[var(--color-border-subtle)]">
        <div className="max-w-[var(--container-max)] mx-auto">
          <motion.h2 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={revealVariant} 
            className="text-display-lg text-[var(--color-ink-900)] text-center mb-16 font-[family-name:var(--font-playfair)]"
          >
            Community Voices
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }} 
                variants={revealVariant} 
                className="bg-white p-10 rounded-[var(--radius-md)] shadow-sm border border-[var(--color-border-subtle)] flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <span className="text-display-xl text-[var(--color-terracotta-600)] leading-none mb-2 block font-[family-name:var(--font-playfair)]">"</span>
                  <p className="text-body-lg italic text-[var(--color-ink-900)] mb-8 font-[family-name:var(--font-jakarta)] leading-relaxed">
                    {i === 1 ? "I finally found a platform that values the time it takes to handcraft furniture. Beautiful experience." : 
                     i === 2 ? "The live auctions are thrilling. Won an amazing antique clock last week and it was perfectly packed." : 
                     "Best place to discover hidden artistic talent across India. Every purchase tells a story."}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-border-subtle)]">
                  <Image 
                    src={i === 1 ? "/images/5ac5f5ecddd67235241297452010a237.jpg" : i === 2 ? "/images/1da0c6767e60f79b79148794732a305f.jpg" : "/images/71d0457823cf94b6f1003b8c50253c61.webp"}
                    width={64} 
                    height={64} 
                    style={{ objectFit: 'cover' }}
                    alt={\`User \${i}\`}
                    className="rounded-full bg-[var(--color-ink-300)] w-[64px] h-[64px] min-w-[64px]"
                  />
                  <div>
                    <p className="text-heading-sm text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)]">
                      {i === 1 ? "Priya S." : i === 2 ? "Arjun M." : "Nandita R."}
                    </p>
                    <div className="flex gap-1 text-[var(--color-terracotta-600)] text-xs mt-1 font-bold font-[family-name:var(--font-jakarta)]">
                      {i === 1 ? "4.5 ★ Verified Buyer" : i === 2 ? "5.0 ★ Verified Buyer" : "5.0 ★ Verified Buyer"}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Featured Creators (Community) */}
      <section className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-base)]">
        <div className="max-w-[var(--container-max)] mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-display-lg text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)] mb-2">
                {user ? 'Creators You Follow' : 'Featured Creators'}
              </h2>
              <p className="text-body-lg text-[var(--color-ink-700)] font-[family-name:var(--font-jakarta)]">
                The master artisans behind the objects.
              </p>
            </div>
            <Link href="/creators" className="text-body-md font-bold text-[var(--color-terracotta-600)] hover:text-[var(--color-terracotta-700)] transition-colors flex items-center gap-2 group font-[family-name:var(--font-jakarta)]">
              View All Creators <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="flex flex-col items-center text-center group cursor-pointer">
                <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-2 border-[var(--color-cream-deep)] group-hover:border-[var(--color-terracotta-600)] transition-colors">
                  <Image 
                    src={i === 1 ? "/images/f2010c7db52047ff698114be0841cdcc.jpg" : i === 2 ? "/images/ca6d9b9d3bce30508fc15e61d8583fb2.jpg" : i === 3 ? "/images/873f2715cc6650dbcb57cbb4d2847a96.jpg" : "/images/66314f85e330be45f65b5cd37e0e479a.jpg"}
                    fill
                    style={{ objectFit: 'cover' }}
                    alt={\`Creator \${i}\`}
                  />
                </div>
                <h3 className="text-heading-sm text-[var(--color-ink-900)] font-[family-name:var(--font-playfair)] mb-1 group-hover:text-[var(--color-terracotta-600)] transition-colors">
                  {i === 1 ? "Anaya Ceramics" : i === 2 ? "Rajesh Woodworks" : i === 3 ? "The Silver Loom" : "Kavita Arts"}
                </h3>
                <p className="text-sm text-[var(--color-ink-500)] font-[family-name:var(--font-jakarta)]">
                  {i === 1 ? "Jaipur, RJ" : i === 2 ? "Mysuru, KA" : i === 3 ? "Kolkata, WB" : "Delhi, DL"}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 11. Become a Seller CTA */}
      <section className="relative w-full min-h-[420px] md:min-h-[520px] flex items-center justify-center overflow-hidden py-24 px-[var(--space-5)] xl:px-[var(--space-8)] border-t border-[var(--color-border-subtle)]">
        {/* Background image */}
        <Image
          src="/images/88a2113f990c6812837330547db6a2c2.jpg"
          alt="Artisan working"
          fill
          className="object-cover opacity-90 mix-blend-overlay z-0"
        />
        <div className="absolute inset-0 bg-[var(--color-ink-900)] opacity-60 z-0" />
        
        <div className="relative z-10 max-w-[600px] mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-display-lg text-white font-[family-name:var(--font-playfair)] mb-6"
          >
            Preserve Your Craft.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-body-lg text-[var(--color-cream-base)] mb-10 font-[family-name:var(--font-jakarta)] font-light"
          >
            Join a community of dedicated artisans. Sell your original works to collectors who value authenticity over speed.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              href="/buyer-protection" 
              className="inline-flex h-14 items-center justify-center bg-[var(--color-terracotta-600)] text-white px-8 text-body-lg font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors font-[family-name:var(--font-jakarta)]"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
`;

fs.writeFileSync(targetFile, content);
console.log('Successfully rewrote client-home.tsx with Phase 4.1 fixes.');
