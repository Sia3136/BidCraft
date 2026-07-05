import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export const metadata = {
  title: 'Creator Tools | BidCraft',
}

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream-base)]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-24 px-[var(--space-5)]">
        
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6">Creator Tools</h1>
        <p className="text-body-lg text-[var(--color-ink-700)]">
          Here you will find a comprehensive suite of tools designed to help sellers manage their inventory, track analytics, and optimize their listings. We are building powerful features to make running your creative business on BidCraft seamless and efficient.
        </p>
      </div>
    
      </main>
      <Footer />
    </div>
  )
}
