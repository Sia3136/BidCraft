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
  const isCart = searchParams.get('cart') === 'true'
  const { token, user } = useAuthStore()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isMock, setIsMock] = useState(false)

  useEffect(() => {
    if ((!listingId && !isCart) || !token) {
      if (!token) router.push('/auth')
      else router.push('/')
      return
    }

    const initPayment = async () => {
      try {
        const endpoint = isCart ? `/api/payments/create-cart-checkout` : `/api/payments/create-checkout`
        const reqBody = isCart ? {} : { listing_id: parseInt(listingId as string, 10), ...(offerId && { offer_id: parseInt(offerId, 10) }) }
        
        // Step 1: Create Razorpay checkout session
        const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(reqBody)
        })
        const data = await res.json()
        
        if (!res.ok) throw new Error(data.error || 'Failed to initialize payment')

        if (data.is_mock) setIsMock(true)

        if (data.is_mock) {
          const mockPaymentId = `pay_mock_${Date.now()}`;
          const mockOrderId = data.provider_order_id;
          try {
            const verifyEndpoint = isCart ? `/api/payments/verify-cart-checkout` : `/api/payments/verify-checkout`
            let shipping_address = {}
            if (isCart) {
              try { shipping_address = JSON.parse(localStorage.getItem('checkout_address') || '{}') } catch (e) {}
            }
            const verifyBody = isCart ? {
              razorpay_order_id: mockOrderId,
              razorpay_payment_id: mockPaymentId,
              razorpay_signature: 'mock_signature',
              shipping_address
            } : {
              razorpay_order_id: mockOrderId,
              razorpay_payment_id: mockPaymentId,
              razorpay_signature: 'mock_signature',
              listing_id: parseInt(listingId as string, 10),
              ...(offerId && { offer_id: parseInt(offerId, 10) })
            }

            const verifyRes = await authenticatedFetch(
              `${process.env.NEXT_PUBLIC_API_URL}${verifyEndpoint}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(verifyBody)
              }
            )
            const verifyData = await verifyRes.json()
            if (verifyData.success) {
              const orderIdToPass = verifyData.order_id || (verifyData.order_ids && verifyData.order_ids[0]) || ''
              router.push(`/checkout/success?order_id=${orderIdToPass}`)
            } else {
              setError(verifyData.error || 'Mock verification failed')
              setLoading(false)
            }
          } catch (err: any) {
            setError('Mock payment verification failed.')
            setLoading(false)
          }
          return
        }

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
          description: isCart ? `Checkout for Cart` : `Checkout for listing #${listingId}`,
          handler: async (response: any) => {
            // Step 4: Verify payment
            try {
              const verifyEndpoint = isCart ? `/api/payments/verify-cart-checkout` : `/api/payments/verify-checkout`
              
              let shipping_address = {}
              if (isCart) {
                try { shipping_address = JSON.parse(localStorage.getItem('checkout_address') || '{}') } catch (e) {}
              }

              const verifyBody = isCart ? {
                ...response,
                shipping_address
              } : {
                ...response,
                listing_id: parseInt(listingId as string, 10),
                ...(offerId && { offer_id: parseInt(offerId, 10) })
              }
              
              const verifyRes = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}${verifyEndpoint}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(verifyBody)
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
  }, [listingId, offerId, isCart, token, router, user])

  return (
    <div className="min-h-screen bg-[var(--color-cream-base)] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[600px] mx-auto w-full px-[var(--space-4)] py-[var(--space-6)] text-center mt-10">
        {error ? (
          <div>
            <h1 className="text-display-sm font-display mb-4 text-[var(--color-urgent-600)]">Payment Failed</h1>
            <p className="mb-6">{error}</p>
            <button onClick={() => router.push(isCart ? `/checkout/address?cart=true` : `/checkout/review?listing_id=${listingId}`)} className="h-12 px-6 bg-[var(--color-ink-900)] text-white rounded-[var(--radius-pill)]">
              Try Again
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-display-sm font-display mb-4">Initializing Payment...</h1>
            <p className="text-[var(--color-ink-500)]">
              {isMock ? 'Processing mock payment...' : 'Please complete the payment in the secure window.'}
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
