import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { SkeletonGrid } from '@/components/skeleton-grid';
import { fetchListings, Listing } from '@/lib/api';
import { ProductCard } from '@/components/product-card';
import { CategoryFilters } from '@/components/category-filters';
import { slugify } from '@/lib/slugify';

export const revalidate = 3600;

const megaMenuData: Record<string, string[]> = {
  'Art': ['Paintings', 'Sketches & Drawings', 'Digital Art & Illustrations', 'Prints & Posters', 'Sculptures'],
  'Handmade & Crafts': ['Crochet & Knitting', 'Resin Art', 'Clay & Pottery', 'Candles & Soaps', 'Paper Crafts'],
  'Collectibles': ['Action Figures', 'Trading Cards', 'Funko Pops', 'Hot Wheels', 'Rare Collectibles'],
  'Gaming & Hobby': ['Board Games', 'Anime Merchandise', 'Cosplay Props', 'Puzzle Collections'],
  'Lifestyle & Gifts': ['Home Decor', 'Jewellery & Accessories', 'Miniatures', 'Stationery'],
};

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ subcategory?: string }>;
}) {
  const { category } = await params;
  const { subcategory } = await searchParams;

  if (!category) return notFound();

  const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
    'art': 'Art',
    'handmade-crafts': 'Handmade & Crafts',
    'collectibles': 'Collectibles',
    'gaming-hobby': 'Gaming & Hobby',
    'lifestyle-gifts': 'Lifestyle & Gifts',
  };

  const categoryName = CATEGORY_DISPLAY_NAMES[category.toLowerCase()] || category
    .split('-')
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const dataKey = Object.keys(megaMenuData).find(
    (k) => k.toLowerCase().replace(/ /g, '-') === category.toLowerCase()
  );

  if (!dataKey) return notFound();

  const subcategories = megaMenuData[dataKey];

  const data = await fetchListings({
    category,
    ...(subcategory ? { subcategory } : {}),
    limit: 100
  });
  
  const filtered = data.listings;

  return (
    <div className="w-full">
      {/* Category header block */}
      <div className="bg-[var(--color-cream-raised)] py-12 text-center px-[var(--space-5)]">
        {subcategory && (
          <p className="text-caption text-[var(--color-ink-500)] mb-2">
            <a href={`/category/${category}`} className="text-[var(--color-ink-500)] hover:text-[var(--color-terracotta-600)] transition-colors">
              {categoryName}
            </a>
            <span className="mx-2">›</span>
            {subcategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </p>
        )}
        <h1 className="text-display-2xl text-[var(--color-ink-900)] mb-2">
          {subcategory
            ? subcategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
            : categoryName}
        </h1>
        <p className="text-body-md text-[var(--color-ink-700)]">
          {filtered.length} item{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Body: sidebar + grid */}
      <div className="max-w-[var(--container-max)] mx-auto px-[var(--space-4)] md:px-[var(--space-6)] xl:px-[var(--space-8)] py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12">
          <CategoryFilters
            subcategories={subcategories}
            activeSubcategory={subcategory}
            categorySlug={category}
          />
          <div className="w-full">
            <Suspense fallback={<SkeletonGrid count={8} />}>
              {filtered.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <p className="text-heading-lg text-[var(--color-ink-900)] mb-2">
                    No items found
                  </p>
                  <p className="text-body-md text-[var(--color-ink-500)]">
                    Try a different subcategory or browse all {categoryName}.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product as any} />
                  ))}
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
