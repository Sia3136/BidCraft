'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { fetchCreators } from '@/lib/api'

export function CreatorSpotlightSection() {
  const [creators, setCreators] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCreators() {
      try {
        const data = await fetchCreators('followers', 1, 0)
        setCreators(data.creators || [])
      } catch (e) {
        console.error('Failed to load creators', e)
      } finally {
        setLoading(false)
      }
    }
    loadCreators()
  }, [])

  if (loading) {
    return (
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          Loading Spotlight...
        </div>
      </section>
    )
  }

  if (creators.length === 0) return null

  const featured = creators[0]
  const avatar = featured.avatar_url || `/creator-${(featured.id % 8) + 1}.png`

  return (
    <section className="py-24 bg-[#F2EFE9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left: Editorial Portrait & Story */}
          <div className="lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-[1px] w-12 bg-foreground/30"></span>
              <span className="text-[13px] uppercase tracking-[0.2em] font-semibold text-foreground/70">Featured Creator</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-brand font-medium text-foreground mb-6 leading-tight">
              Meet {featured.name}
            </h2>
            
            <p className="text-muted-foreground text-[16px] leading-relaxed max-w-lg mb-10 font-serif italic">
              "Crafting has always been a way to tell stories that words cannot. Every piece is unique, forged with passion, and meant for a collector who understands the value of handmade heritage."
            </p>
            
            <div className="flex items-center gap-6 mb-12">
              <div className="text-center lg:text-left">
                <p className="text-2xl font-semibold text-foreground">{Number(featured.follower_count) || 0}</p>
                <p className="text-[12px] uppercase tracking-wider text-muted-foreground">Followers</p>
              </div>
              <div className="w-[1px] h-10 bg-border"></div>
              <div className="text-center lg:text-left">
                <p className="text-2xl font-semibold text-foreground">{Number(featured.average_rating) || 5.0}</p>
                <p className="text-[12px] uppercase tracking-wider text-muted-foreground">Rating</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button className="px-8 py-3.5 bg-[#171717] text-white rounded-full font-medium hover:bg-[#2B2B2B] transition-colors shadow-lg active:scale-95">
                Follow Creator
              </button>
              <span className="px-8 py-3.5 bg-transparent border border-border text-foreground rounded-full font-medium hover:bg-white hover:border-transparent hover:shadow-md transition-all active:scale-95 text-center cursor-not-allowed opacity-50">
                View Profile
              </span>
            </div>
          </div>

          {/* Right: Images Composition */}
          <div className="lg:w-1/2 relative w-full h-[500px] md:h-[600px] flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] h-full">
              {/* Main Portrait */}
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl">
                <img 
                  src={avatar} 
                  alt={featured.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              {/* Floating Product Sample 1 */}
              <div className="absolute -left-6 lg:-left-12 bottom-12 w-32 h-40 md:w-48 md:h-56 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#F2EFE9]">
                <img src="https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover" />
              </div>
              
              {/* Floating Product Sample 2 */}
              <div className="absolute -right-4 lg:-right-8 top-12 w-28 h-36 md:w-40 md:h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#F2EFE9]">
                <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover" />
              </div>

              {/* Verified Badge */}
              {featured.is_verified && (
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                  <span className="text-[12px] font-bold text-foreground">Verified</span>
                </div>
              )}
            </div>
          </div>
          
        </div>

      </div>
    </section>
  )
}
