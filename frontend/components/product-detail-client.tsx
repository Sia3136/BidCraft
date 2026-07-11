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
import { productReviews } from '@/lib/exploreProducts';

import { AuctionTimer } from '@/components/AuctionTimer';

const GALLERY_VIEWS = [
  { transform: 'scale(1)', objectPosition: 'center' },
  { transform: 'scale(1.4)', objectPosition: 'top left' },
  { transform: 'scale(1.4)', objectPosition: 'top right' },
  { transform: 'scale(1.4)', objectPosition: 'bottom left' },
  { transform: 'scale(1.4)', objectPosition: 'bottom right' },
  { transform: 'scale(1.2)', objectPosition: 'center' }
];

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
  
  const [activeImageIdx, setActiveImageIdx] = useState(0);
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

        {/* 60/40 Layout */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          {/* Left: 60% Image Gallery */}
          <div className="w-full lg:w-3/5">
            <div className="flex flex-col md:flex-row-reverse gap-4 sticky top-24">
              <div className="relative aspect-square md:aspect-[4/3] lg:aspect-[4/4] bg-[var(--color-cream-deep)] rounded-[var(--radius-lg)] overflow-hidden flex-1">
                <Image 
                  src={product.image || '/placeholder.jpg'}
                  fill 
                  sizes="(max-width: 768px) 100vw, 60vw"
                  style={{ objectFit: 'cover', ...GALLERY_VIEWS[activeImageIdx] }} 
                  alt={product.title} 
                  priority
                  onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
                />
              </div>
              
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 w-full md:w-[100px] shrink-0 hide-scrollbar">
                {GALLERY_VIEWS.map((view, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={cn(
                      "relative w-20 h-20 md:w-full md:h-[100px] rounded-[var(--radius-sm)] overflow-hidden shrink-0 border-2 transition-colors",
                      activeImageIdx === idx ? "border-[var(--color-terracotta-600)]" : "border-transparent hover:border-[var(--color-ink-300)]"
                    )}
                  >
                    <Image 
                      src={product.image || '/placeholder.jpg'}
                      fill 
                      sizes="100px"
                      style={{ objectFit: 'cover', ...view }} 
                      alt={`Thumbnail ${idx + 1}`} 
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: 40% Panel */}
          <div className="w-full lg:w-2/5 flex flex-col gap-6">
            
            {/* A. Creator block */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]">
              <div className="w-12 h-12 rounded-full bg-[var(--color-terracotta-100)] flex items-center justify-center text-heading-md text-[var(--color-terracotta-700)] shrink-0 font-display">
                {sellerName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-body-md font-bold text-[var(--color-ink-900)]">
                    <Link href={`/seller/${sellerSlug}`} className="hover:underline">{sellerName}</Link>
                  </h3>
                  {product?.verified && <CheckCircle className="w-4 h-4 text-[var(--color-success-600)]" />}
                </div>
                <div className="flex items-center gap-2 text-caption text-[var(--color-ink-700)]">
                  <span>★ {product?.creatorRating || '4.8'}</span>
                  <span>({product?.creatorReviewCount || '128'} reviews)</span>
                  {product?.creatorBadges && product.creatorBadges.length > 0 && (
                    <>
                      <span>•</span>
                      <span className="font-medium text-[var(--color-terracotta-600)]">{product.creatorBadges[0]}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* C. Buying method badge */}
            <div className="flex">
              <span className="text-caption font-bold bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)] px-3 py-1 rounded-[var(--radius-pill)] uppercase tracking-wider">
                {product.buyingMethod}
              </span>
            </div>

            {/* B. Title */}
            <h1 className="text-display-lg font-display text-[var(--color-ink-900)] leading-tight">
              {product.title}
            </h1>

            {/* D. Price block */}
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

            {/* E. Action buttons */}
            <div className="flex flex-col gap-3">
              {product.buyingMethod === 'Auction' && (
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <button type="button" onClick={() => toggleWishlist(product.numericId || product.id)} className="flex-1 h-12 shrink-0 bg-white border border-[var(--color-border-subtle)] flex items-center justify-center rounded-[var(--radius-md)] hover:border-[var(--color-ink-900)] transition-colors">
                      <Heart className={cn("w-5 h-5 mr-2", isWishlisted ? "fill-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)]" : "text-[var(--color-ink-700)]")} />
                      <span className="font-semibold">{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
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
              
              {(product.buyingMethod === 'Buy Now' || product.buyingMethod === 'Negotiable') && (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="flex-1 flex flex-col gap-2">
                      <BuyNowButton listingId={String(product.numericId || product.id)} price={product.price} listingTitle={product.title} />
                      <button onClick={async (e) => {
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
                      }} className="w-full h-12 bg-transparent border-2 border-[var(--color-ink-900)] text-[var(--color-ink-900)] rounded-[var(--radius-pill)] text-[16px] font-semibold cursor-pointer font-ui transition-colors hover:bg-[var(--color-ink-900)] hover:text-white">
                        Add to Cart
                      </button>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product.numericId || product.id); }} className="w-12 h-12 shrink-0 bg-white border border-[var(--color-border-subtle)] flex items-center justify-center rounded-[var(--radius-pill)] hover:border-[var(--color-ink-900)] transition-colors">
                      <Heart className={cn("w-5 h-5", isWishlisted ? "fill-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)]" : "text-[var(--color-ink-700)]")} />
                    </button>
                  </div>
                  {product.offersAllowed && (
                    <MakeOfferPanel listingId={product.id} price={product.price} minimumOfferPercent={product.minimumOfferPercent || 70} />
                  )}
                </div>
              )}
            </div>

            {/* Countdown for Auctions */}
            {product.buyingMethod === 'Auction' && product.auctionEndsAt && (
                <div className="flex items-center gap-2 p-4 bg-[var(--color-cream-deep)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
                  <span className="text-body-sm font-bold text-[var(--color-ink-900)] uppercase tracking-wider">Time left:</span>
                  <AuctionTimer endTime={product.auctionEndsAt} />
                </div>
            )}

            {/* F. Escrow trust strip */}
            <div className="bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] p-4 border border-[var(--color-border-subtle)] flex gap-3 items-center">
              <Shield className="w-5 h-5 text-[var(--color-success-600)] shrink-0" />
              <p className="text-body-sm font-medium text-[var(--color-ink-900)]">
                Secure Escrow — Seller only gets paid after you receive the item.
              </p>
            </div>

            {/* G. About this item */}
            <div className="mt-4">
              <h2 className="text-heading-md text-[var(--color-ink-900)] mb-3">About this item</h2>
              <div className="text-body-md text-[var(--color-ink-700)] space-y-2">
                {(product.description || "").split('\n').map((para: string, idx: number) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            {/* H. Specifications accordion */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] overflow-hidden">
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

            {/* I. Seller reviews section */}
            <div className="mt-4 pt-6 border-t border-[var(--color-border-subtle)]">
              <h2 className="text-heading-sm text-[var(--color-ink-900)] mb-4">What buyers say about this seller</h2>
              <div className="space-y-4">
                {(productReviews[product.id] || []).map((review: any, idx: number) => (
                  <div key={idx} className="p-4 bg-[var(--color-cream-raised)] rounded-[var(--radius-md)]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-[var(--color-ink-900)]">{review.buyer}</span>
                      <span className="text-[var(--color-warning-500)] text-sm">
                        {'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}
                      </span>
                      <span className="text-caption text-[var(--color-ink-500)] ml-auto">
                        {new Date(review.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-body-sm text-[var(--color-ink-700)]">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>

        {/* Related Products */}
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
