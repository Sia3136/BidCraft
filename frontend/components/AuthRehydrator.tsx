'use client'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useStore } from '@/lib/store'
import { getMe } from '@/lib/api'

import { usePathname, useRouter } from 'next/navigation'

export function AuthRehydrator() {
  const { token, clearAuth, setAuth, user, isAuthenticated } = useAuthStore()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!token) return
    getMe(token)
      .then(user => {
        setAuth(user, token)
        useStore.getState().loadWishlist()
        useStore.getState().loadCart()
      })   // refresh user data
      .catch(() => clearAuth())              // token expired → sign out
  }, [])  // Run only on mount to prevent infinite loops if token refreshes

  useEffect(() => {
    if (isAuthenticated && user && !user.onboarding_completed) {
      if (pathname !== '/onboarding' && pathname !== '/auth') {
        router.push('/onboarding')
      }
    }
  }, [isAuthenticated, user, pathname, router])

  return null  // renders nothing
}
