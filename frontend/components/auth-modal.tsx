'use client'

import React, { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { mergeAnonymousData } from '@/lib/mergeAnonymousData'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [signUpStep, setSignUpStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const router = useRouter()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isLogin) {
        await login({ email, password })
        // Onboarding redirect handled by AuthContext? No, we check the global store.
        // Wait, login doesn't return user directly, we should check useAuthStore.
        const { useAuthStore } = await import('@/store/authStore')
        const user = useAuthStore.getState().user
        if (user && !user.onboarding_completed) {
          router.push('/onboarding')
        }
        onClose()
      } else {
        if (signUpStep === 1) {
          await register({ name, email, password })
          setSignUpStep(2)
        } else {
          const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code: otp })
          })
          const verifyData = await verifyRes.json()
          if (!verifyRes.ok) throw new Error(verifyData.error === 'invalid_code' ? 'Invalid verification code' : verifyData.error === 'code_expired' ? 'Code has expired' : verifyData.error === 'code_not_found' ? 'Code is invalid or used' : 'Verification failed')

          await login({ email, password })
          const { useAuthStore } = await import('@/store/authStore')
          const user = useAuthStore.getState().user
          mergeAnonymousData()
          if (user && !user.onboarding_completed) {
            router.push('/onboarding')
          }
          onClose()
        }
      }
    } catch (err: any) {
      if (err.message === 'email_unverified') {
        // Automatically switch to OTP step
        setSignUpStep(2)
        setIsLogin(false)
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-verification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })
      } else {
        setError(err.message === 'invalid_credentials' ? 'Invalid email or password' : err.message || 'Authentication failed. Please check your credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      if (!res.ok) throw new Error('Failed to resend code')
      alert('Verification code sent!')
    } catch (err: any) {
      setError(err.message)
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
          className="absolute top-4 right-4 text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)] text-xl z-10"
        >
          ✕
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <span className="font-brand text-[32px] font-semibold tracking-wide text-[var(--color-ink-900)]">
                BidCraft
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-ink-900)]">
              {isLogin ? 'Welcome Back' : (signUpStep === 1 ? 'Join BidCraft' : 'Verify Email')}
            </h2>
            <p className="text-sm text-[var(--color-ink-700)] mt-1">
              {isLogin ? 'Sign in to access your auctions and storefront' : (signUpStep === 1 ? 'Create an account to start bidding and selling' : `We sent a 6-digit code to ${email}`)}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {!isLogin && signUpStep === 2 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-ink-900)] mb-1 text-center">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full px-4 py-3 bg-[var(--color-cream-deep)] text-[var(--color-ink-900)] border border-[var(--color-border-subtle)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-600)] focus:border-transparent text-2xl tracking-[0.5em] text-center font-mono placeholder:text-[var(--color-ink-300)]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-3 px-4 bg-[var(--color-terracotta-600)] text-white rounded-xl font-semibold hover:bg-[var(--color-terracotta-700)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-600)] focus:ring-offset-2 disabled:opacity-50 text-sm shadow-sm mt-2"
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
                <div className="text-center mt-4">
                  <button type="button" onClick={handleResendOtp} disabled={loading} className="text-sm text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)] underline">
                    Resend Code
                  </button>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
          </form>

          {/* Footer toggle */}
          {(!(!isLogin && signUpStep === 2)) && (
            <div className="mt-6 text-center text-xs text-[var(--color-ink-700)]">
              {isLogin ? (
                <p>
                  Don't have an account?{' '}
                  <button 
                    type="button"
                    onClick={() => { setIsLogin(false); setSignUpStep(1); setError(null); }}
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
          )}
        </div>
      </div>
    </div>
  )
}
