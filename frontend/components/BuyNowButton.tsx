'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { createOrder, createPaymentOrder, verifyPayment } from '@/lib/api'

// Razorpay loads via script tag — declare type
declare global {
  interface Window { Razorpay: any }
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

type Props = {
  listingId: string
  price: number
  listingTitle: string
}

export function BuyNowButton({ listingId, price, listingTitle }: Props) {
  const { isAuthenticated, token, user } = useAuthStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleBuyNow = async () => {
    if (!isAuthenticated || !token) {
      router.push(`/auth?returnTo=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    setLoading(true)
    setError('')

    try {
      // Step 1: Create order on backend
      const { order } = await createOrder(listingId, token)

      // Step 2: Create Razorpay payment order
      const paymentData = await createPaymentOrder(order.id, token)

      // Step 3: Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Failed to load Razorpay'))
          document.body.appendChild(script)
        })
      }

      // Step 4: Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: paymentData.key_id,
        amount: paymentData.amount * 100, // convert INR to paise
        currency: paymentData.currency,
        order_id: paymentData.provider_order_id,
        name: 'BidCraft',
        description: listingTitle,
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          // Step 5: Verify payment on backend
          try {
            const result = await verifyPayment({
              ...response,
              order_id: parseInt(order.id, 10)
            }, token)

            if (result.success) {
              router.push(`/orders/${order.id}?status=success`)
            }
          } catch (err: any) {
            setError('Payment verification failed. Contact support@bidcraft.in')
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: { color: '#C8643A' },
        modal: {
          ondismiss: () => setLoading(false)
        }
      })

      rzp.open()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleBuyNow}
        disabled={loading}
        className="w-full h-12 rounded-[var(--radius-pill)] font-ui text-[16px] font-semibold flex items-center justify-center transition-colors bg-[var(--color-terracotta-600)] text-white hover:bg-[var(--color-terracotta-700)] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : isAuthenticated ? `Buy Now — ${formatPrice(price)}` : 'Sign In to Buy'}
      </button>
      {error && (
        <p className="text-[var(--color-urgent-600)] text-[14px] mt-2">
          {error}
        </p>
      )}
    </div>
  )
}
