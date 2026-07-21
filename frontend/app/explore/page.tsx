import { fetchListings } from '@/lib/api';
import ClientExplore from '@/components/client-explore';

export const dynamic = 'force-dynamic';

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const params: Record<string, string> = {};

  const sanitize = (val: string | string[] | undefined) => 
    Array.isArray(val) ? val.join(',') : val || '';

  if (resolvedParams.category)    params.category = sanitize(resolvedParams.category);
  if (resolvedParams.subcategory) params.subcategory = sanitize(resolvedParams.subcategory);
  if (resolvedParams.method)      params.method = sanitize(resolvedParams.method);
  if (resolvedParams.collection)  params.collection = sanitize(resolvedParams.collection);
  if (resolvedParams.occasion)    params.occasion = sanitize(resolvedParams.occasion);
  if (resolvedParams.type)        params.type = sanitize(resolvedParams.type);
  if (resolvedParams.priceMin)    params.minPrice = sanitize(resolvedParams.priceMin);
  if (resolvedParams.priceMax)    params.maxPrice = sanitize(resolvedParams.priceMax);
  if (resolvedParams.sort)        params.sort = sanitize(resolvedParams.sort);
  if (resolvedParams.search)      params.search = sanitize(resolvedParams.search);
  if (resolvedParams.page)        params.page = sanitize(resolvedParams.page);
  
  const page = parseInt(params.page || '1', 10);
  const limit = 24;
  const offset = (page - 1) * limit;

  const data = await fetchListings({ ...params, limit, offset });

  const TRACKED_AUCTION = 'REPLACE_WITH_AUCTION_SLUG';
  const TRACKED_NEGOTIABLE = 'REPLACE_WITH_NEGOTIABLE_SLUG';
  const TRACKED_BUY_NOW = 'REPLACE_WITH_BUY_NOW_SLUG';

  // TRACE LOGGING
  let buyNowCount = 0, auctionCount = 0, negotiableCount = 0;
  let trackAuctionFound = false, trackNegotiableFound = false, trackBuyNowFound = false;

  for (const row of (data.listings || [])) {
    if (row.buyingMethod === 'Buy Now') buyNowCount++;
    if (row.buyingMethod === 'Auction') auctionCount++;
    if (row.buyingMethod === 'Negotiable') negotiableCount++;
    
    if (row.id === TRACKED_AUCTION) trackAuctionFound = true;
    if (row.id === TRACKED_NEGOTIABLE) trackNegotiableFound = true;
    if (row.id === TRACKED_BUY_NOW) trackBuyNowFound = true;
  }

  console.log("=== TRACE: ExplorePage (Server Component) ===");
  console.log("Total props count (data.total):", data.total);
  console.log("Returned listings length:", (data.listings || []).length);
  console.log("Buy Now Count:", buyNowCount);
  console.log("Auction Count:", auctionCount);
  console.log("Negotiable Count:", negotiableCount);
  console.log(`Tracked Auction (${TRACKED_AUCTION}) Present:`, trackAuctionFound);
  console.log(`Tracked Negotiable (${TRACKED_NEGOTIABLE}) Present:`, trackNegotiableFound);
  console.log(`Tracked Buy Now (${TRACKED_BUY_NOW}) Present:`, trackBuyNowFound);
  console.log("============================================");

  return <ClientExplore initialListings={data.listings} total={data.total} initialParams={params} />;
}
