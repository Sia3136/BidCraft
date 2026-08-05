'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import useSWR from 'swr'
import Link from 'next/link'

const fetcher = (url: string) => 
  fetch(url, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
  }).then(r => r.json())

export function NotificationBell() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data, mutate } = useSWR(
    user ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/notifications` : null,
    fetcher,
    { refreshInterval: 30000 }
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAsRead = async (id: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      mutate()
    } catch (err) {

    }
  }

  const markAllRead = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/notifications/read-all`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      mutate()
    } catch (err) {

    }
  }

  if (!user) return null

  const notifications = data?.notifications || []
  const unreadCount = data?.unreadCount || 0

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative px-3 py-2 text-[var(--color-ink-700)] hover:text-[var(--color-ink-900)] transition-colors outline-none"
      >
        <span className="text-xl">🛎️</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-2 w-4 h-4 flex items-center justify-center bg-[var(--color-urgent-500)] text-white text-[10px] font-bold rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] shadow-md z-50 overflow-hidden">
          <div className="p-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-cream-base)] flex justify-between items-center">
            <h3 className="font-semibold text-sm text-[var(--color-ink-900)]">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead} 
                className="text-xs text-[var(--color-terracotta-600)] hover:underline font-medium"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-[var(--color-ink-400)]">No notifications.</div>
            ) : (
              <div className="divide-y divide-[var(--color-border-subtle)]">
                {notifications.map((n: any) => (
                  <div key={n.id} className={`p-4 transition-colors ${n.is_read ? 'bg-white opacity-80' : 'bg-[var(--color-sage-50)]'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-sm text-[var(--color-ink-900)]">
                        {n.title || n.type.replace('_', ' ').toUpperCase()}
                      </h4>
                      {!n.is_read && (
                        <button 
                          onClick={() => markAsRead(n.id)}
                          className="text-[10px] text-[var(--color-ink-400)] hover:text-[var(--color-ink-900)] hover:underline font-medium"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-ink-700)] mb-2">{n.message}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-[var(--color-ink-400)]">
                        {new Date(n.created_at).toLocaleString()}
                      </span>
                      {n.link && (
                        <Link href={n.link} className="text-[10px] text-[var(--color-terracotta-600)] font-medium hover:underline">
                          View details
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
