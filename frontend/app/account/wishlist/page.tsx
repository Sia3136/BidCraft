'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function WishlistPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <h1 className="text-display-sm text-[var(--color-ink-900)] flex items-center gap-3">
        <Heart className="w-8 h-8 text-[var(--color-terracotta-600)]" /> Wishlist
      </h1>
      
      <Card>
        <CardContent className="py-16 flex flex-col items-center justify-center text-center">
          <Heart className="w-12 h-12 text-[var(--color-ink-300)] mb-4" />
          <h3 className="text-heading-lg text-[var(--color-ink-900)] mb-2">Your wishlist is empty</h3>
          <p className="text-body-md text-[var(--color-ink-700)] mb-6 max-w-md">
            Save items you like so you don't lose track of them.
          </p>
          <Button className="flex items-center gap-2" asChild>
            <Link href="/collections/all">
              Explore Items <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
