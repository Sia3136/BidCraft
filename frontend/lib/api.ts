const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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
  const res = await fetch(`${API_BASE}/api/listings${qs ? '?' + qs : ''}`, {
    next: { revalidate: 60 }   // ISR: re-fetch every 60s
  })
  if (!res.ok) throw new Error(`fetchListings failed: ${res.status}`)
  return res.json()
}

export async function fetchListingById(id: string): Promise<Listing> {
  const res = await fetch(`${API_BASE}/api/listings/${id}`, {
    next: { revalidate: 60 }
  })
  if (!res.ok) throw new Error(`fetchListingById failed: ${res.status}`)
  return res.json()
}

export async function fetchLiveAuctions(limit = 4): Promise<{ auctions: Listing[] }> {
  const res = await fetch(`${API_BASE}/api/listings/auctions/live?limit=${limit}`, {
    next: { revalidate: 30 }  // shorter cache — auctions change fast
  })
  if (!res.ok) throw new Error(`fetchLiveAuctions failed: ${res.status}`)
  return res.json()
}

export async function fetchNewArrivals(): Promise<{ listings: Listing[] }> {
  const res = await fetch(`${API_BASE}/api/listings/new-arrivals`, {
    next: { revalidate: 120 }
  })
  if (!res.ok) throw new Error(`fetchNewArrivals failed: ${res.status}`)
  return res.json()
}

// Register
export async function register(data: {
  name: string
  email: string
  mobile?: string
  password: string
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
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
  emailOrMobile: string
  password: string
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Map emailOrMobile to email since backend expects email
    body: JSON.stringify({ email: data.emailOrMobile, password: data.password }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || json.error || 'Login failed')
  return { user: json.user, token: json.accessToken }
}

// Get current user (requires token)
export async function getMe(token: string): Promise<User> {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
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
  const res = await fetch(`${API_BASE}/api/orders`, {
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
  const res = await fetch(`${API_BASE}/api/payments/create-order`, {
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
  const res = await fetch(`${API_BASE}/api/payments/verify`, {
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
  const res = await fetch(`${API_BASE}/api/orders/${id}`, {
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
  const res = await fetch(`${API_BASE}/api/auctions/${auctionId}/bids`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bid_amount: amount }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to place bid')
  return json
}
