import { SiteNavbar } from "@/components/site-navbar"
import { HeroSection } from "@/components/hero-section"
import { CategoryShowcase } from "@/components/category-showcase"
import { FeaturedCreators } from "@/components/featured-creators"
import { LiveAuctions } from "@/components/live-auctions"
import { CraftOfDay } from "@/components/craft-of-day"
import { TrustSection } from "@/components/trust-section"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <SiteNavbar />
      <HeroSection />
      <CategoryShowcase />
      <FeaturedCreators />
      <LiveAuctions />
      <CraftOfDay />
      <TrustSection />
      <SiteFooter />
    </main>
  )
}
