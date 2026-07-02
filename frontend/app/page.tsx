import { getProducts } from '@/lib/dbProducts';
import ClientHome from '@/components/client-home';

// Revalidate every hour, or rely on dynamic fetching if needed
export const revalidate = 3600;

export default async function Home() {
  const products = await getProducts();
  
  // Also pass the new featured listings to the client component.
  // We can select a few featured products here or inside client-home
  
  return <ClientHome allProducts={products} />;
}
