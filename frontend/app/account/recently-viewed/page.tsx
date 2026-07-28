'use client'

import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function RecentlyViewedPage() {
  const { token } = useAuthStore()
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecent = async () => {
      if (!token) return
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/recently-viewed`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setRecentlyViewed(data.recentlyViewed || [])
        }
      } catch (err) {
        console.error('Failed to fetch recently viewed', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRecent()
  }, [token])

  return (
    <div className="max-w-6xl space-y-8">
      <h1 className="text-display-sm text-[var(--color-ink-900)] flex items-center gap-3">
        <Clock className="w-8 h-8 text-[var(--color-terracotta-600)]" /> Recently Viewed
      </h1>
      
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-terracotta-600)]" />
        </div>
      ) : recentlyViewed.length === 0 ? (
        <Card>
          <CardContent className="py-16 flex flex-col items-center justify-center text-center">
            <Clock className="w-12 h-12 text-[var(--color-ink-300)] mb-4" />
            <h3 className="text-heading-lg text-[var(--color-ink-900)] mb-2">No recently viewed items</h3>
            <p className="text-body-md text-[var(--color-ink-700)] mb-6 max-w-md">
              Items you look at will appear here so you can easily find them again.
            </p>
            <Button className="flex items-center gap-2" asChild>
              <Link href="/collections/all">
                Browse Marketplace <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentlyViewed.map((item) => (
            <Link key={item.id} href={`/listing/${item.id}`} className="group block">
              <div className="relative aspect-square bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] overflow-hidden mb-3">
                <Image 
                  src={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1615266895738-11f1371cd7e5?auto=format&fit=crop&q=80'} 
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-body-md font-medium text-[var(--color-ink-900)] truncate group-hover:text-[var(--color-terracotta-600)] transition-colors">{item.title}</h3>
              <p className="text-body-md font-bold text-[var(--color-ink-900)] mt-1">₹{item.price?.toLocaleString('en-IN')}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
