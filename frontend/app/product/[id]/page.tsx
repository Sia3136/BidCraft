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

  // Fetch all products to find related ones from the same creator
  const moreData = await fetchListings({ limit: 50 });
  const related = moreData.listings
    .filter((l) => l.creator === listing.creator && l.id !== listing.id)
    .slice(0, 4);

  return <ProductDetailClient product={listing} related={related} />;
}

