'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  {
    name: 'Art',
    href: '/explore?category=art',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Handmade & Crafts',
    href: '/explore?category=handmade-and-crafts',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Collectibles',
    href: '/explore?category=collectibles',
    image: 'https://images.unsplash.com/photo-1610486806085-f3769c3a38a3?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Gaming & Hobby',
    href: '/explore?category=gaming-and-hobby',
    image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Lifestyle & Gifts',
    href: '/explore?category=lifestyle-and-gifts',
    image: 'https://images.unsplash.com/photo-1490288860714-eb065c71a355?q=80&w=600&auto=format&fit=crop'
  }
]

export function FeaturedCategories() {
  return (
    <section className="py-[var(--space-8)] max-w-[var(--container-max)] mx-auto px-4 md:px-6 xl:px-6">
      <div className="flex flex-col items-center text-center mb-[var(--space-7)] animate-fade-up">
        <h2 className="text-display-lg text-[var(--color-ink-900)] mb-[var(--space-3)]">
          Explore by Category
        </h2>
        <p className="text-body-lg text-[var(--color-ink-700)] max-w-[480px]">
          Discover unique pieces crafted and curated by our community of independent creators and collectors.
        </p>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory gap-[var(--space-4)] md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-[var(--space-5)] pb-4 md:pb-0 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {CATEGORIES.map((category, i) => (
          <Link
            key={category.name}
            href={category.href}
            className="group relative flex-shrink-0 w-[240px] md:w-auto aspect-[4/5] rounded-[var(--radius-md)] overflow-hidden snap-start animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <img
              src={category.image}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-slow ease-default group-hover:scale-[1.06]"
            />
            <div 
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(43,42,40,0) 50%, rgba(43,42,40,0.65) 100%)' }}
            />
            <div className="absolute bottom-[var(--space-4)] left-[var(--space-4)] flex flex-col items-start">
              <h3 className="text-heading-lg text-white mb-1">
                {category.name}
              </h3>
              <div className="h-[2px] bg-white w-0 transition-all duration-slow ease-default group-hover:w-[24px]" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
