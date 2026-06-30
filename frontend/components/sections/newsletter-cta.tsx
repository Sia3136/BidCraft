'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function NewsletterCta() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    setEmail('')
  }

  return (
    <section className="py-[var(--space-10)] max-w-[var(--container-max)] mx-auto px-4 md:px-6 xl:px-6">
      
      <div className="max-w-[560px] mx-auto text-center flex flex-col items-center animate-fade-up">
        
        <h2 className="text-display-lg text-[var(--color-ink-900)] mb-[var(--space-3)]">
          Stay close to what's new
        </h2>
        
        <p className="text-body-md text-[var(--color-ink-700)] mb-[var(--space-6)]">
          Join our community to receive curated drops, exclusive artisan interviews, and early access to live auctions.
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col md:flex-row items-start gap-[var(--space-3)] mb-[var(--space-2)]">
          <div className="flex-1 w-full">
            <Input 
              type="email" 
              placeholder="Enter your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" size="default" className="w-full md:w-auto shrink-0 h-[44px]">
            Subscribe
          </Button>
        </form>

        <p className="text-caption text-[var(--color-ink-500)]">
          No spam. Unsubscribe anytime.
        </p>

      </div>

    </section>
  )
}
