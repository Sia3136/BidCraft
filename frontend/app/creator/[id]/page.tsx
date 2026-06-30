'use client'

import { useState } from 'react'
import { MessageSquare, Plus, ChevronDown, Heart } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ReviewsSection } from '@/components/marketplace/reviews-section'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const CREATOR = {
  name: 'Elena Rostova',
  specialty: 'Ceramic Artist · Prague · Joined 2024',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
  cover: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=1200&auto=format&fit=crop',
  verified: true,
  bio: 'Exploring the intersection of brutalist architecture and delicate organic forms. Every piece is hand-thrown and fired in my Prague studio.',
  stats: [
    { label: 'Items Sold', value: '412' },
    { label: 'Active Listings', value: '24' },
    { label: 'Avg. Rating', value: '4.9' },
    { label: 'Response Time', value: '< 2 hrs' },
  ],
  followers: 1205
}

const PRODUCTS = [
  { id: 1, title: 'Hand-thrown Ceramic Match Striker', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=400&auto=format&fit=crop', creator: { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop' }, price: '₹1,200', method: 'BUY NOW', isAuction: false },
  { id: 5, title: 'Abstract Minimalist Print', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400&auto=format&fit=crop', creator: { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop' }, price: '₹1,500', method: 'BUY NOW', isAuction: false },
]

