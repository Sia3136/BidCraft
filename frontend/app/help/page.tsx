import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export const metadata = {
  title: 'Help Center | BidCraft',
}

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream-base)]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-24 px-[var(--space-5)]">
        
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6">Help Center</h1>
        <p className="text-body-lg text-[var(--color-ink-700)]">
          Our Help Center is your go-to resource for frequently asked questions, troubleshooting guides, and customer support contact options. Whether you need help with an order, a listing, or your account, this section will provide the answers.
        </p>
      </div>
    
      </main>
      <Footer />
    </div>
  )
}
