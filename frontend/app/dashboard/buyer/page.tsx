'use client'

import React, { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { BuyerOrders } from '@/components/dashboard/buyer-orders'
import { BuyerDisputes } from '@/components/dashboard/buyer-disputes'
import { useAuth } from '@/lib/auth-context'

export default function BuyerDashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'orders' | 'disputes'>('orders')

  if (!user) return <div className="p-8 text-center mt-20">Please sign in.</div>

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 mt-16">
        <div className="mb-8 border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Buyer Dashboard</h1>
          <p className="text-muted-foreground">Manage your purchases, track shipments, and confirm deliveries.</p>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === 'orders' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            My Orders
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === 'disputes' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            My Disputes
          </button>
        </div>

        <div>
          {activeTab === 'orders' && <BuyerOrders />}
          {activeTab === 'disputes' && <BuyerDisputes />}
        </div>
      </main>
    </div>
  )
}
