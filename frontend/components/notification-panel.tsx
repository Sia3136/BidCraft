'use client'

import { useState, useEffect } from 'react'
import { X, Bell, TrendingUp, Gavel, Package, Star } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { user } = useAuth()
  
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const loggedOutContent = [
    { id: 1, icon: TrendingUp, title: 'Trending Now', desc: 'Vintage Rolex Submariner bids are heating up!', time: 'Just now', link: '/category/collectibles' },
    { id: 2, icon: Gavel, title: 'Ending Soon', desc: 'Handcrafted Ceramic Vase auction ends in 1h.', time: '1h ago', link: '/category/crafts' },
    { id: 3, icon: Star, title: 'Featured Creator', desc: 'Studio Noor just dropped a new linen collection.', time: '3h ago', link: '/category/handmade-lifestyle' }
  ]

  const loggedInContent = [
    { id: 1, icon: Bell, title: 'Outbid Alert', desc: 'Someone placed a higher bid on Vintage Polaroid.', time: 'Just now', unread: true },
    { id: 2, icon: Package, title: 'Order Shipped', desc: 'Your Hand-thrown Ceramic Match Striker is on its way.', time: '2h ago', unread: true },
    { id: 3, icon: Star, title: 'Wishlist Update', desc: 'An item on your wishlist is now on sale.', time: '1d ago', unread: false },
    { id: 4, icon: Gavel, title: 'Auction Ended', desc: 'You won the Resin Ocean Wave Board!', time: '2d ago', unread: false }
  ]

  const items = user ? loggedInContent : loggedOutContent

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-[100] bg-[var(--color-ink-900)]/40 backdrop-blur-sm transition-opacity duration-300 ease-default",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className={cn(
          "fixed top-0 right-0 z-[101] w-full max-w-[400px] h-full bg-[var(--color-cream-base)] shadow-[var(--shadow-modal)] transition-transform duration-300 ease-emphasis flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border-subtle)] bg-[var(--color-white)]">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-[var(--color-ink-900)]" />
            <h2 className="text-heading-sm text-[var(--color-ink-900)]">Notifications</h2>
          </div>
          <Button variant="icon" size="icon" onClick={onClose} className="hover:bg-[var(--color-cream-deep)] rounded-full text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)]">
            <X size={20} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!user && (
            <div className="bg-[var(--color-terracotta-100)]/30 p-4 border-b border-[var(--color-terracotta-100)] flex flex-col items-start gap-2">
              <p className="text-sm text-[var(--color-terracotta-700)] font-medium">Sign in to see your personalized updates, bids, and order tracking.</p>
            </div>
          )}

          <div className="divide-y divide-[var(--color-border-subtle)]">
            {items.map((item: any) => {
              const Icon = item.icon
              return (
                <div key={item.id} className={cn("p-5 flex gap-4 transition-colors hover:bg-[var(--color-white)] cursor-pointer relative", item.unread ? 'bg-[var(--color-cream-deep)]/50' : '')}>
                  {item.unread && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-terracotta-600)]" />}
                  <div className="mt-1 w-8 h-8 rounded-full bg-[var(--color-white)] border border-[var(--color-border-subtle)] flex items-center justify-center shrink-0 shadow-sm">
                    <Icon size={14} className={item.unread ? "text-[var(--color-terracotta-600)]" : "text-[var(--color-ink-500)]"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={cn("text-body-md truncate pr-2", item.unread ? "font-bold text-[var(--color-ink-900)]" : "font-semibold text-[var(--color-ink-900)]")}>
                        {item.title}
                      </h4>
                      <span className="text-caption text-[var(--color-ink-500)] whitespace-nowrap shrink-0">{item.time}</span>
                    </div>
                    <p className={cn("text-sm", item.unread ? "text-[var(--color-ink-700)]" : "text-[var(--color-ink-500)]")}>
                      {item.desc}
                    </p>
                    {item.link && (
                      <Link href={item.link} onClick={onClose} className="inline-block mt-2 text-xs font-semibold text-[var(--color-terracotta-600)] hover:underline">
                        Explore &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {user && (
          <div className="p-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-white)] flex justify-center">
            <Link href="/dashboard/notifications" onClick={onClose} className="text-sm font-semibold text-[var(--color-terracotta-600)] hover:underline">
              View All Notifications
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
