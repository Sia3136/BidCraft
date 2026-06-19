'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi, profileApi } from './api'

interface User {
  id: number
  email: string
  name: string
  role: string
  avatar_url?: string
  bio?: string
  phone?: string
  is_verified?: boolean
  trust_score?: number
  razorpay_customer_id?: string
  razorpay_card_token?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (credentials: any) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSession() {
      try {
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
          setToken(storedToken)
          // Fetch current user details & profile details
          const meResponse = await authApi.me()
          const profileResponse = await profileApi.getOwn().catch(() => null)
          
          setUser({
            ...meResponse.user,
            ...(profileResponse?.profile || {})
          })
        }
      } catch (err) {
        console.error('Failed to load session:', err)
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    loadSession()
  }, [])

  const refreshUser = async () => {
    try {
      const meResponse = await authApi.me()
      const profileResponse = await profileApi.getOwn().catch(() => null)
      setUser({
        ...meResponse.user,
        ...(profileResponse?.profile || {})
      })
    } catch (err) {
      console.error('Failed to refresh user profile:', err)
    }
  }

  const login = async (credentials: any) => {
    const res = await authApi.login(credentials)
    localStorage.setItem('token', res.accessToken)
    setToken(res.accessToken)
    
    // Fetch complete profile info
    const profileResponse = await profileApi.getOwn().catch(() => null)
    setUser({
      ...res.user,
      ...(profileResponse?.profile || {})
    })
  }

  const register = async (data: any) => {
    const res = await authApi.register(data)
    localStorage.setItem('token', res.accessToken)
    setToken(res.accessToken)
    setUser(res.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
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
