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
