'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { auctionsApi } from '@/lib/api'

export function LiveAuctionsSection() {
  const [auctions, setAuctions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    async function loadAuctions() {
      try {
        const data = await auctionsApi.list('status=active')
        setAuctions(data.auctions || [])
      } catch (err) {
        console.error('Failed to load active auctions:', err)
      } finally {
        setLoading(false)
      }
    }
    loadAuctions()
  }, [])

  if (loading) {
    return (
      <div className="py-20 text-center text-muted-foreground bg-background">
        Loading premium auctions...
      </div>
    )
  }

  if (auctions.length === 0) return null

  const getRemainingTime = (endTime: string) => {
    const diff = new Date(endTime).getTime() - Date.now()
    if (diff <= 0) return 'Ended'
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const mins = Math.floor((diff / (1000 * 60)) % 60)
    return `${hours}h ${mins}m`
  }

  const nextSlide = () => setCurrentIndex(prev => (prev === auctions.slice(0, 5).length - 1 ? 0 : prev + 1))
  const prevSlide = () => setCurrentIndex(prev => (prev === 0 ? auctions.slice(0, 5).length - 1 : prev - 1))

  const topAuctions = auctions.slice(0, 5)
  const auc = topAuctions[currentIndex]
  
  let photos = []
  try {
    photos = typeof auc.photos === 'string' ? JSON.parse(auc.photos) : auc.photos
  } catch (e) {
    photos = auc.photos || []
  }
  const image = (photos && photos.length > 0) ? photos[0] : '/placeholder.png'

  return (
    <section className="py-24 bg-[#171717] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-brand font-medium tracking-wide">Live Auctions</h2>
            <p className="text-white/70 mt-3 text-[15px]">Bid on exclusive and rare items closing soon.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button 
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        {/* Carousel Window */}
        <div className="relative w-full overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl">
          <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {topAuctions.map((slide, idx) => {
              let sPhotos = []
              try { sPhotos = typeof slide.photos === 'string' ? JSON.parse(slide.photos) : slide.photos } catch (e) {}
              const sImage = (sPhotos && sPhotos.length > 0) ? sPhotos[0] : '/placeholder.png'

              return (
                <div key={slide.id} className="w-full shrink-0 flex flex-col md:flex-row h-auto md:h-[500px]">
                  {/* Left Image */}
                  <div className="md:w-[55%] h-[350px] md:h-full relative overflow-hidden group">
                    <img 
                      src={sImage} 
                      alt={slide.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent"></div>
                    <div className="absolute top-6 left-6 bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> LIVE AUCTION
                    </div>
                  </div>

                  {/* Right Content */}
                  <div className="md:w-[45%] p-8 md:p-12 flex flex-col justify-center bg-zinc-950">
                    <h3 className="text-3xl lg:text-4xl font-brand font-medium mb-6 text-white leading-tight">
                      {slide.title}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-8 mb-8 border-y border-white/10 py-8">
                      <div>
                        <p className="text-[13px] text-white/50 mb-2 uppercase tracking-wider font-semibold">Current Bid</p>
                        <p className="text-3xl font-semibold text-white">${Number(slide.current_bid || slide.start_bid).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[13px] text-white/50 mb-2 uppercase tracking-wider font-semibold">Ends In</p>
                        <p className="text-3xl font-semibold text-red-400">{getRemainingTime(slide.end_time)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-10">
                      <div className="flex -space-x-3">
                         <div className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-800"></div>
                         <div className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-700"></div>
                         <div className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-600"></div>
                      </div>
                      <p className="text-[14px] text-white/70">{slide.total_bids} active bidders</p>
                    </div>

                    <Link 
                      href={`/listings/${slide.listing_id || slide.id}`} 
                      className="w-full py-4 bg-white text-black rounded-xl font-medium text-center hover:bg-zinc-200 transition-colors shadow-lg active:scale-[0.98]"
                    >
                      Place Bid Now
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
