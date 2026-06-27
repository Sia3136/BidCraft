'use client'

import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/analytics`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        })
        if (res.ok) {
          const data = await res.json()
          setAnalytics(data)
        }
      } catch (err) {
        console.error('Failed to load analytics', err)
      } finally {
        setLoading(false)
      }
    }
    loadAnalytics()
  }, [])

  if (!user || user.role !== 'admin') {
    return <div className="p-16 text-center text-red-500 font-bold">Unauthorized. Admins only.</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {loading ? (
          <p className="text-muted-foreground">Loading analytics...</p>
        ) : analytics ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <h3 className="text-muted-foreground text-sm font-semibold mb-2">Total Users</h3>
              <p className="text-3xl font-bold">{analytics.totalUsers}</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <h3 className="text-muted-foreground text-sm font-semibold mb-2">Active Listings</h3>
              <p className="text-3xl font-bold">{analytics.activeListings}</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <h3 className="text-muted-foreground text-sm font-semibold mb-2">Completed Orders</h3>
              <p className="text-3xl font-bold">{analytics.completedOrders}</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <h3 className="text-muted-foreground text-sm font-semibold mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600">${analytics.totalRevenue}</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <h3 className="text-muted-foreground text-sm font-semibold mb-2">Pending Disputes</h3>
              <p className="text-3xl font-bold text-red-500">{analytics.pendingDisputes}</p>
            </div>
          </div>
        ) : null}

        <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/disputes" className="block bg-card border border-border p-6 rounded-xl hover:border-primary transition-colors">
            <h3 className="font-bold text-lg mb-2">Manage Disputes</h3>
            <p className="text-muted-foreground text-sm">Review and resolve buyer/seller conflicts.</p>
          </Link>
          <Link href="/admin/moderation" className="block bg-card border border-border p-6 rounded-xl hover:border-primary transition-colors">
            <h3 className="font-bold text-lg mb-2">Moderation Tools</h3>
            <p className="text-muted-foreground text-sm">Moderate active listings and user accounts.</p>
          </Link>
          <Link href="/admin/kyc" className="block bg-card border border-border p-6 rounded-xl hover:border-primary transition-colors">
            <h3 className="font-bold text-lg mb-2">KYC Verifications</h3>
            <p className="text-muted-foreground text-sm">Review pending seller identity checks.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
