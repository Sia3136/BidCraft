import { exploreProducts } from '@/lib/exploreProducts';
import ClientExplore from '@/components/client-explore';

// export const revalidate = 3600;
export const dynamic = "force-dynamic";

// Simple deterministic shuffle based on slug
function seededShuffle(array: any[], seedStr: string = '') {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed << 5) - seed + seedStr.charCodeAt(i);
    seed |= 0;
  }
  
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const x = Math.sin(seed++) * 10000;
    const r = x - Math.floor(x);
    const j = Math.floor(r * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default async function ExploreSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const shuffledProducts = seededShuffle(exploreProducts, slug);

  return <ClientExplore allProducts={shuffledProducts} />;
}
