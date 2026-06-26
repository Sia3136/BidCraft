'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { SellingMethodBadge } from './selling-method-badge'
import { CountdownTimer } from './countdown-timer'
import { wishlistApi } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

interface ProductCardProps {
  id: string
  title: string
  image: string
  creator: string
  creatorImage: string
  price: number
  rating: number
  reviews: number
  methods: string[]
  badge?: string
  currentBid?: number | null
  bidCount?: number
  endsIn?: string
  isWatchlisted?: boolean
}

export function ProductCard({
  id,
  title,
  image,
  creator,
  price,
  rating,
  reviews,
  methods,
  badge,
  currentBid,
  bidCount,
  endsIn,
  isWatchlisted = false,
}: ProductCardProps) {
  const { user } = useAuth()
  const [watchlisted, setWatchlisted] = useState(isWatchlisted)
  const [watchLoading, setWatchLoading] = useState(false)

  useEffect(() => {
    setWatchlisted(isWatchlisted)
  }, [isWatchlisted])

  const toggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      alert("Please sign in to add to your watchlist.")
      return
    }
    try {
      setWatchLoading(true)
      if (watchlisted) {
        setWatchlisted(false)
        await wishlistApi.remove(id)
      } else {
        setWatchlisted(true)
        await wishlistApi.add(id)
      }
    } catch (err: any) {
      setWatchlisted(!watchlisted)
      alert(err.message || "Failed to update watchlist")
    } finally {
      setWatchLoading(false)
    }
  }

  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full border border-border">
      {/* Clickable Image & Title Area */}
      <Link href={`/listings/${id}`} className="block relative overflow-hidden bg-muted aspect-square">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {badge && (
          <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
            {badge}
          </div>
        )}
        <button
          onClick={toggleWatchlist}
          disabled={watchLoading}
          className="absolute top-3 right-3 z-20 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors text-lg"
          style={badge ? { top: '3rem' } : {}}
          title={watchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          {watchlisted ? '❤️' : '🤍'}
        </button>
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {methods.map(method => (
            <SellingMethodBadge key={method} method={method as 'AUCTION' | 'BUY_NOW' | 'OFFERS'} size="sm" />
          ))}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <Link href={`/listings/${id}`} className="block">
          <h3 className="text-sm font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        {/* Creator */}
        <p className="text-xs text-muted-foreground mb-3">{creator}</p>

        {/* Price/Bid Section */}
        <div className="mb-3 pb-3 border-b border-border mt-auto">
          {currentBid !== undefined && currentBid !== null ? (
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Current Bid</p>
                <p className="text-lg font-bold text-primary">${currentBid}</p>
              </div>
              {bidCount !== undefined && (
                <p className="text-xs text-muted-foreground">{bidCount} bids</p>
              )}
            </div>
          ) : (
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="text-lg font-bold text-primary">${price}</p>
            </div>
          )}
        </div>

        {/* Rating & Countdown */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-foreground">{rating}</span>
            <span className="text-sm">⭐</span>
            <span className="text-xs text-muted-foreground">({reviews})</span>
          </div>
          {endsIn && <CountdownTimer timeString={endsIn} size="sm" />}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex gap-2">
          {methods.includes('AUCTION') && (
            <Link 
              href={`/listings/${id}`}
              className="flex-1 bg-primary text-white py-2 rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors text-center block"
            >
              Bid
            </Link>
          )}
          {methods.includes('BUY_NOW') && (
            <Link 
              href={`/listings/${id}`}
              className="flex-1 bg-secondary text-white py-2 rounded-lg text-xs font-semibold hover:bg-secondary/90 transition-colors text-center block"
            >
              Buy
            </Link>
          )}
          {methods.includes('OFFERS') && !methods.includes('BUY_NOW') && (
            <Link 
              href={`/listings/${id}`}
              className="flex-1 border border-primary text-primary py-2 rounded-lg text-xs font-semibold hover:bg-primary/10 transition-colors text-center block"
            >
              Offer
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
