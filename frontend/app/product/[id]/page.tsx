import { notFound } from 'next/navigation';
import { getProductById, getProducts } from '@/lib/dbProducts';
import ProductDetailClient from '@/components/product-detail-client';

export const revalidate = 3600;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const product = await getProductById(id);
  if (!product) return notFound();

  // Fetch all products to find related ones from the same creator
  // In a real large app, you'd have a specific DB query for this
  const allProducts = await getProducts();
  const related = allProducts
    .filter((p) => p.creator === product.creator && p.id !== product.id)
    .slice(0, 4);

  return <ProductDetailClient product={product} related={related} />;
}
