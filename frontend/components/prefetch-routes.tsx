'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function PrefetchRoutes() {
  const router = useRouter()

  useEffect(() => {
    // Prefetch main routes in the background
    router.prefetch('/explore')
    router.prefetch('/creators')
    router.prefetch('/category/art')
    router.prefetch('/category/handmade-&-crafts')
  }, [router])

  return null
}
