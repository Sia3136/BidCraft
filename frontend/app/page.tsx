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
    
    const allArrivals = newArrivalsData.listings || [];
    newArrivals = allArrivals.slice(0, 4);
    
    // Import TRENDING_IDS and filter the fetched listings
    const { TRENDING_IDS } = await import('@/lib/trending');
    const allListings = await fetchListings({ limit: 100 }).catch(() => ({ listings: [] }));
    trendingListings = allListings.listings.filter(l => TRENDING_IDS.includes(l.id));
  } catch (err) {
    console.error('Failed to fetch homepage data', err);
    // fallback to empty arrays or handle gracefully
  }

  return <ClientHome newArrivals={newArrivals} liveAuctions={liveAuctions} trendingListings={trendingListings} />;
}
