'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { fetchOrderById, confirmDelivery, disputeOrder, shipOrder } from '@/lib/api'
import { formatPrice } from '@/lib/formatPrice'
import Link from 'next/link'
import { CheckCircle, Truck, Package, ShieldAlert } from 'lucide-react'
import { getProductRoute } from '@/lib/routes'

const ESCROW_STEPS = ['held', 'shipped', 'released']

export default function OrderPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ status: string }> }) {
  const { id } = use(params)
  const { status: queryStatus } = use(searchParams)
  
  const router = useRouter()
  const { isAuthenticated, user, token } = useAuthStore()
  
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [disputeOpen, setDisputeOpen] = useState(false)
  const [disputeReason, setDisputeReason] = useState('')
  const [disputeLoading, setDisputeLoading] = useState(false)

  // Seller ship state
  const [shippingOpen, setShippingOpen] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState('India Post')

  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated) {
      router.push(`/auth?returnTo=/orders/${id}`)
      return
    }

    async function loadOrder() {
      try {
        const data = await fetchOrderById(id, token!)
        setOrder(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load order')
      } finally {
        setLoading(false)
      }
    }

    if (token) loadOrder()
  }, [id, isAuthenticated, router, token])

  const handleConfirmDelivery = async () => {
    if (!confirm('Are you sure you have received the item in good condition? Payment will be released to the seller.')) return
    try {
      await confirmDelivery(id, token!)
      setOrder({ ...order, escrowState: 'released', orderStatus: 'delivered' })
    } catch (err: any) {
      alert(err.message || 'Failed to confirm delivery')
    }
  }

  const handleDispute = async (e: React.FormEvent) => {
    e.preventDefault()
    if (disputeReason.trim().length < 20) {
      alert('Please describe the issue in detail (min 20 characters)')
      return
    }
    setDisputeLoading(true)
    try {
      await disputeOrder(id, disputeReason, token!)
      setOrder({ ...order, escrowState: 'disputed' })
      setDisputeOpen(false)
    } catch (err: any) {
      alert(err.message || 'Failed to raise dispute')
    } finally {
      setDisputeLoading(false)
    }
  }

  const handleShip = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await shipOrder(id, { trackingNumber, carrier }, token!)
      setOrder({ ...order, escrowState: 'shipped', trackingNumber, carrier })
      setShippingOpen(false)
    } catch (err: any) {
      alert(err.message || 'Failed to update shipment')
    }
  }

  if (loading) return <div className="p-12 text-center text-[var(--color-ink-500)]">Loading order details...</div>
  if (error) return <div className="p-12 text-center text-[var(--color-urgent-600)] font-bold">{error}</div>
  if (!order) return null

  // Ensure escrowState is at least 'held' if the order is paid
  const escrowState = order.escrowState || (order.orderStatus === 'paid' ? 'held' : 'pending')
  const isBuyer = user?.id === order.buyerId
  const isSeller = user?.id === order.sellerId

  return (
    <div className="min-h-screen bg-[var(--color-cream-base)] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        
        {queryStatus === 'success' && escrowState === 'held' && (
          <div className="mb-8 p-6 bg-[var(--color-success-100)] border border-[var(--color-success-600)] rounded-[var(--radius-lg)] text-center">
            <h1 className="text-2xl font-display font-bold text-[var(--color-ink-900)] mb-2">Order Confirmed!</h1>
            <p className="text-[var(--color-ink-700)]">Your payment is held securely in escrow.</p>
          </div>
        )}

        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] overflow-hidden shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-[var(--color-border-subtle)] bg-[var(--color-cream-raised)] flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-[var(--color-ink-500)]">Order #{order.id}</p>
              <p className="text-sm text-[var(--color-ink-500)]">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[var(--color-terracotta-600)]">{formatPrice(order.amount)}</p>
            </div>
          </div>

          {/* Stepper */}
          <div className="p-8 border-b border-[var(--color-border-subtle)]">
            <div className="flex justify-between relative max-w-md mx-auto">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-[var(--color-border-subtle)] -translate-y-1/2 z-0" />
              {ESCROW_STEPS.map((step, idx) => {
                const currentIdx = ESCROW_STEPS.indexOf(escrowState === 'disputed' ? 'shipped' : escrowState)
                const isCompleted = idx <= currentIdx
                const isCurrent = idx === currentIdx && escrowState !== 'disputed'
                
                return (
                  <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition-colors ${
                      isCompleted ? 'bg-[var(--color-terracotta-600)]' : 'bg-[var(--color-border-strong)]'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      isCurrent ? 'text-[var(--color-terracotta-600)]' :
                      isCompleted ? 'text-[var(--color-ink-900)]' : 'text-[var(--color-ink-500)]'
                    }`}>
                      {step}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-b border-[var(--color-border-subtle)] flex flex-col items-center justify-center text-center">
            {escrowState === 'held' && (
              <>
                <Package className="w-12 h-12 text-[var(--color-ink-300)] mb-4" />
                {isBuyer && <p className="font-bold text-[var(--color-ink-700)]">Waiting for seller to ship your item.</p>}
                {isSeller && (
                  <>
                    <p className="font-bold text-[var(--color-ink-700)] mb-4">Please ship this item to the buyer.</p>
                    <button 
                      onClick={() => setShippingOpen(!shippingOpen)}
                      className="px-8 h-12 bg-[var(--color-ink-900)] text-white font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-600)] transition-colors"
                    >
                      Mark as Shipped
                    </button>
                    {shippingOpen && (
                      <form onSubmit={handleShip} className="mt-4 flex flex-col gap-3 w-full max-w-xs text-left">
                        <select value={carrier} onChange={e => setCarrier(e.target.value)} className="h-12 px-4 border border-[var(--color-border-strong)] rounded-[var(--radius-md)] bg-white text-sm">
                          <option>India Post</option>
                          <option>Delhivery</option>
                          <option>Blue Dart</option>
                          <option>Shiprocket</option>
                          <option>Other</option>
                        </select>
                        <input 
                          type="text" required placeholder="Tracking Number" 
                          value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)}
                          className="h-12 px-4 border border-[var(--color-border-strong)] rounded-[var(--radius-md)] text-sm"
                        />
                        <button type="submit" className="h-12 bg-[var(--color-terracotta-600)] text-white font-bold rounded-[var(--radius-md)] text-sm">Save Shipment</button>
                      </form>
                    )}
                  </>
                )}
              </>
            )}

            {escrowState === 'shipped' && (
              <>
                <Truck className="w-12 h-12 text-[#1565C0] mb-4" />
                <div className="mb-6 p-4 bg-[#E3F2FD] rounded-[var(--radius-md)] w-full max-w-sm">
                  <p className="text-sm font-bold text-[#1565C0] mb-1">Tracking Information</p>
                  <p className="text-lg text-[var(--color-ink-900)]">{order.carrier} - {order.trackingNumber || 'Tracking ID provided'}</p>
                </div>
                
                {isBuyer && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <button 
                      onClick={handleConfirmDelivery}
                      className="w-full max-w-sm h-12 bg-[var(--color-success-600)] text-white font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-success-700)] transition-colors"
                    >
                      Confirm Delivery
                    </button>
                    
                    {!disputeOpen && (
                      <button onClick={() => setDisputeOpen(true)} className="text-sm text-[var(--color-urgent-600)] font-medium hover:underline flex items-center gap-1">
                        <ShieldAlert className="w-4 h-4" /> Raise a Dispute
                      </button>
                    )}
                    
                    {disputeOpen && (
                      <form onSubmit={handleDispute} className="w-full max-w-sm flex flex-col gap-3 mt-2">
                        <textarea 
                          required minLength={20}
                          placeholder="Describe the issue (damaged, wrong item, etc.). Minimum 20 characters."
                          value={disputeReason} onChange={e => setDisputeReason(e.target.value)}
                          className="w-full p-3 h-24 border border-[var(--color-border-strong)] rounded-[var(--radius-md)] text-sm resize-none"
                        />
                        <div className="flex gap-2">
                          <button type="submit" disabled={disputeLoading} className="flex-1 h-10 bg-[var(--color-urgent-600)] text-white font-bold rounded-[var(--radius-sm)] text-sm hover:bg-[var(--color-urgent-700)]">
                            Submit Dispute
                          </button>
                          <button type="button" onClick={() => setDisputeOpen(false)} className="flex-1 h-10 border border-[var(--color-border-strong)] text-[var(--color-ink-700)] font-bold rounded-[var(--radius-sm)] text-sm">
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
                {isSeller && <p className="font-bold text-[var(--color-ink-700)]">Waiting for buyer to confirm delivery.</p>}
              </>
            )}

            {escrowState === 'released' && (
              <>
                <CheckCircle className="w-16 h-16 text-[var(--color-success-600)] mb-4" />
                <p className="text-xl font-bold text-[var(--color-ink-900)]">Order Complete</p>
                {isBuyer && <p className="text-[var(--color-ink-700)] mt-2">Delivery confirmed. Thank you!</p>}
                {isSeller && <p className="text-[var(--color-ink-700)] mt-2">Payment released to your account.</p>}
              </>
            )}

            {escrowState === 'disputed' && (
              <>
                <ShieldAlert className="w-16 h-16 text-[var(--color-urgent-600)] mb-4" />
                <p className="text-xl font-bold text-[var(--color-urgent-600)]">Dispute Raised</p>
                <p className="text-[var(--color-ink-900)] mt-2 font-medium bg-[var(--color-urgent-100)] p-4 rounded-[var(--radius-md)]">
                  Our team is reviewing this order and will contact both parties within 24 hours.
                </p>
              </>
            )}
          </div>

          {/* Listing Summary */}
          <div className="p-6 bg-[var(--color-cream-base)]">
            <h3 className="font-bold text-[var(--color-ink-900)] mb-4">Item Details</h3>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-[var(--radius-md)] overflow-hidden bg-white shrink-0 border border-[var(--color-border-subtle)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {order.listingImage && <img src={order.listingImage} alt={order.listingTitle} className="w-full h-full object-cover" />}
              </div>
              <div>
                <Link href={getProductRoute({ id: order.listingId })} className="font-bold text-lg text-[var(--color-ink-900)] hover:underline block mb-1">
                  {order.listingTitle}
                </Link>
                <p className="text-sm text-[var(--color-ink-500)]">Sold by {order.sellerName || 'Seller'}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
