'use client'

import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Package, Heart, Clock, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function AccountOverview() {
  const { user, token } = useAuthStore()
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

  if (!user) return null

  // Calculate profile completion (simplified)
  let completion = 50
  if (user.bio) completion += 10
  if (user.city && user.country) completion += 15
  if (user.interests?.length > 0) completion += 15
  if (user.avatar_url) completion += 10
  completion = Math.min(completion, 100)

  return (
    <div className="space-y-8">
      <h1 className="text-display-sm text-[var(--color-ink-900)]">Account Overview</h1>
      
      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Completion</CardTitle>
          <CardDescription>Complete your profile to get personalized recommendations and build trust within the community.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-[var(--color-cream-raised)] h-3 rounded-full overflow-hidden">
              <div 
                className="bg-[var(--color-terracotta-600)] h-full transition-all duration-1000"
                style={{ width: `${completion}%` }}
              />
            </div>
            <span className="font-bold text-[var(--color-ink-900)]">{completion}%</span>
          </div>
          {completion < 100 && (
            <Link href="/account/settings">
              <Button variant="outline" className="mt-4">
                Complete Profile
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Orders Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Track and manage your purchases</CardDescription>
            </div>
            <Package className="w-5 h-5 text-[var(--color-ink-500)]" />
          </CardHeader>
          <CardContent>
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <Package className="w-10 h-10 text-[var(--color-ink-300)] mb-3" />
              <p className="text-body-md text-[var(--color-ink-700)]">No recent orders found.</p>
              <Button variant="link" className="mt-2 text-[var(--color-terracotta-600)]" asChild>
                <Link href="/collections/all">Start shopping <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wishlist Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Your Wishlist</CardTitle>
              <CardDescription>Items you've saved for later</CardDescription>
            </div>
            <Heart className="w-5 h-5 text-[var(--color-ink-500)]" />
          </CardHeader>
          <CardContent>
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <Heart className="w-10 h-10 text-[var(--color-ink-300)] mb-3" />
              <p className="text-body-md text-[var(--color-ink-700)]">Your wishlist is empty.</p>
              <Button variant="link" className="mt-2 text-[var(--color-terracotta-600)]" asChild>
                <Link href="/collections/all">Explore items <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recently Viewed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading-lg text-[var(--color-ink-900)] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--color-ink-500)]" /> Recently Viewed
          </h2>
          {recentlyViewed.length > 0 && (
            <Link href="/account/recently-viewed" className="text-body-sm font-medium text-[var(--color-terracotta-600)] hover:underline flex items-center">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          )}
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--color-terracotta-600)]" />
          </div>
        ) : recentlyViewed.length === 0 ? (
          <Card>
            <CardContent className="py-12 flex flex-col items-center justify-center text-center">
              <p className="text-body-md text-[var(--color-ink-700)]">You haven't viewed any items recently.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/">Browse Marketplace</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentlyViewed.slice(0, 4).map((item) => (
              <Link key={item.id} href={`/listing/${item.id}`} className="group block">
                <div className="relative aspect-square bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] overflow-hidden mb-2">
                  <Image 
                    src={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1615266895738-11f1371cd7e5?auto=format&fit=crop&q=80'} 
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-body-sm font-medium text-[var(--color-ink-900)] truncate group-hover:text-[var(--color-terracotta-600)] transition-colors">{item.title}</h3>
                <p className="text-body-sm text-[var(--color-ink-500)]">₹{item.price?.toLocaleString('en-IN')}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
