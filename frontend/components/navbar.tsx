'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { AuthModal } from '@/components/auth-modal'

export function Navbar() {
  const { user, logout } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-lg">
              ✦
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline">BidCraft</span>
          </div>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-2xl mx-4 hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, auctions, creators..."
                className="w-full px-4 py-2 bg-muted text-foreground placeholder:text-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                🔍
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:block px-4 py-2 text-foreground hover:text-primary transition-colors font-medium">
              Explore
            </button>
            <button className="hidden sm:block px-4 py-2 text-foreground hover:text-primary transition-colors font-medium">
              Sell
            </button>
            <button className="relative px-3 py-2 text-foreground hover:text-primary transition-colors">
              🛎️
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end hidden md:flex">
                  <span className="text-sm font-semibold text-foreground">{user.name}</span>
                  <span className="text-[10px] text-muted-foreground capitalize">{user.role}</span>
                </div>
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-border" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary text-white font-bold flex items-center justify-center text-sm shadow">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <button 
                  onClick={logout}
                  className="px-3 py-1.5 border border-border text-foreground hover:bg-muted rounded-lg transition-colors font-medium text-xs"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm shadow-md shadow-primary/10"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  )
}
