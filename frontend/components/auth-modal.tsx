'use client'

import React, { useState } from 'react'
import { useAuth } from '@/lib/auth-context'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isLogin) {
        await login({ email, password })
      } else {
        await register({ name, email, password })
      }
      onClose()
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-md bg-[var(--color-white)] border border-[var(--color-border-subtle)] rounded-2xl shadow-[var(--shadow-modal)] overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)] text-xl"
        >
          ✕
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <img src="/logo.png" alt="BidCraft Logo" className="h-12 w-auto mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-[var(--color-ink-900)]">
              {isLogin ? 'Welcome Back' : 'Join BidCraft'}
            </h2>
            <p className="text-sm text-[var(--color-ink-700)] mt-1">
              {isLogin ? 'Sign in to access your auctions and storefront' : 'Create an account to start bidding and selling'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900/50">
                {error}
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-900)] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 bg-[var(--color-cream-deep)] text-[var(--color-ink-900)] border border-[var(--color-border-subtle)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-600)] focus:border-transparent text-sm placeholder:text-[var(--color-ink-500)]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-900)] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-[var(--color-cream-deep)] text-[var(--color-ink-900)] border border-[var(--color-border-subtle)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-600)] focus:border-transparent text-sm placeholder:text-[var(--color-ink-500)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-900)] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-[var(--color-cream-deep)] text-[var(--color-ink-900)] border border-[var(--color-border-subtle)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-600)] focus:border-transparent text-sm placeholder:text-[var(--color-ink-500)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[var(--color-terracotta-600)] text-white rounded-xl font-semibold hover:bg-[var(--color-terracotta-700)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-600)] focus:ring-offset-2 disabled:opacity-50 text-sm mt-2 shadow-sm"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Footer toggle */}
          <div className="mt-6 text-center text-xs text-[var(--color-ink-700)]">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button 
                  type="button"
                  onClick={() => { setIsLogin(false); setError(null); }}
                  className="text-[var(--color-terracotta-600)] font-bold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button 
                  type="button"
                  onClick={() => { setIsLogin(true); setError(null); }}
                  className="text-[var(--color-terracotta-600)] font-bold hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
