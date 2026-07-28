const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

export type User = {
  id: string
  name: string
  email: string
  mobile?: string
  role: 'buyer' | 'seller' | 'admin'
  avatar?: string
  createdAt: string
}

export type AuthResponse = {
  user: User
  token: string
}
export type Listing = {
  id: string
  title: string
  description: string
  price: number
  category: string
  subcategory: string
  buyingMethod: 'Buy Now' | 'Auction' | 'Negotiable'
  images: string[]
  image: string
  creator: string
  creatorRating: number
  creatorReviewCount: number
  creatorBadges: string[]
  verified: boolean
  offersAllowed: boolean
  minimumOfferPercent: number
  newArrival: boolean
  collections: string[]
  occasions: string[]
  auctionEndsAt: string | null
  currentBid: number | null
  bidCount: number
  specifications: Record<string, string>
  reviews: Array<{ name: string; rating: number; date: string; text: string }>
  status: string
  createdAt: string
  auctionId?: string
  numericId?: number
}

export type ListingsResponse = {
  listings: Listing[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export async function fetchListings(params: Record<string, string | number> = {}): Promise<ListingsResponse> {
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => [k, String(v)])
  ).toString()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings?${qs}`, { credentials: 'include',
    next: { revalidate: 60 }   // ISR: re-fetch every 60s
  })
  if (!res.ok) throw new Error(`fetchListings failed: ${res.status}`)
  const data = await res.json()
  return data
}

export async function fetchListingById(id: string): Promise<Listing> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${id}`, { credentials: 'include',
    next: { revalidate: 60 }
  })
  if (!res.ok) throw new Error(`fetchListingById failed: ${res.status}`)
  return res.json()
}

export async function fetchLiveAuctions(limit = 4): Promise<{ auctions: Listing[] }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/auctions/live?limit=${limit}`, { credentials: 'include',
    next: { revalidate: 30 }  // shorter cache — auctions change fast
  })
  if (!res.ok) throw new Error(`fetchLiveAuctions failed: ${res.status}`)
  return res.json()
}

export async function fetchNewArrivals(): Promise<{ listings: Listing[] }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings?sort=newest`, { credentials: 'include',
    next: { revalidate: 120 }
  })
  if (!res.ok) throw new Error(`fetchNewArrivals failed: ${res.status}`)
  return res.json()
}

// Register
export async function register(data: {
  name: string
  email: string
  password: string
}): Promise<AuthResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, { credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || json.error || 'Registration failed')
  return { user: json.user, token: json.accessToken }
}

// Login
export async function login(data: {
  email: string
  password: string
}): Promise<AuthResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, { credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || json.error || 'Login failed')
  return { user: json.user, token: json.accessToken }
}

// Get current user (requires token)
export async function getMe(token: string): Promise<User> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, { credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || json.error || 'Session expired')
  return json.user || json
}

export type CreateOrderResponse = {
  payment_id: string
  provider_order_id: string
  amount: number
  currency: string
  key_id: string
}

export async function createOrder(listingId: string, token: string): Promise<{ order: { id: string } }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, { credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ listing_id: listingId })
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to create order')
  return json
}

export async function createPaymentOrder(
  orderId: string,
  token: string
): Promise<CreateOrderResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-order`, { credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ order_id: parseInt(orderId, 10) })
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to create payment order')
  return json
}

export async function verifyPayment(data: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  order_id: number
}, token: string): Promise<{ success: boolean; order_id: string; status: string }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/verify`, { credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Payment verification failed')
  return json
}

export async function fetchOrderById(id: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/` + id, { credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Order not found')
  return json.order || json
}

export type BidResponse = {
  success: boolean
  bidAmount: number
  newEndTime: string
  totalBids: number
  antiSnipingExtended: boolean
}

export async function placeBid(
  auctionId: string,
  amount: number,
  token: string
): Promise<BidResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions/` + auctionId + `/bids`, { credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bid_amount: amount }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to place bid', { cause: json.code })
  return json
}

export async function createBidDeposit(auctionId: string, amount: number, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions/` + auctionId + `/deposit`, { credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to initiate deposit')
  return json
}

export async function verifyBidDeposit(auctionId: string, data: any, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions/` + auctionId + `/deposit/verify`, { credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to verify deposit')
  return json
}

export async function uploadListingImage(file: File, token: string): Promise<{ url: string; publicId: string }> {
  const form = new FormData()
  form.append('image', file)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/upload`, { credentials: 'include',
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Upload failed')
  return json
}

export async function createListing(data: {
  title: string; description: string; price: number;
  category: string; subcategory: string; buyingMethod: string;
  offersAllowed: boolean; minimumOfferPercent: number;
  imageUrls: string[]; specifications: Record<string, string>;
  auctionEndsAt?: string; collections?: string[]; occasions?: string[];
}, token: string): Promise<{ listingId: string, slug?: string }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings`, { credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to create listing')
  return json
}

export async function fetchSellerListings(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller/listings`, { credentials: 'include',
    headers: { Authorization: `Bearer ${token}` }, cache: 'no-store'
  })
  return res.json()
}

export async function fetchSellerOrders(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller/orders`, { credentials: 'include',
    headers: { Authorization: `Bearer ${token}` }, cache: 'no-store'
  })
  return res.json()
}

export async function deleteListing(listingId: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/` + listingId, { credentials: 'include',
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

export async function submitOffer(listingId: string, offerAmount: number, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/` + listingId + `/offers`, { credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ listingId, offerAmount }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to submit offer')
  return json
}

export async function shipOrder(orderId: string, data: { trackingNumber: string; carrier: string }, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/` + orderId + `/ship`, { credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to update shipment')
  return json
}

export async function confirmDelivery(orderId: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/` + orderId + `/deliver`, { credentials: 'include',
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to confirm delivery')
  return json
}

export async function disputeOrder(orderId: string, reason: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/` + orderId + `/dispute`, { credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ reason }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to raise dispute')
  return json
}

export async function fetchCreators(sort: string = 'followers', limit: number = 20, offset: number = 0) {
  const qs = new URLSearchParams({ sort, limit: String(limit), offset: String(offset) }).toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/creators?` + qs, { credentials: 'include',
    next: { revalidate: 60 }
  })
  if (!res.ok) throw new Error(`fetchCreators failed: ${res.status}`)
  return res.json()
}

export async function checkUsername(username: string): Promise<{ available: boolean }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/check-username?username=${encodeURIComponent(username)}`, { credentials: 'include' })
  if (!res.ok) throw new Error(`checkUsername failed`)
  return res.json()
}

export async function updateProfile(data: any, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, { credentials: 'include',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to update profile')
  return json
}
