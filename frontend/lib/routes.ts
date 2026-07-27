import { Listing } from './api'

/**
 * Returns the canonical URL for a given listing.
 * If slug exists, uses the slug. 
 * Otherwise, generates a URL safe string from the title + numericId or falls back to ID.
 */
export function getProductRoute(product: Partial<Listing> | any): string {
  // Try to use the slug directly if the backend returns it in the 'id' field
  // because the updated backend will return COALESCE(l.slug, l.id::text) AS id
  const identifier = product.id || product.numericId?.toString()

  if (!identifier) {
    // Fallback if somehow both are missing
    return '/explore'
  }

  return `/product/${identifier}`
}
