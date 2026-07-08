'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useAuthStore } from '@/store/authStore'
import { Trash2 } from 'lucide-react'

type CartItem = {
  cart_item_id: number;
  quantity: number;
  id: number;
  title: string;
  price: string;
  photos: string | string[];
  seller_name: string;
}

export default function CartPage() {
  const { user, token } = useAuthStore()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    fetch(`/api/cart`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.cart) setItems(data.cart)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [token])

  const removeItem = async (listingId: number) => {
    try {
      await fetch(`/api/cart?listing_id=${listingId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      setItems(items.filter(i => i.id !== listingId))
    } catch (err) {
      console.error(err)
    }
  }

  const formatPrice = (p: string | number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(p))

  const total = items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)

  return (
    <div className="min-h-screen bg-[var(--color-cream-base)] flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-[var(--container-max)] mx-auto w-full px-[var(--space-4)] py-[var(--space-6)]">
        <h1 className="text-display-md font-display text-[var(--color-ink-900)] mb-[var(--space-6)]">Your Cart</h1>
        
        {loading ? (
          <p>Loading cart...</p>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <h2 className="text-heading-lg mb-2">Your Cart is empty</h2>
            <p className="text-[var(--color-ink-500)] mb-6">
              {user ? "Nothing here yet" : "Sign in to save your favourite items"}
            </p>
            <Link href={user ? "/explore" : "/auth"} className="px-6 py-3 bg-[var(--color-terracotta-600)] text-white rounded-[var(--radius-md)] font-bold">
              {user ? "Start Exploring" : "Sign In"}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-4">
              {items.map(item => {
                const imageUrl = Array.isArray(item.photos) ? item.photos[0] : (typeof item.photos === 'string' ? JSON.parse(item.photos)[0] : '');
                return (
                  <div key={item.cart_item_id} className="flex gap-4 bg-white p-4 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]">
                    <img src={imageUrl} alt={item.title} className="w-24 h-24 object-cover rounded-[var(--radius-sm)]" />
                    <div className="flex-1">
                      <h3 className="text-heading-sm font-display text-[var(--color-ink-900)]"><Link href={`/product/${item.id}`}>{item.title}</Link></h3>
                      <p className="text-sm text-[var(--color-ink-500)]">by {item.seller_name}</p>
                      <p className="font-bold text-[var(--color-terracotta-600)] mt-2">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => removeItem(item.id)} className="text-[var(--color-urgent-600)] hover:text-[var(--color-urgent-700)]"><Trash2 className="w-5 h-5" /></button>
                      <span className="text-sm font-medium">Qty: {item.quantity}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="w-full lg:w-[320px] bg-white p-6 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] h-fit">
              <h3 className="text-heading-sm font-display mb-4 border-b border-[var(--color-border-subtle)] pb-4">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button className="w-full mt-6 h-12 bg-[var(--color-terracotta-600)] text-white rounded-[var(--radius-pill)] font-bold hover:bg-[var(--color-terracotta-700)]">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}
