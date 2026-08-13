'use client'

import Link from 'next/link'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { Listing } from '@/lib/api'
import { formatPrice } from '@/lib/formatPrice'
import { Heart, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

import { AuctionTimer } from '@/components/AuctionTimer'
import { useStore } from '@/lib/store'
import { getProductRoute } from '@/lib/routes'

export const ProductCard = React.memo(function ProductCard({ product, priority = false }: { product: Listing, priority?: boolean }) {
  const { wishlistIds, toggleWishlist: storeToggleWishlist } = useStore()
  const isWishlisted = wishlistIds.includes(Number(product.numericId || product.id))
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      router.push(`/auth?returnTo=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    
    storeToggleWishlist(Number(product.numericId || product.id))
  }

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const { isAuthenticated } = useAuthStore.getState()
    if (!isAuthenticated) {
      router.push(`/auth?returnTo=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: Number(product.numericId || product.id) })
      })
      if (res.ok) {
        // TODO: Replace with proper transient toast system
        alert('Added to cart!')
        useStore.getState().loadCart()
      } else {
        // TODO: Replace with proper transient toast system
        alert('Failed to add to cart')
      }
    } catch (err) {
      console.error(err)
      // TODO: Replace with proper transient toast system
      alert('Failed to add to cart')
    }
  }

  let badgeColor = 'var(--color-terracotta-600)';
  let badgeText: string = product.buyingMethod || '';
  let badgeBg = 'var(--color-terracotta-100)';
  
  if (product.buyingMethod === 'Auction') {
    badgeBg = 'var(--color-terracotta-600)';
    badgeColor = 'var(--color-white)';
    badgeText = 'Auction';
  } else if (product.buyingMethod === 'Negotiable') {
    badgeBg = 'var(--color-ink-900)';
    badgeColor = 'var(--color-white)';
    badgeText = 'Make Offer';
  } else {
    badgeBg = 'var(--color-success-100)';
    badgeColor = 'var(--color-success-700)';
    badgeText = 'Buy Now';
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'duzlsyzwa'
  const FALLBACK_IMAGE = "/placeholder.jpg";
  const imageStr = product.image?.trim();
  const imageUrl = !imageStr
    ? FALLBACK_IMAGE
    : imageStr.startsWith('http') || imageStr.startsWith('/')
      ? imageStr
      : `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_500/${imageStr}`;

  return (
    <div className="group relative flex flex-col h-full border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] overflow-hidden bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300">
      <Link href={getProductRoute(product)} className="block relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-cream-deep)] animate-pulse-light">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          loading={priority ? undefined : "lazy"}
          style={{ objectFit: 'cover' }}
          className="group-hover:scale-105 transition-transform duration-500 bg-[var(--color-cream-deep)]"
          onLoad={(event) => {
            const img = event.target as HTMLImageElement;
            img.classList.remove('bg-[var(--color-cream-deep)]');
          }}
          onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
        />
        
        {/* Top Left Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: badgeBg,
          color: badgeColor,
          padding: '4px 10px',
          borderRadius: 'var(--radius-pill)',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          zIndex: 10
        }}>
          {badgeText}
        </div>

        {/* Top Right Wishlist Button */}
        <button 
          onClick={toggleWishlist}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            height: '36px', 
            width: '36px',
            background: 'rgba(255, 255, 255, 0.9)', 
            color: isWishlisted ? 'var(--color-terracotta-600)' : 'var(--color-ink-500)',
            border: 'none', 
            borderRadius: '50%',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            zIndex: 10
          }}
          className="hover:scale-110 transition-transform"
        >
          <Heart fill={isWishlisted ? 'currentColor' : 'none'} size={18} />
        </button>

        {/* Bottom Right Cart Button */}
        {(product.buyingMethod === 'Buy Now' || product.buyingMethod === 'Negotiable') && (
          <button 
            onClick={handleAddToCart}
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              height: '36px', 
              width: '36px',
              background: 'rgba(255, 255, 255, 0.9)', 
              color: 'var(--color-ink-900)',
              border: 'none', 
              borderRadius: '50%',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              zIndex: 10
            }}
            className="hover:scale-110 hover:bg-[var(--color-ink-900)] hover:text-white transition-all"
          >
            <ShoppingCart size={18} />
          </button>
        )}


      </Link>

      <div className="p-4 flex flex-col flex-1 bg-white z-10 relative">
        <div className="flex items-center gap-1.5 mb-2">
          <p className="text-[12px] font-semibold text-[var(--color-ink-500)] uppercase tracking-wider line-clamp-1">
            {product.creator}
          </p>
          {product.verified && (
            <span className="text-[10px] bg-[var(--color-success-100)] text-[var(--color-success-700)] px-1.5 py-0.5 rounded-[var(--radius-pill)] font-bold shrink-0">
              ✓
            </span>
          )}
        </div>

        <Link href={getProductRoute(product)} className="block hover:underline decoration-[var(--color-ink-300)] decoration-2 underline-offset-2">
          <h3 className="font-display font-semibold text-[15px] text-[var(--color-ink-900)] mb-3 leading-tight line-clamp-2">
            {product.title}
          </h3>
        </Link>

        <div className="mt-auto pt-2 border-t border-[var(--color-border-subtle)]">
          {product.buyingMethod === 'Auction' ? (
            <div className="flex flex-col">
              {/* Added mini timer for auction item on explore page as requested */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-[var(--color-ink-500)] uppercase tracking-wider mb-0.5">Current Bid</p>
                  <p className="text-[18px] font-bold text-[var(--color-ink-900)]">
                    {formatPrice(product.currentBid ?? product.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-medium text-[var(--color-ink-500)] mt-0.5">
                    {product.bidCount ? `${product.bidCount} bids` : '0 bids'}
                  </p>
                </div>
              </div>
              {product.auctionEndsAt && (
                <div className="mt-2">
                  <AuctionTimer endTime={product.auctionEndsAt} />
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-[10px] font-semibold text-[var(--color-ink-500)] uppercase tracking-wider mb-0.5">Price</p>
              <p className="text-[18px] font-bold text-[var(--color-ink-900)]">
                {formatPrice(product.price)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})
