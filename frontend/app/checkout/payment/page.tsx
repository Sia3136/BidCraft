'use client'
import { authenticatedFetch } from '@/lib/api'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useAuthStore } from '@/store/authStore'

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const listingId = searchParams.get('listing_id')
  const offerId = searchParams.get('offer_id')
  const { token, user } = useAuthStore()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!listingId || !token) {
      if (!token) router.push('/auth')
      else router.push('/')
      return
    }

    const initPayment = async () => {
      try {
        // Step 1: Create Razorpay checkout session
        const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/payments/create-checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ listing_id: parseInt(listingId, 10), ...(offerId && { offer_id: parseInt(offerId, 10) }) })
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
          description: `Checkout for listing #${listingId}`,
          handler: async (response: any) => {
            // Step 4: Verify payment
            try {
              const verifyRes = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/payments/verify-checkout`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  ...response,
                  listing_id: parseInt(listingId, 10),
                  ...(offerId && { offer_id: parseInt(offerId, 10) })
                })
              })
              const verifyData = await verifyRes.json()
              if (verifyData.success) {
                router.push(`/checkout/success?order_id=${verifyData.order_id}`)
              } else {
                setError(verifyData.error || 'Verification failed')
              }
            } catch (err: any) {
              setError('Payment verification failed. Contact support.')
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
              setLoading(false)
            }
          }
        })

        rzp.open()
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    initPayment()
  }, [listingId, offerId, token, router, user])

  return (
    <div className="min-h-screen bg-[var(--color-cream-base)] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[600px] mx-auto w-full px-[var(--space-4)] py-[var(--space-6)] text-center mt-10">
        {error ? (
          <div>
            <h1 className="text-display-sm font-display mb-4 text-[var(--color-urgent-600)]">Payment Failed</h1>
            <p className="mb-6">{error}</p>
            <button onClick={() => router.push(`/checkout/review?listing_id=${listingId}`)} className="h-12 px-6 bg-[var(--color-ink-900)] text-white rounded-[var(--radius-pill)]">
              Try Again
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-display-sm font-display mb-4">Initializing Payment...</h1>
            <p className="text-[var(--color-ink-500)]">Please complete the payment in the secure window.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}


