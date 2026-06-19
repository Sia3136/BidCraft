"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Gavel, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

type Auction = {
  title: string
  creator: string
  src: string
  bid: number
  bids: number
  endsInSec: number
}

const AUCTIONS: Auction[] = [
  {
    title: "Sage Stoneware Vase",
    creator: "Mara Ellison",
    src: "/images/auction-1.png",
    bid: 240,
    bids: 18,
    endsInSec: 3 * 3600 + 12 * 60 + 40,
  },
  {
    title: "Untitled No. 12",
    creator: "Theo Vance",
    src: "/images/auction-2.png",
    bid: 1180,
    bids: 42,
    endsInSec: 1 * 3600 + 47 * 60 + 5,
  },
  {
    title: "Woven Dawn Hanging",
    creator: "Iris Bloom",
    src: "/images/auction-3.png",
    bid: 520,
    bids: 27,
    endsInSec: 6 * 3600 + 3 * 60 + 22,
  },
  {
    title: "Carved Oak Form",
    creator: "Felix Hart",
    src: "/images/auction-4.png",
    bid: 760,
    bids: 31,
    endsInSec: 22 * 60 + 9,
  },
]

function format(sec: number) {
  const s = Math.max(0, sec)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const ss = s % 60
  const pad = (n: number) => String(n).padStart(2, "0")
  return { h: pad(h), m: pad(m), s: pad(ss) }
}

export function LiveAuctions() {
  const [times, setTimes] = useState(AUCTIONS.map((a) => a.endsInSec))

  useEffect(() => {
    const id = setInterval(() => {
      setTimes((prev) => prev.map((t) => (t > 0 ? t - 1 : 0)))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="auctions" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Live now
            </span>
            <h2 className="mt-3 max-w-md font-serif text-4xl tracking-tight text-foreground text-balance lg:text-5xl">
              Live auctions
            </h2>
          </div>
          <p className="max-w-sm text-pretty text-muted-foreground">
            Place a bid before the clock runs out. Every transaction is held in
            escrow until the piece arrives safely.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {AUCTIONS.map((a, i) => {
            const t = format(times[i])
            const ended = times[i] <= 0
            return (
              <article
                key={a.title}
                className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={a.src || "/placeholder.svg"}
                    alt={a.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {ended ? (
                      <span>Ended</span>
                    ) : (
                      <span className="tabular-nums">
                        {t.h}:{t.m}:{t.s}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-serif text-lg text-foreground">
                    {a.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    by {a.creator}
                  </p>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Current bid
                      </p>
                      <p className="font-serif text-xl text-foreground">
                        ${a.bid.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {a.bids} bids
                    </span>
                  </div>

                  <Button
                    className="mt-5 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={ended}
                  >
                    <Gavel className="mr-1 h-4 w-4" />
                    {ended ? "Auction ended" : "Place bid"}
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
