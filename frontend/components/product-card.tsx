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
    <div className="group bg-white rounded-[4px] overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500 flex flex-col h-full border border-border/60">
      {/* Clickable Image & Title Area */}
      <Link href={`/listings/${id}`} className="block relative overflow-hidden bg-muted aspect-square">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Gradients to ensure text/badges are visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {badge && (
          <div className="absolute top-4 right-4 bg-white text-[#171717] px-3 py-1.5 rounded-full text-[11px] font-bold z-10 shadow-lg tracking-wide uppercase">
            {badge}
          </div>
        )}
        <button
          onClick={toggleWatchlist}
          disabled={watchLoading}
          className={`absolute z-20 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all shadow-md text-lg ${badge ? 'top-[4rem] right-4' : 'top-4 right-4'}`}
          title={watchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          {watchlisted ? '❤️' : '🤍'}
        </button>
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
          {methods.map(method => (
            <SellingMethodBadge key={method} method={method as 'AUCTION' | 'BUY_NOW' | 'OFFERS'} size="sm" />
          ))}
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 bg-white">
        
        {/* Creator Info */}
        <div className="flex items-center gap-2 mb-3">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">{creator}</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
        </div>

        {/* Title */}
        <Link href={`/listings/${id}`} className="block mb-6">
          <h3 className="text-[17px] font-brand font-medium text-foreground line-clamp-2 group-hover:text-muted-foreground transition-colors leading-snug tracking-wide">
            {title}
          </h3>
        </Link>

        <div className="mt-auto">
          {/* Price/Bid Section */}
          <div className="mb-5 pb-5 border-b border-border/60">
            {currentBid !== undefined && currentBid !== null ? (
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">Current Bid</p>
                  <p className="text-xl font-semibold text-foreground">${Number(currentBid).toLocaleString()}</p>
                </div>
                {bidCount !== undefined && (
                  <p className="text-[12px] font-medium text-muted-foreground">{bidCount} bids</p>
                )}
              </div>
            ) : (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">Price</p>
                <p className="text-xl font-semibold text-foreground">${Number(price).toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Rating & Countdown */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-1">
              <span className="text-[13px] font-semibold text-foreground">{rating}</span>
              <span className="text-[13px] text-yellow-500">★</span>
              <span className="text-[12px] text-muted-foreground">({reviews})</span>
            </div>
            {endsIn && (
              <div className="text-red-500 font-semibold text-[13px]">
                {endsIn}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {methods.includes('AUCTION') && (
              <Link 
                href={`/listings/${id}`}
                className="flex-1 bg-white border border-[#171717] text-[#171717] py-2.5 rounded-[4px] text-[13px] tracking-wide font-medium hover:bg-[#171717] hover:text-white transition-all duration-300 text-center block"
              >
                Place Bid
              </Link>
            )}
            {methods.includes('BUY_NOW') && (
              <Link 
                href={`/listings/${id}`}
                className="flex-1 bg-[#171717] border border-[#171717] text-white py-2.5 rounded-[4px] text-[13px] tracking-wide font-medium hover:bg-[#2B2B2B] transition-all duration-300 text-center block"
              >
                Buy Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
