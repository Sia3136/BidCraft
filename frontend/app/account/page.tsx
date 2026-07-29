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

  // Calculate profile completion based solely on active fields:
  // Name (25%), Username (25%)
  // City (10%), State (10%)
  // Interests (15%)
  // Marketplace Role (15%)
  let completion = 0
  if (user.name) completion += 25
  if (user.username) completion += 25
  if (user.city) completion += 10
  if (user.state) completion += 10
  if (user.interests?.length > 0) completion += 15
  if (user.marketplace_role) completion += 15
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

    </div>
  )
}
