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
      fetchLiveAuctions(20),
      fetchNewArrivals(),
    ]);
    
    const fetchedAuctions = (auctionsData.auctions || []).sort((a, b) => {
      const bidA = a.bidCount || 0;
      const bidB = b.bidCount || 0;
      if (bidA !== bidB) return bidB - bidA;
      
      const priceA = a.currentBid || a.price || 0;
      const priceB = b.currentBid || b.price || 0;
      if (priceA !== priceB) return priceB - priceA;

      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
    
    // Dynamically pick up to 4 visually diverse auctions based on category/subcategory
    const selected = new Map<string, Listing>();
    for (const auction of fetchedAuctions) {
      if (selected.size >= 4) break;
      const cat = auction.category || 'Other';
      if (!selected.has(cat)) {
        selected.set(cat, auction);
      }
    }
    
    liveAuctions = Array.from(selected.values());
    
    // Fallback if we didn't get 4 distinct categories
    if (liveAuctions.length < 4) {
      const missing = 4 - liveAuctions.length;
      const otherAuctions = fetchedAuctions.filter(a => !liveAuctions.find(l => l.id === a.id)).slice(0, missing);
      liveAuctions = [...liveAuctions, ...otherAuctions];
    }
    
    const allArrivals = newArrivalsData.listings || [];
    newArrivals = allArrivals.slice(0, 4);
    
    // Import filterTrendingListings and filter the fetched listings
    const { filterTrendingListings } = await import('@/lib/trending');
    const allListings = await fetchListings({ limit: 200 }).catch(() => ({ listings: [] }));
    const allTrending = filterTrendingListings(allListings.listings);
    trendingListings = allTrending.slice(0, 4);
  } catch (err) {
    console.error('Failed to fetch homepage data', err);
    // fallback to empty arrays or handle gracefully
  }

  return <ClientHome newArrivals={newArrivals} liveAuctions={liveAuctions} trendingListings={trendingListings} allListings={allListings.listings} />;
}
