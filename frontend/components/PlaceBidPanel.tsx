'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useAuction } from '@/hooks/useAuction'
import { placeBid, createBidDeposit, verifyBidDeposit } from '@/lib/api'
import { formatPrice } from '@/lib/formatPrice'
import Script from 'next/script'

type Props = {
  auctionId: string
  initialCurrentBid: number | null
  initialBidCount: number
  auctionEndsAt: string
  listingPrice: number
}

export function PlaceBidPanel({
  auctionId, initialCurrentBid, initialBidCount, auctionEndsAt, listingPrice
}: Props) {
  const { isAuthenticated, token } = useAuthStore()
  const router = useRouter()

  const auction = useAuction(auctionId, {
    currentBid: initialCurrentBid,
    bidCount: initialBidCount,
    auctionEndsAt,
    isEnded: new Date(auctionEndsAt).getTime() < Date.now()
  })

  // Re-check ended status based on the live auctionEndsAt
  const [isEnded, setIsEnded] = useState(auction.isEnded)
  
  useEffect(() => {
    const checkEnded = () => {
      setIsEnded(new Date(auction.auctionEndsAt).getTime() < Date.now())
    }
    checkEnded()
    const interval = setInterval(checkEnded, 1000)
    return () => clearInterval(interval)
  }, [auction.auctionEndsAt])

  const minimumNextBid = (auction.currentBid || listingPrice) + 10 // min increment 10
  const [bidAmount, setBidAmount] = useState<number | ''>(minimumNextBid)
  const [panelOpen, setPanelOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Sync input when min changes
  useEffect(() => {
    if (bidAmount < minimumNextBid) {
      setBidAmount(minimumNextBid)
    }
  }, [minimumNextBid])

  const handleDepositPayment = async () => {
    try {
      setLoading(true)
      const depositAmount = Math.min(Math.max((typeof bidAmount === 'number' ? bidAmount : 0) * 0.1, 99), 2000)
      const orderData = await createBidDeposit(auctionId, depositAmount, token!)
      
      const options = {
        key: orderData.key_id,
        amount: orderData.amount * 100, // paise
        currency: 'INR',
        name: 'BidCraft',
        description: 'Bid Deposit',
        order_id: orderData.provider_order_id,
        handler: async function (response: any) {
          try {
            await verifyBidDeposit(auctionId, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: depositAmount
            }, token!)
            
            // Retry placing bid
            await handlePlaceBidInternal()
          } catch (e: any) {
            setError('Payment verification failed')
          }
        },
        theme: { color: '#000000' }
      }
      const rzp = new (window as any).Razorpay(options)
      rzp.on('payment.failed', function () {
        setError('Payment failed')
      })
      rzp.open()
    } catch (err: any) {
      setError(err.message || 'Failed to initiate deposit payment')
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceBidInternal = async () => {
    setLoading(true)
    setError('')
    try {
      await placeBid(auctionId, bidAmount, token!)
      setSuccess(true)
      setPanelOpen(false)
      // Socket will update the UI via useAuction hook
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      if (err.cause === 'DEPOSIT_REQUIRED') {
        handleDepositPayment()
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceBid = async () => {
    if (!isAuthenticated || !token) {
      router.push(`/auth?returnTo=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    if (bidAmount < minimumNextBid) {
      setError(`Bid must be at least ${formatPrice(minimumNextBid)}`)
      return
    }

    await handlePlaceBidInternal()
  }

  if (isEnded) {
    return (
      <div className="p-4 bg-[var(--color-urgent-100)] rounded-[var(--radius-md)] text-[var(--color-urgent-600)] font-ui font-medium border border-[var(--color-urgent-300)]">
        This auction has ended.
      </div>
    )
  }

  return (
    <div className="font-ui w-full">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      {/* Live bid counter */}
      <div className="mb-4">
        <p className="text-[var(--color-ink-500)] text-[14px] uppercase font-semibold">Current Bid</p>
        <p className="text-[32px] font-bold text-[var(--color-ink-900)] font-display leading-none mt-1">
          {formatPrice(auction.currentBid || listingPrice)}
        </p>
        <p className="text-[var(--color-ink-500)] text-[14px] mt-1 font-medium">
          {auction.bidCount} {auction.bidCount === 1 ? 'bid' : 'bids'} placed
        </p>
      </div>

      {/* Place bid button */}
      <button
        onClick={() => {
          if (!isAuthenticated) {
            router.push(`/auth?returnTo=${encodeURIComponent(window.location.pathname)}`)
            return
          }
          setPanelOpen(!panelOpen)
        }}
        className="w-full h-12 bg-[var(--color-ink-900)] hover:bg-[var(--color-terracotta-600)] text-white font-bold rounded-[var(--radius-md)] transition-colors"
      >
        {isAuthenticated ? 'Place a Bid' : 'Sign In to Bid'}
      </button>

      {/* Inline bid input panel */}
      {panelOpen && (
        <div className="mt-4 p-4 bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] animate-in fade-in slide-in-from-top-2">
          <p className="text-[13px] text-[var(--color-ink-500)] font-medium mb-2">
            Minimum next bid: <span className="font-bold text-[var(--color-ink-900)]">{formatPrice(minimumNextBid)}</span>
          </p>
          <div className="flex gap-2">
            <div className="flex items-center border border-[var(--color-border-strong)] rounded-[var(--radius-md)] overflow-hidden bg-white flex-1">
              <button type="button" onClick={() => {
                const INCREMENT = (auction.currentBid || listingPrice) < 1000 ? 50 : (auction.currentBid || listingPrice) < 5000 ? 100 : (auction.currentBid || listingPrice) < 20000 ? 250 : 500;
                setBidAmount(prev => Math.max(minimumNextBid, (typeof prev === 'number' ? prev : minimumNextBid) - INCREMENT))
              }} className="px-4 h-11 text-[var(--color-ink-900)] hover:bg-[var(--color-cream-deep)] text-lg font-medium transition-colors">
                −
              </button>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={bidAmount}
                onChange={e => {
                  const raw = e.target.value.replace(/\D/g, '')
                  setBidAmount(raw === '' ? '' : parseInt(raw, 10))
                }}
                className="flex-1 min-w-0 h-11 text-center font-ui text-[16px] font-semibold text-[var(--color-ink-900)] outline-none border-x border-[var(--color-border-strong)] focus:border-[var(--color-terracotta-600)]"
              />
              <button type="button" onClick={() => {
                const INCREMENT = (auction.currentBid || listingPrice) < 1000 ? 50 : (auction.currentBid || listingPrice) < 5000 ? 100 : (auction.currentBid || listingPrice) < 20000 ? 250 : 500;
                setBidAmount(prev => (typeof prev === 'number' ? prev : minimumNextBid) + INCREMENT)
              }} className="px-4 h-11 text-[var(--color-ink-900)] hover:bg-[var(--color-cream-deep)] text-lg font-medium transition-colors">
                +
              </button>
            </div>
            <button
              onClick={handlePlaceBid}
              disabled={loading}
              className="h-11 px-6 bg-[var(--color-terracotta-600)] hover:bg-[var(--color-terracotta-700)] text-white border-none rounded-[var(--radius-md)] font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? '...' : 'Confirm'}
            </button>
          </div>
          {error && (
            <p className="text-[var(--color-urgent-600)] text-[13px] mt-2 font-medium">
              {error}
            </p>
          )}
        </div>
      )}

      {success && (
        <p className="text-[var(--color-success-600)] text-[14px] mt-3 font-medium flex items-center gap-1">
          <span>✓</span> Bid placed successfully!
        </p>
      )}
    </div>
  )
}
