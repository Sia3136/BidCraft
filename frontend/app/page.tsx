import ClientHome from '@/components/client-home';
import { fetchLiveAuctions, fetchNewArrivals } from '@/lib/api';

export const revalidate = 30;

export default async function Home() {
  let liveAuctions = [];
  let newArrivals = [];

  try {
    const [auctionsData, newArrivalsData] = await Promise.all([
      fetchLiveAuctions(4),
      fetchNewArrivals(),
    ]);
    liveAuctions = auctionsData.auctions || [];
    newArrivals = newArrivalsData.listings ? newArrivalsData.listings.slice(0, 4) : [];
  } catch (err) {
    console.error('Failed to fetch homepage data', err);
    // fallback to empty arrays or handle gracefully
  }

  return <ClientHome newArrivals={newArrivals} liveAuctions={liveAuctions} />;
}
