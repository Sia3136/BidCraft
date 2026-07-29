'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { useCategories } from '@/hooks/useCategories'
import { FieldError } from '@/components/ui/field-error'
import { updateProfile } from '@/lib/api'

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

export default function ProfileSettingsPage() {
  const { user, token, setAuth } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Form State
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [phone, setPhone] = useState('')
  
  const { categories } = useCategories()
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [marketplaceRole, setMarketplaceRole] = useState<'buyer' | 'seller' | 'both'>('buyer')
  
  // Username validation
  const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameConflict, setUsernameConflict] = useState('')
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setUsername(user.username || '')
      setCity(user.city || '')
      setState(user.state || '')
      setPhone(user.phone || '')
      setSelectedInterests(user.interests || [])
      setMarketplaceRole(user.marketplace_role || 'buyer')
    }
  }, [user])

  const checkAvailability = useDebounce(async (val: string) => {
    if (!val || val.length < 3 || val === user?.username) {
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
    if (username !== user?.username && username.length >= 3) {
      setIsCheckingUsername(true)
      setIsUsernameValid(null)
      checkAvailability(username)
    } else if (username !== user?.username && username.length > 0 && username.length < 3) {
      setIsUsernameValid(false)
      setUsernameConflict('Must be at least 3 characters.')
    } else {
      setIsUsernameValid(null)
      setUsernameConflict('')
    }
  }, [username, checkAvailability, user?.username])

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !user) return
    if (isUsernameValid === false) return

    setIsSubmitting(true)
    setMessage(null)
    try {
      const { profile } = await updateProfile({
        name,
        username: username !== user.username ? username : undefined,
        city,
        state,
        phone,
        interests: selectedInterests,
        marketplace_role: marketplaceRole
      }, token)
      
      setAuth({ ...user, ...profile }, token)
      setMessage({ type: 'success', text: 'Profile updated successfully.' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err: any) {
      if (err.status === 409 && err.code === 'USERNAME_TAKEN') {
        setMessage({ type: 'error', text: `Username became unavailable. Suggested: ${err.suggestion}` })
        setUsername(err.suggestion)
        setIsUsernameValid(true)
      } else {
        setMessage({ type: 'error', text: err.message || 'Failed to update profile.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-4xl">
      <h1 className="text-display-sm text-[var(--color-ink-900)] mb-8">Profile</h1>

      <div className="mb-10">
        <p className="text-caption font-semibold tracking-wider text-[var(--color-ink-500)] uppercase mb-1">Public Identity</p>
        <h2 className="text-heading-lg font-semibold text-[var(--color-ink-900)] mb-1">Profile Settings</h2>
        <p className="text-body-md text-[var(--color-ink-500)] mb-8">Manage your public information and how others see you on BidCraft.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
            
            {message && message.type === 'success' && (
              <div className="p-4 rounded-sm text-body-md flex items-center gap-2 bg-[var(--color-success-50)] text-[var(--color-success-700)] border border-[var(--color-success-200)] mb-4">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                {message.text}
              </div>
            )}

            <div className="flex items-center gap-6 pb-6 border-b border-[var(--color-border-subtle)]">
              <div className="ring-2 ring-offset-2 ring-[var(--color-terracotta-600)] rounded-full">
                <Avatar size="large" name={name || user.name} identifier={user.id} />
              </div>
              <div>
                <h3 className="text-body-lg font-medium text-[var(--color-ink-900)]">Avatar</h3>
                <p className="text-body-sm text-[var(--color-ink-500)] mt-1 max-w-sm">
                  Your avatar is automatically generated from your initials and name. It appears everywhere you interact.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-body-md font-medium text-[var(--color-ink-900)]">Full Name <span className="text-[var(--color-urgent-600)]">*</span></label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="John Doe" 
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-body-md font-medium text-[var(--color-ink-900)]">Username <span className="text-[var(--color-urgent-600)]">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-500)] select-none">@</span>
                  <Input 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))} 
                    className="pl-8 pr-10"
                    placeholder="username"
                    maxLength={20}
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isCheckingUsername ? (
                      <Loader2 className="w-4 h-4 text-[var(--color-terracotta-600)] animate-spin" />
                    ) : isUsernameValid === true ? (
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-success-600)]" />
                    ) : isUsernameValid === false ? (
                      <XCircle className="w-4 h-4 text-[var(--color-urgent-600)]" />
                    ) : null}
                  </div>
                </div>
                {isUsernameValid === false && <FieldError message={usernameConflict} />}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-body-md font-medium text-[var(--color-ink-900)]">City <span className="text-[var(--color-ink-400)] font-normal ml-1">(Optional)</span></label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai" />
              </div>
              <div className="space-y-2">
                <label className="text-body-md font-medium text-[var(--color-ink-900)]">State <span className="text-[var(--color-ink-400)] font-normal ml-1">(Optional)</span></label>
                <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="Maharashtra" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-body-md font-medium text-[var(--color-ink-900)]">Contact Phone <span className="text-[var(--color-ink-400)] font-normal ml-1">(Optional)</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-500)] select-none">+91</span>
                <Input 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="Mobile number" 
                  className="pl-[42px] max-w-[240px]"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-[var(--color-border-subtle)]">
              <h3 className="text-body-lg font-medium text-[var(--color-ink-900)] mb-2">Marketplace Role</h3>
              <p className="text-body-sm text-[var(--color-ink-500)] mb-4">How do you primarily use BidCraft?</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'buyer', label: 'Buyer' },
                  { id: 'seller', label: 'Seller' },
                  { id: 'both', label: 'Both' }
                ].map(role => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setMarketplaceRole(role.id as any)}
                    className={`h-[48px] rounded-sm border-2 font-medium transition-all ${
                      marketplaceRole === role.id 
                        ? 'border-[var(--color-terracotta-600)] bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-900)]' 
                        : 'border-[var(--color-border-subtle)] bg-[var(--color-white)] text-[var(--color-ink-700)] hover:border-[var(--color-ink-300)]'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[var(--color-border-subtle)]">
              <h3 className="text-body-lg font-medium text-[var(--color-ink-900)] mb-2">Interests</h3>
              <p className="text-body-sm text-[var(--color-ink-500)] mb-4">Update your interests to improve recommendations.</p>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleInterest(cat.name)}
                    className={`px-3 py-1.5 rounded-full border text-body-sm transition-all ${
                      selectedInterests.includes(cat.name)
                        ? 'border-[var(--color-terracotta-600)] bg-[var(--color-terracotta-600)] text-white'
                        : 'border-[var(--color-border-subtle)] bg-[var(--color-white)] text-[var(--color-ink-700)] hover:border-[var(--color-ink-300)] hover:bg-[var(--color-cream-base)]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[var(--color-border-subtle)] flex justify-end gap-4 items-center">
              {message && message.type === 'error' && <FieldError message={message.text} />}
              <Button type="submit" size="lg" disabled={isSubmitting || isUsernameValid === false || isCheckingUsername} className="min-w-[120px]">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
              </Button>
            </div>
          </form>
      </div>
    </div>
  )
}
