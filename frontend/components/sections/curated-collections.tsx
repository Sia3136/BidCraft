'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

const COLLECTIONS = [
  {
    id: 'c1',
    title: 'The Analog Desk',
    items: '24 pieces',
    image: 'https://images.unsplash.com/photo-1596443686812-2f45229eebc3?q=80&w=1200&auto=format&fit=crop', // Typewriter/analog
    size: 'large'
  },
  {
    id: 'c2',
    title: 'JDM Legends',
    items: '12 pieces',
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=600&auto=format&fit=crop', // Hot wheels
    size: 'small'
  },
  {
    id: 'c3',
    title: 'Wabi-Sabi Ceramics',
    items: '18 pieces',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=600&auto=format&fit=crop', // Ceramics
    size: 'small'
  }
]

export function CuratedCollections() {
  const largeCollection = COLLECTIONS.find(c => c.size === 'large')!
  const smallCollections = COLLECTIONS.filter(c => c.size === 'small')

  return (
    <section className="py-[var(--space-8)] max-w-[var(--container-max)] mx-auto px-4 md:px-6 xl:px-6">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-[var(--space-7)] animate-fade-up">
        <h2 className="text-display-lg text-[var(--color-ink-900)] mb-[var(--space-3)]">
          Curated Collections
        </h2>
        <p className="text-body-lg text-[var(--color-ink-700)] max-w-[480px]">
          Editor-picked themes, refreshed weekly.
        </p>
      </div>

      {/* Asymmetric Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--space-4)] md:gap-[var(--space-5)] animate-fade-up">
        
        {/* Large Tile (spans 2 columns on desktop) */}
        <Link 
          href={`/collections/${largeCollection.id}`}
          className="group relative col-span-1 lg:col-span-2 aspect-[16/10] lg:aspect-auto rounded-[var(--radius-md)] overflow-hidden block"
        >
          <img
            src={largeCollection.image}
            alt={largeCollection.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-slow ease-default group-hover:scale-[1.04]"
          />
          <div 
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(43,42,40,0) 50%, rgba(43,42,40,0.65) 100%)' }}
          />
          <div className="absolute bottom-[var(--space-4)] xl:bottom-[var(--space-5)] left-[var(--space-4)] xl:left-[var(--space-5)] flex flex-col items-start">
            <h3 className="text-heading-lg xl:text-display-sm text-white mb-[var(--space-1)]">
              {largeCollection.title}
            </h3>
            <p className="text-caption text-white/80 mb-1">
              {largeCollection.items}
            </p>
            <div className="h-[2px] bg-white w-0 transition-all duration-slow ease-default group-hover:w-[32px]" />
          </div>
        </Link>

        {/* Small Stacked Tiles */}
        <div className="flex flex-col gap-[var(--space-4)] md:gap-[var(--space-5)] lg:col-span-1">
          {smallCollections.map((collection) => (
            <Link 
              key={collection.id}
              href={`/collections/${collection.id}`}
              className="group relative aspect-[16/10] rounded-[var(--radius-md)] overflow-hidden block"
            >
              <img
                src={collection.image}
                alt={collection.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-slow ease-default group-hover:scale-[1.04]"
              />
              <div 
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to bottom, rgba(43,42,40,0) 40%, rgba(43,42,40,0.75) 100%)' }}
              />
              <div className="absolute bottom-[var(--space-4)] left-[var(--space-4)] flex flex-col items-start">
                <h3 className="text-heading-lg text-white mb-[var(--space-1)]">
                  {collection.title}
                </h3>
                <p className="text-caption text-white/80 mb-1">
                  {collection.items}
                </p>
                <div className="h-[2px] bg-white w-0 transition-all duration-slow ease-default group-hover:w-[24px]" />
              </div>
            </Link>
          ))}
        </div>

      </div>

    </section>
  )
}
