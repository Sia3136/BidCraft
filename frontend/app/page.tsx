import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

import { HeroSection } from '@/components/sections/hero-section'
import { FeaturedCategories } from '@/components/sections/featured-categories'
import { LiveAuctions } from '@/components/sections/live-auctions'
import { FeaturedCreators } from '@/components/sections/featured-creators'
import { NewArrivals } from '@/components/sections/new-arrivals'
import { CuratedCollections } from '@/components/sections/curated-collections'
import { CollectorSpotlight } from '@/components/sections/collector-spotlight'
import { HandmadeGifts } from '@/components/sections/handmade-gifts'
import { TrustSection } from '@/components/sections/trust-section'
import { Testimonials } from '@/components/sections/testimonials'
import { NewsletterCta } from '@/components/sections/newsletter-cta'

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-cream-base)]">
      <Navbar />
      
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Featured Categories */}
      <section className="bg-[var(--color-cream-base)]">
        <FeaturedCategories />
      </section>

      {/* 3. Live Auctions Rail */}
      <section className="bg-[var(--color-cream-raised)]">
        <LiveAuctions />
      </section>

      {/* 4. Featured Creators */}
      <section className="bg-[var(--color-cream-base)]">
        <FeaturedCreators />
      </section>

      {/* 5. New Arrivals */}
      <section className="bg-[var(--color-cream-base)]">
        <NewArrivals />
      </section>

      {/* 6. Curated Collections */}
      <section className="bg-[var(--color-cream-raised)]">
        <CuratedCollections />
      </section>

      {/* 7. Collector Spotlight */}
      <section className="bg-[var(--color-cream-base)]">
        <CollectorSpotlight />
      </section>

      {/* 8. Handmade Gifts Section */}
      <section className="bg-[var(--color-cream-raised)]">
        <HandmadeGifts />
      </section>

      {/* 9. Trust Section */}
      <section className="bg-[var(--color-slate-900)]">
        <TrustSection />
      </section>

      {/* 10. Community Testimonials */}
      <section className="bg-[var(--color-cream-base)]">
        <Testimonials />
      </section>

      {/* 11. Newsletter CTA */}
      <section className="bg-[var(--color-cream-raised)]">
        <NewsletterCta />
      </section>

      <Footer />
    </main>
  )
}
