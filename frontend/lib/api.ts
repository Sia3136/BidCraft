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

const TRACKED_AUCTION = 'REPLACE_WITH_AUCTION_SLUG';
const TRACKED_NEGOTIABLE = 'REPLACE_WITH_NEGOTIABLE_SLUG';
const TRACKED_BUY_NOW = 'REPLACE_WITH_BUY_NOW_SLUG';

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

  // TRACE LOGGING
  let buyNowCount = 0, auctionCount = 0, negotiableCount = 0;
  let trackAuctionFound = false, trackNegotiableFound = false, trackBuyNowFound = false;

  for (const row of (data.listings || [])) {
    if (row.buyingMethod === 'Buy Now') buyNowCount++;
    if (row.buyingMethod === 'Auction') auctionCount++;
    if (row.buyingMethod === 'Negotiable') negotiableCount++;
    
    if (row.id === TRACKED_AUCTION) trackAuctionFound = true;
    if (row.id === TRACKED_NEGOTIABLE) trackNegotiableFound = true;
    if (row.id === TRACKED_BUY_NOW) trackBuyNowFound = true;
  }

  console.log("=== TRACE: fetchListings() ===");
  console.log("Total received (data.total):", data.total);
  console.log("Returned listings length:", (data.listings || []).length);
  console.log("Buy Now Count:", buyNowCount);
  console.log("Auction Count:", auctionCount);
  console.log("Negotiable Count:", negotiableCount);
  console.log(`Tracked Auction (${TRACKED_AUCTION}) Present:`, trackAuctionFound);
  console.log(`Tracked Negotiable (${TRACKED_NEGOTIABLE}) Present:`, trackNegotiableFound);
  console.log(`Tracked Buy Now (${TRACKED_BUY_NOW}) Present:`, trackBuyNowFound);
  console.log("================================");

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
  mobile?: string
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
  emailOrMobile: string
  password: string
}): Promise<AuthResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, { credentials: 'include',
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
}, token: string): Promise<{ listingId: string }> {
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me/listings`, { credentials: 'include',
    headers: { Authorization: `Bearer ${token}` }, cache: 'no-store'
  })
  return res.json()
}

export async function fetchSellerOrders(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me/orders`, { credentials: 'include',
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
