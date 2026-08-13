'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  ShoppingBag, 
  Tag, 
  MessageSquare, 
  Bell, 
  User, 
  Settings, 
  HelpCircle,
  FileText,
  Gavel,
  RefreshCcw,
  BarChart2,
  DollarSign,
  PlusCircle,
  Heart
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user } = useAuth()
  
  const isSellerContext = pathname.includes('/dashboard/seller')
  
  const buyerNav = [
    { name: 'Overview', href: '/dashboard/buyer', icon: Home },
    { name: 'Orders', href: '/orders', icon: ShoppingBag },
    { name: 'Offers', href: '/dashboard/buyer/offers', icon: Tag },
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  ]
  
  const sellerNav = [
    { name: 'Overview', href: '/seller/listings', icon: Home },
    { name: 'Listings', href: '/seller/listings', icon: FileText },
    { name: 'Orders', href: '/seller/listings', icon: ShoppingBag },
    { name: 'Auctions', href: '/seller/listings', icon: Gavel },
    { name: 'Offers Received', href: '/seller/listings', icon: Tag },
    { name: 'Trades Received', href: '/seller/listings', icon: RefreshCcw },
    { name: 'Analytics', href: '/seller/analytics', icon: BarChart2 },
    { name: 'Messages', href: '/seller/messages', icon: MessageSquare },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { name: 'Payouts', href: '/seller/payouts', icon: DollarSign },
  ]
  
  const mobileNav = [
    { name: 'Home', href: isSellerContext ? '/seller/listings' : '/dashboard/buyer', icon: Home },
    { name: 'Orders', href: isSellerContext ? '/seller/listings' : '/orders', icon: ShoppingBag },
    { name: isSellerContext ? 'Sell/+' : 'Wishlist', href: isSellerContext ? '/sell/new' : '/wishlist', icon: isSellerContext ? PlusCircle : Heart },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Profile', href: '/dashboard/settings', icon: User },
  ]
  
  const navItems = isSellerContext ? sellerNav : buyerNav

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[240px] flex-col border-r border-border bg-[#FDFBF7] fixed h-full z-10">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-slate-500">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-semibold">{user?.displayName || 'User'}</h2>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 mt-1">
                {isSellerContext ? 'Seller' : 'Buyer'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-6 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard/buyer' && item.href !== '/dashboard/seller' && pathname.startsWith(item.href))
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-terracotta-100 text-terracotta-700' 
                      : 'text-ink-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-terracotta-700' : 'text-ink-500'}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-border mt-auto">
          <nav className="space-y-1">
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-ink-700 hover:bg-slate-100 transition-colors"
            >
              <Settings className="h-5 w-5 text-ink-500" />
              Settings
            </Link>
            <Link
              href="/help"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-ink-700 hover:bg-slate-100 transition-colors"
            >
              <HelpCircle className="h-5 w-5 text-ink-500" />
              Help
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-[240px] pb-20 md:pb-0">
        <div className="p-4 md:p-7 max-w-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#FDFBF7] border-t border-border z-50 flex items-center justify-around px-2">
        {mobileNav.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard/buyer' && item.href !== '/dashboard/seller' && pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-terracotta-600' : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium leading-none">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
