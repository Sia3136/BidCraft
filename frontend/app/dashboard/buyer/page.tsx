'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowUpRight, Clock, ShieldCheck, TrendingUp } from 'lucide-react'

// Mock Data
const stats = [
  { label: 'Active Orders', value: '3', trend: '+1', icon: ShieldCheck },
  { label: 'Active Bids', value: '12', trend: '+4', icon: TrendingUp },
  { label: 'Pending Offers', value: '2', icon: Clock },
  { label: 'Wishlist Items', value: '24', icon: ArrowUpRight },
]

const recentActivity = [
  { id: 1, type: 'outbid', text: 'Your bid on Vintage Rolex was outbid', time: '2m ago', color: 'bg-urgent-600' },
  { id: 2, type: 'shipped', text: 'Your order "Handcrafted Vase" has shipped', time: '1h ago', color: 'bg-success-600' },
  { id: 3, type: 'offer', text: 'Seller countered your offer for "Typewriter"', time: '3h ago', color: 'bg-terracotta-600' },
]

const auctionsEndingSoon = [
  { id: 1, title: 'Sony Walkman TPS-L2', currentBid: '₹4,500', timeRemaining: '12m 40s', image: 'https://images.unsplash.com/photo-1608667508764-33cf0726b13a?w=800&q=80' },
  { id: 2, title: 'Vintage Polaroid 600', currentBid: '₹2,800', timeRemaining: '1h 15m', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80' },
]

export default function BuyerDashboardPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-end border-b border-border-subtle pb-6">
        <div>
          <h1 className="text-display-md text-foreground mb-2">Buyer Overview</h1>
          <p className="text-body-md text-ink-500">Welcome back. Here's a summary of your buying activity.</p>
        </div>
        <Link href="/collections">
          <button className="bg-terracotta-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-terracotta-700 transition-colors">
            Explore Marketplace
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="bg-white rounded-md shadow-card p-6 border border-border-subtle hover-card">
              <div className="flex justify-between items-start mb-2">
                <span className="text-display-md text-foreground">{stat.value}</span>
                {stat.trend && (
                  <span className="flex items-center text-xs font-medium text-success-700 bg-success-100 px-2 py-0.5 rounded-full">
                    {stat.trend} <Icon className="w-3 h-3 ml-1" />
                  </span>
                )}
                {!stat.trend && <Icon className="w-4 h-4 text-ink-300" />}
              </div>
              <p className="text-caption text-ink-500">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <h2 className="text-heading-lg mb-4">Recent Activity</h2>
          <div className="bg-white rounded-md border border-border-subtle shadow-card p-4">
            <div className="space-y-1">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className="group flex items-center justify-between p-3 rounded-md hover:bg-cream-raised cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${activity.color}`} />
                    <p className="text-body-md text-ink-900 group-hover:text-terracotta-700 transition-colors">{activity.text}</p>
                  </div>
                  <span className="text-caption text-ink-500">{activity.time}</span>
                </div>
              ))}
            </div>
            <button className="w-full text-center text-sm font-medium text-terracotta-600 hover:text-terracotta-700 mt-4 py-2 border-t border-border-subtle">
              View all activity
            </button>
          </div>
        </div>

        {/* Auctions Ending Soon */}
        <div>
          <h2 className="text-heading-lg mb-4">Ending Soon</h2>
          <div className="space-y-4">
            {auctionsEndingSoon.map((auction) => (
              <div key={auction.id} className="flex gap-4 bg-white rounded-md border border-border-subtle p-3 hover-card cursor-pointer">
                <div className="w-20 h-20 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                  <img src={auction.image} alt={auction.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <h4 className="text-heading-sm truncate">{auction.title}</h4>
                  <div className="flex justify-between items-end mt-2">
                    <div>
                      <p className="text-[10px] text-ink-500 font-medium uppercase tracking-wider mb-0.5">Current Bid</p>
                      <p className="text-price text-terracotta-600 leading-none">{auction.currentBid}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-urgent-100 text-urgent-700 text-xs font-semibold px-2 py-0.5 rounded-sm">
                        {auction.timeRemaining}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
