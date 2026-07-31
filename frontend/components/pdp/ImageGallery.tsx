'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  images: string[]
  alt: string
  isWishlisted?: boolean
  onWishlistToggle?: () => void
}

export function ImageGallery({ images, alt, isWishlisted, onWishlistToggle }: ImageGalleryProps) {
  // Normalise: always work with an array, filter out empties
  const imgs = (Array.isArray(images) ? images : images ? [images] : []).filter(Boolean)
  if (imgs.length === 0) imgs.push('/placeholder.jpg')

  const [activeIdx, setActiveIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)

  // Touch / swipe state (mobile main image)
  const touchStartX = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // ─── Keyboard navigation for lightbox ───────────────────────────────────
  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowRight') setLightboxIdx(i => (i + 1) % imgs.length)
      if (e.key === 'ArrowLeft') setLightboxIdx(i => (i - 1 + imgs.length) % imgs.length)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, imgs.length])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  // ─── Touch handlers (mobile swipe on main image) ─────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(deltaX) < 40) return // too small, ignore
    if (deltaX < 0) {
      // swipe left → next
      setActiveIdx(i => (i + 1) % imgs.length)
    } else {
      // swipe right → prev
      setActiveIdx(i => (i - 1 + imgs.length) % imgs.length)
    }
  }

  const openLightbox = useCallback((idx: number) => {
    setLightboxIdx(idx)
    setLightboxOpen(true)
  }, [])

  const hasMultiple = imgs.length > 1

  return (
    <>
      {/* ─── Main Gallery ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">

        {/* Main image */}
        <div
          ref={containerRef}
          className="relative aspect-square md:aspect-[4/3] lg:aspect-[4/4] bg-[var(--color-cream-deep)] rounded-[var(--radius-lg)] overflow-hidden flex-1 min-w-0 cursor-zoom-in"
          onTouchStart={hasMultiple ? onTouchStart : undefined}
          onTouchEnd={hasMultiple ? onTouchEnd : undefined}
          onClick={() => openLightbox(activeIdx)}
          role="button"
          aria-label={`View ${alt} — image ${activeIdx + 1} of ${imgs.length} in full screen`}
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') openLightbox(activeIdx) }}
        >
          <Image
            src={imgs[activeIdx]}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            style={{
              objectFit: 'cover',
              // GPU-accelerated zoom on hover via CSS class below
              transition: 'transform 0.32s ease',
            }}
            alt={alt}
            priority={activeIdx === 0}
            className="gallery-main-img"
            onError={e => { e.currentTarget.src = '/placeholder.jpg' }}
          />

          {/* Wishlist Heart Overlay */}
          {onWishlistToggle && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onWishlistToggle();
              }}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="absolute top-4 right-4 z-20 flex items-center justify-center hover:scale-110 transition-transform duration-150 pointer-events-auto"
            >
              {isWishlisted ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-[var(--color-terracotta-600)] drop-shadow-md">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09 C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5 c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06 a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              )}
            </button>
          )}

          {/* Prev / Next arrow buttons — desktop only, sit above image */}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); setActiveIdx(i => (i - 1 + imgs.length) % imgs.length) }}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm z-10 pointer-events-auto transition-colors hidden md:flex"
              >
                <ChevronLeft className="w-4 h-4 text-[#2B211C]" />
              </button>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); setActiveIdx(i => (i + 1) % imgs.length) }}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm z-10 pointer-events-auto transition-colors hidden md:flex"
              >
                <ChevronRight className="w-4 h-4 text-[#2B211C]" />
              </button>
            </>
          )}

          {/* Zoom hint overlay (desktop only) — appears on hover */}
          <div
            aria-hidden
            className="absolute inset-0 hidden md:flex items-end justify-end p-3 pointer-events-none"
          >
            <span className="text-[10px] text-white/70 bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
              Click to zoom
            </span>
          </div>
        </div>

        {/* Dot indicators — mobile only */}
        {hasMultiple && (
          <div className="flex md:hidden justify-center gap-[6px] pt-1" aria-label="Image gallery position">
            {imgs.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                aria-label={`Go to image ${idx + 1}`}
                className={cn(
                  'w-[6px] h-[6px] rounded-full transition-colors focus:outline-none',
                  activeIdx === idx ? 'bg-[#B06A42]' : 'bg-[#D8C8BA]'
                )}
              />
            ))}
          </div>
        )}

        {/* Thumbnails — desktop only (md+), BELOW main image. */}
        {hasMultiple && (
          <div className="hidden md:flex md:flex-row gap-3 overflow-x-auto hide-scrollbar w-full pb-2">
            {imgs.map((src, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIdx(idx)}
                aria-label={`View image ${idx + 1}`}
                className={cn(
                  'relative w-[72px] h-[72px] rounded-[var(--radius-sm)] overflow-hidden shrink-0 border-2 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B06A42]',
                  activeIdx === idx
                    ? 'border-[#B06A42]'
                    : 'border-transparent hover:border-[#D8C8BA]'
                )}
              >
                <Image
                  src={src}
                  fill
                  sizes="72px"
                  style={{ objectFit: 'cover' }}
                  alt={`Thumbnail ${idx + 1}`}
                  loading="lazy"
                  onError={e => { e.currentTarget.src = '/placeholder.jpg' }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── Hover zoom CSS (injected via style tag) ───────────────────── */}
      <style jsx global>{`
        .gallery-main-img {
          transform: scale(1);
          will-change: transform;
        }
        @media (hover: hover) {
          [role="button"]:hover .gallery-main-img {
            transform: scale(1.06);
          }
        }
      `}</style>

      {/* ─── Lightbox ──────────────────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: 'rgba(26,26,26,0.92)' }}
          role="dialog"
          aria-modal="true"
          aria-label={`Image lightbox: ${alt}`}
          onClick={e => { if (e.target === e.currentTarget) setLightboxOpen(false) }}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close image viewer"
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev / Next (only if multiple) */}
          {hasMultiple && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setLightboxIdx(i => (i - 1 + imgs.length) % imgs.length) }}
                aria-label="Previous image"
                className="absolute left-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); setLightboxIdx(i => (i + 1) % imgs.length) }}
                aria-label="Next image"
                className="absolute right-16 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image */}
          <div
            className="relative"
            style={{ maxWidth: '90vw', maxHeight: '90vh', width: '90vw', height: '90vh' }}
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={imgs[lightboxIdx]}
              fill
              sizes="90vw"
              style={{ objectFit: 'contain' }}
              alt={`${alt} — full size view`}
              priority
              onError={e => { e.currentTarget.src = '/placeholder.jpg' }}
            />
          </div>

          {/* Counter */}
          {hasMultiple && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs">
              {lightboxIdx + 1} / {imgs.length}
            </div>
          )}
        </div>
      )}
    </>
  )
}
