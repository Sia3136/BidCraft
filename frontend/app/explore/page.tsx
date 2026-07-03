import { getProducts } from '@/lib/dbProducts';
import ClientExplore from '@/components/client-explore';

export const revalidate = 3600;

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const products = await getProducts({ search });
  return <ClientExplore allProducts={products} />;
}
