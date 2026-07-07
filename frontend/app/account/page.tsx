'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { User as UserIcon, CheckCircle2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function AccountPage() {
  const { isAuthenticated, token, user, setAuth } = useAuthStore()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const [isEditingName, setIsEditingName] = useState(false)
  const [editName, setEditName] = useState('')
  const [isChangingPass, setIsChangingPass] = useState(false)
  
  const [passForm, setPassForm] = useState({ current: '', new: '', confirm: '' })
  const [passMsg, setPassMsg] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth?returnTo=/account')
      return
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setProfile(data.user)
          setEditName(data.user.name || '')
        }
      } catch (e) {
        console.error('Failed to fetch profile:', e)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [isAuthenticated, token, router])

  const handleSaveName = async () => {
    if (editName.trim().length < 2) return;
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: editName })
      })
      if (res.ok) {
        const data = await res.json()
        setProfile({ ...profile, name: data.name })
        setAuth({ ...user, name: data.name } as any, token!)
        setIsEditingName(false)
      }
    } catch (e) {
      console.error(e)
    }
  }
  
  const handlePassChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passForm.new !== passForm.confirm) {
      setPassMsg('Passwords do not match')
      return
    }
    try {
      const res = await fetch(`${API_BASE}/api/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword: passForm.current, newPassword: passForm.new })
      })
      if (res.ok) {
        setPassMsg('Password updated successfully!')
        setPassForm({ current: '', new: '', confirm: '' })
        setTimeout(() => setIsChangingPass(false), 2000)
      } else {
        const err = await res.json()
        setPassMsg(err.error || 'Failed to update password')
      }
    } catch (e) {
      setPassMsg('Error changing password')
    }
  }

  if (loading) return <div className="p-8 text-center text-body-md">Loading...</div>
  if (!profile) return null

  return (
    <div className="w-full max-w-[600px] mx-auto px-4 py-8 mt-[80px]">
      <h1 className="text-heading-lg font-display text-[var(--color-ink-900)] mb-8 flex items-center gap-3">
        <UserIcon className="w-7 h-7 text-[var(--color-terracotta-600)]" /> Account Info
      </h1>

      <div className="bg-[var(--color-white)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] p-6 flex flex-col gap-6 shadow-[var(--shadow-card)]">
        
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label className="text-caption font-bold text-[var(--color-ink-500)] uppercase tracking-wider">Name</label>
          {isEditingName ? (
            <div className="flex gap-2">
              <input 
                type="text" 
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="flex-1 border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] px-3 py-2 text-body-md focus:border-[var(--color-terracotta-600)] outline-none"
              />
              <button onClick={handleSaveName} className="bg-[var(--color-ink-900)] text-white px-4 py-2 rounded-[var(--radius-sm)] text-body-md font-medium">Save</button>
              <button onClick={() => { setIsEditingName(false); setEditName(profile.name) }} className="bg-[var(--color-cream-deep)] text-[var(--color-ink-700)] px-4 py-2 rounded-[var(--radius-sm)] text-body-md font-medium">Cancel</button>
            </div>
          ) : (
            <div className="flex justify-between items-center bg-[var(--color-cream-base)] p-3 rounded-[var(--radius-sm)]">
              <span className="text-body-lg text-[var(--color-ink-900)] font-medium">{profile.name}</span>
              <button onClick={() => setIsEditingName(true)} className="text-body-sm font-medium text-[var(--color-terracotta-600)] hover:underline">Edit</button>
            </div>
          )}
        </div>

        <div className="h-px bg-[var(--color-border-subtle)] w-full" />

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-caption font-bold text-[var(--color-ink-500)] uppercase tracking-wider">Email Address</label>
          <div className="flex justify-between items-center bg-[var(--color-cream-base)] p-3 rounded-[var(--radius-sm)]">
            <span className="text-body-lg text-[var(--color-ink-900)]">{profile.email}</span>
            <div className="flex items-center gap-1 text-[var(--color-success-600)] text-caption font-bold">
              <CheckCircle2 className="w-4 h-4" /> Verified
            </div>
          </div>
        </div>

        <div className="h-px bg-[var(--color-border-subtle)] w-full" />

        {/* Password */}
        <div className="flex flex-col gap-4">
          <label className="text-caption font-bold text-[var(--color-ink-500)] uppercase tracking-wider">Security</label>
          
          {!isChangingPass ? (
            <button 
              onClick={() => setIsChangingPass(true)}
              className="w-full text-left bg-[var(--color-cream-base)] p-3 rounded-[var(--radius-sm)] text-body-md font-medium text-[var(--color-ink-700)] hover:bg-[var(--color-cream-deep)] transition-colors"
            >
              Change Password
            </button>
          ) : (
            <form onSubmit={handlePassChange} className="bg-[var(--color-cream-base)] p-4 rounded-[var(--radius-md)] flex flex-col gap-3">
              <input type="password" placeholder="Current Password" required value={passForm.current} onChange={e => setPassForm({...passForm, current: e.target.value})} className="border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] px-3 py-2 text-body-md w-full outline-none" />
              <input type="password" placeholder="New Password" required value={passForm.new} onChange={e => setPassForm({...passForm, new: e.target.value})} className="border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] px-3 py-2 text-body-md w-full outline-none" />
              <input type="password" placeholder="Confirm New Password" required value={passForm.confirm} onChange={e => setPassForm({...passForm, confirm: e.target.value})} className="border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] px-3 py-2 text-body-md w-full outline-none" />
              {passMsg && <p className={`text-caption ${passMsg.includes('success') ? 'text-[var(--color-success-600)]' : 'text-[var(--color-urgent-600)]'}`}>{passMsg}</p>}
              <div className="flex gap-2 mt-1">
                <button type="submit" className="flex-1 bg-[var(--color-ink-900)] text-white py-2 rounded-[var(--radius-sm)] text-body-md font-medium">Update</button>
                <button type="button" onClick={() => setIsChangingPass(false)} className="flex-1 bg-[var(--color-cream-deep)] text-[var(--color-ink-700)] py-2 rounded-[var(--radius-sm)] text-body-md font-medium">Cancel</button>
              </div>
            </form>
          )}
        </div>

        <div className="h-px bg-[var(--color-border-subtle)] w-full" />

        {/* Member Since */}
        <div className="text-center pt-2">
          <p className="text-caption text-[var(--color-ink-500)]">
            Member since {new Date(profile.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

      </div>
    </div>
  )
}
