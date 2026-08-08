'use client'
import { authenticatedFetch } from '@/lib/api'
import React, { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react'

export default function SecuritySettingsPage() {
  const { token } = useAuthStore()
  
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
      const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/password`, {
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
    </div>
  )
}
