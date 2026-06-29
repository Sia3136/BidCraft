'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop',
    headline: 'Curated Art',
    subline: 'Contemporary paintings & sculptures.',
    cta: 'Explore',
    href: '/category/art'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?q=80&w=800&auto=format&fit=crop',
    headline: 'Handmade Ceramics',
    subline: 'Unique pottery crafted with care.',
    cta: 'Shop Now',
    href: '/category/crafts'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1581022295087-35e593704911?q=80&w=800&auto=format&fit=crop',
    headline: 'Trending Auctions',
    subline: 'Rare collectibles bidding now.',
    cta: 'View Live',
    href: '/category/hot-wheels'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
    headline: 'Vintage Watches',
    subline: 'Timeless luxury timepieces.',
    cta: 'Discover',
    href: '/category/collectibles'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800&auto=format&fit=crop',
    headline: 'Modern Decor',
    subline: 'Elevate your living space.',
    cta: 'Decorate',
    href: '/category/handmade-lifestyle'
  }
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth < 768) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };
    
    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, []);

  const maxIndex = Math.max(0, SLIDES.length - visibleCount);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [maxIndex]);

  const nextSlide = () => setCurrent(prev => (prev >= maxIndex ? 0 : prev + 1));
  const prevSlide = () => setCurrent(prev => (prev === 0 ? maxIndex : prev - 1));

  return (
    <section className="bg-background py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative group">
          {/* Carousel Track Container */}
          <div className="overflow-hidden rounded-[4px]">
            <div 
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]" 
              style={{ transform: `translateX(-${current * (100 / visibleCount)}%)` }}
            >
              {SLIDES.map((slide) => (
                <div 
                  key={slide.id} 
                  className="px-2"
                  style={{ flex: `0 0 ${100 / visibleCount}%` }}
                >
                  <div className="relative h-[300px] sm:h-[350px] lg:h-[400px] rounded-[4px] overflow-hidden group/card border border-border/50">
                    {/* Background Image */}
                    <img 
                      src={slide.image} 
                      alt={slide.headline}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                    />
                    
                    {/* Premium Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/80 via-[#171717]/30 to-transparent"></div>

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 flex flex-col items-start text-white">
                      <h2 className="text-3xl md:text-4xl font-brand font-medium tracking-wide mb-3 drop-shadow-md">
                        {slide.headline}
                      </h2>
                      <p className="text-[14px] md:text-[15px] font-light text-white/90 mb-6 max-w-[280px] drop-shadow-sm tracking-wide">
                        {slide.subline}
                      </p>
                      <Link 
                        href={slide.href}
                        className="inline-flex px-8 py-3 bg-white text-[#171717] rounded-[4px] font-medium text-[13px] tracking-wide hover:bg-[#171717] hover:text-white hover:border-[#171717] border border-white transition-all duration-300 shadow-sm"
                      >
                        {slide.cta}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white hover:bg-[#F7F4EE] hover:scale-105 rounded-full flex items-center justify-center text-[#171717] opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.08)] border border-border z-10 disabled:opacity-0"
            disabled={current === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white hover:bg-[#F7F4EE] hover:scale-105 rounded-full flex items-center justify-center text-[#171717] opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.08)] border border-border z-10 disabled:opacity-0"
            disabled={current === maxIndex}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>

        </div>
      </div>
    </section>
  )
}
