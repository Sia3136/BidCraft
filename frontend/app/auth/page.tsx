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
import { FieldError } from '@/components/ui/field-error'

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
      if (err.message === 'invalid_code' || err.message === 'code_expired' || err.message === 'code_not_found') {
        setError(err.message)
      } else {
        setError(err.message)
      }
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

  const isForgotFlow = activeTab === 'forgot'
  const isOtpFlow = activeTab === 'signup' && signUpStep === 2
  const isFullScreenBg = isForgotFlow || isOtpFlow
  const isRegisterStep1 = activeTab === 'signup' && signUpStep === 1

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--color-cream-base)] relative overflow-hidden">
      {/* BRANDING / IMAGE */}
      <div className={cn(
        "relative shrink-0 overflow-hidden bg-[var(--color-slate-900)]",
        isFullScreenBg ? "absolute inset-0 z-0" : "w-full lg:w-1/2 h-56 sm:h-64 lg:h-auto",
        isRegisterStep1 && !isFullScreenBg ? "lg:order-last" : ""
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-terracotta-900)]/40 to-[var(--color-ink-900)]/70 mix-blend-multiply z-10" />
        
        {isFullScreenBg && (
           <div className="absolute inset-0 bg-[var(--color-cream-base)]/80 z-20 backdrop-blur-md" />
        )}

        <Image
          src={isForgotFlow ? 'https://res.cloudinary.com/duzlsyzwa/image/upload/v1785344942/bidcraft/auth/crochet_pouch.jpg' : 'https://res.cloudinary.com/duzlsyzwa/image/upload/v1785344944/bidcraft/auth/pottery_artwork.webp'}
          alt="Premium handcrafted items"
          fill
          sizes="100vw"
          priority
          className={cn("object-cover", isFullScreenBg ? "opacity-30" : "opacity-80")}
          style={{ objectPosition: 'center 30%' }}
        />
        
        {!isFullScreenBg && (
          <div className="relative z-20 flex flex-col justify-between p-6 sm:p-12 lg:p-16 h-full w-full">
            <Link href="/" className="text-display-md text-white font-bold tracking-tight drop-shadow-md">
              BidCraft
            </Link>
            
            <div className="hidden lg:block max-w-md">
              <h1 className="text-display-sm text-white mb-6 drop-shadow-md">
                {isRegisterStep1 ? 'Join the community.' : 'Discover unique artisanal goods.'}
              </h1>
              <p className="text-body-lg text-white/90 drop-shadow-sm">
                {isRegisterStep1 ? 'Set up your identity and start exploring premium handcrafted items.' : 'Join the premium marketplace for handcrafted items, vintage treasures, and one-of-a-kind art pieces.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN - Auth Form */}
      <div className={cn(
        "flex flex-col items-center justify-center p-6 sm:p-12 flex-1 relative z-30",
        isFullScreenBg ? "w-full" : "w-full lg:w-1/2"
      )}>
        
        {isFullScreenBg && (
           <div className="absolute top-8 left-8 sm:top-12 sm:left-12">
              <Link href="/" className="text-display-md text-[var(--color-ink-900)] font-bold tracking-tight">
                BidCraft
              </Link>
           </div>
        )}

        <div className={cn(
          "w-full max-w-[440px]",
          !isFullScreenBg && "-mt-8 lg:mt-0"
        )}>
          
          <div className={cn(
            "p-8 sm:p-10",
            isFullScreenBg 
              ? "bg-[var(--color-white)]/95 backdrop-blur-md rounded-[4px] border border-[var(--color-border-subtle)] shadow-sm" 
              : "bg-[var(--color-white)] rounded-[4px] border border-[var(--color-border-subtle)] shadow-[var(--shadow-card)]"
          )}>
            
            {/* Tabs */}
            {(activeTab === 'signin' || isRegisterStep1) && (
              <div className="flex bg-[var(--color-cream-raised)] rounded-sm p-1 mb-10 relative">
                <button
                  onClick={() => { setActiveTab('signin'); setError(''); }}
                  className={cn(
                    "flex-1 py-2 rounded-sm text-body-md font-semibold transition-colors z-10",
                    activeTab === 'signin' ? "text-[var(--color-ink-900)] shadow-sm" : "text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)]"
                  )}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setActiveTab('signup'); setError(''); }}
                  className={cn(
                    "flex-1 py-2 rounded-sm text-body-md font-semibold transition-colors z-10",
                    activeTab === 'signup' ? "text-[var(--color-ink-900)] shadow-sm" : "text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)]"
                  )}
                >
                  Create Account
                </button>
                <motion.div
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[var(--color-white)] rounded-sm shadow-sm"
                  initial={false}
                  animate={{ left: activeTab === 'signin' ? '4px' : 'calc(50%)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              </div>
            )}

            {/* Error alerts removed in favor of FieldError inline components */}

            <div className="overflow-visible">
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
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-display-xs text-[var(--color-ink-900)] font-serif mb-6">Welcome back.</h2>
                    </div>
                    <div>
                      <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full h-[52px] bg-white border border-[var(--color-border-subtle)] rounded-sm px-4 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all shadow-sm"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
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
                          className="w-full h-[52px] bg-white border border-[var(--color-border-subtle)] rounded-sm pl-4 pr-12 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignInPassword(!showSignInPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)] transition-colors"
                        >
                          {showSignInPassword ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
                        </button>
                      </div>
                      {error === 'invalid_credentials' && <FieldError message="Incorrect email or password." />}
                      {error !== '' && error !== 'invalid_credentials' && <FieldError message={error} />}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-[52px] bg-[var(--color-terracotta-600)] text-white text-body-lg font-semibold rounded-sm hover:bg-[var(--color-terracotta-700)] transition-colors mt-4 flex items-center justify-center gap-2 shadow-md"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                    </button>
                    
                    <div className="relative flex items-center py-6">
                      <div className="flex-grow border-t border-[var(--color-border-subtle)]"></div>
                      <span className="shrink-0 px-4 text-caption text-[var(--color-ink-500)]">or</span>
                      <div className="flex-grow border-t border-[var(--color-border-subtle)]"></div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full h-[52px] bg-white border border-[var(--color-border-subtle)] text-[var(--color-ink-900)] text-body-md font-medium rounded-sm hover:bg-[var(--color-slate-50)] transition-colors flex items-center justify-center gap-3 shadow-sm"
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
                          className="space-y-5"
                        >
                          <div>
                            <h2 className="text-display-xs text-[var(--color-ink-900)] font-serif mb-6">Create an account.</h2>
                          </div>
                          <div>
                            <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-2">Full Name</label>
                            <input
                              type="text"
                              required
                              value={signUpName}
                              onChange={(e) => setSignUpName(e.target.value)}
                              placeholder="John Doe"
                              className="w-full h-[52px] bg-white border border-[var(--color-border-subtle)] rounded-sm px-4 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all shadow-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-2">Email Address</label>
                            <input
                              type="email"
                              required
                              value={signUpEmail}
                              onChange={(e) => setSignUpEmail(e.target.value)}
                              placeholder="name@example.com"
                              className="w-full h-[52px] bg-white border border-[var(--color-border-subtle)] rounded-sm px-4 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all shadow-sm"
                            />
                            {error === 'email_taken' && <FieldError message="This email is already in use." />}
                          </div>

                          <div>
                            <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-2">Password</label>
                            <div className="relative">
                              <input
                                type={showSignUpPassword ? 'text' : 'password'}
                                required
                                value={signUpPassword}
                                onChange={(e) => setSignUpPassword(e.target.value)}
                                placeholder="Min. 6 characters"
                                minLength={6}
                                className="w-full h-[52px] bg-white border border-[var(--color-border-subtle)] rounded-sm pl-4 pr-12 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all shadow-sm"
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
                            className="w-full h-[52px] bg-[var(--color-terracotta-600)] text-white text-body-lg font-semibold rounded-sm hover:bg-[var(--color-terracotta-700)] transition-colors mt-6 flex items-center justify-center gap-2 shadow-md"
                          >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                          </button>

                          <div className="relative flex items-center py-4">
                            <div className="flex-grow border-t border-[var(--color-border-subtle)]"></div>
                            <span className="shrink-0 px-4 text-caption text-[var(--color-ink-500)]">or</span>
                            <div className="flex-grow border-t border-[var(--color-border-subtle)]"></div>
                          </div>

                          <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full h-[52px] bg-white border border-[var(--color-border-subtle)] text-[var(--color-ink-900)] text-body-md font-medium rounded-sm hover:bg-[var(--color-slate-50)] transition-colors flex items-center justify-center gap-3 shadow-sm"
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                          </button>
                          
                          <p className="text-center font-ui text-[12px] text-[var(--color-ink-500)] mt-6">
                            By creating an account, you agree to our <Link href="/terms" className="hover:underline text-[var(--color-terracotta-600)]">Terms of Service</Link> and <Link href="/privacy" className="hover:underline text-[var(--color-terracotta-600)]">Privacy Policy</Link>.
                          </p>
                        </motion.form>
                      )}

                      {/* Step 2: Email Verification */}
                      {signUpStep === 2 && (
                        <motion.form
                          key="step2"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          onSubmit={handleSignUpStep2}
                          className="space-y-8 flex flex-col items-center justify-center py-12"
                        >
                          <div className="w-16 h-16 rounded-full bg-[var(--color-cream-raised)] flex items-center justify-center mb-2 shadow-sm border border-[var(--color-border-subtle)]">
                            <span className="text-display-xs">✉️</span>
                          </div>
                          <div className="text-center">
                            <h2 className="text-display-xs text-[var(--color-ink-900)] font-serif mb-4">Check your email</h2>
                            <p className="text-body-lg text-[var(--color-ink-700)]">
                              We've sent a 6-digit code to <br/><strong className="text-[var(--color-ink-900)]">{signUpEmail}</strong>
                            </p>
                          </div>

                          <div className="w-full">
                            <input
                              type="text"
                              required
                              maxLength={6}
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                              placeholder="000000"
                              className="w-full h-[64px] bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-sm text-center text-heading-lg tracking-[0.5em] text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all shadow-inner"
                            />
                            {error === 'invalid_code' && <FieldError message="Incorrect verification code." />}
                            {error === 'code_expired' && <FieldError message="Your verification code has expired. Request a new code." />}
                            {error === 'code_not_found' && <FieldError message="This verification code is invalid or has already been used." />}
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting || otp.length !== 6}
                            className="w-full h-[52px] bg-[var(--color-terracotta-600)] text-white text-body-lg font-semibold rounded-sm hover:bg-[var(--color-terracotta-700)] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-md mt-8"
                          >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Account'}
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setSignUpStep(1)}
                            className="text-body-md font-medium text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)] transition-colors mt-6"
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
                      className="flex items-center gap-2 text-body-md text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)] mb-8 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Sign In
                    </button>
                    
                    <h2 className="text-display-xs text-[var(--color-ink-900)] font-serif mb-8">Reset Password</h2>
                    
                    <AnimatePresence mode="wait">
                      {forgotStep === 1 && (
                        <motion.form
                          key="forgot1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          onSubmit={handleForgotStep1}
                          className="space-y-6"
                        >
                          <p className="text-body-lg text-[var(--color-ink-700)] mb-6">
                            Enter the email associated with your account and we'll send you a verification code to reset your password.
                          </p>

                          <div>
                            <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-2">Email Address</label>
                            <input
                              type="email"
                              required
                              value={forgotEmail}
                              onChange={(e) => setForgotEmail(e.target.value)}
                              placeholder="name@example.com"
                              className="w-full h-[52px] bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-sm px-4 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all shadow-sm"
                            />
                            {error !== '' && <FieldError message={error} />}
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-[52px] bg-[var(--color-terracotta-600)] text-white text-body-lg font-semibold rounded-sm hover:bg-[var(--color-terracotta-700)] transition-colors mt-6 flex items-center justify-center gap-2 shadow-md"
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
                          className="space-y-8"
                        >
                          <p className="text-body-lg text-[var(--color-ink-700)] mb-6">
                            We've sent a 6-digit code to <strong>{forgotEmail}</strong>
                          </p>

                          <div>
                            <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-2 text-center">Verification Code</label>
                            <input
                              type="text"
                              required
                              maxLength={6}
                              value={forgotOtp}
                              onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                              placeholder="000000"
                              className="w-full h-[64px] bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-sm text-center text-heading-lg tracking-[0.5em] text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all shadow-inner"
                            />
                            {error === 'invalid_code' && <FieldError message="Incorrect verification code." />}
                            {error === 'code_expired' && <FieldError message="Your verification code has expired. Request a new code." />}
                            {error === 'code_not_found' && <FieldError message="This verification code is invalid or has already been used." />}
                          </div>

                          <div>
                            <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-2">New Password</label>
                            <div className="relative">
                              <input
                                type={showSignInPassword ? 'text' : 'password'}
                                required
                                minLength={6}
                                value={forgotNewPassword}
                                onChange={(e) => setForgotNewPassword(e.target.value)}
                                placeholder="Min. 6 characters"
                                className="w-full h-[52px] bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-sm pl-4 pr-12 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all shadow-sm"
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
                            disabled={isSubmitting || forgotOtp.length < 6 || forgotNewPassword.length < 6}
                            className="w-full h-[52px] bg-[var(--color-terracotta-600)] text-white text-body-lg font-semibold rounded-sm hover:bg-[var(--color-terracotta-700)] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-md"
                          >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Set New Password'}
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
