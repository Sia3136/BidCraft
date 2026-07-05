'use client'
import React, { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';

export default function CookiesPage() {
  const [analytics, setAnalytics] = useState(true);
  const [preferences, setPreferences] = useState(true);

  return (
    <div className="bg-[var(--color-cream-base)] min-h-screen flex flex-col">
      <Navbar />
      <main className="max-w-[var(--container-max)] mx-auto px-[var(--space-5)] xl:px-[var(--space-8)] py-24 pt-32 flex-1">
        <h1 className="text-display-xl font-display text-[var(--color-ink-900)] mb-6">Cookie Settings</h1>
        <p className="text-body-lg text-[var(--color-ink-700)] mb-12 max-w-2xl">BidCraft uses the following types of cookies:</p>
        
        <div className="space-y-8 max-w-2xl">
          {/* Essential */}
          <div className="flex items-start justify-between gap-6 p-6 bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]">
            <div>
              <h2 className="text-heading-md text-[var(--color-ink-900)] mb-2">Essential cookies</h2>
              <p className="text-body-md text-[var(--color-ink-700)]">Required for login sessions, cart, and security. Cannot be disabled.</p>
            </div>
            <div className="shrink-0 pt-1">
              <div className="w-12 h-6 rounded-full bg-[var(--color-ink-300)] opacity-50 relative cursor-not-allowed">
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white transition-all" />
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="flex items-start justify-between gap-6 p-6 bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]">
            <div>
              <h2 className="text-heading-md text-[var(--color-ink-900)] mb-2">Analytics cookies</h2>
              <p className="text-body-md text-[var(--color-ink-700)]">We use anonymised analytics to understand which features are used and improve the platform. No personal data is shared.</p>
            </div>
            <div className="shrink-0 pt-1">
              <button 
                onClick={() => setAnalytics(!analytics)}
                className={cn("w-12 h-6 rounded-full relative transition-colors duration-200", analytics ? "bg-[var(--color-success-600)]" : "bg-[var(--color-ink-300)]")}
              >
                <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200", analytics ? "left-[26px]" : "left-1")} />
              </button>
            </div>
          </div>

          {/* Preference */}
          <div className="flex items-start justify-between gap-6 p-6 bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]">
            <div>
              <h2 className="text-heading-md text-[var(--color-ink-900)] mb-2">Preference cookies</h2>
              <p className="text-body-md text-[var(--color-ink-700)]">Remembers your filter settings and recently viewed items.</p>
            </div>
            <div className="shrink-0 pt-1">
              <button 
                onClick={() => setPreferences(!preferences)}
                className={cn("w-12 h-6 rounded-full relative transition-colors duration-200", preferences ? "bg-[var(--color-success-600)]" : "bg-[var(--color-ink-300)]")}
              >
                <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200", preferences ? "left-[26px]" : "left-1")} />
              </button>
            </div>
          </div>

          <div className="pt-8">
            <button className="bg-[var(--color-terracotta-600)] text-white text-body-lg font-bold px-8 py-3 rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors">
              Save Preferences
            </button>
            <p className="text-caption text-[var(--color-ink-500)] mt-4">
              Note: Your preferences are saved in your browser. Clearing your browser data will reset these settings.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
