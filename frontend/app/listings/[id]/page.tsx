'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { Heart, ShieldCheck, ChevronDown, Minus, Plus } from 'lucide-react'
import * as Accordion from '@radix-ui/react-accordion'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { ReviewsSection } from '@/components/marketplace/reviews-section'
import { cn } from '@/lib/utils'
import { SkeletonGrid } from '@/components/skeleton-grid'
import Image from 'next/image'

// Mock Product Data
const PRODUCT = {
  id: 1,
  title: 'Vintage 1969 Hot Wheels Redline Twin Mill',
  creator: { name: 'Vikram S.', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop', verified: true },
  images: [
    'https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1596727289524-7dae28d052a3?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1610486806085-f3769c3a38a3?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop'
  ],
  methods: ['Buy Now', 'Bid', 'Make Offer', 'Trade'],
  price: '₹12,500',
  currentBid: '₹8,400',
  bidCount: 14,
  timeLeft: '04:12:30',
  minIncrement: 500,
  description: 'An original 1969 Hot Wheels Redline Twin Mill in Spectreflame Red. Paint is about 85% intact with minor edge wear typical for its age. Wheels are straight and roll smoothly. A rare find for serious collectors looking to complete their Sweet 16 original lineup. Sourced from a private collection in Austin, TX.',
  specs: [
    { key: 'Brand', value: 'Hot Wheels (Mattel)' },
    { key: 'Year', value: '1969' },
    { key: 'Scale', value: '1:64' },
    { key: 'Condition', value: 'Excellent (Vintage)' },
    { key: 'Material', value: 'Die-cast Metal' }
  ]
}

function ProductDetailContent() {
  const [activeImage, setActiveImage] = useState(0)
  const [wishlist, setWishlist] = useState(false)
  const [activeTab, setActiveTab] = useState(PRODUCT.methods[0])
  const [bidAmount, setBidAmount] = useState(8900)
  const [offerAmount, setOfferAmount] = useState(10000)

  const tabs = PRODUCT.methods

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 xl:px-6 py-[var(--space-8)] md:py-[var(--space-10)]">
      
      {/* Top Split */}
      <div className="flex flex-col lg:flex-row gap-[var(--space-8)] xl:gap-[var(--space-10)] mb-[var(--space-10)]">
        
        {/* Left: Image Gallery */}
        <div className="w-full lg:w-[60%] flex flex-col gap-[var(--space-4)]">
          
          {/* Primary Image */}
          <div className="relative w-full aspect-square rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-cream-deep)]">
            {PRODUCT.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Product view ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-opacity duration-base",
                  activeImage === i ? "opacity-100 z-10" : "opacity-0 z-0"
                )}
              />
            ))}
            <button 
              onClick={() => setWishlist(!wishlist)}
              className="absolute top-[var(--space-4)] right-[var(--space-4)] z-20 w-[44px] h-[44px] rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-105"
            >
              <Heart size={24} className={cn("transition-colors duration-200", wishlist ? "fill-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)]" : "text-white")} />
            </button>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-[var(--space-3)] overflow-x-auto hide-scrollbar">
            {PRODUCT.images.slice(0, 6).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "relative w-[72px] h-[72px] shrink-0 rounded-[var(--radius-sm)] overflow-hidden transition-all duration-200",
                  activeImage === i ? "ring-2 ring-[var(--color-terracotta-600)]" : "ring-1 ring-[var(--color-border-subtle)] opacity-70 hover:opacity-100"
                )}
              >
                <img src={img} alt="Thumbnail" loading="lazy" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

        </div>

        {/* Right: Purchase Panel */}
        <div className="w-full lg:w-[40%] flex flex-col gap-[var(--space-5)]">
          
          {/* 1. Creator Byline */}
          <Link href={`/creator/${PRODUCT.creator.name}`} className="flex items-center gap-[var(--space-3)] group inline-flex w-max">
            <Avatar src={PRODUCT.creator.avatar} initials={PRODUCT.creator.name[0]} verified={PRODUCT.creator.verified} size="small" />
            <span className="text-body-md font-semibold text-[var(--color-ink-900)] group-hover:text-[var(--color-terracotta-600)] transition-colors">{PRODUCT.creator.name}</span>
          </Link>

          {/* 2. Title */}
          <h1 className="text-display-md text-[var(--color-ink-900)] leading-tight">
            {PRODUCT.title}
          </h1>

          {/* 3. Badges */}
          <div className="flex flex-wrap gap-[var(--space-2)]">
            {PRODUCT.methods.map(m => <Badge key={m} variant="method">{m}</Badge>)}
          </div>

          {/* 4. Price Block */}
          {activeTab === 'Buy Now' || activeTab === 'Make Offer' || activeTab === 'Trade' ? (
            <div className="flex flex-col">
              <span className="text-[32px] font-mono tracking-tight text-[var(--color-ink-900)] font-semibold">{PRODUCT.price}</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <span className="text-caption text-[var(--color-ink-500)] uppercase tracking-wider">Current Bid</span>
              <div className="flex items-end gap-3">
                <span className="text-[32px] font-mono tracking-tight text-[var(--color-ink-900)] font-semibold leading-none">{PRODUCT.currentBid}</span>
                <div className="rounded-[var(--radius-pill)] px-[12px] py-[4px] bg-[var(--color-slate-900)] mb-1">
                  <span className="text-caption text-white font-mono">{PRODUCT.timeLeft}</span>
                </div>
              </div>
              <span className="text-caption text-[var(--color-ink-500)]">{PRODUCT.bidCount} bids · Reserve met</span>
            </div>
          )}

          {/* 5. Buying-method tabs */}
          <div className="p-1 bg-[var(--color-cream-deep)] rounded-[var(--radius-pill)] flex items-center">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-[8px] px-[12px] rounded-[var(--radius-pill)] text-body-md font-medium transition-all duration-250",
                  activeTab === tab ? "bg-white text-[var(--color-ink-900)] shadow-[var(--shadow-card)]" : "text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 6. Action Block */}
          <div className="relative min-h-[120px]">
            {/* Buy Now */}
            <div className={cn("absolute inset-0 flex flex-col gap-[var(--space-3)] transition-opacity duration-base", activeTab === 'Buy Now' ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none")}>
              <Button size="large" className="w-full h-[48px]">Buy Now — {PRODUCT.price}</Button>
              <Button size="large" variant="secondary" className="w-full h-[48px]">Add to Cart</Button>
            </div>

            {/* Bid */}
            <div className={cn("absolute inset-0 flex flex-col gap-[var(--space-3)] transition-opacity duration-base", activeTab === 'Bid' ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none")}>
              <div className="flex items-center h-[48px] border border-[var(--color-border-strong)] rounded-[var(--radius-md)] overflow-hidden bg-white">
                <button 
                  onClick={() => setBidAmount(prev => Math.max(8900, prev - PRODUCT.minIncrement))}
                  className="w-[48px] h-full flex items-center justify-center text-[var(--color-ink-700)] hover:bg-[var(--color-cream-deep)] border-r border-[var(--color-border-subtle)]"
                >
                  <Minus size={20} />
                </button>
                <div className="flex-1 flex items-center justify-center font-mono text-body-lg text-[var(--color-ink-900)]">
                  ₹{bidAmount.toLocaleString('en-IN')}
                </div>
                <button 
                  onClick={() => setBidAmount(prev => prev + PRODUCT.minIncrement)}
                  className="w-[48px] h-full flex items-center justify-center text-[var(--color-ink-700)] hover:bg-[var(--color-cream-deep)] border-l border-[var(--color-border-subtle)]"
                >
                  <Plus size={20} />
                </button>
              </div>
              <Button size="large" className="w-full h-[48px]">Place Bid</Button>
              <p className="text-caption text-[var(--color-ink-500)] text-center">
                By bidding you agree to BidCraft's <Link href="#" className="underline">auction terms</Link>
              </p>
            </div>

            {/* Make Offer */}
            <div className={cn("absolute inset-0 flex flex-col gap-[var(--space-3)] transition-opacity duration-base", activeTab === 'Make Offer' ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none")}>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-500)] font-mono">₹</span>
                <Input 
                  type="number" 
                  value={offerAmount} 
                  onChange={e => setOfferAmount(Number(e.target.value))}
                  className="w-full h-[48px] pl-8 font-mono text-body-lg"
                />
                {offerAmount < 12500 && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-caption text-[var(--color-urgent-600)]">
                    {Math.round(((12500 - offerAmount) / 12500) * 100)}% below asking
                  </span>
                )}
              </div>
              <Button size="large" className="w-full h-[48px]">Submit Offer</Button>
              <p className="text-caption text-[var(--color-ink-500)] text-center">
                Seller has 24 hours to respond.
              </p>
            </div>

            {/* Trade */}
            <div className={cn("absolute inset-0 flex flex-col gap-[var(--space-3)] transition-opacity duration-base", activeTab === 'Trade' ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none")}>
              <Button size="large" variant="secondary" className="w-full h-[48px]">Select items from inventory</Button>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-caption text-[var(--color-ink-500)]">+ Cash (Optional) ₹</span>
                <Input type="number" placeholder="0" className="w-full h-[48px] pl-[140px] font-mono" />
              </div>
              <Button size="large" className="w-full h-[48px]">Propose Trade</Button>
            </div>
          </div>

          {/* Spacer to handle absolute positioning of action blocks based on tallest (Bid block) */}
          <div className="h-[80px]" />

          {/* 7. Trust Strip */}
          <div className="flex items-center gap-[var(--space-4)] bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] p-[var(--space-4)] mt-[var(--space-2)]">
            <ShieldCheck size={28} className="text-[var(--color-terracotta-600)] shrink-0" />
            <div className="flex flex-col">
              <span className="text-body-md font-semibold text-[var(--color-ink-900)]">Escrow-protected purchase</span>
              <span className="text-caption text-[var(--color-ink-500)]">Funds released only after you confirm delivery</span>
            </div>
          </div>

          <div className="h-[1px] w-full bg-[var(--color-border-subtle)] my-[var(--space-2)]" />

          {/* Accordions */}
          <Accordion.Root type="multiple" defaultValue={['desc']} className="flex flex-col">
            
            {/* Description */}
            <Accordion.Item value="desc" className="border-b border-[var(--color-border-subtle)]">
              <Accordion.Header>
                <Accordion.Trigger className="flex items-center justify-between w-full py-[var(--space-4)] group">
                  <span className="text-heading-sm text-[var(--color-ink-900)]">Description</span>
                  <ChevronDown size={20} className="text-[var(--color-ink-500)] transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <p className="text-body-lg text-[var(--color-ink-700)] pb-[var(--space-4)] max-w-[60ch]">
                  {PRODUCT.description}
                </p>
              </Accordion.Content>
            </Accordion.Item>

            {/* Specs */}
            <Accordion.Item value="specs" className="border-b border-[var(--color-border-subtle)]">
              <Accordion.Header>
                <Accordion.Trigger className="flex items-center justify-between w-full py-[var(--space-4)] group">
                  <span className="text-heading-sm text-[var(--color-ink-900)]">Specifications</span>
                  <ChevronDown size={20} className="text-[var(--color-ink-500)] transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="flex flex-col pb-[var(--space-4)]">
                  {PRODUCT.specs.map((spec, i) => (
                    <div key={i} className="flex py-2 border-b border-[var(--color-border-subtle)] last:border-0 text-body-md">
                      <span className="w-1/3 text-[var(--color-ink-500)]">{spec.key}</span>
                      <span className="w-2/3 text-[var(--color-ink-900)]">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </Accordion.Content>
            </Accordion.Item>

            {/* Shipping & Returns */}
            <Accordion.Item value="shipping" className="border-b border-[var(--color-border-subtle)]">
              <Accordion.Header>
                <Accordion.Trigger className="flex items-center justify-between w-full py-[var(--space-4)] group">
                  <span className="text-heading-sm text-[var(--color-ink-900)]">Shipping & Returns</span>
                  <ChevronDown size={20} className="text-[var(--color-ink-500)] transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="flex flex-col gap-[var(--space-3)] pb-[var(--space-4)] text-body-md text-[var(--color-ink-700)]">
                  <p><strong>Shipping:</strong> Usually ships within 2-3 business days. Estimated delivery: 5-7 days.</p>
                  <p><strong>Returns:</strong> Escrow-protected. If the item does not match the description, you have 3 days from delivery to open a dispute for a full refund.</p>
                </div>
              </Accordion.Content>
            </Accordion.Item>

          </Accordion.Root>

        </div>
      </div>

      {/* Bottom Full-Width Sections */}
      <div className="flex flex-col gap-[var(--space-10)]">
        <ReviewsSection scope="product" />
        
        <section className="w-full">
          <h2 className="text-display-lg text-[var(--color-ink-900)] mb-[var(--space-6)]">More from {PRODUCT.creator.name}</h2>
          {/* Horizontal Rail Placeholder */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-[var(--space-4)] pb-4 hide-scrollbar">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-[280px] h-[360px] bg-[var(--color-cream-deep)] rounded-[var(--radius-md)] shrink-0 snap-start animate-pulse" />
            ))}
          </div>
        </section>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--color-border-subtle)] p-4 flex items-center justify-between z-40 lg:hidden shadow-[var(--shadow-modal-reverse)]">
        <div className="flex flex-col">
          <span className="text-caption text-[var(--color-ink-500)]">Total</span>
          <span className="text-price text-[var(--color-ink-900)]">{PRODUCT.price}</span>
        </div>
        <Button size="default">Buy Now</Button>
      </div>
    </div>
  )
}

export default function ProductDetailPage() {
  return (
    <main className="min-h-screen bg-[var(--color-cream-base)]">
      <Navbar />
      <Suspense fallback={
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 xl:px-6 py-[var(--space-8)] md:py-[var(--space-10)]">
          <SkeletonGrid />
        </div>
      }>
        <ProductDetailContent />
      </Suspense>
      <Footer />
    </main>
  )
}
