import { fetchListings } from '@/lib/api';
import ClientExplore from '@/components/client-explore';
import { resolveDisplayTitle } from '@/lib/categories';

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

  const resolveSlugs = (val: string | string[] | undefined) => {
    if (!val) return '';
    const arr = Array.isArray(val) ? val : [val];
    return arr.map(slug => resolveDisplayTitle(slug) || slug).join(',');
  };

  if (resolvedParams.category)    params.category = resolveSlugs(resolvedParams.category);
  if (resolvedParams.subcategory) params.subcategory = resolveSlugs(resolvedParams.subcategory);
  if (resolvedParams.method)      params.method = sanitize(resolvedParams.method);
  
  if (resolvedParams.collection) {
    params.collection = resolveSlugs(resolvedParams.collection);
  }
  if (resolvedParams.occasion) {
    params.occasion = resolveSlugs(resolvedParams.occasion);
  }
  if (resolvedParams.gift) {
    params.gift = sanitize(resolvedParams.gift);
  }
  if (resolvedParams.type)        params.type = sanitize(resolvedParams.type);
  if (resolvedParams.priceMin)    params.minPrice = sanitize(resolvedParams.priceMin);
  if (resolvedParams.priceMax)    params.maxPrice = sanitize(resolvedParams.priceMax);
  if (resolvedParams.sort)        params.sort = sanitize(resolvedParams.sort);
  if (resolvedParams.search)      params.search = sanitize(resolvedParams.search);
  if (resolvedParams.page)        params.page = sanitize(resolvedParams.page);
  
  const page = parseInt(params.page || '1', 10);
  const limit = 28;
  const offset = (page - 1) * limit;

  let data;
  if (params.type === 'trending') {
    // Intercept trending without API change. Fetch a larger set and filter by TRENDING_IDS
    const { TRENDING_IDS } = await import('@/lib/trending');
    const apiParams = { ...params };
    delete apiParams.type; // Don't send trending to API as it would map to listing_type
    
    data = await fetchListings({ ...apiParams, limit: 100, offset: 0 });
    data.listings = data.listings.filter(l => TRENDING_IDS.includes(l.id));
    data.total = data.listings.length;
    data.listings = data.listings.slice(offset, offset + limit);
    data.hasMore = offset + limit < data.total;
  } else {
    data = await fetchListings({ ...params, limit, offset });
  }

  return <ClientExplore initialListings={data.listings} total={data.total} initialParams={params} />;
}
