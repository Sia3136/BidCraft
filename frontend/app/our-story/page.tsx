'use client'

import React from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Image from 'next/image'
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
            Built with conviction. Designed for creators.
          </h1>
          <p className="text-body-lg text-[var(--color-ink-700)] max-w-[560px] mx-auto">
            BidCraft exists because creativity deserves more than a generic storefront. We built this for the student selling her first crochet piece, the sculptor who doesn't know where to list his work, and the collector who can't find a marketplace that takes rare finds seriously.
          </p>
        </section>

        {/* Origin Section */}
        <section className="w-full max-w-[880px] mx-auto px-[var(--space-5)] py-[var(--space-9)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4/5',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}>
              <Image
                src="/images/e966528b52608962bd21f8abdeafbe0a.jpg"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                alt="The story behind BidCraft"
                priority
              />
            </div>
            <div>
              <h2 className="text-display-md font-display text-[var(--color-ink-900)] mb-[var(--space-4)]">
                Why BidCraft exists.
              </h2>
              <div className="space-y-4 text-body-lg text-[var(--color-ink-700)] leading-relaxed">
                <p>
                  There was no single marketplace in India where a handmade artist could list their work alongside an auction, accept offers, or trade with a collector — all under one trusted roof. That gap is why BidCraft was built.
                </p>
                <p>
                  Every design decision, every feature, and every policy on this platform was thought through with one question: does this make life easier for the creator, or safer for the buyer? If the answer was no, we didn't ship it.
                </p>
                <p>
                  This isn't a side project. It's a platform built with the stubbornness of someone who has watched talented creators undersell their work because they had no better option. BidCraft is that better option.
                </p>
              </div>
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
                <h3 className="text-heading-lg text-[var(--color-ink-900)] mb-2">Built to Last</h3>
                <p className="text-body-md text-[var(--color-ink-700)]">
                  No shortcuts on trust, no compromise on quality. Every decision on this platform is made for the long term.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Founder Block */}
        <section className="w-full max-w-[880px] mx-auto px-[var(--space-5)] py-[var(--space-10)] text-center">
          <p className="text-caption uppercase tracking-[0.1em] text-[var(--color-terracotta-600)] mb-4 font-semibold">
            The Person Behind BidCraft
          </p>
          <h2 className="text-display-md font-display text-[var(--color-ink-900)] mb-2">
            Siya Rozani
          </h2>
          <p className="text-body-lg text-[var(--color-ink-700)]">
            Founder, BidCraft
          </p>
        </section>

        {/* CTA Block */}
        <section className="w-full bg-[var(--color-slate-900)] py-[var(--space-10)] text-center px-[var(--space-5)]">
          <h2 className="text-display-lg font-display text-white mb-4">
            Ready to be part of something real?
          </h2>
          <p className="text-body-lg text-white/80 max-w-[480px] mx-auto mb-8">
            Whether you create, collect, or simply love discovering unique things — BidCraft was made for you.
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
