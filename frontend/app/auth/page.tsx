'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { login as apiLogin, register as apiRegister } from '@/lib/api'
import { mergeAnonymousData } from '@/lib/mergeAnonymousData'
import Image from 'next/image'

function AuthPageContent() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') === 'register' ? 'signup' : 'signin'
  
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot'>(defaultTab as any)
  
  // Sign In State
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [showSignInPassword, setShowSignInPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Sign Up State
  const [signUpStep, setSignUpStep] = useState<1 | 2>(1)
  const [signUpName, setSignUpName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)
  const [otp, setOtp] = useState('')
  
  // Forgot Password State
  const [forgotStep, setForgotStep] = useState<1 | 2>(1)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotOtp, setForgotOtp] = useState('')
  const [forgotNewPassword, setForgotNewPassword] = useState('')

  const router = useRouter()
  const { setAuth } = useAuthStore()

  // Google Login (Mock)
  const handleGoogleLogin = () => {
    // Implement Google Login integration here
    alert('Google login integration pending setup.')
  }
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      const { user, token } = await apiLogin({ email: signInEmail, password: signInPassword })
      setAuth(user, token)
      mergeAnonymousData()
      
      if (!user.onboarding_completed) {
        router.push('/onboarding')
      } else {
        const returnTo = searchParams.get('returnTo')
        router.push(returnTo || '/')
      }
    } catch (err: any) {
      if (err.message === 'email_unverified') {
        // Switch to OTP verify mode
        setSignUpEmail(signInEmail)
        setSignUpStep(2)
        setActiveTab('signup')
        // We should send the verification code again
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-verification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: signInEmail })
        })
      } else {
        setError(err.message === 'invalid_credentials' ? 'Invalid credentials provided' : err.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignUpStep1 = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      await apiRegister({ 
        name: signUpName, 
        email: signUpEmail, 
        password: signUpPassword 
      })
      setSignUpStep(2)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignUpStep2 = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signUpEmail, code: otp })
      })
      const verifyData = await verifyRes.json()
      if (!verifyRes.ok) throw new Error(verifyData.error === 'invalid_code' ? 'Invalid code' : 'Verification failed')

      // Auto login after verification
      const { user, token } = await apiLogin({ email: signUpEmail, password: signUpPassword })
      setAuth(user, token)
      mergeAnonymousData()
      
      router.push('/onboarding')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotStep1 = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send reset link')
      }
      setForgotStep(2)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotStep2 = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, token: forgotOtp, newPassword: forgotNewPassword })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to reset password')
      }
      // Reset success
      setActiveTab('signin')
      setSignInEmail(forgotEmail)
      setForgotStep(1)
      setForgotOtp('')
      setForgotNewPassword('')
      alert('Password reset successful. You can now sign in.')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream-base)] flex">
      {/* LEFT COLUMN - Branding / Image */}
      <div className="hidden lg:flex w-1/2 relative bg-[var(--color-slate-900)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-terracotta-900)] to-[var(--color-slate-900)] opacity-90 mix-blend-multiply z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 z-0" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1615266895738-11f1371cd7e5?auto=format&fit=crop&q=80')" }} 
        />
        
        <div className="relative z-20 flex flex-col justify-between p-16 h-full w-full">
          <Link href="/" className="text-display-md text-white font-bold tracking-tight">
            BidCraft
          </Link>
          
          <div className="max-w-md">
            <h1 className="text-display-sm text-white mb-6">Discover unique artisanal goods.</h1>
            <p className="text-body-lg text-[var(--color-slate-200)]">
              Join the premium marketplace for handcrafted items, vintage treasures, and one-of-a-kind art pieces.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[440px]">
          
          <div className="lg:hidden mb-12">
            <Link href="/" className="text-display-md text-[var(--color-ink-900)] font-bold">
              BidCraft
            </Link>
          </div>

          <div className="bg-[var(--color-white)] rounded-[var(--radius-lg)] shadow-[var(--shadow-modal)] p-8">
            
            {/* Tabs */}
            {(activeTab === 'signin' || (activeTab === 'signup' && signUpStep === 1)) && (
              <div className="flex bg-[var(--color-cream-raised)] rounded-[var(--radius-pill)] p-1 mb-8 relative">
                <button
                  onClick={() => { setActiveTab('signin'); setError(''); }}
                  className={cn(
                    "flex-1 py-2 rounded-[var(--radius-pill)] text-body-md font-semibold transition-colors z-10",
                    activeTab === 'signin' ? "text-[var(--color-ink-900)]" : "text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)]"
                  )}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setActiveTab('signup'); setError(''); }}
                  className={cn(
                    "flex-1 py-2 rounded-[var(--radius-pill)] text-body-md font-semibold transition-colors z-10",
                    activeTab === 'signup' ? "text-[var(--color-ink-900)]" : "text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)]"
                  )}
                >
                  Create Account
                </button>
                <motion.div
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[var(--color-white)] rounded-[var(--radius-pill)] shadow-sm"
                  initial={false}
                  animate={{ left: activeTab === 'signin' ? '4px' : 'calc(50%)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              </div>
            )}

            {/* ERROR ALERT */}
            {error && (
              <div className="mb-6 p-3 bg-[var(--color-urgent-100)] text-[var(--color-urgent-700)] text-body-md rounded-[var(--radius-sm)] border border-[var(--color-urgent-200)] flex items-start gap-2">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                {error}
              </div>
            )}

            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                
                {/* SIGN IN FORM */}
                {activeTab === 'signin' && (
                  <motion.form
                    key="signin"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSignIn}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full h-[48px] bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] px-4 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-body-md text-[var(--color-ink-900)] font-medium">Password</label>
                        <button type="button" onClick={() => { setActiveTab('forgot'); setError(''); }} className="text-caption font-medium text-[var(--color-terracotta-600)] hover:underline">
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showSignInPassword ? 'text' : 'password'}
                          required
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          placeholder="Password"
                          className="w-full h-[48px] bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] pl-4 pr-12 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignInPassword(!showSignInPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)] transition-colors"
                        >
                          {showSignInPassword ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-[48px] bg-[var(--color-terracotta-600)] text-white text-body-lg font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors mt-2 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                    </button>
                    
                    <div className="relative flex items-center py-4">
                      <div className="flex-grow border-t border-[var(--color-border-subtle)]"></div>
                      <span className="shrink-0 px-4 text-caption text-[var(--color-ink-500)]">or</span>
                      <div className="flex-grow border-t border-[var(--color-border-subtle)]"></div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full h-[48px] bg-white border border-[var(--color-border-subtle)] text-[var(--color-ink-900)] text-body-md font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-slate-50)] transition-colors flex items-center justify-center gap-3 shadow-sm"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Continue with Google
                    </button>
                  </motion.form>
                )}

                {/* SIGN UP FORM */}
                {activeTab === 'signup' && (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AnimatePresence mode="wait">
                      
                      {/* Step 1: Info Collection */}
                      {signUpStep === 1 && (
                        <motion.form
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          onSubmit={handleSignUpStep1}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-1.5">Full Name</label>
                            <input
                              type="text"
                              required
                              value={signUpName}
                              onChange={(e) => setSignUpName(e.target.value)}
                              placeholder="John Doe"
                              className="w-full h-[48px] bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] px-4 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-1.5">Email Address</label>
                            <input
                              type="email"
                              required
                              value={signUpEmail}
                              onChange={(e) => setSignUpEmail(e.target.value)}
                              placeholder="name@example.com"
                              className="w-full h-[48px] bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] px-4 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-1.5">Password</label>
                            <div className="relative">
                              <input
                                type={showSignUpPassword ? 'text' : 'password'}
                                required
                                value={signUpPassword}
                                onChange={(e) => setSignUpPassword(e.target.value)}
                                placeholder="Min. 6 characters"
                                minLength={6}
                                className="w-full h-[48px] bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] pl-4 pr-12 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)] transition-colors"
                              >
                                {showSignUpPassword ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
                              </button>
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-[48px] bg-[var(--color-terracotta-600)] text-white text-body-lg font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors mt-4 flex items-center justify-center gap-2"
                          >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                          </button>

                          <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-[var(--color-border-subtle)]"></div>
                            <span className="shrink-0 px-4 text-caption text-[var(--color-ink-500)]">or</span>
                            <div className="flex-grow border-t border-[var(--color-border-subtle)]"></div>
                          </div>

                          <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full h-[48px] bg-white border border-[var(--color-border-subtle)] text-[var(--color-ink-900)] text-body-md font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-slate-50)] transition-colors flex items-center justify-center gap-3 shadow-sm"
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                          </button>
                          
                          <p className="text-center font-ui text-[12px] text-[var(--color-ink-500)] mt-4">
                            By creating an account, you agree to our <Link href="/terms" className="hover:underline text-[var(--color-terracotta-600)]">Terms of Service</Link> and <Link href="/privacy" className="hover:underline text-[var(--color-terracotta-600)]">Privacy Policy</Link>.
                          </p>
                        </motion.form>
                      )}

                      {/* Step 2: Email Verification */}
                      {signUpStep === 2 && (
                        <motion.form
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          onSubmit={handleSignUpStep2}
                          className="space-y-6"
                        >
                          <div className="text-center">
                            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-2">Check your email</h2>
                            <p className="text-body-md text-[var(--color-ink-700)]">
                              We've sent a 6-digit code to <strong>{signUpEmail}</strong>
                            </p>
                          </div>

                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="000000"
                            className="w-full h-[56px] text-center tracking-[0.5em] text-heading-lg bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all"
                          />

                          <button
                            type="submit"
                            disabled={isSubmitting || otp.length !== 6}
                            className="w-full h-[48px] bg-[var(--color-terracotta-600)] text-white text-body-lg font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                          >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Continue'}
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setSignUpStep(1)}
                            className="w-full text-center text-body-md font-medium text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)] transition-colors mt-2"
                          >
                            Use a different email
                          </button>
                        </motion.form>
                      )}

                    </AnimatePresence>
                  </motion.div>
                )}

                {/* FORGOT PASSWORD FORM */}
                {activeTab === 'forgot' && (
                  <motion.div
                    key="forgot"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button 
                      type="button" 
                      onClick={() => setActiveTab('signin')} 
                      className="flex items-center gap-2 text-body-md text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)] mb-6 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Sign In
                    </button>
                    
                    <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-2">Reset Password</h2>
                    
                    <AnimatePresence mode="wait">
                      {forgotStep === 1 && (
                        <motion.form
                          key="forgot1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          onSubmit={handleForgotStep1}
                          className="space-y-5"
                        >
                          <p className="text-body-md text-[var(--color-ink-700)] mb-4">
                            Enter the email associated with your account and we'll send you a verification code to reset your password.
                          </p>

                          <div>
                            <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-1.5">Email Address</label>
                            <input
                              type="email"
                              required
                              value={forgotEmail}
                              onChange={(e) => setForgotEmail(e.target.value)}
                              placeholder="name@example.com"
                              className="w-full h-[48px] bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] px-4 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-[48px] bg-[var(--color-terracotta-600)] text-white text-body-lg font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors flex items-center justify-center gap-2"
                          >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Code'}
                          </button>
                        </motion.form>
                      )}

                      {forgotStep === 2 && (
                        <motion.form
                          key="forgot2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          onSubmit={handleForgotStep2}
                          className="space-y-5"
                        >
                          <p className="text-body-md text-[var(--color-ink-700)] mb-4">
                            We've sent a 6-digit code to <strong>{forgotEmail}</strong>
                          </p>

                          <div>
                            <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-1.5">Verification Code</label>
                            <input
                              type="text"
                              required
                              maxLength={6}
                              value={forgotOtp}
                              onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                              placeholder="000000"
                              className="w-full h-[48px] text-center tracking-[0.5em] text-body-lg bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-1.5">New Password</label>
                            <div className="relative">
                              <input
                                type={showSignInPassword ? 'text' : 'password'}
                                required
                                minLength={6}
                                value={forgotNewPassword}
                                onChange={(e) => setForgotNewPassword(e.target.value)}
                                placeholder="Min. 6 characters"
                                className="w-full h-[48px] bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] pl-4 pr-12 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => setShowSignInPassword(!showSignInPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)] transition-colors"
                              >
                                {showSignInPassword ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
                              </button>
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting || forgotOtp.length !== 6 || forgotNewPassword.length < 6}
                            className="w-full h-[48px] bg-[var(--color-terracotta-600)] text-white text-body-lg font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                          >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
                          </button>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Suspense } from 'react'

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--color-cream-base)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-terracotta-600)]" />
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  )
}
