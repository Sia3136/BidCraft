import { Suspense } from 'react';
import ClientHome from '@/components/client-home';
import { fetchLiveAuctions, fetchNewArrivals, Listing } from '@/lib/api';

export const revalidate = 30;

export default async function Home() {
  let liveAuctions: Listing[] = [];
  let newArrivals: Listing[] = [];
  let trendingListings: Listing[] = [];

  try {
    const [auctionsData, newArrivalsData] = await Promise.all([
      fetchLiveAuctions(4),
      fetchNewArrivals(),
    ]);
    liveAuctions = auctionsData.auctions || [];
    
    // Simulate Trending using a different slice of new arrivals to avoid duplication
    const allArrivals = newArrivalsData.listings || [];
    newArrivals = allArrivals.slice(0, 4);
    trendingListings = allArrivals.slice(4, 24);
  } catch (err) {
    console.error('Failed to fetch homepage data', err);
    // fallback to empty arrays or handle gracefully
  }

  return <ClientHome newArrivals={newArrivals} liveAuctions={liveAuctions} trendingListings={trendingListings} />;
}
