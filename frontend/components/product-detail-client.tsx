'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/dbProducts';
import { formatPrice } from '@/lib/formatPrice';
import { ProductCard } from '@/components/product-card';
import { Shield, ChevronRight, Heart, CheckCircle, AlertTriangle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { CountdownTimer } from '@/components/countdown-timer';

const getCloudinaryTransformUrl = (imageId: string, transform: string) => {
  if (!imageId) return '';
  if (imageId.startsWith('http') || imageId.startsWith('/')) {
    return imageId;
  }
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'duzlsyzwa';
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${imageId}`;
};

const imageTransforms = [
  'f_auto,q_auto,w_800',
  'c_crop,g_center,zoom_1.4,f_auto,q_auto,w_800',
  'c_crop,g_north,h_0.6,w_1.0,f_auto,q_auto,w_800',
  'c_crop,g_south,h_0.6,w_1.0,f_auto,q_auto,w_800',
  'c_crop,g_west,w_0.55,ar_1:1,f_auto,q_auto,w_800',
  'e_contrast:25,e_sharpen:60,f_auto,q_auto,w_800'
];

export default function ProductDetailClient({ product, related }: { product: Product, related: Product[] }) {
  const { toggleWishlist, wishlist, addToCart } = useStore();
  const isWishlisted = wishlist.some(w => w.productId === product.id);
  const [added, setAdded] = useState(false);
  
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerError, setOfferError] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const [isBidding, setIsBidding] = useState(false);

  const sellerDiscountFloor = 30;
  const minOffer = product.price * (1 - sellerDiscountFloor / 100);

  const isMiscategorized = product.category === 'Digital Art' && 
    /(crochet|knit|clay|ceramic|wood|embroidery|stitch)/i.test(product.title + ' ' + (product.description || ''));

  const handlePlaceBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBidError('');
    setBidSuccess('');
    const amount = Number(bidAmount);
    const currentHigh = product.currentBid ?? product.price;
    if (isNaN(amount) || amount <= currentHigh) {
      setBidError(`Your bid must be higher than the current bid of ₹${currentHigh}.`);
      return;
    }
    
    setIsBidding(true);
    try {
      const res = await fetch(`/api/products/${product.id}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidAmount: amount })
      });
      const data = await res.json();
      if (!res.ok) {
        setBidError(data.error || 'Failed to place bid.');
      } else {
        setBidSuccess('Bid placed successfully!');
        setBidAmount('');
        product.currentBid = amount;
        product.bidCount = (product.bidCount || 0) + 1;
      }
    } catch (err) {
      setBidError('Something went wrong.');
    } finally {
      setIsBidding(false);
    }
  };

  const handleMakeOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(offerAmount);
    if (isNaN(amount) || amount < minOffer) {
      setOfferError(`Your offer must be at least ₹${minOffer}. The seller has set a minimum offer threshold.`);
      return;
    }
    setOfferError('');
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
            {isMiscategorized && (
              <div className="mb-4 p-3 bg-[var(--color-warning-50)] border border-[var(--color-warning-200)] text-[var(--color-warning-700)] rounded-[var(--radius-sm)] flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-body-sm font-medium">Note: This item may be miscategorized. Suggested category: Handmade & Crafts.</p>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row-reverse gap-4">
              <div className="relative aspect-square md:aspect-[4/3] lg:aspect-[4/4] bg-[var(--color-cream-deep)] rounded-[var(--radius-lg)] overflow-hidden flex-1">
                <Image 
                  src={getCloudinaryTransformUrl(product.image, imageTransforms[activeImageIdx])} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 60vw"
                  style={{ objectFit: 'cover' }} 
                  alt={product.title} 
                  priority
                  onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
                />
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm z-10"
                >
                  <Heart className={cn("w-5 h-5 transition-colors", isWishlisted ? "fill-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)]" : "text-[var(--color-ink-700)]")} />
                </button>
              </div>
              
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 w-full md:w-[100px] shrink-0 hide-scrollbar">
                {imageTransforms.map((transform, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={cn(
                      "relative w-20 h-20 md:w-full md:h-[100px] rounded-[var(--radius-sm)] overflow-hidden shrink-0 border-2 transition-colors",
                      activeImageIdx === idx ? "border-[var(--color-terracotta-600)]" : "border-transparent hover:border-[var(--color-ink-300)]"
                    )}
                  >
                    <Image 
                      src={getCloudinaryTransformUrl(product.image, transform)} 
                      fill 
                      sizes="100px"
                      style={{ objectFit: 'cover' }} 
                      alt={`Thumbnail ${idx + 1}`} 
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Specs & Reviews (Desktop) */}
            <div className="hidden lg:block mt-12">
              <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-6">About this item</h2>
              <p className="text-body-lg text-[var(--color-ink-700)] mb-8 leading-relaxed whitespace-pre-wrap">
                {product.description || "The seller hasn't added this detail yet."}
              </p>
              
              <div className="mb-8">
                <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-4">What makes this special</h3>
                <ul className="list-disc pl-5 space-y-2 text-body-md text-[var(--color-ink-700)]">
                  <li><strong>Materials:</strong> {product.category === 'Art' ? 'Canvas & Wood' : 'Handcrafted'}</li>
                  <li><strong>Technique:</strong> Artisanal craftsmanship</li>
                  <li><strong>Condition:</strong> New</li>
                  <li><strong>Use case:</strong> Perfect for display or gifting</li>
                </ul>
              </div>
              
              <div className="border-t border-[var(--color-border-subtle)] pt-8">
                <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-4">Specifications</h3>
                <ul className="space-y-3 text-body-md text-[var(--color-ink-700)] grid grid-cols-2 gap-x-6">
                  <li className="flex gap-2"><span className="font-medium text-[var(--color-ink-900)] w-24">Condition</span> New</li>
                  <li className="flex gap-2"><span className="font-medium text-[var(--color-ink-900)] w-24">Category</span> {product.category || "The seller hasn't added this detail yet."}</li>
                  <li className="flex gap-2"><span className="font-medium text-[var(--color-ink-900)] w-24">Subcategory</span> {product.subcategory || "The seller hasn't added this detail yet."}</li>
                  <li className="flex gap-2"><span className="font-medium text-[var(--color-ink-900)] w-24">Material</span> {product.category === 'Art' ? 'Canvas & Wood' : 'Handcrafted'}</li>
                  <li className="flex gap-2"><span className="font-medium text-[var(--color-ink-900)] w-24">Dimensions</span> {Math.floor(Math.random() * 20) + 10}" x {Math.floor(Math.random() * 20) + 10}"</li>
                  <li className="flex gap-2"><span className="font-medium text-[var(--color-ink-900)] w-24">Ships from</span> India</li>
                </ul>
              </div>
            </div>

            {/* Seller Section */}
            <div className="hidden lg:block mt-12 pt-8 border-t border-[var(--color-border-subtle)]">
              <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-6">Meet your seller</h2>
              <div className="flex flex-col md:flex-row gap-6 items-start bg-[var(--color-cream-deep)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
                <div className="w-16 h-16 rounded-full bg-[var(--color-terracotta-100)] flex items-center justify-center text-heading-xl text-[var(--color-terracotta-700)] shrink-0 shadow-sm border border-[var(--color-border-subtle)]">
                  {product.creator.charAt(0)}
                </div>
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-heading-md text-[var(--color-ink-900)]">{product.creator}</h3>
                    {product.verified && <CheckCircle className="w-4 h-4 text-[var(--color-success-600)]" />}
                  </div>
                  <p className="text-body-md text-[var(--color-ink-700)] mb-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-terracotta-600)] inline-block"></span> Mumbai, Maharashtra
                  </p>
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="text-caption font-bold bg-[var(--color-success-100)] text-[var(--color-success-700)] px-2.5 py-1 rounded-[var(--radius-pill)] uppercase tracking-wider">
                      Top Rated
                    </span>
                    <span className="text-caption font-bold bg-[var(--color-info-100)] text-[var(--color-info-700)] px-2.5 py-1 rounded-[var(--radius-pill)] uppercase tracking-wider">
                      Fast Shipper
                    </span>
                    <span className="text-body-sm text-[var(--color-ink-700)] font-medium flex items-center gap-1 ml-1">
                      <span className="text-[var(--color-warning-500)] text-base leading-none">★</span> 4.8 · 128 reviews
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-5">
                    <div className="bg-white p-4 rounded-[var(--radius-sm)] border border-[var(--color-border-subtle)] shadow-sm">
                      <p className="text-body-sm text-[var(--color-ink-700)] italic mb-2">"Absolutely stunning piece. The details are much better in person."</p>
                      <p className="text-caption font-medium text-[var(--color-ink-900)]">— Rajesh K. <span className="text-[var(--color-warning-500)] text-sm ml-1">★★★★★</span></p>
                    </div>
                  </div>
                  
                  <Link href={`/seller/${product.creator.toLowerCase().replace(/\s+/g, '-')}`} className="inline-block px-6 py-2.5 bg-[var(--color-ink-900)] rounded-[var(--radius-pill)] text-body-md font-bold text-white hover:bg-[var(--color-terracotta-600)] transition-colors shadow-sm">
                    View Shop
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right: 40% Purchase Panel */}
          <div className="w-full lg:w-2/5">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-caption font-bold bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)] px-3 py-1 rounded-[var(--radius-pill)] uppercase tracking-wider">
                  {product.buyingMethod}
                </span>
                {product.offersAllowed && (
                  <span className="text-caption font-bold bg-[var(--color-slate-100)] text-[var(--color-ink-700)] px-3 py-1 rounded-[var(--radius-pill)] uppercase tracking-wider">
                    Offers Allowed
                  </span>
                )}
              </div>

              <h1 className="text-display-lg text-[var(--color-ink-900)] leading-tight mb-2">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-2 mb-6 text-body-md text-[var(--color-ink-500)]">
                <span>By <span className="font-medium text-[var(--color-ink-900)]">{product.creator}</span></span>
                <span>•</span>
                <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {Math.floor(Math.random() * 50) + 10} Wishlists</span>
              </div>

              <div className="mb-8">
                {product.buyingMethod === 'Auction' ? (
                  <>
                    <p className="text-caption text-[var(--color-ink-500)] mb-1 font-semibold uppercase tracking-wider">Current Bid</p>
                    <div className="flex items-end gap-3 mb-2">
                      <p className="text-display-xl text-[var(--color-ink-900)] font-display">
                        {formatPrice(product.currentBid ?? product.price)}
                      </p>
                      <p className="text-body-md text-[var(--color-ink-500)] pb-2">({product.bidCount ?? 0} bids placed)</p>
                    </div>
                    <div className="flex items-center gap-2 mb-4 p-3 bg-[var(--color-cream-deep)] rounded-[var(--radius-sm)] border border-[var(--color-border-subtle)] w-fit">
                      <span className="text-body-sm font-semibold text-[var(--color-ink-700)]">Time left:</span>
                      <CountdownTimer listingId={product.id} size="md" endTime={product.auctionEndTime} />
                    </div>
                  </>
                ) : (
                  <p className="text-display-xl text-[var(--color-ink-900)] font-display">
                    {formatPrice(product.price)}
                  </p>
                )}
              </div>

              {/* Strict Action Buttons */}
              <div className="flex gap-3 mb-8">
                {product.buyingMethod === 'Auction' && (
                  <div className="flex flex-col gap-3 w-full">
                    <form onSubmit={handlePlaceBidSubmit} className="flex gap-2">
                      <input 
                        type="number" 
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={`> ₹${product.currentBid ?? product.price}`}
                        className="flex-1 h-14 px-4 border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] bg-white text-[var(--color-ink-900)] outline-none focus:border-[var(--color-terracotta-600)] font-bold text-body-lg"
                        required
                      />
                      <button type="submit" disabled={isBidding} className="px-6 h-14 bg-[var(--color-terracotta-600)] text-white text-body-lg font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors shadow-sm disabled:opacity-70">
                        {isBidding ? 'Placing...' : 'Place Bid'}
                      </button>
                      <button type="button" onClick={() => toggleWishlist(product.id)} className="w-14 h-14 shrink-0 bg-white border-2 border-[var(--color-ink-200)] flex items-center justify-center rounded-[var(--radius-md)] hover:border-[var(--color-ink-900)] transition-colors">
                        <Heart className={cn("w-6 h-6", isWishlisted ? "fill-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)]" : "text-[var(--color-ink-700)]")} />
                      </button>
                    </form>
                    {bidError && <p className="text-body-sm text-[var(--color-urgent-600)] font-medium">{bidError}</p>}
                    {bidSuccess && <p className="text-body-sm text-[var(--color-success-600)] font-medium">{bidSuccess}</p>}
                  </div>
                )}
                
                {(product.buyingMethod === 'Buy Now' && !product.offersAllowed) && (
                  <>
                    <button className="flex-1 h-14 bg-[var(--color-terracotta-600)] text-white text-body-lg font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors shadow-sm">
                      Buy Now
                    </button>
                    <button 
                      onClick={handleAdd}
                      className="flex-1 h-14 bg-white text-[var(--color-ink-900)] text-body-lg font-bold rounded-[var(--radius-md)] border-2 border-[var(--color-ink-200)] hover:border-[var(--color-ink-900)] transition-colors"
                    >
                      {added ? 'Added to Cart ✓' : 'Add to Cart'}
                    </button>
                    <button onClick={() => toggleWishlist(product.id)} className="w-14 h-14 shrink-0 bg-white border-2 border-[var(--color-ink-200)] flex items-center justify-center rounded-[var(--radius-md)] hover:border-[var(--color-ink-900)] transition-colors">
                      <Heart className={cn("w-6 h-6", isWishlisted ? "fill-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)]" : "text-[var(--color-ink-700)]")} />
                    </button>
                  </>
                )}

                {((product.buyingMethod === 'Buy Now' && product.offersAllowed) || product.buyingMethod === 'Make Offer') && (
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex gap-3">
                      <button className="flex-1 h-14 bg-[var(--color-terracotta-600)] text-white text-body-lg font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors shadow-sm">
                        Buy Now
                      </button>
                      <button onClick={() => setShowOfferForm(!showOfferForm)} className={cn("flex-1 h-14 bg-white text-[var(--color-ink-900)] text-body-lg font-bold rounded-[var(--radius-md)] border-2 transition-colors", showOfferForm ? "border-[var(--color-ink-900)]" : "border-[var(--color-ink-200)] hover:border-[var(--color-ink-900)]")}>
                        Make an Offer
                      </button>
                      <button onClick={() => toggleWishlist(product.id)} className="w-14 h-14 shrink-0 bg-white border-2 border-[var(--color-ink-200)] flex items-center justify-center rounded-[var(--radius-md)] hover:border-[var(--color-ink-900)] transition-colors">
                        <Heart className={cn("w-6 h-6", isWishlisted ? "fill-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)]" : "text-[var(--color-ink-700)]")} />
                      </button>
                    </div>
                    
                    {showOfferForm && (
                      <form onSubmit={handleMakeOfferSubmit} className="p-4 bg-[var(--color-cream-deep)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] animate-in fade-in slide-in-from-top-2">
                        <label className="block text-body-sm font-semibold text-[var(--color-ink-900)] mb-2">Your Offer (₹)</label>
                        <div className="flex gap-2">
                          <input 
                            type="number" 
                            value={offerAmount}
                            onChange={(e) => setOfferAmount(e.target.value)}
                            placeholder={`Min. ₹${minOffer}`}
                            className="flex-1 h-10 px-3 border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] bg-white text-[var(--color-ink-900)] outline-none focus:border-[var(--color-terracotta-600)]"
                            required
                          />
                          <button type="submit" className="h-10 px-4 bg-[var(--color-ink-900)] text-white font-semibold rounded-[var(--radius-sm)] hover:bg-[var(--color-terracotta-600)] transition-colors">
                            Submit
                          </button>
                        </div>
                        {offerError && <p className="text-caption text-[var(--color-urgent-600)] mt-2 font-medium">{offerError}</p>}
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Escrow Integration */}
              <div className="bg-[var(--color-cream-raised)] rounded-[var(--radius-lg)] p-5 border border-[var(--color-border-subtle)] flex gap-4 items-start mb-8">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border border-[var(--color-border-subtle)] shadow-sm">
                  <Shield className="w-5 h-5 text-[var(--color-success-600)]" />
                </div>
                <div>
                  <h4 className="text-body-md font-bold text-[var(--color-ink-900)] mb-1">Escrow Protection</h4>
                  <p className="text-body-sm text-[var(--color-ink-700)] leading-relaxed">
                    Your payment is held securely until you receive and approve the item. No release without your confirmation.
                  </p>
                </div>
              </div>

              {/* Buyer Reviews */}
              <div className="mt-10 border-t border-[var(--color-border-subtle)] pt-8 hidden lg:block">
                <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-5">Buyer Reviews (3)</h3>
                <div className="space-y-5">
                  <div className="pb-5 border-b border-[var(--color-border-subtle)] last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-[var(--color-ink-900)]">Rajesh K.</span>
                      <span className="text-[var(--color-warning-500)] text-sm">★★★★★</span>
                    </div>
                    <p className="text-body-sm text-[var(--color-ink-700)]">"Absolutely stunning piece. The details are much better in person. Fast shipping and great packaging."</p>
                  </div>
                  <div className="pb-5 border-b border-[var(--color-border-subtle)] last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-[var(--color-ink-900)]">Meera P.</span>
                      <span className="text-[var(--color-warning-500)] text-sm">★★★★★</span>
                    </div>
                    <p className="text-body-sm text-[var(--color-ink-700)]">"I love this! The creator was so communicative during the process."</p>
                  </div>
                  <div className="pb-5 border-b border-[var(--color-border-subtle)] last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-[var(--color-ink-900)]">Arjun M.</span>
                      <span className="text-[var(--color-warning-500)] text-sm">★★★★☆</span>
                    </div>
                    <p className="text-body-sm text-[var(--color-ink-700)]">"Very nice item, slightly smaller than I expected but still great quality."</p>
                  </div>
                </div>
              </div>

              {/* Mobile Specs & Reviews */}
              <div className="lg:hidden mt-8 border-t border-[var(--color-border-subtle)] pt-8">
                <h2 className="text-heading-md text-[var(--color-ink-900)] mb-4">About this item</h2>
                <p className="text-body-md text-[var(--color-ink-700)] mb-6 whitespace-pre-wrap">
                  {(product.description && product.description.length >= 50) ? product.description : "The seller hasn't added a description yet."}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Related Products */}
        {related.length > 0 && (
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

      {/* Mobile Sticky Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[var(--color-border-subtle)] z-40 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] flex gap-3">
        {product.buyingMethod === 'Auction' && (
          <button className="flex-1 h-12 bg-[var(--color-terracotta-600)] text-white font-bold rounded-[var(--radius-md)]">
            Place Bid
          </button>
        )}
        {product.buyingMethod === 'Buy Now' && (
          <>
            <button className="flex-1 h-12 bg-[var(--color-terracotta-600)] text-white font-bold rounded-[var(--radius-md)]">
              Buy Now
            </button>
            <button onClick={handleAdd} className="flex-1 h-12 bg-white text-[var(--color-ink-900)] border-2 border-[var(--color-ink-200)] font-bold rounded-[var(--radius-md)]">
              {added ? 'Added' : 'Cart'}
            </button>
          </>
        )}
        {product.buyingMethod === 'Make Offer' && (
          <>
            <button className="flex-1 h-12 bg-[var(--color-terracotta-600)] text-white font-bold rounded-[var(--radius-md)]">
              Buy Now
            </button>
            <button className="flex-1 h-12 bg-white text-[var(--color-ink-900)] border-2 border-[var(--color-ink-200)] font-bold rounded-[var(--radius-md)]">
              Offer
            </button>
          </>
        )}
      </div>
    </div>
  )
}
