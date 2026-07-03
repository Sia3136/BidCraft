'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/dbProducts';
import { formatPrice } from '@/lib/formatPrice';
import { ProductCard } from '@/components/product-card';
import { Shield, ChevronRight, Heart, CheckCircle, AlertTriangle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { CountdownTimer } from '@/components/countdown-timer';

const getCloudinaryTransformUrl = (url: string, transform: string) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  if (url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/${transform}/`);
  }
  return url;
};

const imageTransforms = [
  'f_auto,q_auto',
  'c_crop,g_center,w_0.6,ar_1:1,f_auto,q_auto',
  'c_crop,g_north,w_0.7,ar_1:1,f_auto,q_auto',
  'c_crop,g_south,w_0.7,ar_1:1,f_auto,q_auto',
  'e_grayscale,f_auto,q_auto',
  'e_contrast:30,f_auto,q_auto'
];

export default function ProductDetailClient({ product, related }: { product: Product, related: Product[] }) {
  const { toggleWishlist, wishlist, addToCart } = useStore();
  const isWishlisted = wishlist.some(w => w.productId === product.id);
  const [added, setAdded] = useState(false);
  
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerError, setOfferError] = useState('');
  
  const sellerDiscountFloor = 30;
  const minOffer = product.price * (1 - sellerDiscountFloor / 100);

  const isMiscategorized = product.category === 'Digital Art' && 
    /(crochet|knit|clay|ceramic|wood|embroidery|stitch)/i.test(product.title + ' ' + (product.description || ''));

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
                  style={{ objectFit: 'cover' }} 
                  alt={product.title} 
                  priority 
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
                      style={{ objectFit: 'cover' }} 
                      alt={`Thumbnail ${idx + 1}`} 
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Specs & Reviews (Desktop) */}
            <div className="hidden lg:block mt-12">
              <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-6">About this item</h2>
              <p className="text-body-lg text-[var(--color-ink-700)] mb-8 leading-relaxed whitespace-pre-wrap">
                {(product.description && product.description.length >= 50) ? product.description : "The seller hasn't added a description yet."}
              </p>
              
              <div className="grid grid-cols-2 gap-6 border-t border-[var(--color-border-subtle)] pt-8">
                <div>
                  <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-4">Specifications</h3>
                  <ul className="space-y-3 text-body-md text-[var(--color-ink-700)]">
                    <li className="flex gap-2"><span className="font-medium text-[var(--color-ink-900)] w-24">Condition</span> New</li>
                    <li className="flex gap-2"><span className="font-medium text-[var(--color-ink-900)] w-24">Category</span> {product.category}</li>
                    <li className="flex gap-2"><span className="font-medium text-[var(--color-ink-900)] w-24">Dimensions</span> {Math.floor(Math.random() * 20) + 10}" x {Math.floor(Math.random() * 20) + 10}"</li>
                    <li className="flex gap-2"><span className="font-medium text-[var(--color-ink-900)] w-24">Material</span> {product.category === 'Art' ? 'Canvas & Wood' : 'Handcrafted'}</li>
                    <li className="flex gap-2"><span className="font-medium text-[var(--color-ink-900)] w-24">Ships from</span> India</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-4">Creator Info</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-cream-deep)] flex items-center justify-center text-heading-md text-[var(--color-terracotta-700)]">
                      {product.creator.charAt(0)}
                    </div>
                    <div>
                      <p className="text-body-md font-medium text-[var(--color-ink-900)] flex items-center gap-1">
                        {product.creator}
                        {product.verified && <CheckCircle className="w-4 h-4 text-[var(--color-success-600)]" />}
                        {product.verified && <span className="ml-1 text-xs bg-[var(--color-success-100)] text-[var(--color-success-700)] px-2 py-0.5 rounded-full font-bold">Top Rated</span>}
                      </p>
                      <p className="text-caption text-[var(--color-ink-500)] flex items-center gap-1 mt-0.5">
                        <span className="text-[var(--color-warning-500)]">★</span> 4.8 (128 reviews)
                      </p>
                    </div>
                  </div>
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
                      <CountdownTimer listingId={product.id} size="md" />
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
                  <>
                    <button className="flex-1 h-14 bg-[var(--color-terracotta-600)] text-white text-body-lg font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors shadow-sm">
                      Place Bid
                    </button>
                    <button onClick={() => toggleWishlist(product.id)} className="w-14 h-14 shrink-0 bg-white border-2 border-[var(--color-ink-200)] flex items-center justify-center rounded-[var(--radius-md)] hover:border-[var(--color-ink-900)] transition-colors">
                      <Heart className={cn("w-6 h-6", isWishlisted ? "fill-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)]" : "text-[var(--color-ink-700)]")} />
                    </button>
                  </>
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
