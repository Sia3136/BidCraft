import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export const metadata = {
  title: 'Seller Community | BidCraft',
}

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream-base)]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-24 px-[var(--space-5)]">
        
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6">Seller Community</h1>
        <p className="text-body-lg text-[var(--color-ink-700)]">
          Welcome to the BidCraft Seller Community hub. This page will host forums, best practice guides, and peer-to-peer support networks where creators can share insights, collaborate, and learn how to grow their businesses together.
        </p>
      </div>
    
      </main>
      <Footer />
    </div>
  )
}
