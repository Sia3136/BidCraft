import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { LiveAuctionsSection } from '@/components/sections/live-auctions'
import { TrendingProductsSection } from '@/components/sections/trending-products'
import { CategoriesSection } from '@/components/sections/categories'
import { SellYourWaySection } from '@/components/sections/sell-your-way'
import { HowItWorksSection } from '@/components/sections/how-it-works'
import { CreatorSpotlightSection } from '@/components/sections/creator-spotlight'
import { FeaturedCollectionsSection } from '@/components/sections/featured-collections'
import { EscrowTrustSection } from '@/components/sections/escrow-trust'
import { Footer } from '@/components/sections/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <LiveAuctionsSection />
      <TrendingProductsSection />
      <CategoriesSection />
      <SellYourWaySection />
      <HowItWorksSection />
      <CreatorSpotlightSection />
      <FeaturedCollectionsSection />
      <EscrowTrustSection />
      <Footer />
    </main>
  )
}
