'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { updateProfile, checkUsername } from '@/lib/api'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import Link from 'next/link'

const INTERESTS_LIST = [
  'Vintage Clothing', 'Handmade Jewelry', 'Furniture', 'Art', 'Home Decor', 'Ceramics',
  'Books', 'Collectibles', 'Electronics', 'Sneakers', 'Streetwear', 'Watches'
]

function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }, [callback, delay])
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
  
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  
  // Interests Data
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  
  // Role Data
  const [marketplaceRole, setMarketplaceRole] = useState<'buyer' | 'seller' | 'both'>('buyer')

  // Redirection checks
  useEffect(() => {
    if (!user) {
      router.push('/auth')
    } else if (user.onboarding_completed) {
      router.push('/')
    }
  }, [user, router])

  // Debounced username check
  const checkUsernameAvailability = useDebounce(async (val: string) => {
    if (!val || val.length < 3) {
      setIsUsernameValid(null)
      setIsCheckingUsername(false)
      return
    }
    try {
      const res = await checkUsername(val)
      setIsUsernameValid(res.available)
    } catch (err) {
      setIsUsernameValid(false)
    } finally {
      setIsCheckingUsername(false)
    }
  }, 500)

  useEffect(() => {
    // Generate a default username if none exists
    if (user && !username) {
      const baseName = user.name.toLowerCase().replace(/[^a-z0-9]/g, '')
      setUsername(baseName + Math.floor(Math.random() * 1000))
    }
  }, [user])

  useEffect(() => {
    if (username.length >= 3) {
      setIsCheckingUsername(true)
      checkUsernameAvailability(username)
    } else {
      setIsUsernameValid(null)
    }
  }, [username, checkUsernameAvailability])

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
        bio,
        city,
        country,
        interests: selectedInterests,
        marketplace_role: marketplaceRole,
        onboarding_completed: true
      }, token)

      setAuth({ ...user, ...profile }, token)
      router.push('/')
    } catch (err: any) {
      setError(err.message)
      setIsSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[var(--color-cream-base)] flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-[600px] mb-6 flex justify-center">
        <Link href="/" className="text-display-md text-[var(--color-ink-900)] font-bold tracking-tight">
          BidCraft
        </Link>
      </div>

      <div className="w-full max-w-[600px] bg-[var(--color-white)] rounded-[var(--radius-lg)] shadow-[var(--shadow-modal)] p-8 overflow-hidden relative min-h-[500px] flex flex-col">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-cream-raised)]">
          <motion.div 
            className="h-full bg-[var(--color-terracotta-600)]"
            initial={{ width: `${((step - 1) / 4) * 100}%` }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {error && (
          <div className="mb-6 p-3 bg-[var(--color-urgent-100)] text-[var(--color-urgent-700)] text-body-md rounded-[var(--radius-sm)] border border-[var(--color-urgent-200)] flex items-start gap-2 mt-4">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
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
                className="flex-1 flex flex-col items-center justify-center text-center space-y-6 mt-8"
              >
                <div className="w-24 h-24 rounded-full bg-[var(--color-cream-raised)] flex items-center justify-center mb-4">
                  <span className="text-display-md text-[var(--color-terracotta-600)]">🎉</span>
                </div>
                <h1 className="text-heading-xl text-[var(--color-ink-900)]">Welcome to BidCraft, {user.name.split(' ')[0]}!</h1>
                <p className="text-body-lg text-[var(--color-ink-700)] max-w-md">
                  We're thrilled to have you here. Let's take a quick minute to set up your profile so you can get the most out of our marketplace.
                </p>
                <button
                  onClick={() => setStep(2)}
                  className="mt-8 h-[48px] px-8 bg-[var(--color-terracotta-600)] text-white text-body-lg font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors"
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
                className="flex-1 flex flex-col mt-4"
              >
                <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-2">Set up your profile</h2>
                <p className="text-body-md text-[var(--color-ink-700)] mb-8">This information will be displayed publicly to other users.</p>
                
                <div className="space-y-5 flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <Avatar size="large" name={user.name} identifier={user.id} />
                    <div className="text-body-sm text-[var(--color-ink-500)] max-w-[200px]">
                      Your avatar is automatically generated from your initials.
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
                        className="w-full h-[48px] bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] pl-10 pr-12 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {isCheckingUsername ? (
                          <Loader2 className="w-5 h-5 text-[var(--color-ink-400)] animate-spin" />
                        ) : isUsernameValid === true ? (
                          <CheckCircle2 className="w-5 h-5 text-[var(--color-success-600)]" />
                        ) : isUsernameValid === false ? (
                          <XCircle className="w-5 h-5 text-[var(--color-urgent-600)]" />
                        ) : null}
                      </div>
                    </div>
                    {isUsernameValid === false && (
                      <p className="text-caption text-[var(--color-urgent-600)] mt-1">Username is already taken or invalid.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-1.5">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us a bit about yourself..."
                      maxLength={160}
                      className="w-full h-[80px] p-4 bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none resize-none transition-all"
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-1.5">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Mumbai"
                        className="w-full h-[48px] bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] px-4 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-1.5">Country</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="India"
                        className="w-full h-[48px] bg-[var(--color-cream-base)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] px-4 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between items-center pt-6 border-t border-[var(--color-border-subtle)]">
                  <button onClick={() => setStep(1)} className="text-body-md font-medium text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)] transition-colors">Back</button>
                  <button 
                    onClick={() => setStep(3)} 
                    disabled={!username || isUsernameValid === false || isCheckingUsername}
                    className="h-[48px] px-8 bg-[var(--color-ink-900)] text-white text-body-md font-semibold rounded-[var(--radius-md)] hover:bg-black disabled:opacity-50 transition-colors"
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
                className="flex-1 flex flex-col mt-4"
              >
                <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-2">What are you interested in?</h2>
                <p className="text-body-md text-[var(--color-ink-700)] mb-8">Select a few categories to help us personalize your experience.</p>
                
                <div className="flex flex-wrap gap-3 flex-1">
                  {INTERESTS_LIST.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-full border transition-all ${
                        selectedInterests.includes(interest)
                          ? 'border-[var(--color-terracotta-600)] bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-700)]'
                          : 'border-[var(--color-border-subtle)] bg-[var(--color-white)] text-[var(--color-ink-700)] hover:border-[var(--color-ink-300)] hover:bg-[var(--color-cream-base)]'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex justify-between items-center pt-6 border-t border-[var(--color-border-subtle)]">
                  <button onClick={() => setStep(2)} className="text-body-md font-medium text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)] transition-colors">Back</button>
                  <button 
                    onClick={() => setStep(4)} 
                    className="h-[48px] px-8 bg-[var(--color-ink-900)] text-white text-body-md font-semibold rounded-[var(--radius-md)] hover:bg-black transition-colors flex items-center gap-2"
                  >
                    Continue
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
                className="flex-1 flex flex-col mt-4"
              >
                <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-2">How do you plan to use BidCraft?</h2>
                <p className="text-body-md text-[var(--color-ink-700)] mb-8">You can always change this later in your account settings.</p>
                
                <div className="space-y-4 flex-1">
                  {[
                    { id: 'buyer', title: 'I want to discover and buy', desc: 'Find unique items and participate in auctions' },
                    { id: 'seller', title: 'I want to sell my creations', desc: 'List items, manage inventory and reach buyers' },
                    { id: 'both', title: 'I want to do both', desc: 'Buy, sell, and participate in the community' }
                  ].map(option => (
                    <div 
                      key={option.id}
                      onClick={() => setMarketplaceRole(option.id as any)}
                      className={`p-5 rounded-[var(--radius-md)] border-2 cursor-pointer transition-all ${
                        marketplaceRole === option.id 
                          ? 'border-[var(--color-terracotta-600)] bg-[var(--color-terracotta-50)] shadow-sm' 
                          : 'border-[var(--color-border-subtle)] hover:border-[var(--color-ink-300)]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          marketplaceRole === option.id ? 'border-[var(--color-terracotta-600)]' : 'border-[var(--color-border-subtle)]'
                        }`}>
                          {marketplaceRole === option.id && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-terracotta-600)]" />}
                        </div>
                        <div>
                          <h3 className={`font-semibold text-body-lg ${marketplaceRole === option.id ? 'text-[var(--color-terracotta-900)]' : 'text-[var(--color-ink-900)]'}`}>
                            {option.title}
                          </h3>
                          <p className={`text-body-sm mt-1 ${marketplaceRole === option.id ? 'text-[var(--color-terracotta-700)]' : 'text-[var(--color-ink-500)]'}`}>
                            {option.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-between items-center pt-6 border-t border-[var(--color-border-subtle)]">
                  <button onClick={() => setStep(3)} className="text-body-md font-medium text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)] transition-colors">Back</button>
                  <button 
                    onClick={handleFinish}
                    disabled={isSubmitting}
                    className="h-[48px] px-8 bg-[var(--color-terracotta-600)] text-white text-body-md font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Setup'}
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
