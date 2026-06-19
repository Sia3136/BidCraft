'use client'

import React, { useEffect, useState, use } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/sections/footer'
import { useAuth } from '@/lib/auth-context'
import { profileApi, listingsApi, followsApi } from '@/lib/api'
import { ProductCard } from '@/components/product-card'

export default function CreatorStorefrontPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [listings, setListings] = useState<any[]>([])
  const [followers, setFollowers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Follow state
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  
  // Tabs: 'all' | 'fixed' | 'auction'
  const [activeTab, setActiveTab] = useState<'all' | 'fixed' | 'auction'>('all')

  const loadData = async () => {
    try {
      setLoading(true)
      // 1. Fetch public profile
      const profData = await profileApi.getPublic(id)
      setProfile(profData.profile)

      // 2. Fetch listings by seller_id
      const listingsData = await listingsApi.list(`seller_id=${id}&status=active`)
      setListings(listingsData.listings || [])

      // 3. Fetch followers
      const followersData = await followsApi.getFollowers(id)
      const list = followersData.followers || followersData || []
      setFollowers(list)

      // 4. Check if logged-in user follows this seller
      if (user) {
        const matchingFollower = list.find((f: any) => String(f.follower_id) === String(user.id))
        setIsFollowing(!!matchingFollower)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load creator profile.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id, user])

  const handleFollowToggle = async () => {
    if (!user) {
      alert('Please sign in to follow creators.')
      return
    }
    try {
      setFollowLoading(true)
      if (isFollowing) {
        await followsApi.unfollow(id)
        setIsFollowing(false)
        setFollowers(prev => prev.filter(f => String(f.follower_id) !== String(user.id)))
      } else {
        await followsApi.follow(id)
        setIsFollowing(true)
        setFollowers(prev => [...prev, { follower_id: user.id }])
      }
    } catch (err: any) {
      alert('Failed to update follow status: ' + err.message)
    } finally {
      setFollowLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center text-muted-foreground">
          Loading creator storefront...
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center text-red-500 font-semibold">
          {error || 'Creator not found.'}
        </div>
        <Footer />
      </main>
    )
  }

  // Filter listings
  const filteredListings = listings.filter((item) => {
    if (activeTab === 'fixed') return item.listing_type === 'fixed'
    if (activeTab === 'auction') return item.listing_type === 'auction'
    return true
  })

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner Header */}
      <div className="h-60 bg-gradient-to-r from-violet-600 via-indigo-600 to-primary relative shadow-inner">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-20 relative z-10">
        {/* Creator Info Card */}
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8 mb-12 flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            {/* Avatar */}
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-32 h-32 rounded-2xl object-cover border-4 border-card shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white font-bold flex items-center justify-center text-4xl shadow-lg border-4 border-card">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Profile Meta */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-3xl font-extrabold text-foreground">{profile.name}</h1>
                {profile.is_verified && (
                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1">
                    ✓ Verified
                  </span>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                {profile.bio || 'This creator hasn\'t set a biography yet.'}
              </p>

              {/* Stats Counters */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm pt-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-foreground">{followers.length}</span>
                  <span className="text-muted-foreground">Followers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-foreground">{profile.total_sales || 0}</span>
                  <span className="text-muted-foreground">Sales</span>
                </div>
                <div className="flex items-center gap-1.5 bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10">
                  <span className="text-xs">🛡️ Trust Score:</span>
                  <span className="font-bold text-primary">{Math.round(profile.trust_score * 100) || 100}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Follow Actions */}
          <div className="flex flex-col gap-3 min-w-[150px] w-full md:w-auto">
            {user && String(user.id) === String(id) ? (
              <span className="px-4 py-2 text-center text-xs font-semibold bg-muted text-muted-foreground rounded-lg">
                Your Storefront
              </span>
            ) : (
              <button
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`w-full py-3 px-6 rounded-xl font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                  isFollowing
                    ? 'border border-border text-foreground hover:bg-muted'
                    : 'bg-primary text-white hover:bg-primary/95 shadow-md shadow-primary/10'
                }`}
              >
                {followLoading ? 'Syncing...' : isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        {/* Storefront Tabs */}
        <div className="border-b border-border mb-8 flex justify-between items-center">
          <div className="flex gap-6">
            {(['all', 'fixed', 'auction'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-semibold capitalize transition-all border-b-2 ${
                  activeTab === tab
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'all' ? 'All Items' : tab === 'fixed' ? 'Buy Now Only' : 'Auctions'}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            Showing {filteredListings.length} of {listings.length} items
          </span>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground bg-card border border-border border-dashed rounded-2xl">
            No active listings found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredListings.map((item) => {
              let photos = []
              try {
                photos = typeof item.photos === 'string' ? JSON.parse(item.photos) : item.photos
              } catch (e) {
                photos = item.photos || []
              }
              const image = (photos && photos.length > 0) ? photos[0] : '/placeholder.png'
              return (
                <ProductCard
                  key={item.id}
                  id={String(item.id)}
                  title={item.title}
                  image={image}
                  creator={profile.name}
                  creatorImage={profile.avatar_url || '/creator-1.png'}
                  price={Number(item.price || 0)}
                  rating={Number(profile.trust_score * 5) || 5.0}
                  reviews={Number(profile.total_sales || 0)}
                  methods={[item.listing_type.toUpperCase()]}
                  badge={item.listing_type === 'auction' ? 'LIVE' : undefined}
                />
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
