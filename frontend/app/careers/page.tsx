import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export const metadata = {
  title: 'Careers | BidCraft',
}

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream-base)]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-24 px-[var(--space-5)]">
        
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6">Careers at BidCraft</h1>
        <p className="text-body-lg text-[var(--color-ink-700)]">
          Join our mission to revolutionize the Indian creator economy. This page will list current job openings across engineering, design, marketing, and operations, and offer a glimpse into our company culture and core values.
        </p>
      </div>
    
      </main>
      <Footer />
    </div>
  )
}
