'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { login as apiLogin, register as apiRegister, getMe } from './api'

interface AuthContextType {
  user: any
  token: string | null
  loading: boolean
  login: (credentials: any) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, token, setAuth, clearAuth } = useAuthStore()
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setHasHydrated(useAuthStore.persist.hasHydrated())
    const unsubFinishHydration = useAuthStore.persist.onFinishHydration(() => setHasHydrated(true))
    return () => {
      unsubFinishHydration()
    }
  }, [])

  const login = async (credentials: any) => {
    const { user, token } = await apiLogin({ emailOrMobile: credentials.email, password: credentials.password })
    setAuth(user, token)
  }

  const register = async (data: any) => {
    const { user, token } = await apiRegister(data)
    setAuth(user, token)
  }

  const logout = () => {
    clearAuth()
  }

  const refreshUser = async () => {
    if (token) {
      try {
        const userData = await getMe(token)
        setAuth(userData, token)
      } catch (err) {
        clearAuth()
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading: !hasHydrated, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
