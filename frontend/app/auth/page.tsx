'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const [signInMethod, setSignInMethod] = useState<'email' | 'mobile'>('email')
  
  // Sign In State
  const [signInEmail, setSignInEmail] = useState('')
  const [signInMobile, setSignInMobile] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [showSignInPassword, setShowSignInPassword] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [signInError, setSignInError] = useState('')

  // Sign Up State
  const [signUpStep, setSignUpStep] = useState<1 | 2 | 3 | 4>(1) // 1: Info, 2: Email OTP, 3: Mobile OTP, 4: Success
  const [signUpName, setSignUpName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpMobile, setSignUpMobile] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)
  const [emailOtp, setEmailOtp] = useState('')
  const [mobileOtp, setMobileOtp] = useState('')
  
  const [tempToken, setTempToken] = useState('') // Store access token during signup flow
  const [tempUser, setTempUser] = useState<any>(null)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [signUpError, setSignUpError] = useState('')

  const router = useRouter()
  const { login } = useStore()
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSigningIn(true)
    setSignInError('')
    try {
      // Use email for login if mobile is selected, we map mobile to email in a real app or use mobile auth, 
      // but the backend login only takes email/password. For this demo, we'll assume the email is the identifier.
      const identifier = signInMethod === 'email' ? signInEmail : `${signInMobile}@bidcraft.in`
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password: signInPassword })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      
      login(data.user, data.accessToken)
      router.push('/')
    } catch (err: any) {
      setSignInError(err.message === 'invalid_credentials' ? 'Invalid credentials provided' : err.message)
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleSignUpStep1 = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSigningUp(true)
    setSignUpError('')
    try {
      // 1. Register User
      const regRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signUpEmail, password: signUpPassword, name: signUpName })
      })
      const regData = await regRes.json()
      if (!regRes.ok) throw new Error(regData.error === 'email_taken' ? 'Email already in use' : regData.error)
      
      setTempToken(regData.accessToken)
      setTempUser(regData.user)

      // 2. Send Email OTP
      const emailVerifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-verification`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${regData.accessToken}` }
      })
      if (!emailVerifyRes.ok) throw new Error('Failed to send email verification')

      setSignUpStep(2)
    } catch (err: any) {
      setSignUpError(err.message)
    } finally {
      setIsSigningUp(false)
    }
  }

  const handleSignUpStep2 = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSigningUp(true)
    setSignUpError('')
    try {
      // Verify Email
      const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`
        },
        body: JSON.stringify({ code: emailOtp })
      })
      const verifyData = await verifyRes.json()
      if (!verifyRes.ok) throw new Error(verifyData.error === 'invalid_code' ? 'Invalid code' : 'Verification failed')

      // Send Mobile OTP
      const phoneVerifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-phone-verification`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`
        },
        body: JSON.stringify({ phone: signUpMobile })
      })
      if (!phoneVerifyRes.ok) throw new Error('Failed to send SMS verification')

      setSignUpStep(3)
    } catch (err: any) {
      setSignUpError(err.message)
    } finally {
      setIsSigningUp(false)
    }
  }

  const handleSignUpStep3 = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSigningUp(true)
    setSignUpError('')
    try {
      // Verify Mobile
      const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-phone`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`
        },
        body: JSON.stringify({ code: mobileOtp })
      })
      const verifyData = await verifyRes.json()
      if (!verifyRes.ok) throw new Error(verifyData.error === 'invalid_code' ? 'Invalid code' : 'Verification failed')

      setSignUpStep(4)
      setTimeout(() => {
        login(tempUser, tempToken)
        router.push('/')
      }, 1500)
    } catch (err: any) {
      setSignUpError(err.message)
    } finally {
      setIsSigningUp(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream-base)] flex flex-col items-center justify-center p-4">
      <Link href="/" className="text-display-md text-[var(--color-ink-900)] mb-[var(--space-5)]">
        BidCraft
      </Link>
      
      <div className="w-full max-w-[440px] bg-[var(--color-white)] rounded-[var(--radius-lg)] shadow-[var(--shadow-modal)] p-8">
        
        {/* Tabs - Only show on Sign In or Step 1 of Sign Up */}
        {(activeTab === 'signin' || (activeTab === 'signup' && signUpStep === 1)) && (
          <div className="flex bg-[var(--color-cream-raised)] rounded-[var(--radius-pill)] p-1 mb-8 relative">
            <button
              onClick={() => setActiveTab('signin')}
              className={cn(
                "flex-1 py-2 rounded-[var(--radius-pill)] text-body-md font-semibold transition-colors z-10",
                activeTab === 'signin' ? "text-[var(--color-ink-900)]" : "text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)]"
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
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

        {/* Forms */}
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
                {signInError && (
                  <div className="p-3 bg-[var(--color-urgent-100)] text-[var(--color-urgent-700)] text-body-md rounded-[var(--radius-sm)] border border-[var(--color-urgent-200)]">
                    {signInError}
                  </div>
                )}

                <div className="overflow-hidden">
                  <AnimatePresence mode="wait">
                    {signInMethod === 'email' ? (
                      <motion.div
                        key="email-input"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-1.5">Email Address</label>
                        <input
                          type="email"
                          required
                          value={signInEmail}
                          onChange={(e) => setSignInEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full h-[48px] bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] px-4 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setSignInMethod('mobile')}
                          className="mt-2 text-caption font-medium text-[var(--color-terracotta-600)] hover:underline block"
                        >
                          Sign in using Mobile Number
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="mobile-input"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-1.5">Mobile Number</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body-md text-[var(--color-ink-500)] select-none">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            value={signInMobile}
                            onChange={(e) => setSignInMobile(e.target.value)}
                            placeholder="Mobile number"
                            className="w-full h-[48px] bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] pl-[52px] pr-4 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setSignInMethod('email')}
                          className="mt-2 text-caption font-medium text-[var(--color-terracotta-600)] hover:underline block"
                        >
                          Sign in using Email Address
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
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
                  disabled={isSigningIn}
                  className="w-full h-[48px] bg-[var(--color-terracotta-600)] text-white text-body-lg font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors mt-2 flex items-center justify-center gap-2"
                >
                  {isSigningIn ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
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
                      {signUpError && (
                        <div className="p-3 bg-[var(--color-urgent-100)] text-[var(--color-urgent-700)] text-body-md rounded-[var(--radius-sm)] border border-[var(--color-urgent-200)]">
                          {signUpError}
                        </div>
                      )}

                      <input
                        type="text"
                        required
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full h-[48px] bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] px-4 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] outline-none"
                      />

                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body-md text-[var(--color-ink-500)] select-none">+91</span>
                        <input
                          type="tel"
                          required
                          value={signUpMobile}
                          onChange={(e) => setSignUpMobile(e.target.value)}
                          placeholder="Mobile number"
                          className="w-full h-[48px] bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] pl-[52px] pr-4 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] outline-none"
                        />
                      </div>

                      <input
                        type="email"
                        required
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="Email address"
                        className="w-full h-[48px] bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] px-4 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] outline-none"
                      />

                      <div className="relative">
                        <input
                          type={showSignUpPassword ? 'text' : 'password'}
                          required
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          placeholder="Password"
                          className="w-full h-[48px] bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] pl-4 pr-12 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)] transition-colors"
                        >
                          {showSignUpPassword ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={isSigningUp}
                        className="w-full h-[48px] bg-[var(--color-terracotta-600)] text-white text-body-lg font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors mt-2 flex items-center justify-center gap-2"
                      >
                        {isSigningUp ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'}
                      </button>

                      <p className="text-center text-caption text-[var(--color-ink-500)] mt-4">
                        By creating an account you agree to BidCraft's{' '}
                        <Link href="/terms" className="text-[var(--color-terracotta-600)] hover:underline">Terms</Link> and{' '}
                        <Link href="/privacy" className="text-[var(--color-terracotta-600)] hover:underline">Privacy Policy</Link>
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
                        <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-2">Verify Email</h2>
                        <p className="text-body-md text-[var(--color-ink-700)]">
                          We've sent a 6-digit code to <strong>{signUpEmail}</strong>
                        </p>
                      </div>

                      {signUpError && (
                        <div className="p-3 bg-[var(--color-urgent-100)] text-[var(--color-urgent-700)] text-body-md rounded-[var(--radius-sm)] border border-[var(--color-urgent-200)] text-center">
                          {signUpError}
                        </div>
                      )}

                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        className="w-full h-[56px] text-center tracking-[0.5em] text-heading-lg bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] focus:border-[var(--color-terracotta-600)] outline-none"
                      />

                      <button
                        type="submit"
                        disabled={isSigningUp || emailOtp.length !== 6}
                        className="w-full h-[48px] bg-[var(--color-terracotta-600)] text-white text-body-lg font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                      >
                        {isSigningUp ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Email'}
                      </button>
                    </motion.form>
                  )}

                  {/* Step 3: Mobile Verification */}
                  {signUpStep === 3 && (
                    <motion.form
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleSignUpStep3}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-2">Verify Mobile</h2>
                        <p className="text-body-md text-[var(--color-ink-700)]">
                          We've sent an SMS code to <strong>+91 {signUpMobile}</strong>
                        </p>
                      </div>

                      {signUpError && (
                        <div className="p-3 bg-[var(--color-urgent-100)] text-[var(--color-urgent-700)] text-body-md rounded-[var(--radius-sm)] border border-[var(--color-urgent-200)] text-center">
                          {signUpError}
                        </div>
                      )}

                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={mobileOtp}
                        onChange={(e) => setMobileOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        className="w-full h-[56px] text-center tracking-[0.5em] text-heading-lg bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] focus:border-[var(--color-terracotta-600)] outline-none"
                      />

                      <button
                        type="submit"
                        disabled={isSigningUp || mobileOtp.length !== 6}
                        className="w-full h-[48px] bg-[var(--color-terracotta-600)] text-white text-body-lg font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                      >
                        {isSigningUp ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Mobile & Finish'}
                      </button>
                    </motion.form>
                  )}

                  {/* Step 4: Success */}
                  {signUpStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                    >
                      <div className="w-16 h-16 bg-[var(--color-success-100)] rounded-full flex items-center justify-center mb-2">
                        <svg className="w-8 h-8 text-[var(--color-success-700)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 className="text-heading-lg text-[var(--color-ink-900)]">Account Verified!</h2>
                      <p className="text-body-md text-[var(--color-ink-700)]">Welcome to BidCraft, {signUpName}. Redirecting...</p>
                    </motion.div>
                  )}

                </AnimatePresence>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      <Link href="/" className="mt-[var(--space-6)] flex items-center justify-center gap-2 text-body-md text-[var(--color-ink-700)] hover:text-[var(--color-ink-900)] hover:bg-[var(--color-white)] px-4 py-2 rounded-[var(--radius-pill)] transition-all">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back to Home
      </Link>
    </div>
  )
}
