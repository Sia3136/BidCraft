'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Loader2, Package, Truck, CheckCircle2, AlertCircle, ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'

interface Scan {
  timestamp: string;
  location: string;
  status: string;
  instructions: string;
}

interface TrackingData {
  trackingNumber: string;
  carrier: string;
  status: string;
  statusType: string;
  currentLocation: string;
  expectedDelivery: string;
  scans: Scan[];
}

export default function OrderTrackingPage() {
  const params = useParams()
  const orderId = params.id as string
  const { token, isAuthenticated } = useAuthStore()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tracking, setTracking] = useState<TrackingData | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push(`/auth?returnTo=/orders/${orderId}/tracking`)
      return
    }

    let isMounted = true;

    async function fetchTracking() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shipments/${orderId}/tracking`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Failed to load tracking data')
        }

        if (isMounted) {
          setTracking(data.tracking)
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchTracking()
    
    return () => { isMounted = false }
  }, [orderId, token, isAuthenticated, router])

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes('delivered')) return <CheckCircle2 className="w-8 h-8 text-[var(--color-success-600)]" />
    if (s.includes('transit') || s.includes('dispatched')) return <Truck className="w-8 h-8 text-[var(--color-terracotta-600)]" />
    return <Package className="w-8 h-8 text-[var(--color-ink-900)]" />
  }

  const getStatusProgress = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes('delivered')) return 100
    if (s.includes('transit') || s.includes('out for delivery')) return 75
    if (s.includes('dispatched')) return 50
    return 25
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream-base)] flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12 md:py-24">
        <Link href={`/orders`} className="inline-flex items-center text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)] font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Link>
        
        <h1 className="text-display-sm text-[var(--color-ink-900)] mb-8 font-[family-name:var(--font-playfair)]">Track Order #{orderId}</h1>

        {loading ? (
          <div className="bg-white rounded-[var(--radius-lg)] p-12 shadow-sm border border-[var(--color-border-subtle)] flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 text-[var(--color-terracotta-600)] animate-spin mb-4" />
            <p className="text-body-lg text-[var(--color-ink-700)]">Fetching latest tracking updates...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-[var(--radius-lg)] p-12 shadow-sm border border-[var(--color-border-subtle)] flex flex-col items-center justify-center min-h-[400px] text-center">
            <AlertCircle className="w-12 h-12 text-[var(--color-error)] mb-4" />
            <h3 className="text-heading-lg text-[var(--color-ink-900)] mb-2">Tracking Unavailable</h3>
            <p className="text-body-lg text-[var(--color-ink-700)] mb-6 max-w-md">{error}</p>
            <p className="text-body-sm text-[var(--color-ink-500)]">
              If this order was recently shipped, please allow 24 hours for tracking data to appear.
            </p>
          </div>
        ) : tracking ? (
          <div className="bg-white rounded-[var(--radius-lg)] shadow-sm border border-[var(--color-border-subtle)] overflow-hidden">
            {/* Header Section */}
            <div className="p-8 border-b border-[var(--color-border-subtle)] bg-[var(--color-cream-raised)]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-[var(--color-ink-900)] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-[var(--radius-pill)]">
                      {tracking.carrier}
                    </span>
                    <span className="font-mono text-body-lg text-[var(--color-ink-700)]">
                      {tracking.trackingNumber}
                    </span>
                  </div>
                  <h2 className="text-heading-xl text-[var(--color-ink-900)] flex items-center gap-3">
                    {getStatusIcon(tracking.status)}
                    {tracking.status}
                  </h2>
                </div>
                
                {tracking.expectedDelivery && (
                  <div className="bg-white px-6 py-4 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] shadow-sm">
                    <p className="text-caption font-semibold text-[var(--color-ink-500)] uppercase tracking-wider mb-1">Expected Delivery</p>
                    <p className="text-heading-md text-[var(--color-terracotta-600)]">
                      {new Date(tracking.expectedDelivery).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-[var(--color-border-subtle)] rounded-full overflow-hidden mt-4">
                <div 
                  className="absolute top-0 left-0 h-full bg-[var(--color-terracotta-600)] transition-all duration-1000 ease-out"
                  style={{ width: `${getStatusProgress(tracking.status)}%` }}
                />
              </div>
            </div>

            {/* Timeline Section */}
            <div className="p-8">
              <h3 className="text-heading-md text-[var(--color-ink-900)] mb-8 font-[family-name:var(--font-playfair)]">Shipment History</h3>
              
              <div className="relative border-l-2 border-[var(--color-border-subtle)] ml-4 space-y-8">
                {tracking.scans.length > 0 ? tracking.scans.map((scan, i) => (
                  <div key={i} className="relative pl-8">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${i === 0 ? 'bg-[var(--color-terracotta-600)]' : 'bg-[var(--color-ink-300)]'}`} />
                    
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                      <div>
                        <p className={`font-semibold text-body-lg ${i === 0 ? 'text-[var(--color-ink-900)]' : 'text-[var(--color-ink-700)]'}`}>
                          {scan.status}
                        </p>
                        {scan.location && (
                          <p className="text-body-md text-[var(--color-ink-500)] mt-1">{scan.location}</p>
                        )}
                        {scan.instructions && (
                          <p className="text-body-sm text-[var(--color-ink-500)] mt-2 italic bg-[var(--color-cream-base)] p-3 rounded-md border border-[var(--color-border-subtle)] inline-block">
                            "{scan.instructions}"
                          </p>
                        )}
                      </div>
                      <div className="flex items-center text-[var(--color-ink-500)] text-body-sm font-medium mt-1 md:mt-0 shrink-0">
                        <Clock className="w-4 h-4 mr-1.5" />
                        {new Date(scan.timestamp).toLocaleString('en-US', {
                          month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="pl-8 text-[var(--color-ink-500)]">No tracking history available yet.</div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </main>
      
      <Footer />
    </div>
  )
}
