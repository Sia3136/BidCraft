// app/orders/[id]/page.tsx
import { fetchOrderById } from '@/lib/api'
import { cookies } from 'next/headers'

export default async function OrderPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ status: string }> }) {
  const { id } = await params
  const { status } = await searchParams
  const isSuccess = status === 'success'

  // For now show a simple confirmation — full order dashboard is Sprint 3
  return (
    <main style={{ padding: '64px 24px', textAlign: 'center', fontFamily: 'var(--font-ui)' }}>
      {isSuccess && (
        <div style={{
          backgroundColor: 'var(--color-success-100)',
          border: '1px solid var(--color-success-600)',
          borderRadius: 'var(--radius-md)',
          padding: '32px',
          maxWidth: '560px',
          margin: '0 auto'
        }}>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink-900)', fontSize: '32px' }}>
            Order Confirmed
          </h1>
          <p style={{ color: 'var(--color-ink-700)', marginTop: '12px' }}>
            Your payment has been received and is held securely in escrow. 
            The seller has been notified to ship your item within 3 business days.
          </p>
          <p style={{ color: 'var(--color-ink-700)', marginTop: '8px' }}>
            Order ID: <strong>{id}</strong>
          </p>
          <p style={{ color: 'var(--color-ink-500)', fontSize: '14px', marginTop: '16px' }}>
            Once you receive the item, return here to confirm delivery and release payment to the seller.
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              marginTop: '24px',
              backgroundColor: 'var(--color-terracotta-600)',
              color: 'white',
              padding: '12px 32px',
              borderRadius: 'var(--radius-pill)',
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            Continue Shopping
          </a>
        </div>
      )}
      {!isSuccess && (
        <div>
          <h1>Order {id}</h1>
          <p>Order details will be fully available here in Sprint 3.</p>
        </div>
      )}
    </main>
  )
}
