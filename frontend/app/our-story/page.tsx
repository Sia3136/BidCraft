import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Our Story | BidCraft',
  description: 'The journey of creating a trust-first marketplace for Indian creators.',
}

export default function OurStoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream-base)]">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 px-[var(--space-5)] bg-[var(--color-cream-soft)] border-b border-[var(--color-cream-dark)]">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-display-xl font-display text-[var(--color-ink-900)] mb-6">Our Story</h1>
            <p className="text-body-xl text-[var(--color-ink-700)] max-w-2xl mx-auto">
              We started BidCraft with a simple belief: genuine creativity deserves a marketplace built on trust.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-24 px-[var(--space-5)]">
          <div className="max-w-3xl mx-auto space-y-16">
            
            <div className="space-y-6">
              <h2 className="text-display-sm font-display text-[var(--color-ink-900)]">The Problem With Existing Marketplaces</h2>
              <p className="text-body-lg text-[var(--color-ink-700)]">
                For years, independent Indian artisans, artists, and crafters faced the same struggles: giant e-commerce platforms that buried their unique work under mass-produced goods, or social media platforms that lacked secure payment and escrow systems. When buyers and sellers can't trust the transaction, the entire creator economy suffers.
              </p>
            </div>

            {/* Image 1: Creators making products */}
            <div className="w-full h-[400px] bg-[var(--color-cream-deep)] rounded-2xl flex items-center justify-center border border-[var(--color-border-subtle)] relative overflow-hidden">
              <Image src="https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto,w_1200/v1785910327/bidcraft_homepage/vleothtzrxgybsvw0fsx.webp" fill className="object-contain" sizes="(max-width: 768px) 100vw, 800px" alt="Creator making pottery" />
            </div>

            <div className="space-y-6">
              <h2 className="text-display-sm font-display text-[var(--color-ink-900)]">Building a Trust-First Platform</h2>
              <p className="text-body-lg text-[var(--color-ink-700)]">
                We designed BidCraft from the ground up to solve these exact problems. By implementing robust escrow protection, verifying our creators, and maintaining strict quality standards, we ensure that every transaction is secure. Buyers know they will receive exactly what they paid for, and creators know they will be compensated for their hard work.
              </p>
            </div>

            {/* Image 2: Packaging/Trust interaction */}
            <div className="w-full h-[400px] bg-[var(--color-cream-deep)] rounded-2xl flex items-center justify-center border border-[var(--color-border-subtle)] relative overflow-hidden">
              <Image src="https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto,w_1200/v1785910328/bidcraft_homepage/w3psq5cxxuugl6bn2086.jpg" fill className="object-cover object-[center_30%]" sizes="(max-width: 768px) 100vw, 800px" alt="Handmade crochet craftsmanship" />
            </div>

            <div className="space-y-6">
              <h2 className="text-display-sm font-display text-[var(--color-ink-900)]">Why Three Ways to Buy?</h2>
              <p className="text-body-lg text-[var(--color-ink-700)]">
                Every piece of art is different, and so is every transaction. We introduced three distinct buying methods to give creators ultimate flexibility:
              </p>
              <ul className="list-disc pl-6 space-y-4 text-body-lg text-[var(--color-ink-700)]">
                <li>
                  <strong className="text-[var(--color-ink-900)] font-medium">Buy Now:</strong> Perfect for ready-made, consistently priced items where buyers want instant purchase.
                </li>
                <li>
                  <strong className="text-[var(--color-ink-900)] font-medium">Auction:</strong> Ideal for one-of-a-kind, highly sought-after pieces where the community determines the true market value.
                </li>
                <li>
                  <strong className="text-[var(--color-ink-900)] font-medium">Make an Offer (Negotiable):</strong> A collaborative approach that allows buyers and sellers to respectfully negotiate a price that works for both.
                </li>
              </ul>
            </div>

            {/* Image 3: Painting Workspace */}
            <div className="w-full h-[400px] bg-[var(--color-cream-deep)] rounded-2xl flex items-center justify-center border border-[var(--color-border-subtle)] relative overflow-hidden">
              <Image src="https://res.cloudinary.com/duzlsyzwa/image/upload/f_auto,q_auto,w_1200/v1785910330/bidcraft_homepage/aetwfouct5hgdfgebllo.jpg" fill className="object-contain" sizes="(max-width: 768px) 100vw, 800px" alt="Creative painting workspace" />
            </div>

            <div className="pt-12 border-t border-[var(--color-cream-dark)] text-center">
              <h2 className="text-display-sm font-display text-[var(--color-ink-900)] mb-6">Join Our Community</h2>
              <p className="text-body-lg text-[var(--color-ink-700)] mb-8">
                Whether you're looking to discover unique creations or share your own craft with the world, you belong here.
              </p>
              <Link 
                href="/explore" 
                className="inline-flex items-center justify-center h-[var(--space-12)] px-8 bg-[var(--color-brand-primary)] text-white rounded-full font-medium hover:bg-[var(--color-brand-hover)] transition-colors"
              >
                Explore Marketplace
              </Link>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
