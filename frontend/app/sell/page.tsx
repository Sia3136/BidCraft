import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export const metadata = {
  title: 'Start Selling on BidCraft | BidCraft',
}

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream-base)]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-24 px-[var(--space-5)]">
        
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-8">Ready to start selling on BidCraft?</h1>
        <p className="text-body-lg text-[var(--color-ink-700)] mb-10">
          Join a community of Indian artisans, creators, and collectors who value authentic craftsmanship.
        </p>
        <div className="flex flex-col items-center gap-6">
          <Link href="/auth" className="bg-[var(--color-terracotta-600)] text-white text-body-lg font-bold px-10 py-4 rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors inline-block">
            Sign In to Start Selling
          </Link>
          <Link href="/auth?tab=register" className="text-body-md text-[var(--color-terracotta-600)] font-medium hover:underline">
            Don't have an account? Create one →
          </Link>
        </div>
      </div>
    
      </main>
      <Footer />
    </div>
  )
}
