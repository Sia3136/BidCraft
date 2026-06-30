'use client'

import Link from 'next/link'
import { Avatar } from '@/components/ui/avatar'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const CREATORS = [
  {
    id: 1,
    name: 'Elena Rostova',
    specialty: 'Ceramic Artist · Prague',
    bio: 'Minimalist forms inspired by brutalist architecture.',
    rating: 4.9,
    reviews: 128,
    cover: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=600&auto=format&fit=crop', // Studio
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    verified: true,
  },
  {
    id: 2,
    name: 'David Chen',
    specialty: 'Resin & Woodwork · Seattle',
    bio: 'Capturing landscapes in epoxy resin and reclaimed wood.',
    rating: 5.0,
    reviews: 342,
    cover: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600&auto=format&fit=crop', // Desk
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop',
    verified: true,
  },
  {
    id: 3,
    name: 'The Vintage Vault',
    specialty: 'Die-cast Collector · Austin',
    bio: 'Sourcing rare Hot Wheels redlines and mint condition mainlines.',
    rating: 4.8,
    reviews: 89,
    cover: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=600&auto=format&fit=crop', // Hot wheels
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=150&auto=format&fit=crop',
    verified: false,
  },
  {
    id: 4,
    name: 'Studio Noor',
    specialty: 'Textile Design · Jaipur',
    bio: 'Hand-block printed textiles using natural botanical dyes.',
    rating: 4.9,
    reviews: 215,
    cover: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=600&auto=format&fit=crop', // Fabric
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
    verified: true,
  }
]

export function FeaturedCreators() {
  return (
    <section className="py-[var(--space-8)] max-w-[var(--container-max)] mx-auto px-4 md:px-6 xl:px-6">
      <div className="flex flex-col items-center text-center mb-[var(--space-7)] animate-fade-up">
        <h2 className="text-display-lg text-[var(--color-ink-900)] mb-[var(--space-3)]">
          Featured Creators
        </h2>
        <p className="text-body-lg text-[var(--color-ink-700)] max-w-[480px]">
          Meet the artisans, collectors, and designers defining BidCraft.
        </p>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory gap-[var(--space-5)] pb-4 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-4 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {CREATORS.map((creator, i) => (
          <Link 
            key={creator.id}
            href={`/creator/${creator.id}`}
            className="group block flex-shrink-0 w-[280px] md:w-auto snap-start hover-card rounded-[var(--radius-md)] bg-[var(--color-white)] animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Cover Strip */}
            <div className="w-full aspect-[16/9] rounded-t-[var(--radius-md)] overflow-hidden relative bg-[var(--color-slate-100)]">
              <img
                src={creator.cover}
                alt={`${creator.name} cover`}
                className="w-full h-full object-cover transition-transform duration-slow ease-default group-hover:scale-[1.04]"
              />
            </div>
            
            <div className="px-[var(--space-5)] pb-[var(--space-5)] relative flex flex-col items-center text-center">
              {/* Avatar - Negative margin to overlap cover */}
              <div className="mt-[-32px] mb-[var(--space-3)] relative z-10">
                <Avatar 
                  src={creator.avatar} 
                  initials={creator.name[0]} 
                  verified={creator.verified} 
                  className="w-[64px] h-[64px] ring-[4px] ring-[var(--color-white)]" 
                />
              </div>

              <h3 className="text-heading-lg text-[var(--color-ink-900)] mb-[2px]">
                {creator.name}
              </h3>
              <p className="text-caption text-[var(--color-ink-500)] mb-[var(--space-3)]">
                {creator.specialty}
              </p>

              <p className="text-body-md text-[var(--color-ink-700)] line-clamp-2 max-w-[220px] mb-[var(--space-4)]">
                {creator.bio}
              </p>

              <div className="flex items-center justify-center gap-1 text-caption text-[var(--color-ink-700)]">
                <Star size={14} className="fill-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)]" />
                <span className="font-semibold">{creator.rating}</span>
                <span className="text-[var(--color-ink-500)]">({creator.reviews})</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
