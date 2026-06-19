'use client'

import { CategoryCard } from '../category-card'
import { CATEGORIES } from '@/lib/mock-data'

export function CategoriesSection() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">Browse Categories</h2>
          <p className="text-muted-foreground mt-1">Discover what interests you</p>
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
