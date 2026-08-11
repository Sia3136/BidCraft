'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { fetchSellerListings, fetchSellerOrders, deleteListing, shipOrder, fetchSellerOffers, acceptOffer, rejectOffer } from '@/lib/api'
import { formatPrice } from '@/lib/formatPrice'
import Link from 'next/link'
import { Package, Tag, Clock, Trash2, Edit3, Truck, Inbox, Check, X, CheckCircle2 } from 'lucide-react'
import { getProductRoute } from '@/lib/routes'

export default function SellerDashboard() {
  const router = useRouter()
  const { isAuthenticated, token, user } = useAuthStore()
  const [tab, setTab] = useState<'overview' | 'listings' | 'orders' | 'offers' | 'analytics' | 'profile' | 'settings'>('listings')
  
  const [listings, setListings] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [offers, setOffers] = useState<any[]>([])
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
        const [listingsData, ordersData, offersData] = await Promise.all([
          fetchSellerListings(token || '').catch(() => ({ listings: [] })),
          fetchSellerOrders(token || '').catch(() => ({ orders: [] })),
          fetchSellerOffers(token || '').catch(() => ({ offers: [] }))
        ])
        
        setListings(listingsData?.listings || [])
        setOrders(ordersData?.orders || [])
        setOffers(offersData?.offers || [])
      } catch (err) {
        console.error('Failed to load seller data', err)
      } finally {
        setLoading(false)
      }
    }
    if (isAuthenticated) loadData()
  }, [isAuthenticated, router, token])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return
    try {
      await deleteListing(id, token || '')
      setListings(listings.map(l => l.id === id ? { ...l, status: 'deleted' } : l))
    } catch (err) {
      alert('Failed to delete listing')
    }
  }

  const handleShip = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shippingOrderId) return
    try {
      await shipOrder(shippingOrderId, { trackingNumber, carrier }, token || '')
      setOrders(orders.map(o => o.id === shippingOrderId ? { ...o, escrowState: 'shipped' } : o))
      setShippingOrderId(null)
      setTrackingNumber('')
    } catch (err) {
      alert('Failed to update shipment')
    }
  }

  const handleAcceptOffer = async (e: React.MouseEvent, offerId: string) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to accept this offer? All other pending offers will be rejected.')) return
    try {
      await acceptOffer(offerId, token || '')
      setOffers(offers.map(o => o.id === offerId ? { ...o, status: 'accepted' } : (o.listingId === offers.find(x => x.id === offerId)?.listingId && o.status === 'pending' ? { ...o, status: 'rejected' } : o)))
      alert('Offer accepted successfully!')
    } catch (err: any) {
      alert(err.message || 'Failed to accept offer')
    }
  }

  const handleRejectOffer = async (e: React.MouseEvent, offerId: string) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to reject this offer?')) return
    try {
      await rejectOffer(offerId, token || '')
      setOffers(offers.map(o => o.id === offerId ? { ...o, status: 'rejected' } : o))
    } catch (err: any) {
      alert(err.message || 'Failed to reject offer')
    }
  }

  if (loading && listings.length === 0 && orders.length === 0 && offers.length === 0) return <div className="p-12 text-center text-[var(--color-ink-500)]">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-[var(--color-ink-900)]">Seller Dashboard</h1>
        <Link href="/sell/new" className="px-6 py-3 bg-[var(--color-terracotta-600)] text-white font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors">
          Create New Listing
        </Link>
      </div>

      <div className="flex gap-8 border-b border-[var(--color-border-subtle)] mb-8 overflow-x-auto hide-scrollbar">
        <button 
          onClick={() => setTab('overview')} 
          className={`pb-4 font-bold text-lg border-b-2 transition-colors whitespace-nowrap ${tab === 'overview' ? 'border-[var(--color-terracotta-600)] text-[var(--color-ink-900)]' : 'border-transparent text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)]'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setTab('listings')} 
          className={`pb-4 font-bold text-lg border-b-2 transition-colors whitespace-nowrap ${tab === 'listings' ? 'border-[var(--color-terracotta-600)] text-[var(--color-ink-900)]' : 'border-transparent text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)]'}`}
        >
          My Listings
        </button>
        <button 
          onClick={() => setTab('orders')} 
          className={`pb-4 font-bold text-lg border-b-2 transition-colors whitespace-nowrap ${tab === 'orders' ? 'border-[var(--color-terracotta-600)] text-[var(--color-ink-900)]' : 'border-transparent text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)]'}`}
        >
          Orders
        </button>
        <button 
          onClick={() => setTab('offers')} 
          className={`pb-4 font-bold text-lg border-b-2 transition-colors whitespace-nowrap ${tab === 'offers' ? 'border-[var(--color-terracotta-600)] text-[var(--color-ink-900)]' : 'border-transparent text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)]'}`}
        >
          Offers
        </button>
        <button 
          onClick={() => setTab('analytics')} 
          className={`pb-4 font-bold text-lg border-b-2 transition-colors whitespace-nowrap ${tab === 'analytics' ? 'border-[var(--color-terracotta-600)] text-[var(--color-ink-900)]' : 'border-transparent text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)]'}`}
        >
          Analytics
        </button>
        <button 
          onClick={() => setTab('profile')} 
          className={`pb-4 font-bold text-lg border-b-2 transition-colors whitespace-nowrap ${tab === 'profile' ? 'border-[var(--color-terracotta-600)] text-[var(--color-ink-900)]' : 'border-transparent text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)]'}`}
        >
          Profile
        </button>
        <button 
          onClick={() => setTab('settings')} 
          className={`pb-4 font-bold text-lg border-b-2 transition-colors whitespace-nowrap ${tab === 'settings' ? 'border-[var(--color-terracotta-600)] text-[var(--color-ink-900)]' : 'border-transparent text-[var(--color-ink-500)] hover:text-[var(--color-ink-700)]'}`}
        >
          Settings
        </button>
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="bg-white p-6 border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
               <p className="text-sm font-bold text-[var(--color-ink-500)] mb-2">Total Sales</p>
               <p className="text-3xl font-display font-bold text-[var(--color-ink-900)]">{formatPrice(orders.reduce((sum, o) => sum + parseFloat(o.amount || 0), 0))}</p>
             </div>
             <div className="bg-white p-6 border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
               <p className="text-sm font-bold text-[var(--color-ink-500)] mb-2">Total Orders</p>
               <p className="text-3xl font-display font-bold text-[var(--color-ink-900)]">{orders.length}</p>
             </div>
             <div className="bg-white p-6 border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
               <p className="text-sm font-bold text-[var(--color-ink-500)] mb-2">Total Listings</p>
               <p className="text-3xl font-display font-bold text-[var(--color-ink-900)]">{listings.length}</p>
             </div>
             <div className="bg-white p-6 border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
               <p className="text-sm font-bold text-[var(--color-ink-500)] mb-2">Active Listings</p>
               <p className="text-3xl font-display font-bold text-[var(--color-ink-900)]">{listings.filter(l => l.status === 'active').length}</p>
             </div>
             <div className="bg-white p-6 border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
               <p className="text-sm font-bold text-[var(--color-ink-500)] mb-2">Auction Listings</p>
               <p className="text-3xl font-display font-bold text-[var(--color-ink-900)]">{listings.filter(l => l.buyingMethod === 'Auction').length}</p>
             </div>
             <div className="bg-white p-6 border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
               <p className="text-sm font-bold text-[var(--color-ink-500)] mb-2">Buy Now Listings</p>
               <p className="text-3xl font-display font-bold text-[var(--color-ink-900)]">{listings.filter(l => l.buyingMethod === 'Buy Now').length}</p>
             </div>
             <div className="bg-white p-6 border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
               <p className="text-sm font-bold text-[var(--color-ink-500)] mb-2">Negotiable Listings</p>
               <p className="text-3xl font-display font-bold text-[var(--color-ink-900)]">{listings.filter(l => l.buyingMethod === 'Negotiable').length}</p>
             </div>
             <div className="bg-white p-6 border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
               <p className="text-sm font-bold text-[var(--color-ink-500)] mb-2">Pending Offers</p>
               <p className="text-3xl font-display font-bold text-[var(--color-ink-900)]">{offers.filter(o => o.status === 'pending').length}</p>
             </div>
          </div>
          
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] overflow-hidden">
             <div className="p-6 border-b border-[var(--color-border-subtle)]">
                <h3 className="text-lg font-bold text-[var(--color-ink-900)]">Recent Activity</h3>
             </div>
             <div className="p-6 text-center text-[var(--color-ink-500)]">
                {orders.length === 0 && offers.length === 0 ? 'No recent activity.' : 'Check Orders and Offers tabs for detailed recent activity.'}
             </div>
          </div>
        </div>
      )}

      {tab === 'analytics' && (() => {
        const typeData = [
          { label: 'Buy Now', value: listings.filter(l => l.buyingMethod === 'Buy Now').length },
          { label: 'Auction', value: listings.filter(l => l.buyingMethod === 'Auction').length },
          { label: 'Negotiable', value: listings.filter(l => l.buyingMethod === 'Negotiable').length }
        ];
        const maxType = Math.max(...typeData.map(d => d.value), 1);
        
        const statusData = [
          { label: 'Active', value: listings.filter(l => l.status === 'active').length, color: 'var(--color-success-600)' },
          { label: 'Sold', value: orders.length, color: 'var(--color-terracotta-600)' },
          { label: 'Deleted', value: listings.filter(l => l.status === 'deleted').length, color: 'var(--color-urgent-600)' }
        ];
        const maxStatus = Math.max(...statusData.map(d => d.value), 1);

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
              <h3 className="font-bold text-[var(--color-ink-900)] mb-6">Listings by Method</h3>
              <div className="space-y-4">
                {typeData.map(d => (
                  <div key={d.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[var(--color-ink-700)] font-medium">{d.label}</span>
                      <span className="text-[var(--color-ink-900)] font-bold">{d.value}</span>
                    </div>
                    <div className="h-2 bg-[var(--color-cream-raised)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--color-terracotta-600)] rounded-full" style={{ width: `${(d.value / maxType) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
              <h3 className="font-bold text-[var(--color-ink-900)] mb-6">Listing Status</h3>
              <div className="space-y-4">
                {statusData.map(d => (
                  <div key={d.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[var(--color-ink-700)] font-medium">{d.label}</span>
                      <span className="text-[var(--color-ink-900)] font-bold">{d.value}</span>
                    </div>
                    <div className="h-2 bg-[var(--color-cream-raised)] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(d.value / maxStatus) * 100}%`, backgroundColor: d.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {tab === 'profile' && (
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] p-8">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[var(--color-border-subtle)]">
            {user?.avatar ? (
              <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border border-[var(--color-border-subtle)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user.avatar} alt={user?.name || 'User'} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-[var(--color-terracotta-600)] text-white flex items-center justify-center text-4xl font-display shrink-0">
                 {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div>
               <h2 className="text-2xl font-bold text-[var(--color-ink-900)]">{user?.name}</h2>
               <p className="text-[var(--color-ink-500)] mb-2">{user?.email}</p>
               <span className="px-3 py-1 bg-[var(--color-cream-deep)] text-[var(--color-ink-700)] rounded-full text-sm font-bold uppercase tracking-wider">{user?.role}</span>
            </div>
          </div>
          <div className="mb-8 pb-8 border-b border-[var(--color-border-subtle)]">
            <h3 className="text-lg font-bold text-[var(--color-ink-900)] mb-2">About</h3>
            {user?.bio ? (
              <p className="text-[var(--color-ink-700)] whitespace-pre-wrap">{user.bio}</p>
            ) : (
              <p className="text-[var(--color-ink-500)] italic">No bio provided yet.</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-8">
             <div>
               <p className="text-sm font-bold text-[var(--color-ink-500)] uppercase tracking-wider mb-1">Joined</p>
               <p className="text-lg text-[var(--color-ink-900)]">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
             </div>
             <div>
               <p className="text-sm font-bold text-[var(--color-ink-500)] uppercase tracking-wider mb-1">Status</p>
               <p className="text-lg text-[var(--color-success-600)] font-medium flex items-center gap-2">
                 <CheckCircle2 className="w-5 h-5" /> Active Seller
               </p>
             </div>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="text-center py-24 bg-[var(--color-cream-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
          <p className="text-xl font-bold text-[var(--color-ink-900)] mb-4">Account Settings</p>
          <p className="text-[var(--color-ink-500)] mb-6">Coming soon</p>
        </div>
      )}

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
                            <Link href={getProductRoute(listing)} className="font-bold text-[var(--color-ink-900)] hover:underline block">{listing.title}</Link>
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
                      <Link href={getProductRoute({ id: order.listingId })} className="font-bold text-[var(--color-ink-900)] hover:underline block mb-1">
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
      {tab === 'offers' && (
        <div>
          {offers.length === 0 && !loading ? (
            <div className="text-center py-24 bg-[var(--color-cream-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
              <Inbox className="w-16 h-16 text-[var(--color-ink-300)] mx-auto mb-4" />
              <p className="text-xl font-bold text-[var(--color-ink-900)] mb-2">You don't have any offers yet.</p>
              <p className="text-[var(--color-ink-500)]">Offers from buyers will appear here.</p>
            </div>
          ) : (
            <div className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[var(--color-cream-raised)] border-b border-[var(--color-border-subtle)]">
                  <tr>
                    <th className="p-4 text-sm font-bold text-[var(--color-ink-500)]">Listing</th>
                    <th className="p-4 text-sm font-bold text-[var(--color-ink-500)]">Buyer</th>
                    <th className="p-4 text-sm font-bold text-[var(--color-ink-500)]">Offer Amount</th>
                    <th className="p-4 text-sm font-bold text-[var(--color-ink-500)]">Status</th>
                    <th className="p-4 text-sm font-bold text-[var(--color-ink-500)] text-right">Date</th>
                    <th className="p-4 text-sm font-bold text-[var(--color-ink-500)] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-subtle)]">
                  {offers.map(offer => (
                    <tr key={offer.id} className="hover:bg-[var(--color-cream-raised)] transition-colors cursor-pointer" onClick={() => router.push(`/seller/offers/${offer.id}`)}>
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-[var(--radius-sm)] overflow-hidden bg-[var(--color-cream-deep)] shrink-0">
                            {offer.listingImage && <img src={offer.listingImage} alt={offer.listingTitle} className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <span className="font-bold text-[var(--color-ink-900)] block">{offer.listingTitle}</span>
                            <span className="text-xs text-[var(--color-ink-500)]">Listed at {formatPrice(offer.listingPrice)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-[var(--color-ink-900)] font-medium">
                        {offer.buyerName || 'Anonymous'}
                      </td>
                      <td className="p-4 font-bold text-[var(--color-terracotta-600)]">
                        {formatPrice(offer.amount)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase tracking-wider inline-block text-center min-w-[80px] ${
                          offer.status === 'accepted' ? 'bg-[var(--color-success-100)] text-[var(--color-success-600)]' :
                          offer.status === 'rejected' ? 'bg-[var(--color-urgent-100)] text-[var(--color-urgent-600)]' :
                          'bg-[#FFF3E0] text-[#E65100]'
                        }`}>
                          {offer.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-[var(--color-ink-500)] text-right">
                        {new Date(offer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        {offer.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <button onClick={(e) => handleAcceptOffer(e, offer.id)} className="p-2 bg-[var(--color-success-100)] text-[var(--color-success-600)] hover:bg-[var(--color-success-200)] rounded-full transition-colors" title="Accept">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={(e) => handleRejectOffer(e, offer.id)} className="p-2 bg-[var(--color-urgent-100)] text-[var(--color-urgent-600)] hover:bg-[var(--color-urgent-200)] rounded-full transition-colors" title="Reject">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
