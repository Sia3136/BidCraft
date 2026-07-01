'use client'

import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useStore } from '@/lib/store'

export default function CartPage() {
  const { user } = useStore()
  
  return (
    <div className="min-h-screen bg-[var(--color-cream-base)] flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-[var(--space-5)]">
        <div className="w-full max-w-[400px] flex flex-col items-center text-center">
          
          <div className="mb-[var(--space-5)] relative text-[var(--color-slate-900)]">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-slate-900)]">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <div className="absolute -top-1 -right-2 text-[var(--color-terracotta-600)] bg-[var(--color-cream-base)] rounded-full border-[2px] border-[var(--color-cream-base)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-heading-lg text-[var(--color-ink-900)] mb-[var(--space-2)]">Your Cart is empty</h1>
          
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
