'use client'

import Link from 'next/link'

const VISUAL_CATEGORIES = [
  {
    id: 'art',
    name: 'Art',
    description: 'Paintings, prints, and digital creations.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop',
    href: '/explore?category=art'
  },
  {
    id: 'handmade-crafts',
    name: 'Handmade & Crafts',
    description: 'Handmade pottery, decor, and textiles.',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=600&auto=format&fit=crop',
    href: '/explore?category=handmade-and-crafts'
  },
  {
    id: 'collectibles',
    name: 'Collectibles',
    description: 'Action figures, trading cards, and rare items.',
    image: 'https://images.unsplash.com/photo-1581022295087-35e593704911?q=80&w=600&auto=format&fit=crop',
    href: '/explore?category=collectibles'
  },
  {
    id: 'gaming-hobby',
    name: 'Gaming & Hobby',
    description: 'Board games, cosplay props, and anime merchandise.',
    image: 'https://images.unsplash.com/photo-1606148386401-209fae4895cc?q=80&w=600&auto=format&fit=crop',
    href: '/explore?category=gaming-and-hobby'
  }
]

export function ExploreCategoriesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-brand font-medium tracking-wide text-foreground">Explore Categories</h2>
            <p className="text-muted-foreground mt-3 text-[15px] max-w-lg">Discover unique creations across our curated collections, spanning from fine art to rare vintage memorabilia.</p>
          </div>
        </div>

        {/* Visual Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VISUAL_CATEGORIES.map((category) => (
            <Link 
              key={category.id} 
              href={category.href}
              className="group relative block h-[380px] rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 active:scale-[0.98]"
            >
              {/* Background Image */}
              <img 
                src={category.image} 
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white font-brand text-2xl tracking-wide mb-1">{category.name}</h3>
                <p className="text-white/80 text-[13px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
