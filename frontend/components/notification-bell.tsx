'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'

export function NotificationBell() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      loadNotifications()
    }
  }, [user])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadNotifications = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/notifications`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
      }
    } catch (err) {
      console.error('Failed to load notifications', err)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/notifications/${id}/read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    } catch (err) {
      console.error('Failed to mark notification as read', err)
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative px-3 py-2 text-foreground hover:text-primary transition-colors outline-none"
      >
        <span className="text-xl">🛎️</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-2 w-4 h-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-3 border-b border-border bg-muted/30">
            <h3 className="font-semibold text-sm">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No notifications.</div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map(n => (
                  <div key={n.id} className={`p-4 transition-colors ${n.is_read ? 'opacity-70 bg-card' : 'bg-primary/5'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-sm">{n.title}</h4>
                      {!n.is_read && (
                        <button 
                          onClick={() => markAsRead(n.id)}
                          className="text-[10px] text-primary hover:underline font-medium"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{n.message}</p>
                    <span className="text-[10px] text-muted-foreground/70">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
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
