'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import { 
  UserCircle, 
  MapPin, 
  ShieldCheck, 
  Settings, 
  Package, 
  Heart, 
  Clock, 
  LogOut 
} from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Loader2 } from 'lucide-react'

const SIDEBAR_NAV = [
  { name: 'Overview', href: '/account', icon: UserCircle },
  { name: 'Orders', href: '/account/orders', icon: Package },
  { name: 'Wishlist', href: '/account/wishlist', icon: Heart },
  { name: 'Recently Viewed', href: '/account/recently-viewed', icon: Clock },
  { name: 'Profile Settings', href: '/account/settings', icon: Settings },
  { name: 'Addresses', href: '/account/addresses', icon: MapPin },
  { name: 'Security', href: '/account/security', icon: ShieldCheck },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, token, clearAuth } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!token) {
      router.push('/auth')
    }
  }, [token, router])

  const handleLogout = () => {
    clearAuth()
    router.push('/auth')
  }

  if (!mounted) return null
  if (!user) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[var(--color-terracotta-600)]" />
    </div>
  )

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12 mt-[80px]">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-[280px] shrink-0">
          <div className="bg-[var(--color-white)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] p-6 shadow-[var(--shadow-card)] sticky top-[100px]">
            
            {/* User Info */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[var(--color-border-subtle)]">
              <Avatar size="default" name={user.name} identifier={user.id} />
              <div className="overflow-hidden">
                <h2 className="text-body-lg font-bold text-[var(--color-ink-900)] truncate">{user.name}</h2>
                <p className="text-body-sm text-[var(--color-ink-500)] truncate">@{user.username || user.name.split(' ')[0]}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1">
              {SIDEBAR_NAV.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-body-md font-medium transition-colors",
                      isActive 
                        ? "bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-700)]" 
                        : "text-[var(--color-ink-700)] hover:bg-[var(--color-cream-base)] hover:text-[var(--color-ink-900)]"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isActive ? "text-[var(--color-terracotta-600)]" : "text-[var(--color-ink-500)]")} strokeWidth={isActive ? 2.5 : 2} />
                    {item.name}
                  </Link>
                )
              })}

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-body-md font-medium text-[var(--color-urgent-600)] hover:bg-[var(--color-urgent-50)] transition-colors mt-4 text-left w-full"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
        
      </div>
    </div>
  )
}
