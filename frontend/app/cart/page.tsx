'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Minus, Plus, Loader2 } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'

export default function CartPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [promoCode, setPromoCode] = useState('')
  
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    fetchCart()
  }, [user])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const res = await api.get('/cart')
      // map backend cart item to frontend structure
      const mapped = res.data.cart.map((item: any) => ({
        id: item.listing_id,
        cart_id: item.id,
        title: item.title,
        creator: item.seller_name,
        price: parseFloat(item.price),
        image: item.photos?.[0] || 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=400&auto=format&fit=crop',
        quantity: 1, // Default quantity
        status: item.status
      }))
      setItems(mapped)
    } catch (err: any) {
      setError('Failed to load cart items')
    } finally {
      setLoading(false)
    }
  }
  
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  
  const updateQuantity = (id: number, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const removeItem = async (id: number) => {
    try {
      setItems(items.filter(item => item.id !== id))
      await api.delete(`/cart/${id}`)
    } catch (err: any) {
      // Revert if failed
      fetchCart()
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-cream-base)] flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-6 xl:px-6 py-[var(--space-8)] md:py-[var(--space-10)] mt-[80px]">
        
        <h1 className="text-display-lg text-[var(--color-ink-900)] mb-[var(--space-8)]">Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-[var(--space-8)] xl:gap-[var(--space-10)] items-start">
          
          {/* Left: Cart Items List */}
          <div className="w-full lg:w-[65%] flex flex-col gap-[var(--space-4)]">
            {!user ? (
              <div className="py-[var(--space-10)] text-center">
                <p className="text-body-lg text-[var(--color-ink-700)] mb-[var(--space-6)]">Please sign in to view your cart.</p>
              </div>
            ) : loading ? (
              <div className="py-[var(--space-10)] flex justify-center text-[var(--color-terracotta-600)]">
                <Loader2 className="animate-spin w-8 h-8" />
              </div>
            ) : error ? (
              <div className="py-[var(--space-10)] text-center">
                <p className="text-body-lg text-[var(--color-urgent-600)] mb-[var(--space-6)]">{error}</p>
                <Button onClick={fetchCart}>Try Again</Button>
              </div>
            ) : items.length === 0 ? (
              <div className="py-[var(--space-10)] text-center">
                <p className="text-body-lg text-[var(--color-ink-700)] mb-[var(--space-6)]">Your cart is empty.</p>
                <Link href="/"><Button>Continue Shopping</Button></Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-[var(--space-4)] bg-white rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] p-[var(--space-4)] animate-fade-up">
                  
                  {/* Thumbnail */}
                  <Link href={`/listings/${item.id}`} className="shrink-0">
                    <img src={item.image} alt={item.title} className="w-[96px] h-[96px] rounded-[var(--radius-sm)] object-cover bg-[var(--color-slate-100)]" />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex justify-between items-start gap-4 mb-1">
                      <Link href={`/listings/${item.id}`} className="text-heading-sm text-[var(--color-ink-900)] hover:text-[var(--color-terracotta-600)] transition-colors line-clamp-2">
                        {item.title}
                      </Link>
                      {/* Desktop Price */}
                      <span className="hidden sm:block text-price text-[var(--color-ink-900)] shrink-0">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                    
                    <span className="text-caption text-[var(--color-ink-700)] mb-1">by {item.creator}</span>
                    {item.status !== 'active' && <span className="text-caption text-[var(--color-urgent-600)] mb-[var(--space-3)]">No longer available</span>}
                    
                    <div className="mt-auto flex items-center justify-between">
                      {/* Quantity Stepper */}
                      <div className="flex items-center h-[36px] border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] overflow-hidden bg-white">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-[36px] h-full flex items-center justify-center text-[var(--color-ink-700)] hover:bg-[var(--color-cream-deep)] border-r border-[var(--color-border-subtle)]"
                        >
                          <Minus size={14} />
                        </button>
                        <div className="w-[40px] h-full flex items-center justify-center font-mono text-body-md text-[var(--color-ink-900)]">
                          {item.quantity}
                        </div>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-[36px] h-full flex items-center justify-center text-[var(--color-ink-700)] hover:bg-[var(--color-cream-deep)] border-l border-[var(--color-border-subtle)]"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-[var(--space-4)]">
                        {/* Mobile Price */}
                        <span className="sm:hidden text-price text-[var(--color-ink-900)] shrink-0">₹{item.price.toLocaleString('en-IN')}</span>
                        <div className="hidden sm:flex flex-col items-end">
                          <button onClick={() => removeItem(item.id)} className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[var(--color-ink-500)] hover:bg-[var(--color-cream-deep)] hover:text-[var(--color-urgent-600)] transition-colors">
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Actions */}
                    <div className="sm:hidden flex items-center justify-between mt-[var(--space-4)] pt-[var(--space-3)] border-t border-[var(--color-border-subtle)]">
                      <button onClick={() => removeItem(item.id)} className="flex items-center gap-1 text-caption text-[var(--color-urgent-600)]">
                        <X size={14} /> Remove
                      </button>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right: Order Summary Panel */}
          {items.length > 0 && (
            <div className="w-full lg:w-[35%] shrink-0 sticky top-[100px]">
              <div className="bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] p-[var(--space-5)] animate-fade-up [animation-delay:100ms]">
                <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-[var(--space-5)]">Order Summary</h2>
                
                <div className="flex flex-col gap-[var(--space-3)] mb-[var(--space-5)]">
                  <div className="flex justify-between text-body-md text-[var(--color-ink-700)]">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-body-md text-[var(--color-ink-700)]">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="h-[1px] w-full bg-[var(--color-border-subtle)] mb-[var(--space-4)]" />

                <div className="flex justify-between items-end mb-[var(--space-6)]">
                  <span className="text-heading-lg text-[var(--color-ink-900)]">Estimated Total</span>
                  <span className="text-[24px] font-mono tracking-tight text-[var(--color-ink-900)] font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center gap-[var(--space-2)] mb-[var(--space-6)]">
                  <Input 
                    type="text" 
                    placeholder="Promo code" 
                    value={promoCode} 
                    onChange={e => setPromoCode(e.target.value)}
                    className="flex-1 bg-white h-[44px]"
                  />
                  <Button variant="secondary" className="h-[44px] px-6">Apply</Button>
                </div>

                <Link href="/checkout" className="block w-full">
                  <Button size="large" className="w-full">Proceed to Checkout</Button>
                </Link>
                
                <p className="text-caption text-[var(--color-ink-500)] text-center mt-[var(--space-3)]">
                  Your payment is protected until delivery is confirmed.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </main>
  )
}

