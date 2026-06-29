import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { ExploreCategoriesSection } from '@/components/sections/explore-categories'
import { FeaturedCollectionsSection } from '@/components/sections/featured-collections'
import { TrendingProductsSection } from '@/components/sections/trending-products'
import { CreatorSpotlightSection } from '@/components/sections/creator-spotlight'
import { LiveAuctionsSection } from '@/components/sections/live-auctions'
import { CollectorsPicksSection } from '@/components/sections/collectors-picks'
import { HandmadeSpotlightSection } from '@/components/sections/handmade-spotlight'
import { RecentlyAddedSection } from '@/components/sections/recently-added'
import { TestimonialsSection } from '@/components/sections/testimonials'
import { Footer } from '@/components/sections/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ExploreCategoriesSection />
      <FeaturedCollectionsSection />
      <TrendingProductsSection />
      <CreatorSpotlightSection />
      <LiveAuctionsSection />
      <CollectorsPicksSection />
      <HandmadeSpotlightSection />
      <RecentlyAddedSection />
      <TestimonialsSection />
      <Footer />
    </main>
  )
}
