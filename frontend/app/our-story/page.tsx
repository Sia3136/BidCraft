import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export const metadata = {
  title: 'Our Story | BidCraft',
}

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream-base)]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-24 px-[var(--space-5)]">
        
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6">Our Story</h1>
        <p className="text-body-lg text-[var(--color-ink-700)]">
          This page will share the founding journey of BidCraft, exploring how we identified the gap in the Indian creator economy for a trust-first marketplace. It will detail our mission to empower artisans and collectors with secure, escrow-protected transactions and a platform designed specifically for emerging talent.
        </p>
      </div>
    
      </main>
      <Footer />
    </div>
  )
}
