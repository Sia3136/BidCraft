'use client'

import React from 'react'
import Link from 'next/link'
import { AlertCircle, FileText, IndianRupee, Package, Tag } from 'lucide-react'

// Mock Data
const stats = [
  { label: 'Active Listings', value: '15', icon: FileText },
  { label: 'Pending Orders', value: '4', icon: Package },
  { label: 'Unread Offers', value: '7', icon: Tag },
  { label: '30-Day Revenue', value: '₹42,500', icon: IndianRupee, isHighlight: true },
]

const needsAttention = [
  { id: 1, type: 'offer', title: 'New offer for "Vintage Rolex"', detail: 'Offer: ₹40,000 (Expires in 2h)', badge: 'Urgent', badgeColor: 'bg-urgent-100 text-urgent-700' },
  { id: 2, type: 'ship', title: 'Ship order #ORD-8921', detail: 'Buyer: Alex M. (Due tomorrow)', badge: 'Action Required', badgeColor: 'bg-terracotta-100 text-terracotta-700' },
  { id: 3, type: 'dispute', title: 'Dispute opened for "Handcrafted Vase"', detail: 'Reason: Item damaged in transit', badge: 'Critical', badgeColor: 'bg-urgent-600 text-white' },
]

// Simple SVG Line Chart Component
function RevenueChart() {
  const points = "0,80 20,70 40,75 60,50 80,45 100,55 120,30 140,25 160,35 180,15 200,5"
  
  return (
    <div className="w-full h-48 relative mt-4">
      {/* Y-Axis Gridlines */}
      <div className="absolute inset-0 flex flex-col justify-between">
        {[50, 40, 30, 20, 10, 0].map((val, i) => (
          <div key={i} className="flex items-center w-full">
            <span className="text-caption text-ink-300 w-8">{val}k</span>
            <div className="flex-1 border-t border-ink-100 ml-2" />
          </div>
        ))}
      </div>
      
      {/* SVG Line */}
      <div className="absolute inset-0 ml-10 mb-5 overflow-hidden">
        <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
          <polyline 
            points={points} 
            fill="none" 
            stroke="var(--color-terracotta-600)" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Fill Gradient underneath */}
          <polygon 
            points={`0,100 ${points} 200,100`} 
            fill="url(#revenueGradient)" 
            opacity="0.1" 
          />
          <defs>
            <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--color-terracotta-600)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* X-Axis Labels */}
      <div className="absolute bottom-0 left-10 right-0 flex justify-between text-caption text-ink-300 px-2">
        <span>Jun 1</span>
        <span>Jun 15</span>
        <span>Jun 30</span>
      </div>
    </div>
  )
}

export default function SellerDashboardPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-end border-b border-border-subtle pb-6">
        <div>
          <h1 className="text-display-md text-foreground mb-2">Seller Overview</h1>
          <p className="text-body-md text-ink-500">Manage your store, fulfill orders, and track your performance.</p>
        </div>
        <Link href="/dashboard/seller/listings/new">
          <button className="bg-terracotta-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-terracotta-700 transition-colors">
            + New Listing
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className={`bg-white rounded-md shadow-card p-6 border hover-card ${stat.isHighlight ? 'border-terracotta-100 ring-1 ring-terracotta-100' : 'border-border-subtle'}`}>
              <div className="flex justify-between items-start mb-2">
                <span className={`text-display-md ${stat.isHighlight ? 'text-terracotta-600' : 'text-foreground'}`}>
                  {stat.value}
                </span>
                <Icon className={`w-4 h-4 ${stat.isHighlight ? 'text-terracotta-600' : 'text-ink-300'}`} />
              </div>
              <p className="text-caption text-ink-500">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <h2 className="text-heading-lg mb-4">Revenue</h2>
          <div className="bg-cream-raised rounded-md border border-border-subtle shadow-card p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-body-lg font-medium text-ink-900">Last 30 Days</h3>
              <select className="bg-transparent border border-border-subtle rounded-md text-sm px-2 py-1 text-ink-700 focus:outline-none focus:ring-2 focus:ring-terracotta-600">
                <option>Last 30 Days</option>
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Year</option>
              </select>
            </div>
            <RevenueChart />
          </div>
        </div>

        {/* Needs Attention */}
        <div>
          <h2 className="text-heading-lg mb-4 flex items-center gap-2">
            Needs Attention <AlertCircle className="w-5 h-5 text-urgent-600" />
          </h2>
          <div className="space-y-3">
            {needsAttention.map((item) => (
              <div key={item.id} className="bg-white rounded-md border border-border-subtle shadow-card p-4 hover-card cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-body-md font-semibold text-ink-900 leading-tight pr-2">{item.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm whitespace-nowrap ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-caption text-ink-500">{item.detail}</p>
                <div className="mt-3 flex justify-end">
                  <button className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 transition-colors">
                    Take Action &rarr;
                  </button>
                </div>
              </div>
            ))}
            
            {needsAttention.length === 0 && (
              <div className="text-center p-8 bg-cream-raised rounded-md border border-border-subtle">
                <p className="text-body-md text-ink-500">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
