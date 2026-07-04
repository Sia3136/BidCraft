'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/slugify';

interface CategoryFiltersProps {
  subcategories: string[];
  activeSubcategory?: string;
  categorySlug: string;
}

export const CategoryFilters = React.memo(function CategoryFilters({
  subcategories,
  activeSubcategory,
  categorySlug,
}: CategoryFiltersProps) {
  const router = useRouter();

  function handleSubcategoryClick(sub: string) {
    const slug = slugify(sub);
    if (activeSubcategory === slug) {
      router.push(`/category/${categorySlug}`);
    } else {
      router.push(`/category/${categorySlug}?subcategory=${slug}`);
    }
  }

  function handleClearSubcategory() {
    router.push(`/category/${categorySlug}`);
  }

  return (
    <aside>
      <div className="mb-8">
        <p className="font-display text-heading-sm font-semibold text-[var(--color-ink-900)] mb-3">
          Subcategories
        </p>
        {activeSubcategory && (
          <button
            onClick={handleClearSubcategory}
            className="text-caption text-[var(--color-terracotta-600)] bg-transparent border-none cursor-pointer mb-2 p-0 hover:underline"
          >
            Clear ×
          </button>
        )}
        <ul className="list-none p-0 m-0 space-y-1">
          {subcategories.map((sub) => {
            const slug = slugify(sub);
            const isActive = activeSubcategory === slug;
            return (
              <li key={sub}>
                <button
                  onClick={() => handleSubcategoryClick(sub)}
                  className={`w-full text-left px-3 py-2 rounded-[var(--radius-sm)] border-none cursor-pointer font-display text-body-sm transition-all duration-150 whitespace-nowrap overflow-hidden text-ellipsis ${
                    isActive 
                      ? 'bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)] border-l-4 border-l-[var(--color-terracotta-600)]' 
                      : 'bg-transparent text-[var(--color-ink-700)] border-l-4 border-l-transparent hover:bg-[var(--color-cream-deep)]'
                  }`}
                >
                  {sub}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="h-px bg-[var(--color-border-subtle)] mb-8" />

      <div>
        <p className="font-display text-heading-sm font-semibold text-[var(--color-ink-900)] mb-3">
          Browse explore page for full filtering
        </p>
        <a
          href="/explore"
          className="text-body-sm text-[var(--color-terracotta-600)] font-display hover:underline"
        >
          Open Explore All →
        </a>
      </div>
    </aside>
  );
});
