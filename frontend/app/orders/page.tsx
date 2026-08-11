'use client'
import { authenticatedFetch } from '@/lib/api'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'
import Image from 'next/image'
import { Package, ChevronRight } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL

function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export default function OrdersPage() {
  const { isAuthenticated, token } = useAuthStore()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth?returnTo=/orders')
      return
    }

    const fetchOrders = async () => {
      try {
        const res = await authenticatedFetch(`${API_BASE}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setOrders(data.orders || [])
        }
      } catch (e) {
        console.error('Failed to fetch orders:', e)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [isAuthenticated, token, router])

  if (loading) return <div className="p-8 text-center text-body-md">Loading...</div>

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 py-8 mt-[80px]">
      <h1 className="text-heading-lg font-display text-[var(--color-ink-900)] mb-6 flex items-center gap-2">
        <Package className="w-6 h-6" /> Previous Orders
      </h1>

      {orders.length === 0 ? (
        <div className="bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] p-12 flex flex-col items-center justify-center text-center border border-[var(--color-border-subtle)]">
          <h2 className="text-heading-md text-[var(--color-ink-900)] mb-2">You haven't placed any orders yet.</h2>
          <p className="text-body-md text-[var(--color-ink-500)] mb-6">Discover unique items and place your first order.</p>
          <Link href="/explore" className="bg-[var(--color-terracotta-600)] text-white px-6 py-2.5 rounded-[var(--radius-pill)] font-medium text-body-md hover:bg-[var(--color-terracotta-700)] transition-colors">
            Start exploring →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Link 
              href={`/orders/${order.id}`} 
              key={order.id}
              className="bg-[var(--color-white)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] p-4 flex items-center gap-4 hover:shadow-[var(--shadow-card)] transition-shadow group"
            >
              <div className="w-12 h-12 relative rounded-[var(--radius-sm)] overflow-hidden shrink-0 bg-[var(--color-cream-deep)]">
                {order.listing_photos && order.listing_photos[0] ? (
                  <Image src={order.listing_photos[0]} alt="thumbnail" fill className="object-cover" />
                ) : null}
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <span className="text-body-md font-bold text-[var(--color-ink-900)] truncate">
                  {order.listing_title || 'Item'}
                </span>
                <span className="text-caption text-[var(--color-ink-500)]">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-body-lg font-bold text-[var(--color-ink-900)]">
                  {formatPrice(order.amount)}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-bold uppercase tracking-wider ${
                    order.status === 'delivered' ? 'bg-[var(--color-success-100)] text-[var(--color-success-700)]' :
                    order.status === 'shipped' ? 'bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)]' :
                    'bg-[var(--color-cream-deep)] text-[var(--color-ink-700)]'
                  }`}>
                    {order.status}
                  </span>
                  {order.escrow_status && (
                    <span className="px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-bold uppercase tracking-wider bg-[var(--color-ink-100)] text-[var(--color-ink-700)]">
                      Escrow: {order.escrow_status}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-ink-300)] group-hover:text-[var(--color-terracotta-600)] transition-colors ml-2" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}


