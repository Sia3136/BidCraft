'use client'

import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface ReviewsSectionProps {
  scope: 'product' | 'creator'
  className?: string
}

const MOCK_REVIEWS = [
  {
    id: 1,
    author: 'Samira Patel',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    rating: 5,
    date: '2 weeks ago',
    text: 'Absolutely stunning work. The craftsmanship exceeded my expectations and it arrived securely packaged via escrow.',
    photos: [
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=200&auto=format&fit=crop'
    ]
  },
  {
    id: 2,
    author: 'Michael R.',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop',
    rating: 5,
    date: '1 month ago',
    text: 'Great communication throughout the process. Highly recommend this creator.',
  },
  {
    id: 3,
    author: 'J. Dawson',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=100&auto=format&fit=crop',
    rating: 4,
    date: '2 months ago',
    text: 'Beautiful piece, just a slight delay in shipping. Otherwise perfect.',
  }
]

export function ReviewsSection({ scope, className }: ReviewsSectionProps) {
  return (
    <section className={cn("w-full max-w-[var(--container-max)] mx-auto", className)}>
      <h2 className="text-display-lg text-[var(--color-ink-900)] mb-[var(--space-6)]">
        {scope === 'creator' ? 'Storefront Reviews' : 'Reviews'}
      </h2>

      {/* Summary Row */}
      <div className="flex flex-col md:flex-row gap-[var(--space-8)] mb-[var(--space-8)]">
        
        {/* Left: Score */}
        <div className="flex flex-col items-center md:items-start shrink-0">
          <div className="text-display-md text-[var(--color-ink-900)] font-semibold leading-none mb-[var(--space-2)]">
            4.8
          </div>
          <div className="flex items-center gap-[2px] mb-[var(--space-2)]">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={20} 
                className={cn(
                  "fill-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)]",
                  i === 4 && "opacity-30" // Simulate 4.8 rating visually
                )} 
              />
            ))}
          </div>
          <div className="text-caption text-[var(--color-ink-500)]">
            Based on 142 reviews
          </div>
        </div>

        {/* Right: Breakdown Bars */}
        <div className="flex-1 max-w-[400px] flex flex-col gap-[var(--space-2)]">
          {[
            { label: '5 stars', pct: '85%' },
            { label: '4 stars', pct: '10%' },
            { label: '3 stars', pct: '3%' },
            { label: '2 stars', pct: '1%' },
            { label: '1 star', pct: '1%' },
          ].map((bar) => (
            <div key={bar.label} className="flex items-center gap-[var(--space-3)]">
              <span className="text-caption text-[var(--color-ink-700)] w-[48px] shrink-0">{bar.label}</span>
              <div className="flex-1 h-[6px] bg-[var(--color-cream-deep)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--color-terracotta-600)] rounded-full" 
                  style={{ width: bar.pct }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="flex flex-col gap-[var(--space-6)] mb-[var(--space-6)]">
        {MOCK_REVIEWS.map((review) => (
          <div key={review.id} className="flex flex-col border-b border-[var(--color-border-subtle)] pb-[var(--space-6)] last:border-0 last:pb-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-[var(--space-3)]">
              <div className="flex items-center gap-[var(--space-3)]">
                <Avatar src={review.avatar} initials={review.author[0]} size="small" />
                <span className="text-body-md font-semibold text-[var(--color-ink-900)]">{review.author}</span>
              </div>
              <span className="text-caption text-[var(--color-ink-500)]">{review.date}</span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-[2px] mb-[var(--space-3)]">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  className={cn(
                    "fill-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)]",
                    i >= review.rating && "opacity-20 fill-[var(--color-ink-300)] text-[var(--color-ink-300)]"
                  )} 
                />
              ))}
            </div>

            {/* Body */}
            <p className="text-body-md text-[var(--color-ink-700)] mb-[var(--space-3)]">
              {review.text}
            </p>

            {/* Photos */}
            {review.photos && review.photos.length > 0 && (
              <div className="flex items-center gap-[var(--space-3)] mt-[var(--space-2)]">
                {review.photos.map((photo, i) => (
                  <div key={i} className="w-[72px] h-[72px] rounded-[var(--radius-sm)] overflow-hidden cursor-pointer">
                    <img src={photo} alt="Review photo" className="w-full h-full object-cover transition-transform duration-250 hover:scale-105" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center mt-[var(--space-6)]">
        <Button variant="ghost">Load More</Button>
      </div>

    </section>
  )
}
