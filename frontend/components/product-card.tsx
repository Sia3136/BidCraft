'use client'

import Link from 'next/link'
import Image from 'next/image'
import React, { useState } from 'react'
import { Product } from '@/lib/dbProducts'
import { formatPrice } from '@/lib/formatPrice'
import { Heart } from 'lucide-react'

export const ProductCard = React.memo(function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  function toggleWishlist(e: React.MouseEvent) {
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const bidText = product.bidCount ? `Place Bid · ${product.bidCount} bids` : 'Place Bid · Be first'

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#fff' }}>
      <Link href={`/product/${product.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
        <div style={{ position: 'relative', aspectRatio: '4/5', width: '100%', overflow: 'hidden', backgroundColor: 'var(--color-cream-deep)' }}>
          <Image
            src={product.image}
            alt={product.title}
            fill
            style={{ objectFit: 'cover' }}
          />
          {/* Buying Method Badge */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'var(--color-white)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            color: 'var(--color-ink-900)'
          }}>
            {product.buyingMethod}
          </div>
        </div>

        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-ink-500)', textTransform: 'uppercase' }}>
              {product.creator}
            </p>
            {product.verified && (
              <span style={{ fontSize: '10px', background: 'var(--color-success-100)', color: 'var(--color-success-700)', padding: '2px 6px', borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>
                ✓
              </span>
            )}
          </div>

          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--color-ink-900)', marginBottom: '12px', lineHeight: 1.3 }}>
            {product.title}
          </h3>

          <div style={{ marginTop: 'auto' }}>
            {product.buyingMethod === 'Auction' ? (
              <div>
                <p style={{ fontSize: '11px', color: 'var(--color-ink-500)', fontWeight: 600, textTransform: 'uppercase' }}>Current Bid</p>
                <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ink-900)' }}>
                  {formatPrice(product.currentBid ?? product.price)}
                </p>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '11px', color: 'var(--color-ink-500)', fontWeight: 600, textTransform: 'uppercase' }}>Price</p>
                <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ink-900)' }}>
                  {formatPrice(product.price)}
                </p>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Action buttons are OUTSIDE the Link */}
      <div className="card-actions" onClick={(e) => e.stopPropagation()} style={{ padding: '0 16px 16px', display: 'flex', gap: '8px' }}>
        
        {product.buyingMethod === 'Auction' && (
          <button style={{
            flex: 1, height: '36px',
            background: 'var(--color-terracotta-600)', color: 'white',
            border: 'none', borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600,
            cursor: 'pointer',
          }}>
            {bidText}
          </button>
        )}

        {(product.buyingMethod === 'Buy Now') && (
          <>
            <button style={{
              flex: 1, height: '36px',
              background: 'var(--color-terracotta-600)', color: 'white',
              border: 'none', borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer',
            }}>
              Buy Now
            </button>
            <button style={{
              flex: 1, height: '36px',
              background: 'transparent', color: 'var(--color-slate-900)',
              border: '1.5px solid var(--color-slate-700)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer',
            }}>
              Add to Cart
            </button>
          </>
        )}

        {(product.buyingMethod === 'Negotiable') && (
          <>
            <button style={{
              flex: 1, height: '36px',
              background: 'var(--color-terracotta-600)', color: 'white',
              border: 'none', borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer',
            }}>
              Buy Now
            </button>
            <button style={{
              flex: 1, height: '36px',
              background: 'transparent', color: 'var(--color-slate-900)',
              border: '1.5px solid var(--color-slate-700)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer',
            }}>
              Make an Offer
            </button>
          </>
        )}
        
        {/* Wishlist Button outside the image */}
        <button 
          onClick={toggleWishlist}
          style={{
            height: '36px', width: '36px',
            background: 'transparent', color: isWishlisted ? 'var(--color-urgent-600)' : 'var(--color-ink-500)',
            border: 'none', borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Heart fill={isWishlisted ? 'currentColor' : 'none'} size={20} />
        </button>
      </div>
    </div>
  )
})
