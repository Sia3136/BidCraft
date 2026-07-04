import { getLiveAuctions } from '@/lib/dbProducts';
import ClientHome from '@/components/client-home';
import { exploreProducts } from '@/lib/exploreProducts';

export const revalidate = 30; // Shorter revalidation for live auctions

export default async function Home() {
  const liveAuctions = await getLiveAuctions();
  const newArrivals = exploreProducts.slice(-8).reverse();
  
  return <ClientHome newArrivals={newArrivals} liveAuctions={liveAuctions} />;
}
