'use client'

import { Avatar } from '@/components/ui/avatar'

const TESTIMONIALS = [
  {
    quote: "I used to sell my pottery on generic marketplaces, but it always felt lost. BidCraft actually understands the value of handmade work. My sales have doubled.",
    author: {
      name: "Sarah Jenkins",
      role: "Ceramic Artist",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
    }
  },
  {
    quote: "The live auction feature is incredible for rare drops. It brings the StockX energy to collectibles that truly deserve it. Escrow makes it stress-free.",
    author: {
      name: "Marcus V.",
      role: "Hot Wheels Collector",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop"
    }
  },
  {
    quote: "Finding unique, non-mass-produced gifts used to take hours of digging. Now I just browse the curated collections here. The quality is unmatched.",
    author: {
      name: "Priya Desai",
      role: "Buyer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop"
    }
  }
]

export function Testimonials() {
  return (
    <section className="py-[var(--space-9)] max-w-[var(--container-max)] mx-auto px-4 md:px-6 xl:px-6">
      
      <div className="flex flex-col items-center text-center mb-[var(--space-7)] animate-fade-up">
        <h2 className="text-display-lg text-[var(--color-ink-900)]">
          Loved by Creators and Collectors
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-5)]">
        {TESTIMONIALS.map((testimonial, i) => (
          <div 
            key={i}
            className="bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] p-[var(--space-6)] flex flex-col animate-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Opening Quote Mark */}
            <span 
              className="font-brand italic text-[32px] text-[var(--color-terracotta-600)] leading-none -ml-2 mb-[var(--space-4)]"
            >
              &ldquo;
            </span>

            {/* Quote text */}
            <p className="font-brand italic text-body-lg text-[var(--color-ink-900)] mb-[var(--space-5)] flex-1">
              {testimonial.quote}
            </p>

            {/* Divider */}
            <div className="h-[1px] w-full bg-[var(--color-border-subtle)] mb-[var(--space-4)]" />

            {/* Author */}
            <div className="flex items-center gap-[var(--space-3)]">
              <Avatar src={testimonial.author.avatar} initials={testimonial.author.name[0]} size="default" className="w-[40px] h-[40px]" />
              <div className="flex flex-col">
                <span className="text-body-md font-semibold text-[var(--color-ink-900)]">{testimonial.author.name}</span>
                <span className="text-caption text-[var(--color-ink-500)]">{testimonial.author.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}
