import ClientHome from '@/components/client-home';
import { exploreProducts } from '@/lib/exploreProducts';
import { NEW_ARRIVAL_IDS } from '@/lib/newArrivals';

export const revalidate = 30;

export default async function Home() {
  const liveAuctions = exploreProducts
    .filter(p => p.buyingMethod === 'Auction' && p.auctionEndsAt)
    .sort((a, b) => new Date(a.auctionEndsAt).getTime() - new Date(b.auctionEndsAt).getTime())
    .slice(0, 4);
    
  const newArrivals = exploreProducts
    .filter(p => NEW_ARRIVAL_IDS.includes(p.id))
    .slice(0, 4);
  
  return <ClientHome newArrivals={newArrivals} liveAuctions={liveAuctions} />;
}
