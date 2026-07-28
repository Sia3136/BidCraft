'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { updateProfile, checkUsername } from '@/lib/api'
import { Avatar } from '@/components/ui/avatar'

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

export default function ProfileSettingsPage() {
  const { user, token, setAuth } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Form State
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [phone, setPhone] = useState('')
  
  // Username validation
  const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setUsername(user.username || '')
      setBio(user.bio || '')
      setCity(user.city || '')
      setCountry(user.country || '')
      setPhone(user.phone || '')
    }
  }, [user])

  const checkUsernameAvailability = useDebounce(async (val: string) => {
    if (!val || val.length < 3 || val === user?.username) {
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
    if (username !== user?.username && username.length >= 3) {
      setIsCheckingUsername(true)
      checkUsernameAvailability(username)
    } else {
      setIsUsernameValid(null)
    }
  }, [username, checkUsernameAvailability, user?.username])

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
        bio,
        city,
        country,
        phone
      }, token)
      
      setAuth({ ...user, ...profile }, token)
      setMessage({ type: 'success', text: 'Profile updated successfully.' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-2xl">
      <h1 className="text-display-sm text-[var(--color-ink-900)] mb-8">Profile Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Public Profile</CardTitle>
          <CardDescription>Manage your public information and how others see you on BidCraft.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {message && (
              <div className={`p-4 rounded-[var(--radius-md)] text-body-md flex items-center gap-2 ${
                message.type === 'success' 
                  ? 'bg-[var(--color-success-50)] text-[var(--color-success-700)] border border-[var(--color-success-200)]' 
                  : 'bg-[var(--color-urgent-50)] text-[var(--color-urgent-700)] border border-[var(--color-urgent-200)]'
              }`}>
                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
                {message.text}
              </div>
            )}

            <div className="flex items-center gap-6 pb-6 border-b border-[var(--color-border-subtle)]">
              <Avatar size="large" name={name || user.name} identifier={user.id} />
              <div>
                <h3 className="text-body-lg font-medium text-[var(--color-ink-900)]">Avatar</h3>
                <p className="text-body-sm text-[var(--color-ink-500)] mt-1">
                  Your avatar is automatically generated from your initials and name.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-body-md font-medium text-[var(--color-ink-900)]">Full Name</label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="John Doe" 
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-body-md font-medium text-[var(--color-ink-900)]">Username</label>
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
                      <Loader2 className="w-4 h-4 text-[var(--color-ink-400)] animate-spin" />
                    ) : isUsernameValid === true ? (
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-success-600)]" />
                    ) : isUsernameValid === false ? (
                      <XCircle className="w-4 h-4 text-[var(--color-urgent-600)]" />
                    ) : null}
                  </div>
                </div>
                {isUsernameValid === false && (
                  <p className="text-caption text-[var(--color-urgent-600)]">Username is already taken or invalid.</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-body-md font-medium text-[var(--color-ink-900)]">Bio</label>
              <Textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                placeholder="Tell us a bit about yourself..."
                maxLength={160}
                className="h-24 resize-none"
              />
              <p className="text-caption text-[var(--color-ink-500)] text-right">{bio.length}/160</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-body-md font-medium text-[var(--color-ink-900)]">City</label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai" />
              </div>
              <div className="space-y-2">
                <label className="text-body-md font-medium text-[var(--color-ink-900)]">Country</label>
                <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="India" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-body-md font-medium text-[var(--color-ink-900)]">Contact Phone (Optional)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-500)] select-none">+91</span>
                <Input 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="Mobile number" 
                  className="pl-[42px]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[var(--color-border-subtle)]">
              <Button type="submit" disabled={isSubmitting || isUsernameValid === false || isCheckingUsername}>
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Save Changes
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
