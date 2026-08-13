'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { fetchSellerListings, fetchSellerOrders, deleteListing, shipOrder, fetchSellerOffers, acceptOffer, rejectOffer } from '@/lib/api'
import { formatPrice } from '@/lib/formatPrice'
import Link from 'next/link'
import { Package, Tag, Clock, Trash2, Edit3, Truck, Inbox, Check, X, CheckCircle2, Bell, Lock, User, Shield, AlertCircle, ShoppingBag } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { getProductRoute } from '@/lib/routes'

const MOCK_LISTINGS = [
  { id: 'mock-1', title: 'Vintage Artisan Wooden Bowl', image: '/images/1da0c6767e60f79b79148794732a305f.jpg', price: 145.00, status: 'active', buyingMethod: 'Buy Now', currentBid: null, bidCount: 0, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'mock-2', title: 'Mid-Century Modern Desk Clock', image: '/images/1f92888deb74023c26ec86c954a18188.jpg', price: 320.00, status: 'active', buyingMethod: 'Auction', currentBid: 410.00, bidCount: 12, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 'mock-3', title: 'Hand-painted Ceramic Vase', image: '/images/3331bf8da919ff1b47c345584f0f91a3.jpg', price: 85.00, status: 'active', buyingMethod: 'Negotiable', currentBid: null, bidCount: 0, createdAt: new Date(Date.now() - 259200000).toISOString() },
];

const MOCK_ORDERS = [
  { id: 'mock-ord-1', buyerName: 'Aarav K.', buyerEmail: 'aarav@example.com', amount: 145.00, escrowState: 'processing', listingImage: '/images/1da0c6767e60f79b79148794732a305f.jpg', listingTitle: 'Vintage Artisan Wooden Bowl', listingId: 'mock-1', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'mock-ord-2', buyerName: 'Priya M.', buyerEmail: 'priya@example.com', amount: 410.00, escrowState: 'shipped', listingImage: '/images/1f92888deb74023c26ec86c954a18188.jpg', listingTitle: 'Mid-Century Modern Desk Clock', listingId: 'mock-2', createdAt: new Date(Date.now() - 86400000).toISOString() },
];

const MOCK_OFFERS = [
  { id: 'mock-off-1', buyerName: 'Rohan D.', amount: 75.00, status: 'pending', listingId: 'mock-3', listingTitle: 'Hand-painted Ceramic Vase', listingPrice: 85.00, listingImage: '/images/3331bf8da919ff1b47c345584f0f91a3.jpg', createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'mock-off-2', buyerName: 'Neha S.', amount: 80.00, status: 'rejected', listingId: 'mock-3', listingTitle: 'Hand-painted Ceramic Vase', listingPrice: 85.00, listingImage: '/images/3331bf8da919ff1b47c345584f0f91a3.jpg', createdAt: new Date(Date.now() - 172800000).toISOString() },
];

