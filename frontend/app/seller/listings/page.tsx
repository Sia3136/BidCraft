'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { fetchSellerListings, fetchSellerOrders, deleteListing, shipOrder } from '@/lib/api'
import { formatPrice } from '@/lib/formatPrice'
import Link from 'next/link'
import { Package, Tag, Clock, Trash2, Edit3, Truck } from 'lucide-react'

export default function SellerDashboard() {
  const router = useRouter()
  const { isAuthenticated, token } = useAuthStore()
  const [tab, setTab] = useState<'listings' | 'orders'>('listings')
  
  const [listings, setListings] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Shipping form state
  const [shippingOrderId, setShippingOrderId] = useState<string | null>(null)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState('India Post')

  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated) {
      router.push('/auth?returnTo=/seller/listings')
      return
    }

    async function loadData() {
      setLoading(true)
      try {
        if (tab === 'listings') {
          const data = await fetchSellerListings(token!)
          setListings(data.listings)
        } else {
          const data = await fetchSellerOrders(token!)
          setOrders(data.orders)
        }
      } catch (err) {
        console.error('Failed to load seller data', err)
        if (tab === 'orders') setOrders([])
      } finally {
        setLoading(false)
      }
    }
    if (token) loadData()
  }, [tab, isAuthenticated, router, token])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return
    try {
      await deleteListing(id, token!)
      setListings(listings.map(l => l.id === id ? { ...l, status: 'deleted' } : l))
    } catch (err) {
      alert('Failed to delete listing')
    }
  }

  const handleShip = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shippingOrderId) return
    try {
      await shipOrder(shippingOrderId, { trackingNumber, carrier }, token!)
      setOrders(orders.map(o => o.id === shippingOrderId ? { ...o, escrowState: 'shipped' } : o))
      setShippingOrderId(null)
      setTrackingNumber('')
    } catch (err) {
      alert('Failed to update shipment')
    }
  }

  if (loading && listings.length === 0 && orders.length === 0) return <div className="p-12 text-center text-[var(--color-ink-500)]">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-[var(--color-ink-900)]">Seller Dashboard</h1>
        <Link href="/sell/new" className="px-6 py-3 bg-[var(--color-terracotta-600)] text-white font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors">
          Create New Listing
        </Link>
      </div>

      <div className="flex gap-8 border-b border-[var(--color-border-subtle)] mb-8">
        <button 
          onClick={() => setTab('listings')} 
          className={`pb-4 font-bold text-lg border-b-2 transition-colors ${tab === 'listings' ? 'border-[var(--color-terracotta-600)] text-[var(--color-ink-900)]' : 'border-transparent text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)]'}`}
        >
          My Listings
        </button>
        <button 
          onClick={() => setTab('orders')} 
          className={`pb-4 font-bold text-lg border-b-2 transition-colors ${tab === 'orders' ? 'border-[var(--color-terracotta-600)] text-[var(--color-ink-900)]' : 'border-transparent text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)]'}`}
        >
          My Orders
        </button>
      </div>

      {tab === 'listings' && (
        <div>
          {listings.length === 0 && !loading ? (
            <div className="text-center py-24 bg-[var(--color-cream-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
              <Package className="w-16 h-16 text-[var(--color-ink-300)] mx-auto mb-4" />
              <p className="text-xl font-bold text-[var(--color-ink-900)] mb-2">You haven't created any listings yet.</p>
              <Link href="/sell/new" className="text-[var(--color-terracotta-600)] font-medium hover:underline">Create your first listing →</Link>
            </div>
          ) : (
            <div className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[var(--color-cream-raised)] border-b border-[var(--color-border-subtle)]">
                  <tr>
                    <th className="p-4 text-sm font-bold text-[var(--color-ink-500)]">Listing</th>
                    <th className="p-4 text-sm font-bold text-[var(--color-ink-500)]">Price</th>
                    <th className="p-4 text-sm font-bold text-[var(--color-ink-500)]">Status</th>
                    <th className="p-4 text-sm font-bold text-[var(--color-ink-500)]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-subtle)]">
                  {listings.map(listing => (
                    <tr key={listing.id} className={listing.status === 'deleted' ? 'opacity-50' : ''}>
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-[var(--radius-sm)] overflow-hidden bg-[var(--color-cream-deep)] shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            {listing.image && <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <Link href={`/product/${listing.id}`} className="font-bold text-[var(--color-ink-900)] hover:underline block">{listing.title}</Link>
                            <span className="text-xs font-medium text-[var(--color-ink-500)] bg-[var(--color-cream-raised)] px-2 py-0.5 rounded-full inline-block mt-1">
                              {listing.buyingMethod}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-[var(--color-ink-900)]">
                        {listing.buyingMethod === 'Auction' ? (
                          <div className="flex flex-col">
                            <span>{formatPrice(listing.currentBid)} <span className="text-xs text-[var(--color-ink-500)] font-normal">current</span></span>
                            <span className="text-xs text-[var(--color-ink-500)] font-normal">{listing.bidCount} bids</span>
                          </div>
                        ) : (
                          formatPrice(listing.price)
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                          listing.status === 'active' ? 'bg-[var(--color-success-100)] text-[var(--color-success-600)]' :
                          listing.status === 'deleted' ? 'bg-[var(--color-urgent-100)] text-[var(--color-urgent-600)]' :
                          'bg-[var(--color-ink-100)] text-[var(--color-ink-600)]'
                        }`}>
                          {listing.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button disabled className="p-2 text-[var(--color-ink-500)] hover:bg-[var(--color-cream-raised)] rounded-[var(--radius-sm)]" title="Edit (Coming soon)">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {listing.status === 'active' && (
                            <button onClick={() => handleDelete(listing.id)} className="p-2 text-[var(--color-urgent-600)] hover:bg-[var(--color-urgent-100)] rounded-[var(--radius-sm)]" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'orders' && (
        <div>
          {(orders ?? []).length === 0 && !loading ? (
            <div className="text-center py-24 bg-[var(--color-cream-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
              <Tag className="w-16 h-16 text-[var(--color-ink-300)] mx-auto mb-4" />
              <p className="text-xl font-bold text-[var(--color-ink-900)] mb-2">You haven't made any sales yet.</p>
              <p className="text-[var(--color-ink-500)]">Keep sharing your listings!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {(orders ?? []).map(order => (
                <div key={order.id} className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] p-6">
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-[var(--color-border-subtle)]">
                    <div>
                      <p className="text-sm text-[var(--color-ink-500)] mb-1">Order #{order.id} • {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p className="text-lg font-bold text-[var(--color-ink-900)]">Buyer: {order.buyerName} ({order.buyerEmail})</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[var(--color-terracotta-600)]">{formatPrice(order.amount)}</p>
                      <span className={`inline-block mt-2 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                        order.escrowState === 'held' ? 'bg-[#FFF3E0] text-[#E65100]' :
                        order.escrowState === 'shipped' ? 'bg-[#E3F2FD] text-[#1565C0]' :
                        order.escrowState === 'released' ? 'bg-[var(--color-success-100)] text-[var(--color-success-600)]' :
                        order.escrowState === 'disputed' ? 'bg-[var(--color-urgent-100)] text-[var(--color-urgent-600)]' :
                        'bg-[var(--color-ink-100)] text-[var(--color-ink-600)]'
                      }`}>
                        {order.escrowState || order.orderStatus}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-[var(--radius-sm)] overflow-hidden bg-[var(--color-cream-deep)] shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {order.listingImage && <img src={order.listingImage} alt={order.listingTitle} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <Link href={`/product/${order.listingId}`} className="font-bold text-[var(--color-ink-900)] hover:underline block mb-1">
                        {order.listingTitle}
                      </Link>
                    </div>

                    {order.escrowState === 'held' && shippingOrderId !== order.id && (
                      <button 
                        onClick={() => setShippingOrderId(order.id)}
                        className="flex items-center gap-2 px-6 py-2 bg-[var(--color-ink-900)] text-white font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-600)] transition-colors"
                      >
                        <Truck className="w-4 h-4" />
                        Mark as Shipped
                      </button>
                    )}

                    {shippingOrderId === order.id && (
                      <form onSubmit={handleShip} className="flex gap-2 items-center bg-[var(--color-cream-raised)] p-2 rounded-[var(--radius-md)]">
                        <select value={carrier} onChange={e => setCarrier(e.target.value)} className="h-10 px-3 border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] bg-white text-sm">
                          <option>India Post</option>
                          <option>Delhivery</option>
                          <option>Blue Dart</option>
                          <option>Shiprocket</option>
                          <option>Other</option>
                        </select>
                        <input 
                          type="text" required placeholder="Tracking Number" 
                          value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)}
                          className="h-10 px-3 border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] w-48 text-sm"
                        />
                        <button type="submit" className="h-10 px-4 bg-[var(--color-terracotta-600)] text-white font-bold rounded-[var(--radius-sm)] text-sm">Save</button>
                        <button type="button" onClick={() => setShippingOrderId(null)} className="h-10 px-3 text-[var(--color-ink-500)] hover:bg-[var(--color-border-subtle)] rounded-[var(--radius-sm)]">Cancel</button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
