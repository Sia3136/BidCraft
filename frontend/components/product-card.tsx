'use client'

import Link from 'next/link'
import Image from 'next/image'
import React, { useState } from 'react'
import { Product } from '@/lib/dbProducts'
import { formatPrice } from '@/lib/formatPrice'
import { Heart } from 'lucide-react'
import { CountdownTimer } from '@/components/countdown-timer'

export const ProductCard = React.memo(function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const bidText = product.bidCount ? `Place Bid · ${product.bidCount} bids` : 'Place Bid · Be first'

  let badgeColor = 'var(--color-terracotta-600)';
  let badgeText = product.buyingMethod;
  let badgeBg = 'var(--color-terracotta-100)';
  
  if (product.buyingMethod === 'Auction') {
    badgeBg = 'var(--color-terracotta-600)';
    badgeColor = 'var(--color-white)';
    badgeText = 'Auction';
  } else {
    badgeBg = 'var(--color-success-100)';
    badgeColor = 'var(--color-success-700)';
    badgeText = 'Buy Now';
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'duzlsyzwa'
  const imageUrl = product.image.startsWith('http') || product.image.startsWith('/') 
    ? product.image 
    : `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_500/${product.image}`;

  return (
    <div className="group relative flex flex-col h-full border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] overflow-hidden bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300">
      <Link href={`/product/${product.id}`} className="block relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-cream-deep)]">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          style={{ objectFit: 'cover' }}
          className="group-hover:scale-105 transition-transform duration-500"
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

        <Link href={`/product/${product.id}`} className="block hover:underline decoration-[var(--color-ink-300)] decoration-2 underline-offset-2">
          <h3 className="font-display text-[15px] text-[var(--color-ink-900)] mb-3 leading-tight line-clamp-2">
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
                  <p className="text-[11px] font-medium text-[var(--color-ink-500)] mt-0.5">
                    {product.bidCount ? `${product.bidCount} bids` : '0 bids'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold text-[var(--color-urgent-600)] uppercase tracking-wider mb-0.5">Ending in</p>
                  <CountdownTimer listingId={product.id} size="sm" />
                </div>
              </div>
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
