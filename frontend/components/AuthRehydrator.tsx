'use client'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { getMe } from '@/lib/api'

export function AuthRehydrator() {
  const { token, clearAuth, setAuth } = useAuthStore()

  useEffect(() => {
    if (!token) return
    getMe(token)
      .then(user => setAuth(user, token))   // refresh user data
      .catch(() => clearAuth())              // token expired → sign out
  }, [token, setAuth, clearAuth])  // add deps

  return null  // renders nothing
}
