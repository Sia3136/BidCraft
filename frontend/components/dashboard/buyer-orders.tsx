'use client'

import React, { useEffect, useState } from 'react'
import { confirmDelivery } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

export function BuyerOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuthStore()

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/orders?role=buyer`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelivery = async (orderId: number) => {
    if (!token) return;
    try {
      await confirmDelivery(orderId.toString(), token)
      alert('Delivery confirmed! Payment will be released to the seller.')
      loadOrders()
    } catch (err: any) {
      alert('Failed to confirm delivery: ' + err.message)
    }
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading orders...</div>
  if (orders.length === 0) return <div className="p-8 text-center text-muted-foreground bg-card border border-border rounded-xl">No orders found.</div>

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order.id} className="p-6 bg-card border border-border rounded-xl shadow-sm flex flex-col md:flex-row gap-6 items-center">
          <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden shrink-0">
            {order.listing_photos && order.listing_photos[0] ? (
              <img src={order.listing_photos[0]} alt={order.listing_title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No img</div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">{order.listing_title}</h3>
            <p className="text-sm text-muted-foreground">Order #{order.id} • Total: ${order.total_amount}</p>
            <div className="mt-2 text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-md inline-block uppercase tracking-wider">
              {order.status}
            </div>
            
            {order.status === 'shipped' && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-blue-400 mb-2 font-semibold">Your item has been shipped!</p>
                <button
                  onClick={() => handleConfirmDelivery(order.id)}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition-colors"
                >
                  Confirm Delivery
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
