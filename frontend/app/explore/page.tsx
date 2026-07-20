import { fetchListings } from '@/lib/api';
import ClientExplore from '@/components/client-explore';

export const revalidate = 60;

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const resolvedParams = await searchParams;
  const params: Record<string, string> = {};

  if (resolvedParams.category)    params.category = resolvedParams.category;
  if (resolvedParams.subcategory) params.subcategory = resolvedParams.subcategory;
  if (resolvedParams.method)      params.method = resolvedParams.method;
  if (resolvedParams.collection)  params.collection = resolvedParams.collection;
  if (resolvedParams.occasion)    params.occasion = resolvedParams.occasion;
  if (resolvedParams.type)        params.type = resolvedParams.type;
  if (resolvedParams.minPrice)    params.minPrice = resolvedParams.minPrice;
  if (resolvedParams.maxPrice)    params.maxPrice = resolvedParams.maxPrice;
  if (resolvedParams.sort)        params.sort = resolvedParams.sort;
  if (resolvedParams.search)      params.search = resolvedParams.search;
  if (resolvedParams.page)        params.page = resolvedParams.page;
  
  const page = parseInt(params.page || '1', 10);
  const limit = 24;
  const offset = (page - 1) * limit;

  const data = await fetchListings({ ...params, limit, offset });

  return <ClientExplore initialListings={data.listings} total={data.total} initialParams={params} />;
}
