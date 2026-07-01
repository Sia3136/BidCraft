'use client'

import React from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CloudinaryImage } from '@/components/CloudinaryImage'
import { Heart, Shield, Users } from 'lucide-react'
import Link from 'next/link'

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream-base)]">
      <Navbar />

      <main className="pt-[var(--space-10)] pb-0">
        
        {/* Hero Block */}
        <section className="w-full max-w-[880px] mx-auto px-[var(--space-5)] text-center mb-[var(--space-8)]">
          <p className="text-caption uppercase tracking-[0.1em] text-[var(--color-terracotta-600)] mb-4 font-semibold">
            Our Story
          </p>
          <h1 className="text-display-xl font-display text-[var(--color-ink-900)] mb-6">
            Built for creators. Trusted by collectors.
          </h1>
          <p className="text-body-lg text-[var(--color-ink-700)] max-w-[560px] mx-auto">
            BidCraft was built on a simple belief — that creativity deserves a stage, and every handmade object carries a story worth sharing.
          </p>
        </section>

        {/* Origin Section 1 */}
        <section className="w-full max-w-[880px] mx-auto px-[var(--space-5)] py-[var(--space-9)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden">
              <CloudinaryImage 
                publicId="story-origin" 
                alt="Where it began"
                width={600}
                height={750}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-display-md font-display text-[var(--color-ink-900)] mb-[var(--space-4)]">
                Where it began.
              </h2>
              <div className="space-y-4 text-body-lg text-[var(--color-ink-700)] leading-relaxed">
                <p>
                  BidCraft didn't start in a boardroom. It started in a crowded college dorm, where a group of art students realized how incredibly difficult it was to turn their passion into a sustainable living. The existing platforms were either too corporate, taking massive cuts, or too convoluted for independent creators.
                </p>
                <p>
                  We wanted a space that felt like a weekend craft fair — vibrant, personal, and driven by stories. A place where a potter could explain the glaze on their mug, and a collector could ask about the history of a vintage Hot Wheel before placing a bid.
                </p>
                <p>
                  So we built it ourselves. What began as a simple idea to help students monetize their creativity has blossomed into a thriving ecosystem for artists, hobbyists, and collectors across India.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Origin Section 2 (Alternate layout) */}
        <section className="w-full max-w-[880px] mx-auto px-[var(--space-5)] py-[var(--space-9)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-display-md font-display text-[var(--color-ink-900)] mb-[var(--space-4)]">
                Growing the community.
              </h2>
              <div className="space-y-4 text-body-lg text-[var(--color-ink-700)] leading-relaxed">
                <p>
                  As word spread, our tiny marketplace grew. We quickly realized that the magic of BidCraft wasn't just in the transactions, but in the connections being made. We saw resin artists collaborating with woodworkers, and vintage toy collectors sharing restoration tips.
                </p>
                <p>
                  To protect this ecosystem, we introduced live auctions, secure escrow payments, and strict seller verifications. We wanted to ensure that no matter how big we got, the trust and intimacy of that original weekend craft fair was never lost.
                </p>
              </div>
            </div>
            <div className="order-1 md:order-2 aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden">
              <CloudinaryImage 
                publicId="story-community" 
                alt="Growing the community"
                width={600}
                height={750}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Values Strip */}
        <section className="w-full bg-[var(--color-cream-raised)] py-[var(--space-8)] mt-[var(--space-6)]">
          <div className="w-full max-w-[880px] mx-auto px-[var(--space-5)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              
              <div className="flex flex-col items-center md:items-start">
                <Heart className="w-[28px] h-[28px] text-[var(--color-terracotta-600)] mb-4" strokeWidth={1.5} />
                <h3 className="text-heading-lg text-[var(--color-ink-900)] mb-2">Creator First</h3>
                <p className="text-body-md text-[var(--color-ink-700)]">
                  We believe creators should keep more of what they earn. Our fee structure is transparent and designed to support independent artists.
                </p>
              </div>

              <div className="flex flex-col items-center md:items-start">
                <Shield className="w-[28px] h-[28px] text-[var(--color-terracotta-600)] mb-4" strokeWidth={1.5} />
                <h3 className="text-heading-lg text-[var(--color-ink-900)] mb-2">Trust by Design</h3>
                <p className="text-body-md text-[var(--color-ink-700)]">
                  From secure escrow payments to verified seller badges, we build mechanisms that ensure every transaction is safe and reliable.
                </p>
              </div>

              <div className="flex flex-col items-center md:items-start">
                <Users className="w-[28px] h-[28px] text-[var(--color-terracotta-600)] mb-4" strokeWidth={1.5} />
                <h3 className="text-heading-lg text-[var(--color-ink-900)] mb-2">Community Driven</h3>
                <p className="text-body-md text-[var(--color-ink-700)]">
                  We don't just host products; we host people. Forums, live chats, and creator spotlights keep the human connection alive.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Team / Founder Block */}
        <section className="w-full max-w-[880px] mx-auto px-[var(--space-5)] py-[var(--space-10)] text-center">
          <h2 className="text-display-lg font-display text-[var(--color-ink-900)] mb-2">
            The people behind BidCraft
          </h2>
          <p className="text-body-md text-[var(--color-ink-500)] mb-10">
            A small team of creators, collectors, and builders.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-[80px] h-[80px] rounded-[var(--radius-pill)] bg-[var(--color-cream-deep)] mb-3" />
                <span className="text-caption text-[var(--color-ink-500)]">Coming soon</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Block */}
        <section className="w-full bg-[var(--color-slate-900)] py-[var(--space-10)] text-center px-[var(--space-5)]">
          <h2 className="text-display-lg font-display text-white mb-4">
            Ready to join?
          </h2>
          <p className="text-body-lg text-white/80 max-w-[480px] mx-auto mb-8">
            Whether you're here to discover something rare or share your craft with the world, there's a place for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/explore" 
              className="w-full sm:w-auto px-8 py-3 bg-white text-[var(--color-slate-900)] text-body-lg font-semibold rounded-[var(--radius-md)] hover:bg-white/90 transition-colors"
            >
              Start Exploring
            </Link>
            <Link 
              href="/seller/register" 
              className="w-full sm:w-auto px-8 py-3 bg-transparent border border-white text-white text-body-lg font-semibold rounded-[var(--radius-md)] hover:bg-white/10 transition-colors"
            >
              Become a Seller
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