export default function CreatorStorefront() {
  const [activeTab, setActiveTab] = useState<'Listings' | 'Reviews' | 'About'>('Listings')
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({})

  return (
    <main className="min-h-screen bg-[var(--color-cream-base)]">
      <Navbar />

      <div className="max-w-[var(--container-max)] mx-auto px-4 md:px-6 xl:px-6 py-[var(--space-8)]">
        
        {/* Header Block */}
        <div className="relative mb-[var(--space-8)]">
          {/* Cover */}
          <div className="w-full aspect-[16/9] md:aspect-[16/5] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-slate-100)]">
            <img src={CREATOR.cover} alt="Cover" className="w-full h-full object-cover" />
          </div>

          {/* Info Row */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-[var(--space-5)] px-2 md:px-[var(--space-6)]">
            
            <div className="flex-1 flex flex-col items-start -mt-[48px] relative z-10">
              {/* Avatar overlapping */}
              <div className="mb-[var(--space-3)]">
                <Avatar src={CREATOR.avatar} initials={CREATOR.name[0]} verified={CREATOR.verified} className="w-[96px] h-[96px] ring-4 ring-[var(--color-cream-base)]" />
              </div>
              
              <h1 className="text-display-md text-[var(--color-ink-900)] leading-none mb-1">{CREATOR.name}</h1>
              <p className="text-caption text-[var(--color-ink-500)] mb-[var(--space-3)]">{CREATOR.specialty}</p>
              
              <div className="flex items-center gap-[var(--space-3)] text-body-md text-[var(--color-ink-700)] mb-[var(--space-4)]">
                <span className="font-semibold text-[var(--color-ink-900)]">4.9 <span className="font-normal text-[var(--color-ink-500)]">★</span></span>
                <span className="text-[var(--color-ink-300)]">•</span>
                <span>412 Reviews</span>
                <span className="text-[var(--color-ink-300)]">•</span>
                <span>{CREATOR.followers.toLocaleString()} Followers</span>
              </div>

              <p className="text-body-lg text-[var(--color-ink-700)] max-w-[640px]">
                {CREATOR.bio}
              </p>
            </div>

            {/* Actions (Desktop aligned right, Mobile stacked) */}
            <div className="flex flex-col items-start md:items-end gap-[var(--space-4)] md:mt-[var(--space-5)]">
              <div className="flex items-center gap-[var(--space-3)] w-full md:w-auto">
                <Button className="flex-1 md:flex-none h-[44px]"><Plus size={18} className="mr-2" /> Follow</Button>
                <Button variant="secondary" className="flex-1 md:flex-none h-[44px]"><MessageSquare size={18} className="mr-2" /> Message</Button>
              </div>
              <div className="flex items-center gap-[var(--space-4)] text-[var(--color-ink-500)]">
                <a href="#" className="hover:text-[var(--color-ink-900)] transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className="hover:text-[var(--color-ink-900)] transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Stats Strip */}
        <div className="bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] mb-[var(--space-8)]">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[var(--color-border-subtle)]">
            {CREATOR.stats.map(stat => (
              <div key={stat.label} className="flex flex-col items-center justify-center p-[var(--space-4)] md:p-[var(--space-5)]">
                <span className="text-heading-lg text-[var(--color-ink-900)] mb-1">{stat.value}</span>
                <span className="text-caption text-[var(--color-ink-500)]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b-[1.5px] border-[var(--color-border-subtle)] mb-[var(--space-8)]">
          {(['Listings', 'Reviews', 'About'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-[var(--space-5)] py-[var(--space-3)] text-heading-sm transition-colors relative",
                activeTab === tab ? "text-[var(--color-terracotta-600)]" : "text-[var(--color-ink-700)] hover:text-[var(--color-ink-900)]"
              )}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-[-1.5px] left-0 right-0 h-[2px] bg-[var(--color-terracotta-600)]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          
          {/* LISTINGS */}
          {activeTab === 'Listings' && (
            <div className="animate-fade-up">
              {/* Secondary Filter Row */}
              <div className="flex flex-wrap items-center justify-between gap-[var(--space-4)] mb-[var(--space-6)]">
                <div className="flex items-center gap-[var(--space-2)]">
                  <Badge variant="method" className="cursor-pointer bg-[var(--color-ink-900)] text-white">All (24)</Badge>
                  <Badge variant="method" className="cursor-pointer border-transparent bg-[var(--color-cream-deep)] text-[var(--color-ink-700)] hover:bg-[var(--color-border-subtle)]">Buy Now</Badge>
                  <Badge variant="method" className="cursor-pointer border-transparent bg-[var(--color-cream-deep)] text-[var(--color-ink-700)] hover:bg-[var(--color-border-subtle)]">Auction</Badge>
                </div>
                <Button variant="ghost" className="flex items-center gap-2 pr-0 text-[var(--color-ink-700)]">
                  Sort: <span className="text-[var(--color-ink-900)] font-medium">Newest</span>
                  <ChevronDown size={16} />
                </Button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[var(--space-4)] lg:gap-[var(--space-5)]">
                {PRODUCTS.map((product) => (
                  <div key={product.id} className="group block rounded-[var(--radius-md)] bg-[var(--color-white)] relative hover-card flex flex-col">
                    <div className="w-full aspect-[4/5] rounded-[var(--radius-md)] overflow-hidden relative mb-[var(--space-3)] shrink-0">
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-slow ease-default group-hover:scale-[1.04]" />
                      <div className="absolute top-[var(--space-3)] left-[var(--space-3)] pointer-events-none">
                        <Badge variant="method">{product.method}</Badge>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          setWishlist(prev => ({ ...prev, [product.id]: !prev[product.id] }))
                        }}
                        className="absolute top-[var(--space-3)] right-[var(--space-3)] w-[32px] h-[32px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-105"
                      >
                        <Heart size={16} className={cn("transition-colors duration-200", wishlist[product.id] ? "fill-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)] scale-110" : "text-white")} />
                      </button>
                    </div>
                    <div className="px-1 flex flex-col flex-1 pb-1">
                      <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-2)] line-clamp-2 flex-1">{product.title}</h3>
                      <div className="flex flex-col mt-auto">
                        <span className="text-price text-[var(--color-ink-900)]">{product.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REVIEWS */}
          {activeTab === 'Reviews' && (
            <div className="animate-fade-up">
              <ReviewsSection scope="creator" />
            </div>
          )}

          {/* ABOUT */}
          {activeTab === 'About' && (
            <div className="max-w-[720px] mx-auto animate-fade-up flex flex-col items-center text-center pb-[var(--space-10)]">
              <p className="text-body-lg text-[var(--color-ink-900)] mb-[var(--space-8)] leading-relaxed">
                I'm Elena, a ceramic artist based in Prague. My journey with clay started 10 years ago when I fell in love with the tactile nature of earth. My current collection explores the tension between stark brutalist architectural forms and the organic, unpredictable nature of wood-fired glazes.
                <br/><br/>
                Every piece you see here is thrown by hand on the wheel or slab-built in my small studio. I focus on small-batch drops rather than mass production because I believe the things we bring into our homes should carry the fingerprint of their maker.
              </p>

              {/* Workspace Images */}
              <div className="grid grid-cols-2 gap-[var(--space-4)] w-full">
                <div className="aspect-square rounded-[var(--radius-md)] overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover" alt="Studio 1" />
                </div>
                <div className="aspect-square rounded-[var(--radius-md)] overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover" alt="Studio 2" />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </main>
  )
}
