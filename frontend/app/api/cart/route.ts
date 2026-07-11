import { NextRequest, NextResponse } from 'next/server'
import { getServerSession, authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const userId = parseInt(String(session.user.id), 10)
  
  const result = await db.query(
    `SELECT 
      c.id as cart_item_id,
      1 as quantity,
      l.id,
      l.title,
      l.price,
      (l.photos->0)::text as image,
      l.listing_type,
      l.category
     FROM cart_items c
     JOIN listings l ON l.id = c.listing_id
     WHERE c.user_id = $1
       AND l.status = 'active'
       AND l.listing_type != 'AUCTION'
     ORDER BY c.created_at DESC`,
    [userId]
  )
  return NextResponse.json({ items: result.rows })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const userId = parseInt(String(session.user.id), 10)
  const body = await req.json()
  const listingId = parseInt(String(body.listing_id), 10)

  // Verify listing exists and is not an auction
  const listing = await db.query(
    `SELECT id, listing_type FROM listings WHERE id = $1 AND status = 'active'`,
    [listingId]
  )
  if (!listing.rows[0]) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  if (listing.rows[0].listing_type === 'AUCTION') {
    return NextResponse.json({ error: 'Auction items cannot be added to cart' }, { status: 400 })
  }

  await db.query(
    `INSERT INTO cart_items (user_id, listing_id, created_at, updated_at)
     VALUES ($1, $2, NOW(), NOW())
     ON CONFLICT (user_id, listing_id) DO NOTHING`,
    [userId, listingId]
  )
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const userId = parseInt(String(session.user.id), 10)
  const { searchParams } = new URL(req.url)
  const listingId = parseInt(String(searchParams.get('listing_id')), 10)

  if (isNaN(listingId)) return NextResponse.json({ error: 'Invalid listing id' }, { status: 400 })

  await db.query(
    `DELETE FROM cart_items WHERE user_id = $1 AND listing_id = $2`,
    [userId, listingId]
  )
  return NextResponse.json({ success: true })
}
