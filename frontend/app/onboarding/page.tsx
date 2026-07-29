'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { updateProfile, checkUsername, suggestUsername } from '@/lib/api'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import Link from 'next/link'
import Image from 'next/image'

interface Category {
  id: number;
  name: string;
  slug: string;
}

function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef(callback)
  
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args)
    }, delay)
  }, [delay])
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user, token, setAuth } = useAuthStore()
  
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Profile Data
  const [username, setUsername] = useState('')
  const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameConflict, setUsernameConflict] = useState('')
  
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  
  // Interests Data
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.categories) setCategories(data.categories)
      })
      .catch(err => console.error('Failed to fetch categories:', err))
  }, [])
  
  // Role Data
  const [marketplaceRole, setMarketplaceRole] = useState<'buyer' | 'seller' | 'both'>('buyer')
  
  const abortControllerRef = useRef<AbortController | null>(null)

  // Redirect if not logged in or already onboarded
  useEffect(() => {
    if (!user) {
      router.push('/auth')
    } else if (user.onboarding_completed) {
      router.push('/')
    } else {
      // Step Persistence
      const savedStep = localStorage.getItem('onboarding_step')
      if (savedStep) setStep(parseInt(savedStep, 10))
    }
  }, [user, router])

  // Save step to local storage
  useEffect(() => {
    localStorage.setItem('onboarding_step', step.toString())
  }, [step])

  // Auto-suggest username on mount if empty
  useEffect(() => {
    if (user && !username && step === 2) {
      const fetchSuggestion = async () => {
        try {
          const res = await suggestUsername(user.name)
          if (res.available) {
            setUsername(res.suggestion)
            setIsUsernameValid(true)
          }
        } catch (err) {
          // If suggestion fails, do not block. Leave empty.
          console.warn('Suggestion failed', err)
        }
      }
      fetchSuggestion()
    }
  }, [user, step, username])

  const checkAvailability = useDebounce(async (val: string) => {
    if (!val || val.length < 3) {
      setIsUsernameValid(null)
      setIsCheckingUsername(false)
      return
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    try {
      const res = await checkUsername(val, abortControllerRef.current.signal)
      setIsUsernameValid(res.available)
      if (!res.available) setUsernameConflict('Username is already taken.')
      else setUsernameConflict('')
    } catch (err: any) {
      if (err.name === 'AbortError') return
      setIsUsernameValid(false)
    } finally {
      setIsCheckingUsername(false)
    }
  }, 500)

  useEffect(() => {
    if (username.length >= 3) {
      setIsCheckingUsername(true)
      setIsUsernameValid(null)
      checkAvailability(username)
    } else if (username.length > 0) {
      setIsUsernameValid(false)
      setUsernameConflict('Must be at least 3 characters.')
    } else {
      setIsUsernameValid(null)
      setUsernameConflict('')
    }
  }, [username, checkAvailability])

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const handleFinish = async () => {
    if (!token || !user) return
    setIsSubmitting(true)
    setError('')
    try {
      const { profile } = await updateProfile({
        username,
        city,
        state,
        interests: selectedInterests,
        marketplace_role: marketplaceRole,
        onboarding_completed: true
      }, token)

      setAuth({ ...user, ...profile }, token)
      localStorage.removeItem('onboarding_step')
      router.push('/')
    } catch (err: any) {
      if (err.status === 409 && err.code === 'USERNAME_TAKEN') {
        // Race condition handled
        setError(`Username became unavailable. Suggested: ${err.suggestion}`)
        setUsername(err.suggestion)
        setIsUsernameValid(true)
        setStep(2) // Jump back to profile step
      } else {
        setError(err.message)
      }
      setIsSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[var(--color-cream-base)] flex flex-col items-center justify-center p-4 py-8 sm:py-12 relative overflow-hidden">
      
      {/* Background imagery depending on step */}
      <AnimatePresence>
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-cream-base)] via-[var(--color-cream-base)]/80 to-[var(--color-cream-100)]/40 z-10 backdrop-blur-[4px]" />
            <Image 
              src="https://res.cloudinary.com/duzlsyzwa/image/upload/v1785344944/bidcraft/auth/pottery_artwork.webp" 
              alt="Welcome" 
              fill 
              className="object-cover opacity-30" 
            />
          </motion.div>
        )}
        {step === 4 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-[var(--color-cream-base)]/80 z-10 backdrop-blur-[8px]" />
            <Image 
              src="https://res.cloudinary.com/duzlsyzwa/image/upload/v1785344944/bidcraft/auth/minimal_dog.jpg" 
              alt="Ready" 
              fill 
              className="object-cover opacity-25" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-[600px] mb-6 flex justify-center relative z-20">
        <Link href="/" className="text-display-md text-[var(--color-ink-900)] font-bold tracking-tight">
          BidCraft
        </Link>
      </div>

      <div className="w-full max-w-[600px] bg-[var(--color-white)]/95 backdrop-blur-[12px] rounded-[var(--radius-lg)] shadow-[var(--shadow-modal)] p-8 overflow-hidden relative min-h-[550px] flex flex-col z-20">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-cream-raised)]">
          <motion.div 
            className="h-full bg-[var(--color-terracotta-600)]"
            initial={{ width: `${((step - 1) / 4) * 100}%` }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="text-caption font-bold tracking-wider text-[var(--color-ink-500)] uppercase mb-6 flex items-center justify-between">
          <span>Step {step} of 4</span>
          {step > 1 && step < 4 && (
             <span className="text-[var(--color-ink-400)]">{step === 2 ? 'Required' : 'Optional'}</span>
          )}
        </div>

        {error && (
          <div className="mb-6 p-3 bg-[var(--color-urgent-50)] text-[var(--color-urgent-700)] text-body-md rounded-[var(--radius-sm)] border border-[var(--color-urgent-200)] flex items-start gap-2">
            <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <div className="flex-1 relative flex flex-col">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: WELCOME */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="w-24 h-24 rounded-full bg-[var(--color-cream-raised)] flex items-center justify-center mb-2">
                  <span className="text-display-lg drop-shadow-sm">👋</span>
                </div>
                <h1 className="text-display-sm text-[var(--color-ink-900)] font-serif mt-2">Welcome to BidCraft, {user.name.split(' ')[0]}!</h1>
                <p className="text-body-lg text-[var(--color-ink-700)] max-w-md">
                  We're thrilled to have you here. Let's set up your identity and preferences to personalize your experience.
                </p>
                <button
                  onClick={() => setStep(2)}
                  className="mt-8 h-[48px] px-8 bg-[var(--color-terracotta-600)] text-white text-body-lg font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors shadow-sm"
                >
                  Let's Go
                </button>
              </motion.div>
            )}

            {/* STEP 2: PROFILE INFO */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-2">Your Profile</h2>
                <p className="text-body-md text-[var(--color-ink-700)] mb-8">This information represents you on the marketplace.</p>
                
                <div className="space-y-6 flex-1">
                  <div className="flex items-center gap-4 p-4 bg-[var(--color-cream-base)] rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]">
                    <Avatar size="large" name={user.name} identifier={user.id} />
                    <div className="text-body-sm text-[var(--color-ink-700)]">
                      <p className="font-semibold text-body-md text-[var(--color-ink-900)]">{user.name}</p>
                      Your avatar is automatically generated from your initials and used everywhere on BidCraft.
                    </div>
                  </div>

                  <div>
                    <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-1.5">Username <span className="text-[var(--color-urgent-600)]">*</span></label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body-md text-[var(--color-ink-500)] select-none">@</span>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                        placeholder="username"
                        maxLength={20}
                        className="w-full h-[48px] bg-[var(--color-white)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] pl-10 pr-12 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                        {isCheckingUsername ? (
                          <Loader2 className="w-5 h-5 text-[var(--color-terracotta-600)] animate-spin" />
                        ) : isUsernameValid === true ? (
                          <CheckCircle2 className="w-5 h-5 text-[var(--color-success-600)]" />
                        ) : isUsernameValid === false ? (
                          <XCircle className="w-5 h-5 text-[var(--color-urgent-600)]" />
                        ) : null}
                      </div>
                    </div>
                    {isUsernameValid === false && (
                      <p className="text-caption text-[var(--color-urgent-600)] mt-1">{usernameConflict}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-1.5">City <span className="text-[var(--color-ink-400)] font-normal ml-1">(Optional)</span></label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Mumbai"
                        className="w-full h-[48px] bg-[var(--color-white)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] px-4 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-1.5">State <span className="text-[var(--color-ink-400)] font-normal ml-1">(Optional)</span></label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Maharashtra"
                        className="w-full h-[48px] bg-[var(--color-white)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] px-4 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between items-center pt-6 border-t border-[var(--color-border-subtle)]">
                  <button onClick={() => setStep(1)} className="text-body-md font-medium text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)] transition-colors">Back</button>
                  <button 
                    onClick={() => setStep(3)} 
                    disabled={!username || isUsernameValid === false || isCheckingUsername}
                    className="h-[48px] px-8 bg-[var(--color-ink-900)] text-white text-body-md font-semibold rounded-[var(--radius-md)] hover:bg-black disabled:opacity-50 transition-colors shadow-sm"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: INTERESTS */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-display-xs text-[var(--color-ink-900)] font-serif">Your Interests</h2>
                </div>
                <p className="text-body-md text-[var(--color-ink-700)] mb-8">Select a few categories to help us personalize your feed.</p>
                
                <div className="flex flex-wrap gap-3 flex-1 content-start">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => toggleInterest(cat.name)}
                      className={`px-4 py-2.5 rounded-full border-2 transition-all text-body-md font-medium ${
                        selectedInterests.includes(interest)
                          ? 'border-[var(--color-terracotta-600)] bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-800)] shadow-sm'
                          : 'border-[var(--color-border-subtle)] bg-[var(--color-white)] text-[var(--color-ink-700)] hover:border-[var(--color-ink-300)] hover:bg-[var(--color-cream-base)]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex flex-col items-center pt-6 border-t border-[var(--color-border-subtle)] space-y-4">
                  <div className="w-full flex justify-between items-center">
                    <button onClick={() => setStep(2)} className="text-body-md font-medium text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)] transition-colors">Back</button>
                    <button 
                      onClick={() => setStep(4)} 
                      className="h-[48px] px-8 bg-[var(--color-ink-900)] text-white text-body-md font-semibold rounded-[var(--radius-md)] hover:bg-black transition-colors shadow-sm"
                    >
                      Continue
                    </button>
                  </div>
                  <button onClick={() => setStep(4)} className="text-body-sm font-medium text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)] hover:underline">
                    Skip for now
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: INTENT & FINISH */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-display-xs text-[var(--color-ink-900)] font-serif">How will you use BidCraft?</h2>
                </div>
                <p className="text-body-md text-[var(--color-ink-700)] mb-8">You can always change this later if you decide to sell.</p>
                
                <div className="space-y-4 flex-1">
                  {[
                    { id: 'buyer', title: 'I want to discover and buy', desc: 'Find unique items, participate in auctions, build collections.' },
                    { id: 'seller', title: 'I want to sell my creations', desc: 'List your work, manage inventory and reach buyers globally.' },
                    { id: 'both', title: 'I want to do both', desc: 'Experience everything the marketplace has to offer.' }
                  ].map(option => (
                    <div 
                      key={option.id}
                      onClick={() => setMarketplaceRole(option.id as any)}
                      className={`p-5 rounded-[var(--radius-md)] border-2 cursor-pointer transition-all ${
                        marketplaceRole === option.id 
                          ? 'border-[var(--color-terracotta-600)] bg-[var(--color-terracotta-50)] shadow-sm' 
                          : 'border-[var(--color-border-subtle)] bg-[var(--color-white)] hover:border-[var(--color-ink-300)]'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          marketplaceRole === option.id ? 'border-[var(--color-terracotta-600)]' : 'border-[var(--color-ink-300)]'
                        }`}>
                          {marketplaceRole === option.id && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-terracotta-600)]" />}
                        </div>
                        <div>
                          <h3 className={`font-semibold text-body-lg ${marketplaceRole === option.id ? 'text-[var(--color-terracotta-900)]' : 'text-[var(--color-ink-900)]'}`}>
                            {option.title}
                          </h3>
                          <p className={`text-body-sm mt-1 ${marketplaceRole === option.id ? 'text-[var(--color-terracotta-800)]' : 'text-[var(--color-ink-500)]'}`}>
                            {option.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col items-center pt-6 border-t border-[var(--color-border-subtle)] space-y-4">
                  <div className="w-full flex justify-between items-center">
                    <button onClick={() => setStep(3)} className="text-body-md font-medium text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)] transition-colors">Back</button>
                    <button 
                      onClick={handleFinish}
                      disabled={isSubmitting}
                      className="h-[48px] px-8 bg-[var(--color-terracotta-600)] text-white text-body-md font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors flex items-center justify-center gap-2 shadow-sm min-w-[140px]"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Finish'}
                    </button>
                  </div>
                  <button onClick={handleFinish} disabled={isSubmitting} className="text-body-sm font-medium text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)] hover:underline">
                    Skip for now
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
