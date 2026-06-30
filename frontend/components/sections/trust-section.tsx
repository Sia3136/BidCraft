'use client'

import { ShieldCheck, BadgeCheck, PackageCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Escrow-Protected Payments',
    description: 'Funds are held securely and only released to the seller once you receive the item exactly as described.'
  },
  {
    icon: BadgeCheck,
    title: 'Verified Creators',
    description: 'Every seller undergoes a strict verification process to ensure authenticity and protect our community.'
  },
  {
    icon: PackageCheck,
    title: 'Buyer-Confirmed Delivery',
    description: 'You have the final say. If the item isn’t what you expected, our support team will make it right.'
  }
]

export function TrustSection() {
  return (
    <section className="py-[var(--space-9)] max-w-[var(--container-max)] mx-auto px-4 md:px-6 xl:px-6">
      
      <div className="max-w-[880px] mx-auto flex flex-col items-center text-center animate-fade-up">
        
        {/* Header */}
        <h2 className="text-display-lg text-white mb-[var(--space-3)]">
          Buy and sell with confidence
        </h2>
        <p className="text-body-lg text-white/80 mb-[var(--space-8)] max-w-[640px]">
          We protect every transaction through our secure escrow system, ensuring peace of mind from bid to delivery.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-[32px] gap-x-[var(--space-6)] mb-[var(--space-8)]">
          {FEATURES.map((feature, i) => (
            <div 
              key={feature.title} 
              className="flex flex-col items-center text-center animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <feature.icon size={32} strokeWidth={1.5} className="text-white mb-[var(--space-4)]" />
              <h3 className="text-heading-sm text-white mb-[var(--space-2)]">
                {feature.title}
              </h3>
              <p className="text-caption text-white/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="animate-fade-up [animation-delay:300ms]">
          <Button 
            size="large" 
            className="bg-transparent border-[1.5px] border-white text-white hover:bg-white/10 hover:underline-none"
          >
            Learn How Escrow Works
          </Button>
        </div>

      </div>

    </section>
  )
}
