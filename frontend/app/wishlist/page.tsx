'use client'

import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useStore } from '@/lib/store'

export default function WishlistPage() {
  const { user } = useStore()
  
  return (
    <div className="min-h-screen bg-[var(--color-cream-base)] flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-[var(--space-5)]">
        <div className="w-full max-w-[400px] flex flex-col items-center text-center">
          
          <div className="mb-[var(--space-5)] relative text-[var(--color-slate-900)]">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-slate-900)]">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <div className="absolute -top-1 -right-2 text-[var(--color-terracotta-600)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-heading-lg text-[var(--color-ink-900)] mb-[var(--space-2)]">Your Wishlist is empty</h1>
          
          <p className="text-body-md text-[var(--color-ink-500)] mb-[var(--space-5)]">
            {user ? "Nothing here yet" : "Sign in to save your favourite items and pick up where you left off"}
          </p>
          
          {!user ? (
            <Link 
              href="/auth"
              className="w-full mb-[var(--space-3)] flex items-center justify-center bg-[rgba(200,100,58,0.15)] backdrop-blur-[8px] border-[1.5px] border-[rgba(200,100,58,0.6)] text-[var(--color-terracotta-600)] text-body-md font-semibold py-[12px] rounded-[var(--radius-md)] hover:bg-[rgba(200,100,58,0.25)] hover:border-[rgba(200,100,58,1)] transition-all duration-fast"
            >
              Sign In
            </Link>
          ) : (
            <Link 
              href="/explore"
              className="w-full mb-[var(--space-3)] flex items-center justify-center bg-[var(--color-terracotta-600)] text-white text-body-md font-semibold py-[12px] rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors duration-fast"
            >
              Start Exploring
            </Link>
          )}
          
          <Link 
            href="/"
            className="w-full flex items-center justify-center text-body-md font-semibold text-[var(--color-ink-700)] py-[12px] rounded-[var(--radius-md)] hover:bg-[var(--color-cream-raised)] transition-colors duration-fast"
          >
            Continue Browsing
          </Link>
          
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
