import { getProducts } from '@/lib/dbProducts';
import ClientExplore from '@/components/client-explore';

export const revalidate = 3600;

export default async function ExplorePage() {
  const products = await getProducts();
  return <ClientExplore allProducts={products} />;
}
