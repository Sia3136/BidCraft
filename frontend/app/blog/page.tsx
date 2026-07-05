import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export const metadata = {
  title: 'BidCraft Blog | BidCraft',
}

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream-base)]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-24 px-[var(--space-5)]">
        
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6">BidCraft Blog</h1>
        <p className="text-body-lg text-[var(--color-ink-700)]">
          Discover stories from our community, curated collections, and expert tips on collecting and crafting. The blog will feature deep dives into artisanal techniques, market trends, and creator spotlights to inspire your next purchase or project.
        </p>
      </div>
    
      </main>
      <Footer />
    </div>
  )
}
