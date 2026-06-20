'use client'

import React, { useEffect, useState, use } from 'react'
import Script from 'next/script'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/sections/footer'
import { useAuth } from '@/lib/auth-context'
import { listingsApi, auctionsApi, ordersApi, paymentsApi, profileApi, wishlistApi } from '@/lib/api'
import { CountdownTimer } from '@/components/countdown-timer'

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user, refreshUser } = useAuth()
  const [listing, setListing] = useState<any>(null)
  const [auction, setAuction] = useState<any>(null)
  const [bids, setBids] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isWatchlisted, setIsWatchlisted] = useState(false)
  const [watchLoading, setWatchLoading] = useState(false)
  
  // Checkout & Bid state
  const [bidAmount, setBidAmount] = useState('')
  const [submittingBid, setSubmittingBid] = useState(false)
  const [purchasing, setPurchasing] = useState(false)
  const [preauthorizing, setPreauthorizing] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'order_created' | 'success'>('idle')
  const [createdOrder, setCreatedOrder] = useState<any>(null)
  const [paymentData, setPaymentData] = useState<any>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const listingData = await listingsApi.get(id)
      setListing(listingData.listing)

      if (listingData.listing.listing_type === 'auction') {
        // Find matching auction
        const auctionsRes = await auctionsApi.list()
        const match = auctionsRes.auctions?.find((a: any) => String(a.listing_id) === String(id))
        if (match) {
          // Fetch full auction details + bids history
          const fullAuc = await auctionsApi.get(match.id)
          setAuction(fullAuc.auction)
          setBids(fullAuc.bids || [])
          
          // Prefill minimum bid amount
          const current = Number(fullAuc.auction.current_bid || fullAuc.auction.start_bid)
          const increment = Number(fullAuc.auction.min_bid_increment || 10)
          setBidAmount(String(current + increment))
        }
      }

      if (user) {
        try {
          const wl = await wishlistApi.list()
          const inWl = wl.wishlist?.find((item: any) => String(item.listing_id) === String(id))
          setIsWatchlisted(!!inWl)
        } catch (e) {
          console.error("Failed to fetch wishlist", e)
        }
      }

    } catch (err: any) {
      setError(err.message || 'Failed to load listing.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id, user])

  const toggleWatchlist = async () => {
    if (!user) {
      alert("Please sign in to add to your watchlist.")
      return
    }
    try {
      setWatchLoading(true)
      if (isWatchlisted) {
        setIsWatchlisted(false)
        await wishlistApi.remove(id)
      } else {
        setIsWatchlisted(true)
        await wishlistApi.add(id)
      }
    } catch (err: any) {
      setIsWatchlisted(!isWatchlisted)
      alert(err.message || "Failed to update watchlist")
    } finally {
      setWatchLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center text-muted-foreground">
          Loading product details...
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !listing) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center text-red-500 font-semibold">
          {error || 'Listing not found.'}
        </div>
        <Footer />
      </main>
    )
  }

  const photos = typeof listing.photos === 'string' ? JSON.parse(listing.photos) : listing.photos
  const mainImage = photos && photos.length > 0 ? photos[0] : '/placeholder.png'

  const handleBuyNow = async () => {
    if (!user) {
      alert('Please sign in to buy items.')
      return
    }
    router.push(`/checkout/${id}`)
  }

  const handleSimulatePayment = async () => {
    if (!createdOrder || !paymentData) return
    try {
      setPurchasing(true)
      const mockPayId = `mock_pay_${Date.now()}`
      const mockSig = `mock_sig_${paymentData.provider_order_id}_${mockPayId}`
      
      await paymentsApi.verifyPayment({
        razorpay_order_id: paymentData.provider_order_id,
        razorpay_payment_id: mockPayId,
        razorpay_signature: mockSig,
        order_id: createdOrder.id,
      })

      setCheckoutStep('success')
      alert('Simulated payment successful! Escrow is active.')
      loadData()
    } catch (err: any) {
      alert('Simulation failed: ' + err.message)
    } finally {
      setPurchasing(false)
    }
  }

  const handlePreauthorizeCard = async () => {
    try {
      setPreauthorizing(true)
      const setupRes = await paymentsApi.createSetupOrder()

      if (setupRes.key_id && setupRes.key_id !== 'mock_key' && (window as any).Razorpay) {
        const options = {
          key: setupRes.key_id,
          amount: setupRes.amount,
          currency: setupRes.currency,
          name: 'BidCraft Card Auth',
          description: `Pre-authorization for bidding`,
          order_id: setupRes.provider_order_id,
          handler: async function (response: any) {
            try {
              setPreauthorizing(true)
              await paymentsApi.saveCard(response.razorpay_payment_id)
              await refreshUser()
              alert('Card successfully pre-authorized for bidding!')
            } catch (err: any) {
              alert('Save Card failed: ' + err.message)
            } finally {
              setPreauthorizing(false)
            }
          },
          prefill: {
            name: user?.name,
            email: user?.email,
          },
          theme: { color: '#6366F1' },
          modal: {
            ondismiss: function() {
              setPreauthorizing(false)
            }
          }
        }
        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      } else {
        // Mock mode
        await paymentsApi.saveCard(`mock_preauth_pay_${Date.now()}`)
        await refreshUser()
        alert('Mock Card successfully pre-authorized for bidding!')
        setPreauthorizing(false)
      }
    } catch (err: any) {
      alert('Pre-authorization setup failed: ' + err.message)
      setPreauthorizing(false)
    }
  }

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert('Please sign in to place a bid.')
      return
    }
    if (!auction) return

    const amount = Number(bidAmount)
    const current = Number(auction.current_bid || auction.start_bid)
    const increment = Number(auction.min_bid_increment || 10)

    if (amount < current + increment) {
      alert(`Bid must be at least $${current + increment}`)
      return
    }

    try {
      setSubmittingBid(true)
      await auctionsApi.placeBid(auction.id, amount)
      alert('Bid placed successfully!')
      loadData() // reload PDP
    } catch (err: any) {
      alert('Failed to place bid: ' + err.message)
    } finally {
      setSubmittingBid(false)
    }
  }

  const getRemainingTime = (endTime: string) => {
    const diff = new Date(endTime).getTime() - Date.now()
    if (diff <= 0) return 'Ended'
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const mins = Math.floor((diff / (1000 * 60)) % 60)
    return `${hours}h ${mins}m`
  }

  return (
    <main className="min-h-screen bg-background">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-2xl overflow-hidden border border-border">
              <img
                src={mainImage}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {photos?.slice(1, 5).map((photo: string, index: number) => (
                <div key={index} className="aspect-square bg-muted rounded-xl overflow-hidden border border-border">
                  <img src={photo} alt={`${listing.title}-${index}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase tracking-wider">
                  {listing.listing_type}
                </span>
                <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full">
                  {listing.condition}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-foreground">{listing.title}</h1>
                <button
                  onClick={toggleWatchlist}
                  disabled={watchLoading}
                  className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors text-xl"
                  title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
                >
                  {isWatchlisted ? '❤️' : '🤍'}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Seller ID: #{listing.seller_id}</p>
            </div>

            {/* Escrow Guarantee Banner */}
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl mb-6 flex gap-3 items-start">
              <span className="text-xl">🛡️</span>
              <div>
                <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">Escrow Protected Transaction</h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">
                  Your funds are held securely by BidCraft. We only release payment to the creator after you confirm delivery of your item.
                </p>
              </div>
            </div>

            <div className="p-6 bg-card border border-border rounded-2xl shadow-sm mb-6">
              {listing.listing_type === 'fixed' ? (
                // FIXED PRICE DETAILS
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Price</p>
                  <p className="text-3xl font-extrabold text-primary mb-6">${listing.price}</p>

                  {checkoutStep === 'idle' && (
                    <button
                      onClick={handleBuyNow}
                      disabled={purchasing || listing.status !== 'active'}
                      className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                      {purchasing ? 'Processing Order...' : listing.status === 'active' ? 'Buy Now' : 'Not Available'}
                    </button>
                  )}

                  {checkoutStep === 'order_created' && (
                    <div className="space-y-3">
                      <p className="text-xs text-amber-600 font-semibold">Order created! Please complete payment.</p>
                      <button
                        onClick={handleSimulatePayment}
                        className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all"
                      >
                        Simulate Mock Payment (Local Dev Only)
                      </button>
                    </div>
                  )}

                  {checkoutStep === 'success' && (
                    <div className="p-3 bg-green-50 dark:bg-green-950/30 text-green-700 border border-green-200 dark:border-green-900/30 rounded-xl text-center text-sm font-semibold">
                      ✓ Order paid successfully! Check your notifications.
                    </div>
                  )}
                </div>
              ) : (
                // AUCTION DETAILS
                <div>
                  {auction ? (
                    <div>
                      <div className="flex justify-between items-baseline mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Current Highest Bid</p>
                          <p className="text-3xl font-extrabold text-primary">
                            ${auction.current_bid || auction.start_bid}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground mb-1">Time Remaining</p>
                          <CountdownTimer timeString={getRemainingTime(auction.end_time)} size="lg" />
                        </div>
                      </div>

                      {user && !user.razorpay_card_token ? (
                        // Pre-authorization mandate required
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl space-y-3">
                          <p className="text-xs text-amber-700 dark:text-amber-400">
                            <strong>Pre-authorization Required:</strong> To prevent non-payment, you must register a payment method before bidding.
                          </p>
                          <button
                            onClick={handlePreauthorizeCard}
                            disabled={preauthorizing}
                            className="w-full py-2.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition-all"
                          >
                            {preauthorizing ? 'Saving Payment Info...' : 'Pre-authorize Card'}
                          </button>
                        </div>
                      ) : (
                        // Bidding form active
                        <form onSubmit={handlePlaceBid} className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                              Your Bid (USD)
                            </label>
                            <input
                              type="number"
                              required
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                              className="w-full px-4 py-3 bg-muted text-foreground border border-border rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Minimum bid: ${Number(auction.current_bid || auction.start_bid) + Number(auction.min_bid_increment || 10)}
                            </p>
                          </div>

                          <button
                            type="submit"
                            disabled={submittingBid || auction.status !== 'active'}
                            className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
                          >
                            {submittingBid ? 'Placing Bid...' : 'Place Bid'}
                          </button>
                        </form>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-amber-600 font-semibold">Auction details are loading...</p>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-border pt-6 mt-6 flex-1">
              <h3 className="text-lg font-bold text-foreground mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {listing.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bids Log for Auctions */}
        {listing.listing_type === 'auction' && bids.length > 0 && (
          <div className="mt-16 pt-8 border-t border-border">
            <h3 className="text-xl font-bold text-foreground mb-6">Bid History</h3>
            <div className="max-w-2xl bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Bidder</th>
                    <th className="px-6 py-4">Bid Amount</th>
                    <th className="px-6 py-4">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bids.map((bid) => (
                    <tr key={bid.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">{bid.bidder_name}</td>
                      <td className="px-6 py-4 font-bold text-primary">${bid.bid_amount}</td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {new Date(bid.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
