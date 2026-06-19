"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SLIDES = [
  {
    src: "/images/hero-pottery.png",
    alt: "Handmade ceramic pottery in warm terracotta glazes",
    tag: "Ceramics & Pottery",
  },
  {
    src: "/images/hero-painting.png",
    alt: "Abstract handmade oil painting in earthy tones",
    tag: "Original Paintings",
  },
  {
    src: "/images/hero-crochet.png",
    alt: "Handmade crochet and woven textile art",
    tag: "Fiber & Textile",
  },
]

export function HeroSection() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="top" className="relative overflow-hidden bg-background pt-20">
      {/* Background slowly sliding artwork */}
      <div className="absolute inset-0">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1500ms] ease-in-out",
              i === active ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={slide.src || "/placeholder.svg"}
              alt={slide.alt}
              fill
              priority={i === 0}
              className={cn(
                "object-cover",
                i === active ? "animate-[heroPan_8s_ease-out_forwards]" : "",
              )}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col px-6 pb-24 pt-20 lg:px-10 lg:pb-32 lg:pt-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            A digital exhibition for creators
          </span>

          <h1 className="mt-6 font-serif text-5xl leading-[1.04] tracking-tight text-foreground text-balance sm:text-6xl lg:text-7xl">
            Where Creativity Finds Its Value
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
            BidCraft is the escrow-protected auction marketplace for artists,
            crafters, and collectors. Discover one-of-a-kind handmade work and
            bid with confidence on pieces made to last.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="group rounded-full bg-primary px-7 text-base text-primary-foreground hover:bg-primary/90"
            >
              Start Selling
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-foreground/20 bg-card/60 px-7 text-base text-foreground backdrop-blur hover:bg-card"
            >
              Explore Auctions
            </Button>
          </div>

          <div className="mt-12 flex items-center gap-8">
            <Stat value="12k+" label="Creators" />
            <span className="h-8 w-px bg-border" />
            <Stat value="48k+" label="Pieces sold" />
            <span className="h-8 w-px bg-border" />
            <Stat value="100%" label="Escrow safe" />
          </div>
        </div>

        {/* Slide indicators + caption */}
        <div className="mt-16 flex items-center justify-between lg:mt-24">
          <div className="flex items-center gap-3">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Show ${slide.tag}`}
                onClick={() => setActive(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i === active
                    ? "w-10 bg-primary"
                    : "w-5 bg-foreground/25 hover:bg-foreground/40",
                )}
              />
            ))}
          </div>
          <span className="hidden text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground sm:block">
            {SLIDES[active].tag}
          </span>
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-2xl text-foreground">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  )
}
