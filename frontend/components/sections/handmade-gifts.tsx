'use client'

import Link from 'next/link'

const GIFTS = [
  {
    name: 'Birthdays',
    href: '/gifts/birthdays',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop' // Gift box/ribbon
  },
  {
    name: 'Anniversaries',
    href: '/gifts/anniversaries',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400&auto=format&fit=crop' // Jewelry/romantic
  },
  {
    name: 'Housewarming',
    href: '/gifts/housewarming',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=400&auto=format&fit=crop' // Home decor
  },
  {
    name: 'Just Because',
    href: '/gifts/just-because',
    image: 'https://images.unsplash.com/photo-1520121401995-928cb5c4119c?q=80&w=400&auto=format&fit=crop' // Small crafts/flowers
  },
  {
    name: 'For Him',
    href: '/gifts/for-him',
    image: 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?q=80&w=400&auto=format&fit=crop' // Wallet/leather
  },
  {
    name: 'For Her',
    href: '/gifts/for-her',
    image: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?q=80&w=400&auto=format&fit=crop' // Skincare/bath
  }
]

export function HandmadeGifts() {
  return (
    <section className="py-[var(--space-8)] max-w-[var(--container-max)] mx-auto px-4 md:px-6 xl:px-6 overflow-hidden">
      
      <div className="flex flex-col items-center text-center mb-[var(--space-7)] animate-fade-up">
        <h2 className="text-display-lg text-[var(--color-ink-900)] mb-[var(--space-3)]">
          Gifts With a Story
        </h2>
        <p className="text-body-lg text-[var(--color-ink-700)] max-w-[480px]">
          Thoughtful finds for the people who matter.
        </p>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory gap-[var(--space-4)] pb-4 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {GIFTS.map((gift, i) => (
          <Link
            key={gift.name}
            href={gift.href}
            className="group relative flex-shrink-0 w-[200px] aspect-[3/4] rounded-[var(--radius-md)] overflow-hidden snap-start animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <img
              src={gift.image}
              alt={gift.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-slow ease-default group-hover:scale-[1.06]"
            />
            <div 
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(43,42,40,0) 50%, rgba(43,42,40,0.65) 100%)' }}
            />
            <div className="absolute bottom-[var(--space-4)] left-[var(--space-4)] flex flex-col items-start">
              <h3 className="text-heading-lg text-white mb-1">
                {gift.name}
              </h3>
              <div className="h-[2px] bg-white w-0 transition-all duration-slow ease-default group-hover:w-[24px]" />
            </div>
          </Link>
        ))}
        {/* Spacer */}
        <div className="w-[40px] shrink-0 lg:hidden" />
      </div>

    </section>
  )
}
