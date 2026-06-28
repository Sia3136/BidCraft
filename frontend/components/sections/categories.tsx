'use client'

import { CategoryCard } from '../category-card'
import { CATEGORIES } from '@/lib/mock-data'

export function CategoriesSection() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-brand font-medium tracking-wide text-foreground">Explore Categories</h2>
          <p className="text-[14px] text-muted-foreground mt-3">Curated collections for the discerning collector.</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              count={category.count}
              color={category.color}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
