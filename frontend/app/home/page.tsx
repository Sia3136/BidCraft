import { fetchListings, Listing } from '@/lib/api';
import ClientHomeFeed from '@/components/client-home-feed';

export const revalidate = 30;

export default async function AuthenticatedHomePage() {
  let liveAuctions: Listing[] = [];
  let newArrivals: Listing[] = [];
  let trending: Listing[] = [];
  let picksForYou: Listing[] = [];

  try {
    const [auctionsData, arrivalsData, trendingData] = await Promise.all([
      fetchListings({ method: 'auction', sort: 'newest', limit: 6 }),
      fetchListings({ sort: 'newest', limit: 7 }),
      fetchListings({ sort: 'trending', limit: 6 })
    ]);
    
    liveAuctions = auctionsData.listings || [];
    newArrivals = arrivalsData.listings || [];
    trending = trendingData.listings || [];

    // Picks for you: 1 each from a few categories (e.g. Art, Fashion, Vintage)
    const picksPromises = ['Art', 'Fashion', 'Vintage'].map(cat => 
       fetchListings({ category: cat.toLowerCase(), limit: 1 })
    );
    const picksResults = await Promise.all(picksPromises);
    picksForYou = picksResults.flatMap(res => res.listings || []);

  } catch (err) {
    console.error('Failed to fetch authenticated homepage data', err);
  }

  return (
    <ClientHomeFeed 
      liveAuctions={liveAuctions} 
      newArrivals={newArrivals} 
      trending={trending} 
      picksForYou={picksForYou} 
    />
  );
}
