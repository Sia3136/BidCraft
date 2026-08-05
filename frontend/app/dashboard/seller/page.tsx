'use client'

import React from 'react'
import { 
  TrendingUp, Users, ShoppingBag, Package, Star, Award, IndianRupee,
  Activity, ArrowRight, Eye, MessageSquare, Clock, Plus, BarChart2,
  AlertCircle, CheckCircle2, ChevronRight, Gavel
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function SellerDashboard() {
  return (
    <div className="space-y-8 font-[family-name:var(--font-jakarta)] pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-display-sm font-[family-name:var(--font-playfair)] text-[var(--color-ink-900)]">Seller Dashboard</h1>
          <p className="text-body-md text-[var(--color-ink-600)]">Welcome back, Studio Pottery. Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/seller/listings/new" className="bg-[var(--color-terracotta-600)] hover:bg-[var(--color-terracotta-700)] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Listing
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Revenue" value="₹8,45,200" trend="+12.5%" icon={IndianRupee} />
        <KPICard title="Pending Revenue" value="₹1,12,450" subtitle="In Escrow" icon={Clock} />
        <KPICard title="Total Orders" value="142" trend="+5.2%" icon={ShoppingBag} />
        <KPICard title="Active Listings" value="34" subtitle="4 out of stock" icon={Package} />
        <KPICard title="Conversion Rate" value="3.8%" trend="+0.4%" icon={Activity} />
        <KPICard title="Seller Rating" value="4.9/5" subtitle="128 Reviews" icon={Star} />
        <KPICard title="Returning Buyers" value="28%" trend="+2.1%" icon={Users} />
        <KPICard title="Auction Wins" value="45" subtitle="Avg +18% premium" icon={Award} />
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-card)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-heading-sm font-[family-name:var(--font-playfair)] text-[var(--color-ink-900)]">Revenue & Orders (6 Months)</h2>
            <select className="bg-[var(--color-cream-soft)] border border-[var(--color-border-subtle)] text-sm rounded-md px-3 py-1.5 focus:outline-none">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 h-[240px] pt-4 pb-2 border-b border-[var(--color-border-subtle)]">
            {/* CSS Bar Chart Simulation */}
            {[
              { m: 'Mar', rev: 45, ord: 30 },
              { m: 'Apr', rev: 55, ord: 40 },
              { m: 'May', rev: 40, ord: 28 },
              { m: 'Jun', rev: 75, ord: 55 },
              { m: 'Jul', rev: 85, ord: 60 },
              { m: 'Aug', rev: 100, ord: 75 }
            ].map((d, i) => (
              <div key={i} className="flex flex-col items-center justify-end w-full group relative">
                <div className="w-full flex justify-center gap-1.5 items-end h-[180px]">
                  <div className="w-1/3 bg-[var(--color-terracotta-200)] rounded-t-sm transition-all group-hover:bg-[var(--color-terracotta-300)]" style={{ height: `${d.ord}%` }} />
                  <div className="w-1/3 bg-[var(--color-terracotta-600)] rounded-t-sm shadow-sm transition-all group-hover:bg-[var(--color-terracotta-700)]" style={{ height: `${d.rev}%` }} />
                </div>
                <span className="text-xs text-[var(--color-ink-600)] mt-3 font-medium">{d.m}</span>
                
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  Rev: ₹{(d.rev * 1500).toLocaleString()}<br/>Orders: {d.ord * 2}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm text-[var(--color-ink-600)]">
              <div className="w-3 h-3 rounded-full bg-[var(--color-terracotta-600)]" /> Revenue
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--color-ink-600)]">
              <div className="w-3 h-3 rounded-full bg-[var(--color-terracotta-200)]" /> Orders
            </div>
          </div>
        </div>
        
        {/* Seller Insights */}
        <div className="bg-[var(--color-slate-900)] rounded-[var(--radius-lg)] p-6 text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <BarChart2 className="text-[var(--color-terracotta-400)] w-5 h-5" />
              <h2 className="text-heading-sm font-[family-name:var(--font-playfair)]">Seller Insights</h2>
            </div>
            
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-sm text-white/70">Best Selling Category</span>
                <span className="text-sm font-semibold">Ceramics & Pottery</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-sm text-white/70">Average Order Value</span>
                <span className="text-sm font-semibold">₹5,950</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-sm text-white/70">Visitor to Sale Ratio</span>
                <span className="text-sm font-semibold">1 in 26</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-sm text-white/70">Profile Completion</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-[var(--color-terracotta-500)]" />
                  </div>
                  <span className="text-xs font-semibold">85%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-white/5 p-4 rounded-xl border border-white/10">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[var(--color-terracotta-400)]" /> Suggested Action
            </h3>
            <p className="text-xs text-white/80 leading-relaxed mb-3">
              2 of your listings in "Collectibles" are running low on stock. Restock them to maintain your search ranking.
            </p>
            <button className="text-xs font-semibold text-[var(--color-terracotta-400)] hover:text-[var(--color-terracotta-300)] flex items-center gap-1 transition-colors">
              Manage Inventory <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Orders */}
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] overflow-hidden flex flex-col">
          <div className="p-5 flex justify-between items-center border-b border-[var(--color-border-subtle)]">
            <h2 className="text-heading-sm font-[family-name:var(--font-playfair)] text-[var(--color-ink-900)]">Recent Orders</h2>
            <Link href="#" className="text-sm text-[var(--color-terracotta-600)] font-semibold hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--color-cream-soft)] text-[var(--color-ink-600)] text-xs uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Item / Buyer</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)] text-[var(--color-ink-900)]">
                {[
                  { item: 'Hand-painted Vase', buyer: 'Arjun M.', amount: '₹4,500', status: 'Processing', color: 'text-amber-700 bg-amber-50 border-amber-200' },
                  { item: 'Vintage Brass Lamp', buyer: 'Priya S.', amount: '₹12,800', status: 'In Transit', color: 'text-blue-700 bg-blue-50 border-blue-200' },
                  { item: 'Teakwood Coffee Table', buyer: 'Rahul V.', amount: '₹24,000', status: 'Delivered', color: 'text-green-700 bg-green-50 border-green-200' },
                  { item: 'Terracotta Planters Set', buyer: 'Anita D.', amount: '₹2,200', status: 'Escrow', color: 'text-purple-700 bg-purple-50 border-purple-200' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[var(--color-cream-base)] transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[var(--color-ink-900)]">{row.item}</p>
                      <p className="text-xs text-[var(--color-ink-600)] mt-0.5">by {row.buyer}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold">{row.amount}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${row.color}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performing Listings */}
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] overflow-hidden flex flex-col">
          <div className="p-5 flex justify-between items-center border-b border-[var(--color-border-subtle)]">
            <h2 className="text-heading-sm font-[family-name:var(--font-playfair)] text-[var(--color-ink-900)]">Top Performing Listings</h2>
            <Link href="#" className="text-sm text-[var(--color-terracotta-600)] font-semibold hover:underline">Manage All</Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--color-cream-soft)] text-[var(--color-ink-600)] text-xs uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Listing</th>
                  <th className="px-5 py-3">Stats</th>
                  <th className="px-5 py-3">Stock/Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)] text-[var(--color-ink-900)]">
                {[
                  { img: 'https://res.cloudinary.com/duzlsyzwa/image/upload/v1785910327/bidcraft_homepage/vleothtzrxgybsvw0fsx.webp', name: 'Ceramic Serving Bowl', type: 'Buy Now', views: 1240, sales: 45, stock: 12 },
                  { img: 'https://res.cloudinary.com/duzlsyzwa/image/upload/v1785910328/bidcraft_homepage/w3psq5cxxuugl6bn2086.jpg', name: 'Macrame Wall Hanging', type: 'Offer', views: 890, sales: 18, stock: 4 },
                  { img: 'https://res.cloudinary.com/duzlsyzwa/image/upload/v1785910330/bidcraft_homepage/aetwfouct5hgdfgebllo.jpg', name: 'Original Oil Canvas', type: 'Auction', views: 2100, bids: 34, stock: 1 },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[var(--color-cream-base)] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 shrink-0 relative">
                          <Image src={row.img} fill className="object-cover" alt={row.name} sizes="40px" />
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-[var(--color-ink-900)] line-clamp-1">{row.name}</p>
                          <span className="text-[10px] uppercase font-bold text-[var(--color-terracotta-600)] tracking-wider">{row.type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs">
                      <div className="flex items-center gap-1.5 text-[var(--color-ink-600)] mb-0.5">
                        <Eye className="w-3.5 h-3.5" /> {row.views}
                      </div>
                      <div className="flex items-center gap-1.5 text-[var(--color-terracotta-600)] font-semibold">
                        {row.type === 'Auction' ? <Gavel className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />} 
                        {row.type === 'Auction' ? `${row.bids} Bids` : `${row.sales} Sales`}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {row.type === 'Auction' ? (
                         <span className="px-2 py-1 text-[10px] font-bold rounded bg-red-100 text-red-700 animate-pulse">Live</span>
                      ) : (
                         <span className={`text-xs font-semibold ${row.stock <= 5 ? 'text-amber-600' : 'text-green-600'}`}>
                           {row.stock} in stock
                         </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

function KPICard({ title, value, trend, subtitle, icon: Icon }: any) {
  return (
    <div className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-[var(--duration-base)]">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-full bg-[var(--color-cream-soft)] border border-[var(--color-cream-dark)] flex items-center justify-center text-[var(--color-terracotta-600)]">
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-bold px-2 py-1 rounded-full",
            trend.startsWith('+') ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--color-ink-600)] mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-[var(--color-ink-900)] tracking-tight">{value}</h3>
        {subtitle && (
          <p className="text-xs text-[var(--color-ink-500)] mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
