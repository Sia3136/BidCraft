'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useStore } from '@/lib/store'
import { useAuthStore } from '@/store/authStore'
import { Trash2 } from 'lucide-react'

type WishlistItem = {
  wishlist_id: number;
  wishlisted_at: string;
  id: number;
  title: string;
  price: string;
  photos: string | string[];
  seller_name: string;
}

export default function WishlistPage() {
  const { user, token } = useAuthStore()
  const { toggleWishlist } = useStore()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/wishlist`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.wishlist) setItems(data.wishlist)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [token])

  const removeItem = async (listingId: number) => {
    toggleWishlist(String(listingId))
    setItems(items.filter(i => i.id !== listingId))
  }

  const formatPrice = (p: string | number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(p))

  return (
    <div className="min-h-screen bg-[var(--color-cream-base)] flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-[var(--container-max)] mx-auto w-full px-[var(--space-4)] py-[var(--space-6)]">
        <h1 className="text-display-md font-display text-[var(--color-ink-900)] mb-[var(--space-6)]">Your Wishlist</h1>
        
        {loading ? (
          <p>Loading wishlist...</p>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <h2 className="text-heading-lg mb-2">Your Wishlist is empty</h2>
            <p className="text-[var(--color-ink-500)] mb-6">
              {user ? "Nothing here yet" : "Sign in to save your favourite items"}
            </p>
            <Link href={user ? "/explore" : "/auth"} className="px-6 py-3 bg-[var(--color-terracotta-600)] text-white rounded-[var(--radius-md)] font-bold">
              {user ? "Start Exploring" : "Sign In"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => {
              const imageUrl = Array.isArray(item.photos) ? item.photos[0] : (typeof item.photos === 'string' ? JSON.parse(item.photos)[0] : '');
              return (
                <div key={item.wishlist_id} className="bg-white rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] overflow-hidden">
                  <div className="aspect-square bg-[var(--color-cream-raised)] relative group">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[var(--color-cream-lowered)] text-[var(--color-ink-400)] text-sm font-medium">
                        No Image
                      </div>
                    )}
                    <button onClick={() => removeItem(item.id)} className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-full text-[var(--color-ink-700)] hover:text-[var(--color-urgent-600)] transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-heading-sm font-display truncate mb-1">
                      <Link href={`/product/${item.id}`} className="hover:text-[var(--color-terracotta-600)] transition-colors">{item.title}</Link>
                    </h3>
                    <p className="text-sm text-[var(--color-ink-500)] mb-2">by {item.seller_name}</p>
                    <p className="font-bold text-[var(--color-ink-900)]">{formatPrice(item.price)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}
