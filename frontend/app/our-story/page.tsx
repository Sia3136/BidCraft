
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Our Story | BidCraft',
  description: 'The journey of creating a trust-first marketplace for Indian creators.',
}

export default function OurStoryPage() {
  return (
    <div className="flex-1 w-full">
        {/* Hero Section */}
        <section className="py-24 px-[var(--space-5)] bg-[var(--color-cream-soft)] border-b border-[var(--color-cream-dark)]">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-display-xl font-display text-[var(--color-ink-900)] mb-6">Our Story</h1>
            <p className="text-body-xl text-[var(--color-ink-700)] max-w-2xl mx-auto">
              We started BidCraft with a simple belief: genuine creativity deserves a marketplace built on trust, transparency, and true value.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-24 px-[var(--space-5)]">
          <div className="max-w-3xl mx-auto space-y-16">
            
            <div className="space-y-6">
              <h2 className="text-display-sm font-display text-[var(--color-ink-900)]">The Challenge for Independent Creators</h2>
              <p className="text-body-lg text-[var(--color-ink-700)] leading-relaxed">
                For years, independent Indian artisans, artists, and crafters faced a significant hurdle: finding a dedicated space that values their unique, handcrafted goods. On massive e-commerce platforms, exquisite artisan work gets buried under oceans of mass-produced inventory. On social media, creators are burdened with managing DMs, arranging insecure payments, and dealing with flaky buyers. When buyers and sellers can't fully trust the transaction process, the entire independent creator ecosystem is hindered.
              </p>
            </div>

            {/* Main Image */}
            <div className="w-full relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-[var(--color-cream-border)] shadow-sm">
              <Image 
                src="https://res.cloudinary.com/duzlsyzwa/image/upload/v1786218811/bidcraft_assets/oez02sk45w9ujkjpname.webp"
                alt="Artisan working on pottery, representing India's creative ecosystem"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-display-sm font-display text-[var(--color-ink-900)]">Building a Trust-First Platform</h2>
              <p className="text-body-lg text-[var(--color-ink-700)] leading-relaxed">
                BidCraft was explicitly built from the ground up to solve these marketplace challenges. We act as a secure bridge between passionate creators and buyers who appreciate true craftsmanship. 
                <br /><br />
                At the core of BidCraft is our integrated escrow payment system. When a buyer makes a purchase, the funds are securely held until the order is successfully delivered. This ensures total protection: buyers know they will receive exactly what they paid for, and creators are guaranteed compensation for their hard work without the risk of chargeback fraud or non-payment.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-display-sm font-display text-[var(--color-ink-900)]">Three Ways to Transact</h2>
              <p className="text-body-lg text-[var(--color-ink-700)] leading-relaxed">
                Because every piece of handcrafted art is unique, the way it is sold should be too. We introduced three distinct buying methods to give creators ultimate flexibility and ensure they earn a sustainable livelihood:
              </p>
              <ul className="list-disc pl-6 space-y-4 text-body-lg text-[var(--color-ink-700)]">
                <li>
                  <strong className="text-[var(--color-ink-900)] font-medium">Buy Now:</strong> Perfect for ready-made, consistently priced items where buyers want the convenience of an instant, straightforward purchase.
                </li>
                <li>
                  <strong className="text-[var(--color-ink-900)] font-medium">Make an Offer:</strong> A collaborative approach that allows buyers to respectfully propose a negotiated price, fostering direct connection between the creator and the collector.
                </li>
                <li>
                  <strong className="text-[var(--color-ink-900)] font-medium">Auctions:</strong> Ideal for one-of-a-kind, rare, or highly sought-after pieces. Auctions allow the community to determine the true market value of an item, ensuring the creator receives fair compensation for their finest work.
                </li>
              </ul>
            </div>

            <div className="pt-12 border-t border-[var(--color-cream-dark)] text-center">
              <h2 className="text-display-sm font-display text-[var(--color-ink-900)] mb-6">Support India's Creative Ecosystem</h2>
              <p className="text-body-lg text-[var(--color-ink-700)] mb-8">
                Every purchase on BidCraft directly supports an independent creator. Join us in building a marketplace where creativity becomes opportunity.
              </p>
              <Link 
                href="/explore" 
                className="inline-flex items-center justify-center h-[var(--space-12)] px-8 bg-[var(--color-ink-900)] text-white rounded-[var(--radius-md)] font-medium hover:bg-[var(--color-terracotta-600)] transition-colors"
              >
                Explore Marketplace
              </Link>
            </div>

          </div>
        </section>
    </div>
  )
}
