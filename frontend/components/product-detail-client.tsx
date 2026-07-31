'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/formatPrice';
import { Listing } from '@/lib/api';
import { ProductCard } from '@/components/product-card';
import { BuyNowButton } from '@/components/BuyNowButton';
import { PlaceBidPanel } from '@/components/PlaceBidPanel';
import { MakeOfferPanel } from '@/components/MakeOfferPanel';
import { Shield, ChevronRight, Heart, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AuctionTimer } from '@/components/AuctionTimer';
import { ImageGallery } from '@/components/pdp/ImageGallery';
import { SellerReputationBlock } from '@/components/pdp/SellerReputationBlock';
import { ShippingInfo } from '@/components/pdp/ShippingInfo';



export default function ProductDetailClientErrorBoundary(props: { product: Listing, related?: Listing[] }) {
  return (
    <ErrorBoundary>
      <ProductDetailClient {...props} />
    </ErrorBoundary>
  )
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error('ProductDetailClient error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div className="p-10 text-center">Something went wrong loading this product.</div>;
    }
    return this.props.children;
  }
}

function ProductDetailClient({ product, related = [] }: { product: Listing; related?: Listing[] }) {
  const router = useRouter();
  
  if (!product) {
    return <div className="p-10 text-center">Product not found.</div>;
  }
  const sellerName = typeof product?.creator === 'object' ? (product?.creator as any)?.name ?? 'Unknown Seller' : (product?.creator ?? 'Unknown Seller');
  const sellerSlug = sellerName?.toLowerCase().replace(/\s+/g, '-') ?? 'seller';
  
  const { toggleWishlist: storeToggleWishlist, wishlistIds, addToCart } = useStore();
  const { isAuthenticated } = useAuthStore();
  
  const isWishlisted = wishlistIds.includes(Number(product.numericId || product.id));
  const [added, setAdded] = useState(false);
  
  const [bidAmount, setBidAmount] = useState('');
  const [isBidding, setIsBidding] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(true);


  const handleAuthCheck = (action: () => void) => {
    if (!isAuthenticated) {
      router.push(`/auth?returnTo=${encodeURIComponent(window.location.pathname)}`);
    } else {
      action();
    }
  };

  const handlePlaceBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuthCheck(() => {
      const amount = Number(bidAmount);
      const currentHigh = product.currentBid ?? product.price;
      if (isNaN(amount) || amount <= currentHigh) {
        alert(`Your bid must be higher than the current bid of ₹${currentHigh}.`);
        return;
      }
      setIsBidding(true);
      setTimeout(() => {
        alert('Bid placed successfully!');
        setIsBidding(false);
        setBidAmount('');
      }, 1000);
    });
  };


  
  const handleAdd = () => {
    handleAuthCheck(() => {
      addToCart({ id: Math.random().toString(), productId: String(product.numericId || product.id), title: product.title, price: product.price, quantity: 1, image: product.image });
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    });
  };

  const toggleWishlist = (id?: string | number) => {
    handleAuthCheck(() => {
      const numericId = product.numericId || (id ? Number(id) : NaN) || Number(product.id);
      storeToggleWishlist(Number(numericId));
    });
  };

  return (
    <div className="bg-[var(--color-cream-base)] flex flex-col">
      <main className="flex-1 w-full max-w-[var(--container-max)] mx-auto px-[var(--space-4)] md:px-[var(--space-6)] xl:px-[var(--space-8)] py-[var(--space-8)]">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-caption text-[var(--color-ink-500)] mb-6">
          <span>Home</span>
          <ChevronRight className="w-4 h-4" />
          <span>{product.category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[var(--color-ink-900)] font-medium line-clamp-1">{product.title}</span>
        </div>

        {/* ROW 1 — Two-column grid (desktop: 55% left / 45% right, mobile: single col) */}
        <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-8 md:gap-12">

          {/* LEFT COLUMN — Gallery + Seller Card + Buyer Reviews */}
          <div className="flex flex-col">
            <ImageGallery
              images={product.images?.length ? product.images : [product.image || '/placeholder.jpg']}
              alt={product.title}
            />

            {/* BLOCK E + G — Seller Card and Buyer Reviews (SellerReputationBlock contains both) */}
            <div className="bg-[#F7F4EE] border border-[#D8C8BA] rounded-xl p-5 mt-6">
              <SellerReputationBlock
                sellerName={sellerName}
                verified={!!product?.verified}
                location={product?.shipsFrom}
                reputation={product?.sellerReputation}
              />
            </div>
          </div>

          {/* RIGHT COLUMN — Item details */}
          <div className="flex flex-col gap-8">

            {/* BLOCK A — Item Header */}
            <div className="flex flex-col gap-2 text-left">
              {/* Category chip */}
              {product.category && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-caption font-bold bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)] px-3 py-1 rounded-[var(--radius-pill)] uppercase tracking-wider">
                    {product.category}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-display-lg font-display text-[var(--color-ink-900)] leading-tight">
                {product.title}
              </h1>

              {/* Price block */}
              <div className="flex flex-col gap-1">
                {product.buyingMethod === 'Auction' && (
                  <p className="text-caption font-semibold text-[var(--color-ink-500)] uppercase">Current Bid</p>
                )}
                {product.buyingMethod === 'Buy Now' && (
                  <p className="text-caption font-semibold text-[var(--color-ink-500)] uppercase">Buy Now Price</p>
                )}
                <p className="text-display-xl font-display text-[var(--color-ink-900)]">
                  {formatPrice(product.currentBid ?? product.price)}
                </p>
              </div>

              {/* Listing type badge */}
              <div className="flex">
                <span className="text-caption font-bold bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)] px-3 py-1 rounded-[var(--radius-pill)] uppercase tracking-wider">
                  {product.buyingMethod}
                </span>
              </div>
            </div>

            {/* BLOCK B — About this Item */}
            <div>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#B06A42',
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                About This Item
              </p>
              <div aria-hidden style={{ borderTop: '1px solid #D8C8BA', marginBottom: 16 }} />

              <div className="text-body-md text-[var(--color-ink-700)] space-y-2">
                {(product.description || "").split('\n').map((para: string, idx: number) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              {/* Specifications accordion */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] overflow-hidden mt-4">
                  <button 
                    onClick={() => setSpecsOpen(!specsOpen)}
                    className="w-full flex items-center justify-between p-4 bg-[var(--color-cream-deep)] hover:bg-[var(--color-cream-raised)] transition-colors text-heading-sm text-[var(--color-ink-900)]"
                  >
                    Specifications
                    {specsOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {specsOpen && (
                    <div className="p-4 bg-white grid grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key}>
                          <span className="block text-caption text-[var(--color-ink-500)]">{key}</span>
                          <span className="block text-body-sm font-medium text-[var(--color-ink-900)]">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* BLOCK C — Shipping & Delivery */}
            <ShippingInfo
              shipsFrom={product.shipsFrom}
              dispatchDays={product.dispatchDays}
              estimatedMin={product.estimatedMin}
              estimatedMax={product.estimatedMax}
              returnsPolicy={product.returnsPolicy}
              packagingNote={product.packagingNote}
            />

            {/* BLOCK D — Action Buttons + Countdown + Escrow */}
            <div className="flex flex-col gap-3">

              {/* AUCTION: [ ♡ Wishlist ] [ Place a Bid → ] */}
              {product.buyingMethod === 'Auction' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.numericId || product.id)}
                      className="h-11 px-4 rounded-md border border-[#D8C8BA] text-[#2B211C] text-sm font-medium flex items-center gap-2"
                    >
                      <Heart className={cn("w-4 h-4", isWishlisted ? "fill-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)]" : "text-[#2B211C]")} />
                      {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                    </button>
                  </div>
                  {product.auctionId ? (
                    <PlaceBidPanel 
                      auctionId={product.auctionId}
                      initialCurrentBid={product.currentBid}
                      initialBidCount={product.bidCount || 0}
                      auctionEndsAt={product.auctionEndsAt!}
                      listingPrice={product.price}
                    />
                  ) : (
                    <p className="text-[var(--color-ink-500)] text-sm">
                      Auction information is being loaded. Please refresh.
                    </p>
                  )}
                </div>
              )}

              {/* FIXED / OFFER: [ ♡ Wishlist ] [ Add to Cart ] [ Buy Now → ] [ Make an Offer ] */}
              {(product.buyingMethod === 'Buy Now' || product.buyingMethod === 'Negotiable') && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(product.numericId || product.id); }}
                      className="h-11 px-4 rounded-md border border-[#D8C8BA] text-[#2B211C] text-sm font-medium flex items-center gap-2"
                    >
                      <Heart className={cn("w-4 h-4", isWishlisted ? "fill-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)]" : "text-[#2B211C]")} />
                      {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation()
                        if (!useAuthStore.getState().isAuthenticated) {
                          alert('Please sign in to add to cart')
                          return
                        }
                        try {
                          const res = await fetch(`/api/cart`, {
                            method: 'POST',
                            credentials: 'include',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ listing_id: Number(product.numericId || product.id) })
                          })
                          if (res.ok) {
                            alert('Added to cart!')
                            useStore.getState().loadCart()
                          } else {
                            let errMsg = 'Failed to add to cart';
                            try {
                              const err = await res.json()
                              errMsg = err.error || errMsg;
                              console.error('Cart error:', err.error)
                            } catch (e) {
                              console.error('Non-JSON error response')
                            }
                            alert(errMsg)
                          }
                        } catch (err) {
                          console.error(err)
                          alert('Failed to add to cart')
                        }
                      }}
                      className="h-11 px-4 rounded-md border border-[#B06A42] text-[#B06A42] text-sm font-medium"
                    >
                      Add to Cart
                    </button>
                    <BuyNowButton listingId={String(product.numericId || product.id)} price={product.price} listingTitle={product.title} />
                  </div>
                  {product.offersAllowed && (
                    <MakeOfferPanel listingId={product.id} price={product.price} minimumOfferPercent={product.minimumOfferPercent || 70} />
                  )}
                </div>
              )}

              {/* Countdown for Auctions */}
              {product.buyingMethod === 'Auction' && product.auctionEndsAt && (
                <div className="flex items-center gap-2 p-4 bg-[var(--color-cream-deep)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
                  <span className="text-body-sm font-bold text-[var(--color-ink-900)] uppercase tracking-wider">Time left:</span>
                  <AuctionTimer endTime={product.auctionEndsAt} />
                </div>
              )}

              {/* Escrow trust strip */}
              <div className="bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] p-4 border border-[var(--color-border-subtle)] flex gap-3 items-center">
                <Shield className="w-5 h-5 text-[var(--color-success-600)] shrink-0" />
                <p className="text-body-sm font-medium text-[var(--color-ink-900)]">
                  Secure Escrow — Seller only gets paid after you receive the item.
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* Related Products — unchanged */}
        {related && related.length > 0 && (
          <div className="mt-24 pt-16 border-t border-[var(--color-border-subtle)]">
            <h2 className="text-display-md text-[var(--color-ink-900)] mb-8">More from {product.creator}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
