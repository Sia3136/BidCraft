'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useAuthStore } from '@/store/authStore'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const { token } = useAuthStore()
  
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    if (!orderId || !token) {
      if (!token) router.push('/auth')
      else router.push('/')
      return
    }

    // Optionally fetch order details if we want to display them
    // For now we just show success
    setLoading(false)
  }, [orderId, token, router])

  return (
    <div className="min-h-screen bg-[var(--color-cream-base)] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[600px] mx-auto w-full px-[var(--space-4)] py-[var(--space-6)] text-center flex flex-col items-center justify-center">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white p-10 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] flex flex-col items-center">
            <CheckCircle className="w-20 h-20 text-[var(--color-success-600)] mb-6" />
            <h1 className="text-display-sm font-display mb-2 text-[var(--color-ink-900)]">Order Confirmed!</h1>
            <p className="text-[var(--color-ink-500)] mb-8 text-lg">
              Thank you for your purchase. Your order #{orderId} has been placed successfully.
            </p>
            
            <div className="flex gap-4">
              <Link href={`/orders/${orderId}`} className="h-12 px-6 flex items-center justify-center bg-[var(--color-terracotta-600)] text-white rounded-[var(--radius-pill)] font-bold hover:bg-[var(--color-terracotta-700)] transition-colors">
                View Order
              </Link>
              <Link href="/" className="h-12 px-6 flex items-center justify-center bg-transparent border-2 border-[var(--color-ink-900)] text-[var(--color-ink-900)] rounded-[var(--radius-pill)] font-bold hover:bg-[var(--color-ink-900)] hover:text-white transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
