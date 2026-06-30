'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const LIVE_AUCTIONS = [
  {
    id: 1,
    title: 'Vintage 1969 Hot Wheels Redline Twin Mill',
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=400&auto=format&fit=crop',
    creator: { name: 'Vikram S.', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop' },
    currentBid: '₹4,500',
    bidCount: 14,
    timeLeft: '00:45:12', // under 1 hr
    isUrgent: true,
  },
  {
    id: 2,
    title: 'Hand-painted Abstract Canvas 24x36"',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400&auto=format&fit=crop',
    creator: { name: 'Aarav Art', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop' },
    currentBid: '₹2,100',
    bidCount: 3,
    timeLeft: '02:14:33',
    isUrgent: false,
  },
  {
    id: 3,
    title: 'Custom Resin Ocean Table Lamp',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&auto=format&fit=crop',
    creator: { name: 'Priya Crafts', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop' },
    currentBid: '₹3,850',
    bidCount: 8,
    timeLeft: '04:05:00',
    isUrgent: false,
  },
  {
    id: 4,
    title: 'Limited Edition Comic Convention Badge 2019',
    image: 'https://images.unsplash.com/photo-1610486806085-f3769c3a38a3?q=80&w=400&auto=format&fit=crop',
    creator: { name: 'GeekVault', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=100&auto=format&fit=crop' },
    currentBid: '₹950',
    bidCount: 22,
    timeLeft: '00:15:40', // under 1 hr
    isUrgent: true,
  },
  {
    id: 5,
    title: 'Handmade Silver Filigree Earrings',
    image: 'https://images.unsplash.com/photo-1490288860714-eb065c71a355?q=80&w=400&auto=format&fit=crop',
    creator: { name: 'Lumina Jewels', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop' },
    currentBid: '₹1,200',
    bidCount: 5,
    timeLeft: '12:00:00',
    isUrgent: false,
  },
]

export function LiveAuctions() {
  return (
    <section className="py-[var(--space-8)] max-w-[var(--container-max)] mx-auto px-4 md:px-6 xl:px-6 overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-[var(--space-7)] animate-fade-up">
        <div className="flex items-center gap-[var(--space-4)]">
          <h2 className="text-display-lg text-[var(--color-ink-900)]">Live Auctions</h2>
          <Badge variant="urgent">LIVE NOW</Badge>
        </div>
        <Button variant="ghost">View All</Button>
      </div>

      {/* Rail */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-[20px] pb-[20px] hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 animate-fade-up [animation-delay:100ms]">
        {LIVE_AUCTIONS.map((auction) => (
          <div 
            key={auction.id}
            className="group flex-shrink-0 w-[280px] snap-start hover-card rounded-[var(--radius-md)] bg-[var(--color-white)] relative flex flex-col"
          >
            {/* Image */}
            <div className="w-full aspect-[4/5] rounded-t-[var(--radius-md)] overflow-hidden relative">
              <img
                src={auction.image}
                alt={auction.title}
                className="w-full h-full object-cover transition-transform duration-slow ease-default group-hover:scale-[1.04]"
              />
              {/* Countdown Chip */}
              <div 
                className={cn(
                  "absolute top-[var(--space-3)] right-[var(--space-3)] rounded-[var(--radius-pill)] px-[12px] py-[6px] transition-transform duration-slow ease-default group-hover:scale-105",
                  auction.isUrgent ? "bg-[var(--color-urgent-600)]" : "bg-[var(--color-slate-900)]/85"
                )}
              >
                <span className="text-caption text-white font-mono">{auction.timeLeft}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-[var(--space-4)] flex flex-col flex-1">
              {/* Creator row */}
              <div className="flex items-center gap-[var(--space-2)] mb-[var(--space-3)]">
                <Avatar src={auction.creator.avatar} initials={auction.creator.name[0]} size="small" />
                <span className="text-caption text-[var(--color-ink-700)] line-clamp-1">{auction.creator.name}</span>
              </div>

              {/* Title */}
              <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-[var(--space-2)] line-clamp-2 min-h-[48px]">
                {auction.title}
              </h3>

              <div className="flex-1" />

              {/* Bid row */}
              <div className="flex items-end justify-between mt-[var(--space-2)]">
                <div className="flex flex-col">
                  <span className="text-caption text-[var(--color-ink-500)]">Current Bid</span>
                  <span className="text-price text-[var(--color-ink-900)]">{auction.currentBid}</span>
                </div>
                <span className="text-caption text-[var(--color-ink-500)]">{auction.bidCount} bids</span>
              </div>
            </div>
          </div>
        ))}
        {/* Spacer for the .5 card peek effect on wide screens if we only have 5 cards */}
        <div className="w-[40px] shrink-0" />
      </div>

    </section>
  )
}
