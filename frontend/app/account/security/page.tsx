'use client'

import React, { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react'

export default function SecuritySettingsPage() {
  const { token, user } = useAuthStore()
  
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      })

      if (res.ok) {
        setMessage({ type: 'success', text: 'Password updated successfully.' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => setMessage(null), 3000)
      } else {
        const err = await res.json()
        throw new Error(err.error || 'Failed to update password.')
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  // If user signed up with Google and doesn't have a password set, they might not be able to change it
  // We check if they have google_account linked, but for now we assume they can change it if they want
  // Or we just show the form.

  return (
    <div className="max-w-4xl space-y-8">
      <h1 className="text-display-sm text-[var(--color-ink-900)] flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-[var(--color-terracotta-600)]" /> Change Password
      </h1>

      <div className="mb-10 mt-8">
        <p className="text-caption font-semibold tracking-wider text-[var(--color-ink-500)] uppercase mb-1">Security</p>
        <h2 className="text-heading-lg font-semibold text-[var(--color-ink-900)] mb-1">Update Password</h2>
        <p className="text-body-md text-[var(--color-ink-500)] mb-8">Update your password to keep your account secure.</p>
        
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

            <div className="space-y-2 max-w-sm">
              <label className="text-body-md font-medium text-[var(--color-ink-900)]">Current Password</label>
              <Input 
                type="password"
                required
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                placeholder="Enter current password" 
              />
            </div>

            <div className="space-y-2 max-w-sm">
              <label className="text-body-md font-medium text-[var(--color-ink-900)]">New Password</label>
              <Input 
                type="password"
                required
                minLength={6}
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="Min. 6 characters" 
              />
            </div>

            <div className="space-y-2 max-w-sm">
              <label className="text-body-md font-medium text-[var(--color-ink-900)]">Confirm New Password</label>
              <Input 
                type="password"
                required
                minLength={6}
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Confirm new password" 
              />
            </div>

            <div className="pt-6 border-t border-[var(--color-border-subtle)] flex justify-end">
              <Button type="submit" size="lg" disabled={isSubmitting} className="min-w-[120px]">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
              </Button>
            </div>

          </form>
      </div>
      
      {user?.google_account && (
        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 bg-[var(--color-cream-base)] rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] max-w-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <div>
                <p className="text-body-md font-medium text-[var(--color-ink-900)]">Google</p>
                <p className="text-body-sm text-[var(--color-ink-500)]">Connected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  )
}
