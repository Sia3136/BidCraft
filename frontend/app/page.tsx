import { getNewArrivals, getLiveAuctions } from '@/lib/dbProducts';
import ClientHome from '@/components/client-home';

export const revalidate = 30; // Shorter revalidation for live auctions

export default async function Home() {
  const [newArrivals, liveAuctions] = await Promise.all([
    getNewArrivals(),
    getLiveAuctions()
  ]);
  
  return <ClientHome newArrivals={newArrivals} liveAuctions={liveAuctions} />;
}
