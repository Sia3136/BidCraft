'use client'

import { ProductCard } from './product-card'
import { PRODUCTS, MARKETPLACE_STATS } from '@/lib/mock-data'

export function HeroSection() {
  const featuredProducts = PRODUCTS.slice(0, 6)

  return (
    <section className="bg-gradient-to-b from-background to-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Headline & Stats */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
              The Marketplace for Creators
            </h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Buy unique handmade items through auctions, fixed prices, or make offers. Support independent creators worldwide.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 py-4 border-b border-border">
              <div>
                <p className="text-2xl font-bold text-primary">{MARKETPLACE_STATS.liveAuctions}</p>
                <p className="text-sm text-muted-foreground">Live Auctions</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">{MARKETPLACE_STATS.activeListings.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Active Listings</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">{MARKETPLACE_STATS.verifiedCreators}</p>
                <p className="text-sm text-muted-foreground">Verified Creators</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Start Bidding
              </button>
              <button className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                Explore Items
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-2 mt-6 pt-6 border-t border-border">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="text-sm font-semibold text-foreground">Escrow Protected</p>
                <p className="text-xs text-muted-foreground">Funds held safely until you receive your item</p>
              </div>
            </div>
          </div>

          {/* Right: Featured Products Grid */}
          <div className="grid grid-cols-2 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
