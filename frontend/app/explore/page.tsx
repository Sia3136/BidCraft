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

  return <ClientExplore initialListings={data.listings} total={data.total} initialParams={params} />;
}
