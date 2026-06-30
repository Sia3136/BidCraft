'use client'

import { Button } from '@/components/ui/button'

export function CollectorSpotlight() {
  return (
    <section className="w-[var(--container-full-bleed)] flex flex-col lg:flex-row">
      
      {/* Left Half: Image */}
      <div className="w-full lg:w-1/2 h-[320px] lg:h-[480px] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=1200&auto=format&fit=crop"
          alt="Collector's display shelf"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right Half: Content block */}
      <div className="w-full lg:w-1/2 bg-[var(--color-slate-900)] flex flex-col justify-center p-[32px] lg:p-[64px]">
        <div className="max-w-[480px] animate-fade-up">
          <span className="text-caption text-white uppercase tracking-[0.04em] mb-[var(--space-4)] block">
            Collector Spotlight
          </span>
          
          <h2 className="text-display-lg text-white mb-[var(--space-4)]">
            Built one shelf at a time.
          </h2>
          
          <p className="text-body-lg text-white/80 mb-[var(--space-6)]">
            Every collection tells a story of patience, obsession, and the thrill of the hunt. 
            Discover rare finds sourced from passionate collectors worldwide.
          </p>
          
          <Button 
            size="large" 
            className="bg-white text-[var(--color-slate-900)] hover:bg-white/90"
          >
            Explore Collectibles
          </Button>
        </div>
      </div>

    </section>
  )
}
