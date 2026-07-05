const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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
