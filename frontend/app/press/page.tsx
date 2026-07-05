import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export const metadata = {
  title: 'Press & Media | BidCraft',
}

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream-base)]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-24 px-[var(--space-5)]">
        
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6">Press & Media</h1>
        <p className="text-body-lg text-[var(--color-ink-700)]">
          Access our latest press releases, media kits, and brand assets here. This section is designed for journalists and media professionals looking for official company news, statistics, and high-resolution logos.
        </p>
      </div>
    
      </main>
      <Footer />
    </div>
  )
}
