'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/formatPrice';
import { ProductCard } from '@/components/product-card';
import { Shield, ChevronRight, Heart, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { CountdownTimer } from '@/components/countdown-timer';

const GALLERY_VIEWS = [
  { transform: 'scale(1)', objectPosition: 'center' },
  { transform: 'scale(1.4)', objectPosition: 'top left' },
  { transform: 'scale(1.4)', objectPosition: 'top right' },
  { transform: 'scale(1.4)', objectPosition: 'bottom left' },
  { transform: 'scale(1.4)', objectPosition: 'bottom right' },
  { transform: 'scale(1.2)', objectPosition: 'center' }
];

export default function ProductDetailClient({ product, related }: { product: any, related: any[] }) {
  const { toggleWishlist, wishlist, addToCart } = useStore();
  const isWishlisted = wishlist.some(w => w.productId === product.id);
  const [added, setAdded] = useState(false);
  
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [isBidding, setIsBidding] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(true);

  const sellerDiscountFloor = product.minimumOfferPercent || 30;
  const minOffer = product.price * (sellerDiscountFloor / 100);

  const handlePlaceBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  const handleMakeOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(offerAmount);
    if (isNaN(amount) || amount < minOffer) {
      alert(`Your offer must be at least ₹${minOffer}. The seller has set a minimum offer threshold.`);
      return;
    }
    alert(`Offer of ₹${amount} submitted!`);
    setShowOfferForm(false);
  };
  
  const handleAdd = () => {
    addToCart({ id: Math.random().toString(), productId: product.id, title: product.title, price: product.price, quantity: 1, image: product.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
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
                {product.creator.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-body-md font-bold text-[var(--color-ink-900)]">{product.creator}</h3>
                  {product.verified && <CheckCircle className="w-4 h-4 text-[var(--color-success-600)]" />}
                </div>
                <div className="flex items-center gap-2 text-caption text-[var(--color-ink-700)]">
                  <span>★ {product.creatorRating || '4.8'}</span>
                  <span>({product.creatorReviewCount || '128'} reviews)</span>
                  {product.creatorBadges && product.creatorBadges.length > 0 && (
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
                <form onSubmit={handlePlaceBidSubmit} className="flex gap-2">
                  <input 
                    type="number" 
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`> ${formatPrice(product.currentBid ?? product.price)}`}
                    className="flex-1 h-12 px-4 border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] text-[var(--color-ink-900)] font-bold outline-none focus:border-[var(--color-terracotta-600)]"
                    required
                  />
                  <button type="submit" disabled={isBidding} className="px-6 h-12 bg-[var(--color-ink-900)] hover:bg-[var(--color-terracotta-600)] text-white font-bold rounded-[var(--radius-md)] transition-colors">
                    Place Bid
                  </button>
                  <button type="button" onClick={() => toggleWishlist(product.id)} className="w-12 h-12 shrink-0 bg-white border border-[var(--color-border-subtle)] flex items-center justify-center rounded-[var(--radius-md)] hover:border-[var(--color-ink-900)] transition-colors">
                    <Heart className={cn("w-5 h-5", isWishlisted ? "fill-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)]" : "text-[var(--color-ink-700)]")} />
                  </button>
                </form>
              )}
              
              {(product.buyingMethod === 'Buy Now' || product.buyingMethod === 'Negotiable') && (
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); handleAdd(); }} className="flex-1 h-12 bg-[var(--color-ink-900)] hover:bg-[var(--color-terracotta-600)] text-white font-bold rounded-[var(--radius-md)] transition-colors">
                    {added ? 'Added to Cart ✓' : 'Add to Cart'}
                  </button>
                  {product.offersAllowed && (
                    <button onClick={(e) => { e.stopPropagation(); setShowOfferForm(!showOfferForm); }} className={cn("flex-1 h-12 bg-white text-[var(--color-ink-900)] font-bold rounded-[var(--radius-md)] border-2 transition-colors", showOfferForm ? "border-[var(--color-ink-900)]" : "border-[var(--color-ink-200)] hover:border-[var(--color-ink-900)]")}>
                      Make Offer
                    </button>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }} className="w-12 h-12 shrink-0 bg-white border border-[var(--color-border-subtle)] flex items-center justify-center rounded-[var(--radius-md)] hover:border-[var(--color-ink-900)] transition-colors">
                    <Heart className={cn("w-5 h-5", isWishlisted ? "fill-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)]" : "text-[var(--color-ink-700)]")} />
                  </button>
                </div>
              )}

              {showOfferForm && product.offersAllowed && (
                <form onSubmit={handleMakeOfferSubmit} className="p-4 mt-2 bg-[var(--color-cream-deep)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] animate-in fade-in slide-in-from-top-2">
                  <label className="block text-body-sm font-semibold text-[var(--color-ink-900)] mb-2">Your Offer</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      placeholder={`Min. ${formatPrice(minOffer)}`}
                      className="flex-1 h-10 px-3 border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] bg-white text-[var(--color-ink-900)] outline-none focus:border-[var(--color-terracotta-600)]"
                      required
                    />
                    <button type="submit" className="h-10 px-4 bg-[var(--color-ink-900)] text-white font-semibold rounded-[var(--radius-sm)] hover:bg-[var(--color-terracotta-600)] transition-colors">
                      Submit
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Countdown for Auctions */}
            {product.buyingMethod === 'Auction' && product.auctionEndsAt && (
              <div className="flex items-center gap-2 p-3 bg-[var(--color-cream-deep)] rounded-[var(--radius-sm)] border border-[var(--color-border-subtle)]">
                <span className="text-body-sm font-semibold text-[var(--color-ink-700)]">Ends in:</span>
                <span className="text-body-md font-bold text-[var(--color-urgent-600)]">
                  {new Date(product.auctionEndsAt).toLocaleDateString()} {/* Simple fallback, can be timer */}
                </span>
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
              <h2 className="text-heading-sm text-[var(--color-ink-900)] mb-4">Seller Reviews ({product.creatorReviewCount || '3'})</h2>
              <div className="space-y-4">
                <div className="p-4 bg-[var(--color-cream-raised)] rounded-[var(--radius-md)]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-[var(--color-ink-900)]">Verified Buyer</span>
                    <span className="text-[var(--color-warning-500)] text-sm">★★★★★</span>
                  </div>
                  <p className="text-body-sm text-[var(--color-ink-700)]">"Great quality and exactly as described. The shipping was very fast and securely packaged."</p>
                </div>
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
