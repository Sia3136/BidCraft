/*
Diagnosis Results:
-- 1. What's in the wishlists table?
[]

-- 2. What's in cart_items?
[]

-- 3. Check column types
[
  { column_name: 'id', data_type: 'integer' },
  { column_name: 'user_id', data_type: 'integer' },
  { column_name: 'id', data_type: 'integer' },
  { column_name: 'id', data_type: 'integer' },
  { column_name: 'user_id', data_type: 'integer' }
]
*/
// app/api/wishlist/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession, authOptions } from '@/lib/auth'
import { db } from '@/lib/db'  // your pg Pool

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = parseInt(String(session.user.id), 10)
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user session' }, { status: 400 })
  }

  try {
    const result = await db.query(
      `SELECT 
        w.id as wishlist_id,
        w.created_at as saved_at,
        l.id,
        l.title,
        l.slug,
        l.price,
        l.listing_type,
        l.cloudinary_public_id,
        l.category,
        l.subcategory,
        l.seller_id
       FROM wishlists w
       JOIN listings l ON l.id = w.listing_id
       WHERE w.user_id = $1
         AND l.status = 'active'
         AND l.is_published = true
       ORDER BY w.created_at DESC`,
      [userId]
    )
    return NextResponse.json({ items: result.rows })
  } catch (err) {
    console.error('[GET /api/wishlist] DB error:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = parseInt(String(session.user.id), 10)
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user session' }, { status: 400 })
  }

  const body = await req.json()
  const listingId = parseInt(String(body.listing_id), 10)
  if (isNaN(listingId)) {
    return NextResponse.json({ error: 'Invalid listing_id' }, { status: 400 })
  }

  try {
    // Check if listing exists and is active
    const listing = await db.query(
      `SELECT id FROM listings WHERE id = $1 AND status = 'active' AND is_published = true`,
      [listingId]
    )
    if (listing.rows.length === 0) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    // Check if already wishlisted
    const existing = await db.query(
      `SELECT id FROM wishlists WHERE user_id = $1 AND listing_id = $2`,
      [userId, listingId]
    )

    if (existing.rows.length > 0) {
      // Toggle OFF — remove
      await db.query(
        `DELETE FROM wishlists WHERE user_id = $1 AND listing_id = $2`,
        [userId, listingId]
      )
      return NextResponse.json({ action: 'removed', listing_id: listingId })
    } else {
      // Toggle ON — add
      await db.query(
        `INSERT INTO wishlists (user_id, listing_id, created_at) VALUES ($1, $2, NOW())`,
        [userId, listingId]
      )
      return NextResponse.json({ action: 'added', listing_id: listingId })
    }
  } catch (err) {
    console.error('[POST /api/wishlist] DB error:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
