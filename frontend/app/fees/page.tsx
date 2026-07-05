import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export const metadata = {
  title: 'Fees & Pricing | BidCraft',
}

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream-base)]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-24 px-[var(--space-5)]">
        
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6">Fees & Pricing</h1>
        <p className="text-body-lg text-[var(--color-ink-700)]">
          This section will break down BidCraft's transparent fee structure, including listing fees, final value fees, and payment processing charges. We believe in keeping costs clear and fair so creators can maximize their earnings without hidden surprises.
        </p>
      </div>
    
      </main>
      <Footer />
    </div>
  )
}
