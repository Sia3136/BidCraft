'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { useAuth } from '@/lib/auth-context'
import { listingsApi, paymentsApi } from '@/lib/api'

export default function CheckoutPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, refreshUser } = useAuth()
  
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [step, setStep] = useState<'review' | 'payment' | 'success'>('review')

  useEffect(() => {
    async function load() {
      try {
        const res = await listingsApi.get(id as string)
        setListing(res.listing)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleCheckout = async () => {
    if (!user) {
      alert('Please sign in to checkout')
      return
    }

    try {
      setPurchasing(true)
      
      // 1. Create order
      const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/orders/buy-now`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ listing_id: listing.id })
      })

      if (!orderRes.ok) {
        const error = await orderRes.json()
        throw new Error(error.error || 'Failed to create order')
      }

      const { order } = await orderRes.json()

      // 2. Initialize Payment
      const payRes = await paymentsApi.createOrder(order.id)
      const paymentData = payRes

      if (paymentData.key_id && paymentData.key_id !== 'mock_key' && (window as any).Razorpay) {
        const options = {
          key: paymentData.key_id,
          amount: paymentData.amount,
          currency: paymentData.currency,
          name: 'BidCraft Escrow',
          description: `Purchase of ${listing.title}`,
          order_id: paymentData.provider_order_id,
          handler: async function (response: any) {
            try {
              await paymentsApi.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: order.id,
              })
              setStep('success')
            } catch (err: any) {
              alert('Payment verification failed: ' + err.message)
            }
          },
          prefill: { name: user.name, email: user.email },
          theme: { color: '#6366F1' },
        }
        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      } else {
        // Mock Mode Simulation
        const mockPayId = `mock_pay_${Date.now()}`
        const mockSig = `mock_sig_${paymentData.provider_order_id}_${mockPayId}`
        await paymentsApi.verifyPayment({
          razorpay_order_id: paymentData.provider_order_id,
          razorpay_payment_id: mockPayId,
          razorpay_signature: mockSig,
          order_id: order.id,
        })
        setStep('success')
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) return <div className="p-8 text-center mt-20">Loading checkout...</div>
  if (!listing) return <div className="p-8 text-center mt-20">Listing not found.</div>

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12 mt-16">
        {step === 'success' ? (
          <div className="text-center bg-card p-12 rounded-xl border border-border">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-muted-foreground mb-8">
              Your funds are securely held in Escrow. The seller has been notified to ship the item.
            </p>
            <button onClick={() => router.push('/dashboard')} className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg">
              View Order Status
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-8">Secure Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                  <div className="bg-card p-6 rounded-xl border border-border">
                    <p className="text-sm text-muted-foreground mb-4">Select or add a shipping address</p>
                    <textarea 
                      placeholder="Full Address, City, ZIP Code" 
                      className="w-full p-3 bg-muted/50 border border-border rounded-lg"
                      rows={3}
                    />
                  </div>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                    <div className="flex items-center space-x-3 p-3 border border-primary/50 bg-primary/5 rounded-lg">
                      <input type="radio" checked readOnly />
                      <span>Razorpay Secure Checkout</span>
                    </div>
                  </div>
                </section>
              </div>

              <div>
                <div className="bg-card p-6 rounded-xl border border-border sticky top-24">
                  <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                  
                  <div className="flex space-x-4 mb-6">
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {listing.photos?.[0] && <img src={listing.photos[0]} alt={listing.title} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <h3 className="font-medium line-clamp-2">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Condition: {listing.condition}</p>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-border pt-6 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Item Subtotal</span>
                      <span>₹{Number(listing.price).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Escrow Protection Fee</span>
                      <span>₹100</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-3 border-t border-border">
                      <span>Total</span>
                      <span>₹{(Number(listing.price) + 100).toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={purchasing}
                    className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {purchasing ? 'Processing...' : 'Pay Securely'}
                  </button>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    By clicking Pay, you agree to our Escrow Terms of Service. Funds are released only after delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
