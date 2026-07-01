import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-[var(--color-cream-base)] flex flex-col">
      <Navbar />
      
      <div className="flex-1 mt-[80px]">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] w-full bg-[#111]">
          <img 
            src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1600&auto=format&fit=crop" 
            alt="Artist creating work" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-t from-[#111]/80 to-transparent">
            <h1 className="text-display-lg md:text-[56px] text-white mb-4 font-brand drop-shadow-md max-w-3xl">
              Where Creativity Becomes Opportunity
            </h1>
            <p className="text-body-lg text-white/90 max-w-2xl font-light">
              We built BidCraft because independent creators deserve a stage that honors their craft.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-[800px] mx-auto px-6 py-[var(--space-10)] md:py-20 flex flex-col gap-[var(--space-8)]">
          <div className="prose prose-lg text-[var(--color-ink-700)] mx-auto">
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-6">The Problem We Saw</h2>
            <p className="mb-6">
              For too long, students, hobbyists, and independent artists have struggled to find a marketplace that values the human element. Mass-produced goods drown out genuine craftsmanship, and exorbitant platform fees make it impossible for emerging creators to build a sustainable business. 
            </p>
            <p className="mb-10">
              When you pour your heart into a resin coaster, a crochet bouquet, or a carefully restored Hot Wheels collectible, it’s not just a product—it’s a piece of your story.
            </p>

            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-6">Our Mission</h2>
            <p className="mb-6">
              Our mission is simple: to democratize the creator economy. We want to empower everyone—from the student knitting in their dorm room to the dedicated ceramicist in their studio—with the tools they need to share their passion with the world.
            </p>

            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-6">A Creator-First Philosophy</h2>
            <p className="mb-6">
              At BidCraft, we don't just host storefronts; we build communities. Our platform is designed around discovery and curation, ensuring that buyers who value premium, handmade items can seamlessly connect with the artisans who create them. Whether you're a collector hunting for rare finds or a shopper looking for the perfect personalized gift, you're directly supporting an independent creator's dream.
            </p>

            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-6">Looking Forward</h2>
            <p className="mb-10">
              Our long-term goal is to build an ecosystem where creativity is the ultimate currency. We envision a future where anyone with a passion can turn it into a livelihood, supported by a platform that fights for their success every step of the way.
            </p>
          </div>

          <div className="bg-[var(--color-cream-raised)] p-[var(--space-8)] rounded-[var(--radius-lg)] text-center mt-8">
            <h3 className="text-heading-md text-[var(--color-ink-900)] mb-3">Join Our Community</h3>
            <p className="text-body-md text-[var(--color-ink-700)] mb-6 max-w-md mx-auto">
              Whether you are here to showcase your craft or discover something extraordinary, you belong here.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/explore">
                <Button size="large">Start Exploring</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
