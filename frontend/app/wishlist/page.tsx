'use client'

import { useState } from 'react'
import { Heart, X } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const WISHLIST_ITEMS = [
  { 
    id: 1, 
    title: 'Vintage 1969 Hot Wheels Redline Twin Mill', 
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=400&auto=format&fit=crop', 
    creator: { name: 'Vikram S.', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop' }, 
    currentBid: '₹8,400', 
    bidCount: 14, 
    method: 'AUCTION', 
    isAuction: true,
    addedAt: 'Added 2 days ago',
    priceDrop: null
  },
  { 
    id: 3, 
    title: 'Resin Ocean Wave Charcuterie Board', 
    image: 'https://images.unsplash.com/photo-1611142998399-52e46d3eb808?q=80&w=400&auto=format&fit=crop', 
    creator: { name: 'David Chen', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop' }, 
    price: '₹4,500', 
    method: 'BUY NOW', 
    isAuction: false,
    addedAt: 'Added 1 week ago',
    priceDrop: 'Price dropped ₹500'
  }
]

export default function WishlistPage() {
  const [items, setItems] = useState(WISHLIST_ITEMS)

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <main className="min-h-screen bg-[var(--color-cream-base)] flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-[var(--container-max)] w-full mx-auto px-4 md:px-6 xl:px-6 py-[var(--space-10)]">
        
        <div className="flex items-center justify-between mb-[var(--space-8)] border-b border-[var(--color-border-subtle)] pb-[var(--space-6)]">
          <h1 className="text-display-lg text-[var(--color-ink-900)]">Your Wishlist</h1>
          <span className="text-body-md text-[var(--color-ink-500)]">{items.length} items</span>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[var(--space-10)] animate-fade-up">
            <div className="w-[64px] h-[64px] rounded-full bg-[var(--color-cream-deep)] flex items-center justify-center mb-[var(--space-5)] text-[var(--color-ink-500)]">
              <Heart size={32} />
            </div>
            <h2 className="text-display-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">
              Your wishlist is empty
            </h2>
            <p className="text-body-lg text-[var(--color-ink-700)] max-w-[480px] text-center mb-[var(--space-8)]">
              Discover unique pieces and curate your own collection by saving items you love.
            </p>
            <Button size="large">Start Exploring</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--space-4)] lg:gap-[var(--space-6)]">
            {items.map((product) => (
              <div key={product.id} className="group block rounded-[var(--radius-md)] bg-[var(--color-white)] relative hover-card flex flex-col animate-fade-up">
                
                {/* Image Area */}
                <div className="w-full aspect-[4/5] rounded-[var(--radius-md)] overflow-hidden relative mb-[var(--space-3)] shrink-0">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-slow ease-default group-hover:scale-[1.04]" />
                  <div className="absolute top-[var(--space-3)] left-[var(--space-3)] pointer-events-none">
                    <Badge variant="method">{product.method}</Badge>
                  </div>
                  <button 
                    onClick={() => removeItem(product.id)}
                    className="absolute top-[var(--space-3)] right-[var(--space-3)] w-[32px] h-[32px] rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-105"
                  >
                    <X size={16} className="text-[var(--color-ink-900)]" />
                  </button>
                </div>

                {/* Info Area */}
                <div className="px-1 flex flex-col flex-1 pb-1">
                  
                  {/* Meta Overline */}
                  <div className="flex flex-col gap-1 mb-[var(--space-3)]">
                    <span className="text-caption text-[var(--color-ink-500)]">{product.addedAt}</span>
                    {product.priceDrop && (
                      <span className="text-[11px] font-mono tracking-tight font-bold uppercase text-[var(--color-success-700)] bg-[var(--color-success-100)] px-2 py-1 rounded-sm w-fit leading-none">
                        {product.priceDrop}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-[var(--space-2)] mb-[var(--space-2)]">
                    <Avatar src={product.creator.avatar} initials={product.creator.name[0]} size="small" className="w-[24px] h-[24px]" />
                    <span className="text-caption text-[var(--color-ink-700)] line-clamp-1">{product.creator.name}</span>
                  </div>
                  
                  <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-2)] line-clamp-2 flex-1">{product.title}</h3>
                  
                  <div className="flex flex-col mt-auto">
                    {product.isAuction ? (
                      <div className="flex flex-col">
                        <span className="text-caption text-[var(--color-ink-500)]">Current Bid</span>
                        <div className="flex items-center justify-between">
                          <span className="text-price text-[var(--color-ink-900)]">{product.currentBid}</span>
                          <span className="text-caption text-[var(--color-ink-500)]">{product.bidCount} bids</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-price text-[var(--color-ink-900)]">{product.price}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
