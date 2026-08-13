import { Suspense } from 'react';
import ClientHome from '@/components/client-home';
import { fetchLiveAuctions, fetchNewArrivals, fetchListings, Listing } from '@/lib/api';

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
    newArrivals = newArrivalsData.listings ? newArrivalsData.listings.slice(0, 4) : [];

    const trendingData = await fetchListings({ sort: 'newest', limit: 20 }).catch(() => ({ listings: [] }));
    
    // Ensure no overlap with New Arrivals
    const newArrivalIds = new Set(newArrivals.map(l => l.id));
    
    trendingListings = (trendingData.listings || [])
      .filter(l => !newArrivalIds.has(l.id))
      // Sort by bidCount to reflect actual activity for "Trending"
      .sort((a, b) => (Number(b.bidCount) || 0) - (Number(a.bidCount) || 0))
      .slice(0, 4);
  } catch (err) {
    console.error('Failed to fetch homepage data', err);
    // fallback to empty arrays or handle gracefully
  }

  return <ClientHome newArrivals={newArrivals} liveAuctions={liveAuctions} trendingListings={trendingListings} />;
}