export default function SellerDashboard() {
  const router = useRouter()
  const { isAuthenticated, token, user } = useAuthStore()
  const [tab, setTab] = useState<'overview' | 'listings' | 'orders' | 'offers' | 'analytics' | 'profile' | 'settings'>('listings')
  
  const [listings, setListings] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [isDemoListings, setIsDemoListings] = useState(false)
  const [isDemoOrders, setIsDemoOrders] = useState(false)
  const [isDemoOffers, setIsDemoOffers] = useState(false)
  
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
        
        const l = listingsData?.listings || []
        const o = ordersData?.orders || []
        const off = offersData?.offers || []

        if (l.length === 0) { setListings(MOCK_LISTINGS); setIsDemoListings(true); } else { setListings(l); setIsDemoListings(false); }
        if (o.length === 0) { setOrders(MOCK_ORDERS); setIsDemoOrders(true); } else { setOrders(o); setIsDemoOrders(false); }
        if (off.length === 0) { setOffers(MOCK_OFFERS); setIsDemoOffers(true); } else { setOffers(off); setIsDemoOffers(false); }
      } catch (err) {
        console.error('Failed to load seller data', err)
      } finally {
        setLoading(false)
      }
    }
    if (isAuthenticated) loadData()
  }, [isAuthenticated, router, token])

  const handleDelete = async (id: string) => {
    if (isDemoListings) { alert('Demo Mode: Cannot modify sample presentation listings.'); return; }
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
    if (isDemoOrders) { alert('Demo Mode: Cannot modify sample presentation orders.'); return; }
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
    if (isDemoOffers) { alert('Demo Mode: Cannot modify sample presentation offers.'); return; }
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
    if (isDemoOffers) { alert('Demo Mode: Cannot modify sample presentation offers.'); return; }
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
             <div className="p-6 border-b border-[var(--color-border-subtle)] flex justify-between items-center">
                <h3 className="text-lg font-bold text-[var(--color-ink-900)]">Recent Activity</h3>
                {(isDemoOrders || isDemoOffers) && <span className="text-xs font-bold px-2 py-1 bg-[var(--color-cream-deep)] text-[var(--color-ink-500)] rounded-full uppercase tracking-wider">Demo Data</span>}
             </div>
             <div className="flex flex-col">
                {(() => {
                  const recent = [...orders.map(o => ({...o, activityType: 'order', date: new Date(o.createdAt)})), ...offers.map(o => ({...o, activityType: 'offer', date: new Date(o.createdAt)}))].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 3);
                  if (recent.length === 0) {
                    return (
                      <div className="p-8 text-center flex flex-col items-center">
                        <Clock className="w-12 h-12 text-[var(--color-ink-300)] mb-3" />
                        <p className="text-[var(--color-ink-500)] font-medium">No recent activity.</p>
                      </div>
                    );
                  }
                  return recent.map((item, i) => (
                    <div key={`${item.activityType}-${item.id}`} className={`p-6 flex items-center gap-4 ${i !== recent.length - 1 ? 'border-b border-[var(--color-border-subtle)]' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.activityType === 'order' ? 'bg-[var(--color-success-100)] text-[var(--color-success-600)]' : 'bg-[#E3F2FD] text-[#1565C0]'}`}>
                        {item.activityType === 'order' ? <ShoppingBag className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-[var(--color-ink-900)] font-bold">
                          {item.activityType === 'order' ? `New order from ${item.buyerName}` : `New offer on ${item.listingTitle || 'your listing'}`}
                        </p>
                        <p className="text-sm text-[var(--color-ink-500)]">{item.date.toLocaleDateString()} • {formatPrice(item.amount)}</p>
                      </div>
                      <Link href={`#${item.activityType}s`} onClick={(e) => { e.preventDefault(); setTab(item.activityType === 'order' ? 'orders' : 'offers'); }} className="text-sm font-bold text-[var(--color-terracotta-600)] hover:underline">
                        View
                      </Link>
                    </div>
                  ));
                })()}
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

        // MOCK DATA for presentation only
        const mockSalesData = [
          { name: 'Mon', sales: 1200 },
          { name: 'Tue', sales: 1900 },
          { name: 'Wed', sales: 1500 },
          { name: 'Thu', sales: 2800 },
          { name: 'Fri', sales: 2100 },
          { name: 'Sat', sales: 3400 },
          { name: 'Sun', sales: 3100 },
        ];

        return (
          <div className="space-y-6">
            <div className="bg-white p-6 border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 gap-4 sm:gap-0">
                <div>
                  <h3 className="font-bold text-[var(--color-ink-900)]">Sales Revenue Trend</h3>
                  <p className="text-sm text-[var(--color-ink-500)]">Last 7 days (Demo Data)</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-2xl font-display font-bold text-[var(--color-ink-900)]">₹16,000</p>
                  <p className="text-sm font-bold text-[var(--color-success-600)]">+12% vs last week</p>
                </div>
              </div>
              <div className="h-[250px] sm:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockSalesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-terracotta-600)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--color-terracotta-600)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-subtle)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-ink-500)' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-ink-500)' }} tickFormatter={(val) => `₹${val}`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)', padding: '8px 12px' }}
                      itemStyle={{ color: 'var(--color-ink-900)', fontWeight: 'bold' }}
                      formatter={(val: number) => [`₹${val}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="sales" stroke="var(--color-terracotta-600)" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

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
        <div className="space-y-6">
          {isDemoListings && (
            <div className="bg-[#E3F2FD] border border-[#90CAF9] p-4 rounded-[var(--radius-lg)] flex gap-3 items-center">
              <AlertCircle className="w-5 h-5 text-[#1565C0] shrink-0" />
              <p className="text-sm text-[#1565C0] font-medium"><strong>Preview / Example Listings:</strong> You don't have any real listings yet. These are marketplace examples shown for presentation purposes.</p>
            </div>
          )}
          {listings.length === 0 && !isDemoListings ? (
            <div className="text-center py-24 bg-[var(--color-cream-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
              <Package className="w-16 h-16 text-[var(--color-ink-300)] mx-auto mb-4" />
              <p className="text-xl font-bold text-[var(--color-ink-900)] mb-2">You haven't created any listings yet.</p>
              <Link href="/sell/new" className="text-[var(--color-terracotta-600)] font-medium hover:underline">Create your first listing →</Link>
            </div>
          ) : (
            <div className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] overflow-hidden">
              <div className="overflow-x-auto">
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
            </div>
          )}
        </div>
      )}

      {tab === 'orders' && (
        <div className="space-y-6">
          {isDemoOrders && (
            <div className="bg-[#E3F2FD] border border-[#90CAF9] p-4 rounded-[var(--radius-lg)] flex gap-3 items-center">
              <AlertCircle className="w-5 h-5 text-[#1565C0] shrink-0" />
              <p className="text-sm text-[#1565C0] font-medium"><strong>Preview / Example Orders:</strong> You haven't made any real sales yet. These are mock examples shown for presentation purposes.</p>
            </div>
          )}
          {(orders ?? []).length === 0 && !isDemoOrders ? (
            <div className="text-center py-24 bg-[var(--color-cream-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
              <Tag className="w-16 h-16 text-[var(--color-ink-300)] mx-auto mb-4" />
              <p className="text-xl font-bold text-[var(--color-ink-900)] mb-2">You haven't made any sales yet.</p>
              <p className="text-[var(--color-ink-500)]">Keep sharing your listings!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {(orders ?? []).map(order => (
                <div key={order.id} className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 pb-4 border-b border-[var(--color-border-subtle)] gap-4 sm:gap-0">
                    <div>
                      <p className="text-sm text-[var(--color-ink-500)] mb-1">Order #{order.id} • {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p className="text-lg font-bold text-[var(--color-ink-900)] break-words">Buyer: {order.buyerName} ({order.buyerEmail})</p>
                    </div>
                    <div className="sm:text-right">
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
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-[var(--radius-sm)] overflow-hidden bg-[var(--color-cream-deep)] shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {order.listingImage && <img src={order.listingImage} alt={order.listingTitle} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={getProductRoute({ id: order.listingId })} className="font-bold text-[var(--color-ink-900)] hover:underline block mb-1 truncate">
                          {order.listingTitle}
                        </Link>
                      </div>
                    </div>

                    <div className="sm:ml-auto w-full sm:w-auto">
                      {order.escrowState === 'held' && shippingOrderId !== order.id && (
                        <button 
                          onClick={() => setShippingOrderId(order.id)}
                          className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-2 bg-[var(--color-ink-900)] text-white font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-600)] transition-colors"
                        >
                          <Truck className="w-4 h-4" />
                          Mark as Shipped
                        </button>
                      )}

                      {shippingOrderId === order.id && (
                        <form onSubmit={handleShip} className="flex flex-col sm:flex-row gap-2 sm:items-center bg-[var(--color-cream-raised)] p-3 sm:p-2 rounded-[var(--radius-md)] w-full">
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
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {tab === 'offers' && (
        <div className="space-y-6">
          {isDemoOffers && (
            <div className="bg-[#E3F2FD] border border-[#90CAF9] p-4 rounded-[var(--radius-lg)] flex gap-3 items-center">
              <AlertCircle className="w-5 h-5 text-[#1565C0] shrink-0" />
              <p className="text-sm text-[#1565C0] font-medium"><strong>Preview / Example Offers:</strong> You haven't received any real offers yet. These are mock examples shown for presentation purposes.</p>
            </div>
          )}
          {offers.length === 0 && !isDemoOffers ? (
            <div className="text-center py-24 bg-[var(--color-cream-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
              <Inbox className="w-16 h-16 text-[var(--color-ink-300)] mx-auto mb-4" />
              <p className="text-xl font-bold text-[var(--color-ink-900)] mb-2">You don't have any offers yet.</p>
              <p className="text-[var(--color-ink-500)]">Offers from buyers will appear here.</p>
            </div>
          ) : (
            <div className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] overflow-hidden">
              <div className="flex flex-col gap-4 p-4">
                {offers.map(offer => (
                  <div key={offer.id} className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                          offer.status === 'accepted' ? 'bg-[var(--color-success-100)] text-[var(--color-success-600)]' :
                          offer.status === 'rejected' ? 'bg-[var(--color-urgent-100)] text-[var(--color-urgent-600)]' :
                          'bg-[#FFF3E0] text-[#E65100]'
                        }`}>
                          {offer.status}
                        </span>
                        <span className="text-xs text-[var(--color-ink-500)]">{new Date(offer.createdAt).toLocaleDateString()}</span>
                      </div>
                      <Link href={getProductRoute({ id: offer.listingId })} className="font-bold text-[var(--color-ink-900)] text-lg hover:underline block truncate mb-1">
                        {offer.listingTitle || `Listing #${offer.listingId}`}
                      </Link>
                      <p className="text-sm text-[var(--color-ink-500)]">From: {offer.buyerName || 'Unknown Buyer'}</p>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t sm:border-t-0 border-[var(--color-border-subtle)] pt-4 sm:pt-0 mt-2 sm:mt-0">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-[var(--color-ink-500)] uppercase tracking-wider font-bold mb-1">Offer Amount</p>
                        <p className="text-xl font-bold text-[var(--color-terracotta-600)]">{formatPrice(offer.amount)}</p>
                      </div>
                      {offer.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={(e) => handleAcceptOffer(e, offer.id)} className="flex items-center justify-center w-10 h-10 bg-[var(--color-success-100)] text-[var(--color-success-600)] hover:bg-[var(--color-success-200)] rounded-full transition-colors" title="Accept">
                            <Check className="w-5 h-5" />
                          </button>
                          <button onClick={(e) => handleRejectOffer(e, offer.id)} className="flex items-center justify-center w-10 h-10 bg-[var(--color-urgent-100)] text-[var(--color-urgent-600)] hover:bg-[var(--color-urgent-200)] rounded-full transition-colors" title="Reject">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {tab === 'settings' && (
        <div className="space-y-8">
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-border-subtle)]">
              <User className="w-6 h-6 text-[var(--color-ink-500)]" />
              <h2 className="text-xl font-bold text-[var(--color-ink-900)]">Profile Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-[var(--color-ink-700)] mb-2">Display Name</label>
                <input type="text" defaultValue={user?.name} className="w-full h-10 px-3 border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--color-ink-700)] mb-2">Email Address</label>
                <input type="email" defaultValue={user?.email} className="w-full h-10 px-3 border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] bg-[var(--color-cream-raised)] text-[var(--color-ink-500)] cursor-not-allowed" disabled />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--color-ink-700)] mb-2">Bio</label>
              <textarea defaultValue={user?.bio} rows={4} className="w-full p-3 border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] bg-white resize-none" placeholder="Tell buyers about yourself..."></textarea>
            </div>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => alert('Demo only: Profile changes are not saved.')} className="px-6 py-2 bg-[var(--color-ink-900)] text-white font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-ink-700)] transition-colors">
                Save Changes
              </button>
            </div>
          </div>

          <div className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-border-subtle)]">
              <Bell className="w-6 h-6 text-[var(--color-ink-500)]" />
              <h2 className="text-xl font-bold text-[var(--color-ink-900)]">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-[var(--color-ink-900)]">Email Notifications</p>
                  <p className="text-sm text-[var(--color-ink-500)]">Receive daily digests of your account activity.</p>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" name="toggle" id="toggle1" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" style={{ right: 0, borderColor: 'var(--color-success-600)' }} onClick={(e) => e.preventDefault()} />
                  <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-6 rounded-full bg-[var(--color-success-600)] cursor-pointer"></label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-[var(--color-ink-900)]">Order Updates</p>
                  <p className="text-sm text-[var(--color-ink-500)]">Get notified immediately when a buyer pays for an order.</p>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" name="toggle" id="toggle2" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" style={{ right: 0, borderColor: 'var(--color-success-600)' }} onClick={(e) => e.preventDefault()} />
                  <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-6 rounded-full bg-[var(--color-success-600)] cursor-pointer"></label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-[var(--color-ink-900)]">New Offers</p>
                  <p className="text-sm text-[var(--color-ink-500)]">Get notified when someone makes an offer on your listings.</p>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" name="toggle" id="toggle3" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" style={{ right: 0, borderColor: 'var(--color-success-600)' }} onClick={(e) => e.preventDefault()} />
                  <label htmlFor="toggle3" className="toggle-label block overflow-hidden h-6 rounded-full bg-[var(--color-success-600)] cursor-pointer"></label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-border-subtle)]">
              <Lock className="w-6 h-6 text-[var(--color-ink-500)]" />
              <h2 className="text-xl font-bold text-[var(--color-ink-900)]">Security</h2>
            </div>
            <div className="bg-[var(--color-cream-raised)] p-4 rounded-[var(--radius-sm)] flex gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-[var(--color-ink-500)] shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--color-ink-700)]">For your security, changing your password requires verifying your current password. This is a UI-only demo and will not actually modify your credentials.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-[var(--color-ink-700)] mb-2">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full h-10 px-3 border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] bg-white" />
              </div>
              <div className="hidden sm:block"></div>
              <div>
                <label className="block text-sm font-bold text-[var(--color-ink-700)] mb-2">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full h-10 px-3 border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--color-ink-700)] mb-2">Confirm New Password</label>
                <input type="password" placeholder="••••••••" className="w-full h-10 px-3 border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] bg-white" />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => alert('Demo only: Password cannot be changed.')} className="px-6 py-2 bg-[var(--color-terracotta-600)] text-white font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors">
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
