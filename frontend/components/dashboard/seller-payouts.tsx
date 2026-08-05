'use client'

import React, { useEffect, useState } from 'react'

export function SellerPayouts() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/orders?role=seller`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } catch (err) {

    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading payouts...</div>
  
  // Filter only orders that are relevant to payouts (delivered, completed, or shipped)
  const payoutOrders = orders.filter(o => ['shipped', 'delivered', 'completed'].includes(o.status))

  if (payoutOrders.length === 0) return <div className="p-8 text-center text-muted-foreground bg-card border border-border rounded-xl">No payout history available.</div>

  return (
    <div className="space-y-4">
      {payoutOrders.map(order => (
        <div key={order.id} className="p-6 bg-card border border-border rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-bold text-lg mb-1">{order.listing_title}</h3>
            <p className="text-sm text-muted-foreground">Order #{order.id} • Buyer: {order.buyer_name}</p>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-extrabold text-foreground">${order.total_amount}</p>
            <div className="mt-1">
              {order.status === 'completed' ? (
                <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-semibold rounded-md uppercase tracking-wider">
                  Released
                </span>
              ) : order.status === 'delivered' ? (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-semibold rounded-md uppercase tracking-wider">
                  In Inspection (24h)
                </span>
              ) : (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-semibold rounded-md uppercase tracking-wider">
                  Held in Escrow
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
