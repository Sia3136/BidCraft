import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { fetchListingById, fetchListings } from '@/lib/api';
import ProductDetailClient from '@/components/product-detail-client';

export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return (
    <Suspense fallback={
      <div className="w-full max-w-[var(--container-max)] mx-auto px-[var(--space-4)] md:px-[var(--space-6)] xl:px-[var(--space-8)] py-8 md:py-12 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div className="aspect-square bg-[var(--color-cream-deep)] rounded-[var(--radius-lg)]"></div>
          <div className="space-y-6">
            <div className="h-10 bg-[var(--color-cream-deep)] w-3/4 rounded"></div>
            <div className="h-6 bg-[var(--color-cream-deep)] w-1/4 rounded"></div>
            <div className="space-y-2 pt-4">
              <div className="h-4 bg-[var(--color-cream-deep)] w-full rounded"></div>
              <div className="h-4 bg-[var(--color-cream-deep)] w-5/6 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <ProductDetailData id={id} />
    </Suspense>
  );
}

async function ProductDetailData({ id }: { id: string }) {
  let listing;
  try {
    listing = await fetchListingById(id);
  } catch {
    return notFound();
  }

  if (listing.buyingMethod === 'Auction' && listing.auctionEndsAt && new Date(listing.auctionEndsAt) < new Date()) {
    redirect(`/auction/ended/${id}`);
  }

  // Fetch candidate listings for similar and seller products
  // We use limit 100 to cast a reasonably wide net without hardcoding multiple pagination calls.
  const moreData = await fetchListings({ limit: 100 });
  
  // 1. More From This Seller
  const sellerListings = moreData.listings
    .filter((l) => l.creator === listing.creator && l.id !== listing.id);
  
  const related = sellerListings.slice(0, 4);

  // 2. Similar Products
  const excludeIds = new Set([listing.id, ...related.map(l => l.id)]);
  const similarCandidates = moreData.listings.filter(l => !excludeIds.has(l.id));
  
  const scoreSimilarity = (l: any) => {
    let score = 0;
    if (l.category === listing.category && l.subcategory === listing.subcategory) score += 40;
    else if (l.category === listing.category) score += 30;
    
    if (l.buyingMethod === listing.buyingMethod) score += 10;
    
    // Title keywords overlap (words > 3 chars)
    const getTokens = (t: string) => t.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const keywords1 = new Set(getTokens(listing.title));
    const keywords2 = new Set(getTokens(l.title));
    let matches = 0;
    for (const kw of keywords1) if (keywords2.has(kw)) matches++;
    score += (matches * 5);
    
    // Recent active fallback naturally happens via order if scores tie, 
    // but we can add a slight boost for newer items if we had timestamps.
    return score;
  };

  const similarListings = similarCandidates
    .map(l => ({ listing: l, score: scoreSimilarity(l) }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.listing)
    .slice(0, 4);

  return <ProductDetailClient product={listing} related={related} similar={similarListings} />;
}

