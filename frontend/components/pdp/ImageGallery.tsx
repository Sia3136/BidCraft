'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  images: string[]
  alt: string
}

// Generate 6 distinct view variants if less than 6 unique images are provided
function build6AngleVariants(imagesList: string[]): string[] {
  const rawList = (Array.isArray(imagesList) ? imagesList : imagesList ? [imagesList] : []).filter(Boolean)
  
  // If we already have multiple unique URLs, use them!
  const uniqueUrls = Array.from(new Set(rawList))
  if (uniqueUrls.length >= 6) {
    return uniqueUrls.slice(0, 6)
  }

  const baseImage = uniqueUrls[0] || '/placeholder.jpg'

  // If Cloudinary URL, use Cloudinary transformation parameters for 6 distinct crops/zooms
  if (baseImage.includes('/upload/')) {
    const transforms = [
      '', // 1. Original / Full
      'c_crop,g_center,w_0.75,h_0.75,fl_relative', // 2. Zoomed in
      'c_pad,w_1.15,h_1.15,b_auto', // 3. Wide / Zoomed out
      'c_crop,g_west,w_0.65,h_1.0,fl_relative', // 4. Left crop
      'c_crop,g_east,w_0.65,h_1.0,fl_relative', // 5. Right crop
      'c_crop,g_north,w_0.85,h_0.7,fl_relative' // 6. Top/Bottom crop
    ]
    const parts = baseImage.split('/upload/')
    const base = parts[0] + '/upload/'
    const path = parts[1]
    
    return transforms.map((t, idx) => {
      if (uniqueUrls[idx]) return uniqueUrls[idx]
      return t ? `${base}${t}/${path}` : baseImage
    })
  }

  // Fallback variant URLs for non-Cloudinary images
  const fallbackSuffixes = [
    '',
    '#zoom=center',
    '#view=wide',
    '#crop=left',
    '#crop=right',
    '#crop=top'
  ]

  return fallbackSuffixes.map((suffix, idx) => {
    if (uniqueUrls[idx]) return uniqueUrls[idx]
    return `${baseImage}${suffix}`
  })
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const imgs = build6AngleVariants(images)

  const [activeIdx, setActiveIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)

  // Touch / swipe state (mobile main image)
  const touchStartX = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // ─── Keyboard navigation for lightbox ───────────────────────────────────
  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false)
        setIsZoomed(false)
      }
      if (e.key === 'ArrowRight') {
        setActiveIdx(i => (i + 1) % imgs.length)
        setIsZoomed(false)
      }
      if (e.key === 'ArrowLeft') {
        setActiveIdx(i => (i - 1 + imgs.length) % imgs.length)
        setIsZoomed(false)
      }
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
      setIsZoomed(false)
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
    if (Math.abs(deltaX) < 40) return
    if (deltaX < 0) {
      setActiveIdx(i => (i + 1) % imgs.length)
    } else {
      setActiveIdx(i => (i - 1 + imgs.length) % imgs.length)
    }
  }

  const openLightbox = useCallback((idx: number) => {
    setActiveIdx(idx)
    setIsZoomed(false)
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
          className="relative aspect-square md:aspect-[4/3] bg-[var(--color-cream-deep)] rounded-[var(--radius-lg)] overflow-hidden w-full cursor-zoom-in"
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
              transition: 'transform 0.32s ease',
            }}
            alt={alt}
            priority={activeIdx === 0}
            className="gallery-main-img"
            onError={e => { e.currentTarget.src = '/placeholder.jpg' }}
          />

          {/* Prev / Next arrow buttons — desktop only */}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); setActiveIdx(i => (i - 1 + imgs.length) % imgs.length) }}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm z-10 pointer-events-auto transition-colors hidden md:flex focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-600)]"
              >
                <ChevronLeft className="w-4 h-4 text-[var(--color-ink-900)]" />
              </button>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); setActiveIdx(i => (i + 1) % imgs.length) }}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm z-10 pointer-events-auto transition-colors hidden md:flex focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-600)]"
              >
                <ChevronRight className="w-4 h-4 text-[var(--color-ink-900)]" />
              </button>
            </>
          )}

          {/* Zoom hint overlay */}
          <div
            aria-hidden
            className="absolute inset-0 hidden md:flex items-end justify-end p-3 pointer-events-none"
          >
            <span className="text-[10px] text-white/70 bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
              Click to zoom
            </span>
          </div>
        </div>

        {/* Thumbnails — desktop only (md+) */}
        {hasMultiple && (
          <div className="hidden md:flex md:flex-row gap-2 overflow-x-auto md:overflow-y-hidden w-full shrink-0 hide-scrollbar justify-start">
            {imgs.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                aria-label={`View image ${idx + 1}`}
                className={cn(
                  'relative flex-1 min-w-[72px] max-w-[120px] aspect-square rounded-[var(--radius-sm)] overflow-hidden shrink-0 border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-600)]',
                  activeIdx === idx
                    ? 'border-[var(--color-terracotta-600)]'
                    : 'border-transparent hover:border-[var(--color-ink-300)]'
                )}
              >
                <Image
                  src={src}
                  fill
                  sizes="120px"
                  style={{ objectFit: 'cover' }}
                  alt={`Thumbnail ${idx + 1}`}
                  loading="lazy"
                  onError={e => { e.currentTarget.src = '/placeholder.jpg' }}
                />
              </button>
            ))}
          </div>
        )}

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
                  activeIdx === idx ? 'bg-[var(--color-terracotta-600)]' : 'bg-[var(--color-border-strong)]'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* ─── Hover zoom CSS ────────────────────────────────────────────── */}
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

      {/* ─── Lightbox Fullscreen Viewer ─────────────────────────────────── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Image lightbox: ${alt}`}
          onClick={() => {
            setLightboxOpen(false)
            setIsZoomed(false)
          }}
        >
          {/* Close (X) button — placed at top right with highest z-index */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxOpen(false)
              setIsZoomed(false)
            }}
            aria-label="Close image viewer"
            className="fixed top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition-all focus:outline-none z-[100000] cursor-pointer shadow-lg"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Prev / Next buttons */}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation()
                  setActiveIdx(i => (i - 1 + imgs.length) % imgs.length)
                  setIsZoomed(false)
                }}
                aria-label="Previous image"
                className="fixed left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition-all focus:outline-none z-[100000] cursor-pointer shadow-lg"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation()
                  setActiveIdx(i => (i + 1) % imgs.length)
                  setIsZoomed(false)
                }}
                aria-label="Next image"
                className="fixed right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition-all focus:outline-none z-[100000] cursor-pointer shadow-lg"
              >
                <ChevronRight className="w-6 h-6 stroke-[2.5]" />
              </button>
            </>
          )}

          {/* Main Lightbox Image (Click toggles Zoom) */}
          <div
            className="relative w-[85vw] h-[85vh] flex items-center justify-center overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <div
              className={cn(
                "relative transition-transform duration-300 ease-out",
                isZoomed ? "scale-[2.0] cursor-zoom-out" : "scale-100 cursor-zoom-in"
              )}
              style={{ width: '100%', height: '100%' }}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <Image
                src={imgs[activeIdx]}
                fill
                sizes="90vw"
                style={{ objectFit: 'contain' }}
                alt={`${alt} — full size view`}
                priority
                onError={e => { e.currentTarget.src = '/placeholder.jpg' }}
              />
            </div>
          </div>

          {/* Bottom Counter & Hint */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-md z-[100000] flex items-center gap-3">
            <span>{activeIdx + 1} / {imgs.length}</span>
            <span className="text-white/40">|</span>
            <span className="text-xs text-white/70">{isZoomed ? 'Click to Zoom Out' : 'Click image to Zoom In'}</span>
          </div>
        </div>
      )}
    </>
  )
}
