'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const HERO_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1590483736622-398541c4da96?q=80&w=2070&auto=format&fit=crop', // Pottery/hands
    alt: 'Ceramic artist shaping pottery'
  },
  {
    src: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=2070&auto=format&fit=crop', // Hot wheels collection
    alt: 'Curated Hot Wheels collection'
  },
  {
    src: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop', // Artist studio
    alt: 'Artist workspace and tools'
  }
]

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative w-[var(--container-full-bleed)] h-[440px] md:h-[520px] xl:h-[640px] overflow-hidden bg-[var(--color-slate-900)]">
      {/* Rotating Background Images */}
      {HERO_IMAGES.map((image, index) => (
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
        />
      ))}

      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(43,42,40,0.55) 0%, rgba(43,42,40,0) 60%)' }}
      />

      {/* Content Container */}
      <div className="absolute inset-0 w-full max-w-[var(--container-max)] mx-auto pointer-events-none">
        <div className="absolute bottom-[32px] xl:bottom-[64px] left-[32px] xl:left-[64px] max-w-[680px] flex flex-col pointer-events-auto z-10">
          
          <span className="text-sm text-white uppercase tracking-[0.06em] mb-[var(--space-3)] animate-fade-up font-semibold">
            Curated this week
          </span>
          
          <h1 className="text-display-xl xl:text-[64px] xl:leading-[72px] font-semibold text-white mb-[var(--space-4)] animate-fade-up [animation-delay:100ms]">
            Where creativity becomes opportunity.
          </h1>
          
          <p className="text-body-lg text-white/85 mb-[var(--space-5)] animate-fade-up [animation-delay:200ms] max-w-[560px]">
            The premium marketplace for independent creators, handmade crafts, and rare collectibles.
          </p>
          
          <div className="flex flex-row flex-wrap items-center gap-[16px] animate-fade-up [animation-delay:300ms]">
            <Button size="large">
              Explore Collection
            </Button>
            <Link href="/explore?type=auction" className="h-14 px-8 bg-white text-[var(--color-ink-900)] text-body-lg font-bold rounded-[var(--radius-md)] flex items-center justify-center hover:bg-[var(--color-cream-deep)] transition-colors shadow-sm">
              Watch Live Auctions
            </Link>
          </div>
          
        </div>

        {/* Dash Indicators */}
        <div className="absolute bottom-[32px] xl:bottom-[64px] right-[32px] xl:right-[64px] flex items-center gap-2 pointer-events-auto z-10">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-[2px] w-[24px] transition-all duration-400 ease-default",
                index === currentIndex ? "bg-white" : "bg-white/30 hover:bg-white/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
