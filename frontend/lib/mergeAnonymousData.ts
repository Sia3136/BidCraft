import { useStore } from '@/lib/store'

export function mergeAnonymousData() {
  // Cart and wishlist are currently stored together with user data in lib/store.ts
  // No merge needed at MVP since cart/wishlist are still client-side only
  // This function is a placeholder for Sprint 3 when server-side cart is implemented
  console.log('[auth] Anonymous data merge: client-side stores retained as-is')
}
