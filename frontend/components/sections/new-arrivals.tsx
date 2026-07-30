'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

const PRODUCTS = [
  {
    id: 1,
    title: 'Hand-thrown Ceramic Match Striker',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=400&auto=format&fit=crop', // Ceramics
    creator: { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop' },
    price: '₹1,200',
    method: 'BUY NOW',
    isAuction: false,
  },
  {
    id: 2,
    title: '1971 Datsun 510 Bluebird Wagon',
    image: 'https://images.unsplash.com/photo-1596727289524-7dae28d052a3?q=80&w=400&auto=format&fit=crop', // Hot wheels
    creator: { name: 'The Vintage Vault', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=100&auto=format&fit=crop' },
    price: '₹3,400',
    method: 'AUCTION',
    isAuction: true,
  },
  {
    id: 3,
    title: 'Resin Ocean Wave Charcuterie Board',
    image: 'https://images.unsplash.com/photo-1611142998399-52e46d3eb808?q=80&w=400&auto=format&fit=crop', // Wood/resin
    creator: { name: 'David Chen', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop' },
    price: '₹4,500',
    method: 'BUY NOW',
    isAuction: false,
  },
  {
    id: 4,
    title: 'Hand-dyed Indigo Linen Scarf',
    image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=400&auto=format&fit=crop', // Fabric
    creator: { name: 'Studio Noor', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop' },
    price: '₹2,800',
    method: 'NEGOTIABLE',
    isAuction: false,
  }
]

export function NewArrivals() {
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({})

  const toggleWishlist = (e: React.MouseEvent, id: number) => {
    e.preventDefault()
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section className="py-[var(--space-8)] max-w-[var(--container-max)] mx-auto px-4 md:px-6 xl:px-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-[var(--space-7)] animate-fade-up">
        <h2 className="text-display-lg text-[var(--color-ink-900)]">New Arrivals</h2>
        <Button variant="ghost">View All</Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[var(--space-4)] md:gap-[var(--space-5)]">
        {PRODUCTS.map((product, i) => (
          <Link 
            key={product.id}
            href={`/product/${product.id}`}
            className="group block rounded-[var(--radius-md)] bg-[var(--color-white)] relative animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Image Container */}
            <div className="w-full aspect-[4/5] rounded-[var(--radius-md)] overflow-hidden relative mb-[var(--space-3)]">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-slow ease-default group-hover:scale-[1.04]"
              />
              
              {/* Method Badge (Fixed) */}
              <div className="absolute top-[var(--space-3)] left-[var(--space-3)] pointer-events-none">
                <Badge variant="method">{product.method}</Badge>
              </div>

              {/* Wishlist Button (Fixed) */}
              <button 
                onClick={(e) => toggleWishlist(e, product.id)}
                className="absolute top-[var(--space-3)] right-[var(--space-3)] w-[32px] h-[32px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-105"
                aria-label="Add to wishlist"
              >
                <Heart 
                  size={16} 
                  className={cn(
                    "transition-colors",
                    wishlist[product.id] ? "fill-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)] animate-scale-pulse" : "text-white"
                  )} 
                />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col">
              {/* Creator row */}
              <div className="flex items-center gap-[var(--space-2)] mb-[var(--space-2)]">
                <Avatar src={product.creator.avatar} initials={product.creator.name[0]} size="small" className="w-[24px] h-[24px]" />
                <span className="text-caption text-[var(--color-ink-700)] line-clamp-1">{product.creator.name}</span>
              </div>

              {/* Title */}
              <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-2)] line-clamp-2 min-h-[44px]">
                {product.title}
              </h3>

              {/* Price Row */}
              <div className="flex flex-col">
                {product.isAuction && <span className="text-caption text-[var(--color-ink-500)] mb-1">Current Bid</span>}
                <span className="text-price text-[var(--color-ink-900)]">{product.price}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </section>
  )
}
