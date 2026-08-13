'use client'

import React, { useEffect, useState } from 'react'
import { DashboardShell } from '@/components/dashboard-shell'
import { authenticatedFetch } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TrendingUp, Users, DollarSign, Clock } from 'lucide-react'

export default function AnalyticsPage() {
  const { token } = useAuthStore()
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller/listings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        setListings(data.listings || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchListings()
  }, [token])
  
  // Deterministic mock views based on listing ID
  const listingsWithViews = listings.map(l => ({
    ...l,
    views: 120 + ((l.id * 17) % 680)
  })).sort((a, b) => b.views - a.views)

  const totalViews = listingsWithViews.reduce((acc, curr) => acc + curr.views, 0)
  
  // Mock chart data (last 7 days)
  const chartData = [
    { name: 'Mon', revenue: 4200 },
    { name: 'Tue', revenue: 3100 },
    { name: 'Wed', revenue: 6800 },
    { name: 'Thu', revenue: 2400 },
    { name: 'Fri', revenue: 8900 },
    { name: 'Sat', revenue: 11200 },
    { name: 'Sun', revenue: 9500 },
  ]
  
  const totalRevenue = chartData.reduce((acc, curr) => acc + curr.revenue, 0)

  if (loading) {
    return <DashboardShell><div className="p-8 text-center text-[var(--color-ink-500)]">Loading analytics...</div></DashboardShell>
  }

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-display-sm font-display text-[var(--color-ink-900)]">Analytics Dashboard</h1>
          <p className="text-[var(--color-ink-500)] mt-1">Track your store's performance and visitor engagement.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-[var(--color-ink-500)]">
              <Users className="w-5 h-5" />
              <h3 className="text-body-md font-medium">Total Views</h3>
            </div>
            <p className="text-display-md font-display text-[var(--color-ink-900)]">{totalViews.toLocaleString()}</p>
          </div>
          
          <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-[var(--color-ink-500)]">
              <DollarSign className="w-5 h-5" />
              <h3 className="text-body-md font-medium">Total Revenue</h3>
            </div>
            <p className="text-display-md font-display text-[var(--color-ink-900)]">₹{totalRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-[var(--color-ink-500)]">
              <TrendingUp className="w-5 h-5" />
              <h3 className="text-body-md font-medium">Conversion Rate</h3>
            </div>
            <p className="text-display-md font-display text-[var(--color-ink-900)]">3.2%</p>
          </div>

          <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-[var(--color-ink-500)]">
              <Clock className="w-5 h-5" />
              <h3 className="text-body-md font-medium">Avg Response</h3>
            </div>
            <p className="text-display-md font-display text-[var(--color-ink-900)]">2.4 hrs</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] shadow-sm">
          <h2 className="text-heading-sm font-display text-[var(--color-ink-900)] mb-6">Revenue (Last 7 Days)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} tickFormatter={(val) => `₹${val}`} dx={-10} />
                <Tooltip 
                  cursor={{ fill: 'rgba(200,100,58,0.05)' }} 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E5E5', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: any) => [`₹${value}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="var(--color-terracotta-600)" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Listings Table */}
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[var(--color-border-subtle)]">
            <h2 className="text-heading-sm font-display text-[var(--color-ink-900)]">Top Listings by Views</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-cream-base)] border-b border-[var(--color-border-subtle)]">
                  <th className="px-6 py-4 text-caption font-bold text-[var(--color-ink-500)] uppercase tracking-wider">Listing Title</th>
                  <th className="px-6 py-4 text-caption font-bold text-[var(--color-ink-500)] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-caption font-bold text-[var(--color-ink-500)] uppercase tracking-wider text-right">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)]">
                {listingsWithViews.slice(0, 5).map((listing, idx) => (
                  <tr key={idx} className="hover:bg-[var(--color-cream-base)] transition-colors">
                    <td className="px-6 py-4 text-body-sm font-medium text-[var(--color-ink-900)] truncate max-w-[300px]">
                      {listing.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-body-sm font-medium text-[var(--color-ink-900)] text-right">
                      {listing.views.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {listingsWithViews.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-[var(--color-ink-500)]">
                      No listings found. Start selling to see analytics!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardShell>
  )
}
