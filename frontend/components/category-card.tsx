'use client'

import Link from 'next/link'

interface CategoryCardProps {
  name: string
  count: number
  color: string
}

export function CategoryCard({ name, count }: CategoryCardProps) {
  const href = `/category/${name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`
  
  return (
    <Link href={href} className="group flex flex-col items-center justify-center rounded-[16px] h-32 border border-border bg-card hover:border-foreground/20 transition-all duration-300">
      <h3 className="text-xl font-brand font-medium text-foreground mb-1 group-hover:-translate-y-0.5 transition-transform">{name}</h3>
      <p className="text-[13px] text-muted-foreground">{count.toLocaleString()} items</p>
    </Link>
  )
}
