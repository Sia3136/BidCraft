'use client'

import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'

export function SellerOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState('')
  const [shippingOrderId, setShippingOrderId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { token } = useAuthStore()

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/orders?role=seller`, {
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

  const handleAddTracking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shippingOrderId || !token) return

    try {
      setSubmitting(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/shipments/${shippingOrderId}/tracking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tracking_number: trackingNumber, carrier })
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to add tracking')
      }

      alert('Tracking information added successfully!')
      setShippingOrderId(null)
      setTrackingNumber('')
      setCarrier('')
      loadOrders()
    } catch (err: any) {
      alert('Failed: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading orders...</div>
  if (orders.length === 0) return <div className="p-8 text-center text-muted-foreground bg-card border border-border rounded-xl">No orders to fulfill.</div>

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order.id} className="p-6 bg-card border border-border rounded-xl shadow-sm flex flex-col md:flex-row gap-6 items-start">
          <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden shrink-0">
            {order.listing_photos && order.listing_photos[0] ? (
              <img src={order.listing_photos[0]} alt={order.listing_title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No img</div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{order.listing_title}</h3>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-md uppercase tracking-wider">
                {order.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Order #{order.id} • Buyer: {order.buyer_name} • Total: ${order.total_amount}</p>
            
            {order.shipping_address && (
              <div className="mb-4 p-3 bg-muted rounded-lg border border-border text-sm">
                <p className="font-semibold mb-1">Shipping Address:</p>
                <p>{order.shipping_address.fullName}</p>
                <p>{order.shipping_address.addressLine1} {order.shipping_address.addressLine2}</p>
                <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}</p>
                <p>{order.shipping_address.country}</p>
              </div>
            )}

            {order.status === 'paid' && (
              shippingOrderId === order.id ? (
                <form onSubmit={handleAddTracking} className="p-4 border border-border rounded-lg bg-background mt-4 space-y-3">
                  <h4 className="font-semibold text-sm">Add Tracking Info</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Carrier (e.g. FedEx)"
                      required
                      value={carrier}
                      onChange={e => setCarrier(e.target.value)}
                      className="px-3 py-2 bg-muted border border-border rounded-md text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Tracking Number"
                      required
                      value={trackingNumber}
                      onChange={e => setTrackingNumber(e.target.value)}
                      className="px-3 py-2 bg-muted border border-border rounded-md text-sm"
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <button type="button" onClick={() => setShippingOrderId(null)} className="px-4 py-2 text-sm text-muted-foreground hover:bg-muted rounded-md">Cancel</button>
                    <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-primary text-primary-foreground font-semibold rounded-md">
                      {submitting ? 'Saving...' : 'Save & Mark Shipped'}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShippingOrderId(order.id)}
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg shadow-sm hover:bg-primary/90 transition-colors mt-2"
                >
                  Ship Item
                </button>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
