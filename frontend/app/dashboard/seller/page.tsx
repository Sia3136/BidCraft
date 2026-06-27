'use client'

import React, { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { SellerOrders } from '@/components/dashboard/seller-orders'
import { SellerPayouts } from '@/components/dashboard/seller-payouts'
import { useAuth } from '@/lib/auth-context'

export default function SellerDashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'orders' | 'payouts'>('orders')

  if (!user) return <div className="p-8 text-center mt-20">Please sign in.</div>

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 mt-16">
        <div className="mb-8 border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Seller Dashboard</h1>
          <p className="text-muted-foreground">Manage your sales, fulfill orders, and track your escrow payouts.</p>
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
            To Fulfill
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === 'payouts' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Payouts & Escrow
          </button>
        </div>

        <div>
          {activeTab === 'orders' && <SellerOrders />}
          {activeTab === 'payouts' && <SellerPayouts />}
        </div>
      </main>
    </div>
  )
}
