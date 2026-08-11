'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, ShieldCheck } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { authenticatedFetch } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

type CheckoutStep = 'shipping' | 'payment' | 'review' | 'success'

const STEPS: { id: CheckoutStep, label: string }[] = [
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
]

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping')
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', address: '', city: '', zip: '',
    cardNumber: '', expiry: '', cvc: ''
  })

  const [items, setItems] = useState<{id?: number, title: string, price: number, quantity?: number}[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const { token, user } = useAuthStore()
  const shipping = 250
  const total = subtotal + (items.length > 0 ? shipping : 0)

  useEffect(() => {
    if (!token) return;
    authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.cart) {
          setItems(data.cart)
          setSubtotal(data.cart.reduce((acc: number, item: any) => acc + (item.price * (item.quantity || 1)), 0))
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return null;

  if (currentStep === 'success') {
    return (
      <main className="min-h-screen bg-[var(--color-cream-base)] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-[var(--space-10)] px-4 animate-fade-up text-center">
          <div className="w-[80px] h-[80px] rounded-full bg-[var(--color-success-100)] flex items-center justify-center mb-[var(--space-6)] text-[var(--color-success-600)]">
            <Check size={40} strokeWidth={3} />
          </div>
          <h1 className="text-display-md text-[var(--color-ink-900)] mb-[var(--space-3)]">
            Order Confirmed
          </h1>
          <p className="text-body-lg text-[var(--color-ink-700)] mb-[var(--space-8)] max-w-[480px]">
            Order #BC-289410<br/>
            Estimated delivery: Oct 24 - Oct 26
          </p>
          <div className="flex flex-col sm:flex-row gap-[var(--space-4)] w-full max-w-[400px]">
            <Button size="large" className="flex-1">Track Your Order</Button>
            <Link href="/" className="flex-1"><Button variant="ghost" size="large" className="w-full text-[var(--color-ink-700)]">Continue Browsing</Button></Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep === 'shipping') setCurrentStep('payment')
    else if (currentStep === 'payment') setCurrentStep('review')
    else if (currentStep === 'review') {
      if (!token) return;
      setProcessing(true);
      setError('');
      try {
        // Step 1: Create Razorpay checkout session for Cart
        const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/payments/create-cart-checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({})
        })
        const data = await res.json()
        
        if (!res.ok) throw new Error(data.error || 'Failed to initialize payment')

        // Step 2: Load Razorpay
        if (!(window as any).Razorpay) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => resolve()
            script.onerror = () => reject(new Error('Failed to load Razorpay'))
            document.body.appendChild(script)
          })
        }

        // Step 3: Open Razorpay
        const rzp = new (window as any).Razorpay({
          key: data.key_id,
          amount: data.amount * 100, // INR to paise
          currency: data.currency,
          order_id: data.provider_order_id,
          name: 'BidCraft',
          description: `Checkout for Cart`,
          handler: async (response: any) => {
            // Step 4: Verify payment
            try {
              const verifyRes = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/payments/verify-cart-checkout`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  ...response,
                  shipping_address: formData
                })
              })
              const verifyData = await verifyRes.json()
              if (verifyData.success) {
                setCurrentStep('success')
              } else {
                setError(verifyData.error || 'Verification failed')
                setProcessing(false)
              }
            } catch (err: any) {
              setError('Payment verification failed. Contact support.')
              setProcessing(false)
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
          },
          theme: { color: '#C8643A' },
          modal: {
            ondismiss: () => {
              setError('Payment cancelled.')
              setProcessing(false)
            }
          }
        })

        rzp.open()
      } catch (err: any) {
        setError(err.message)
        setProcessing(false)
      }
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-cream-base)] flex flex-col">
      <Navbar />

      <div className="flex-1 w-full max-w-[880px] mx-auto px-4 md:px-6 py-[var(--space-8)]">
        
        <h1 className="text-display-lg text-[var(--color-ink-900)] mb-[var(--space-8)] text-center">Checkout</h1>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-[var(--space-10)] max-w-[600px] mx-auto">
          {STEPS.map((step, i) => {
            const stepIndex = STEPS.findIndex(s => s.id === step.id)
            const currentIndex = STEPS.findIndex(s => s.id === currentStep)
            const isCompleted = stepIndex < currentIndex
            const isCurrent = stepIndex === currentIndex

            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none relative">
                <div className="flex flex-col items-center relative z-10 w-[40px]">
                  <div className={cn(
                    "w-[32px] h-[32px] rounded-full flex items-center justify-center transition-colors text-body-sm font-semibold",
                    isCompleted ? "bg-[var(--color-terracotta-600)] text-white" : 
                    isCurrent ? "bg-white border-2 border-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)]" : 
                    "bg-[var(--color-cream-deep)] text-[var(--color-ink-300)]"
                  )}>
                    {isCompleted ? <Check size={16} strokeWidth={3} /> : i + 1}
                  </div>
                  <span className={cn("absolute top-[40px] text-caption whitespace-nowrap", isCurrent || isCompleted ? "text-[var(--color-ink-900)] font-medium" : "text-[var(--color-ink-500)]")}>
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-[2px] mx-2" style={{ backgroundColor: isCompleted ? 'var(--color-terracotta-600)' : 'var(--color-ink-300)' }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="flex flex-col lg:flex-row gap-[var(--space-8)]">
          
          {/* Main Form Column */}
          <div className="flex-1 w-full relative min-h-[400px]">
            
            <form onSubmit={handleNext}>
              {currentStep === 'shipping' && (
                <div className="bg-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-[var(--space-6)] animate-fade-up">
                  <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-[var(--space-5)]">Shipping Address</h2>
                  <div className="grid grid-cols-2 gap-[var(--space-4)] mb-[var(--space-4)]">
                    <Input placeholder="First Name" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                    <Input placeholder="Last Name" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
                  </div>
                  <Input placeholder="Street Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="mb-[var(--space-4)]" required />
                  <div className="grid grid-cols-2 gap-[var(--space-4)] mb-[var(--space-6)]">
                    <Input placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required />
                    <Input placeholder="ZIP Code" value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})} required />
                  </div>
                  <Button type="submit" size="large" className="w-full">Continue to Payment</Button>
                </div>
              )}

              {currentStep === 'payment' && (
                <div className="bg-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-[var(--space-6)] animate-fade-up">
                  <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-[var(--space-5)]">Payment Details</h2>
                  <div className="bg-[var(--color-cream-deep)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] p-[var(--space-4)] mb-[var(--space-6)] flex items-center justify-between">
                    <span className="text-body-md font-semibold text-[var(--color-ink-900)]">Credit Card</span>
                    <div className="flex gap-2">
                      <div className="w-[32px] h-[20px] bg-white rounded border border-[var(--color-border-subtle)]" />
                      <div className="w-[32px] h-[20px] bg-white rounded border border-[var(--color-border-subtle)]" />
                    </div>
                  </div>
                  <Input placeholder="Card Number" className="mb-[var(--space-4)] font-mono" required />
                  <div className="grid grid-cols-2 gap-[var(--space-4)] mb-[var(--space-6)]">
                    <Input placeholder="MM/YY" className="font-mono" required />
                    <Input placeholder="CVC" className="font-mono" required />
                  </div>
                  <Button type="submit" size="large" className="w-full">Review Order</Button>
                  <div className="mt-4 flex items-start gap-2">
                    <ShieldCheck size={20} className="text-[var(--color-success-600)] shrink-0" />
                    <p className="text-caption text-[var(--color-ink-500)]">Your payment is encrypted and securely held in escrow until you confirm delivery of your items.</p>
                  </div>
                </div>
              )}

              {currentStep === 'review' && (
                <div className="bg-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-[var(--space-6)] animate-fade-up flex flex-col gap-[var(--space-6)]">
                  <h2 className="text-heading-lg text-[var(--color-ink-900)]">Review Order</h2>
                  
                  {/* Summary Blocks */}
                  <div className="flex flex-col gap-[var(--space-4)]">
                    <div className="flex justify-between items-start border-b border-[var(--color-border-subtle)] pb-[var(--space-4)]">
                      <div>
                        <h4 className="text-heading-sm text-[var(--color-ink-900)] mb-1">Shipping</h4>
                        <p className="text-body-md text-[var(--color-ink-700)]">John Doe<br/>123 Creative Lane<br/>Austin, TX 78704</p>
                      </div>
                      <button onClick={() => setCurrentStep('shipping')} className="text-caption text-[var(--color-terracotta-600)] hover:underline">Edit</button>
                    </div>
                    
                    <div className="flex justify-between items-start border-b border-[var(--color-border-subtle)] pb-[var(--space-4)]">
                      <div>
                        <h4 className="text-heading-sm text-[var(--color-ink-900)] mb-1">Payment</h4>
                        <p className="text-body-md text-[var(--color-ink-700)]">Visa ending in 4242</p>
                      </div>
                      <button onClick={() => setCurrentStep('payment')} className="text-caption text-[var(--color-terracotta-600)] hover:underline">Edit</button>
                    </div>

                    <div>
                      <h4 className="text-heading-sm text-[var(--color-ink-900)] mb-2">Items</h4>
                      {items.map((item, i) => (
                        <div key={i} className="flex justify-between text-body-md mb-1">
                          <span className="text-[var(--color-ink-700)] truncate pr-4">{item.title}</span>
                          <span className="font-mono text-[var(--color-ink-900)]">₹{item.price.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {error && <div className="text-[var(--color-urgent-600)] text-center text-sm font-semibold">{error}</div>}
                  <Button type="submit" disabled={processing || items.length === 0} className="w-full h-[52px] text-[16px]">
                    {processing ? 'Processing...' : `Place Order — ₹${total.toLocaleString('en-IN')}`}
                  </Button>
                  <p className="text-caption text-[var(--color-ink-500)] text-center">
                    By placing your order, you agree to BidCraft's Terms of Service and Escrow Agreement.
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Order Summary (Visible on Desktop for all steps) */}
          <div className="hidden lg:block w-[320px] shrink-0 sticky top-[100px]">
            <div className="bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] p-[var(--space-5)]">
              <h3 className="text-heading-md text-[var(--color-ink-900)] mb-[var(--space-4)]">Order Summary</h3>
              <div className="flex flex-col gap-[var(--space-3)] mb-[var(--space-4)] border-b border-[var(--color-border-subtle)] pb-[var(--space-4)]">
                <div className="flex justify-between text-body-md text-[var(--color-ink-700)]">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-body-md text-[var(--color-ink-700)]">
                  <span>Shipping</span>
                  <span>₹{shipping.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-heading-lg text-[var(--color-ink-900)]">Total</span>
                <span className="text-[24px] font-mono tracking-tight text-[var(--color-ink-900)] font-semibold">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </main>
  )
}
