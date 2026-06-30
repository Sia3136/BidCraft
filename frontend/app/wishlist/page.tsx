'use client'

import { useState, useEffect } from 'react'
import { Heart, X, Loader2 } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import api from '@/lib/api'

export default function WishlistPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    fetchWishlist()
  }, [user])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const res = await api.get('/wishlist')
      
      const mapped = res.data.wishlist.map((item: any) => ({
        id: item.id,
        title: item.title,
        image: item.photos?.[0] || 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=400&auto=format&fit=crop',
        creator: { 
          name: item.seller_name, 
          avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop' 
        },
        price: `₹${parseFloat(item.price).toLocaleString('en-IN')}`,
        currentBid: item.listing_type === 'auction' ? `₹${parseFloat(item.price).toLocaleString('en-IN')}` : null,
        method: item.listing_type === 'auction' ? 'AUCTION' : 'BUY NOW',
        isAuction: item.listing_type === 'auction',
        addedAt: `Added ${new Date(item.wishlisted_at).toLocaleDateString()}`,
        status: item.status
      }))

      setItems(mapped)
    } catch (err: any) {
      setError('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (id: number) => {
    try {
      setItems(items.filter(item => item.id !== id))
      await api.delete(`/wishlist/${id}`)
    } catch (err: any) {
      // Revert if failed
      fetchWishlist()
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-cream-base)] flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-[var(--container-max)] w-full mx-auto px-4 md:px-6 xl:px-6 py-[var(--space-10)] mt-[80px]">
        
        <div className="flex items-center justify-between mb-[var(--space-8)] border-b border-[var(--color-border-subtle)] pb-[var(--space-6)]">
          <h1 className="text-display-lg text-[var(--color-ink-900)]">Your Wishlist</h1>
          <span className="text-body-md text-[var(--color-ink-500)]">{items.length} items</span>
        </div>

        {!user ? (
          <div className="flex flex-col items-center justify-center py-[var(--space-10)] animate-fade-up">
            <h2 className="text-display-sm text-[var(--color-ink-900)] mb-[var(--space-3)]">
              Please sign in to view your wishlist
            </h2>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-[var(--space-10)] text-[var(--color-terracotta-600)]">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-[var(--space-10)]">
            <p className="text-body-lg text-[var(--color-urgent-600)] mb-[var(--space-6)]">{error}</p>
            <Button onClick={fetchWishlist}>Try Again</Button>
          </div>
        ) : items.length === 0 ? (
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
                  {product.status !== 'active' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-bold bg-black/60 px-3 py-1 rounded">No longer available</span>
                    </div>
                  )}
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
                          <span className="text-caption text-[var(--color-ink-500)]">{product.bidCount || 0} bids</span>
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

