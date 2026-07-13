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
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession, authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    const result = await prisma.wishlist.findMany({
      where: {
        user_id: userId,
        listings: { status: 'active' }
      },
      include: {
        listings: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            listing_type: true,
            photos: true,
            category: true,
            seller_id: true,
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })
    
    const items = result.map((w: any) => {
      let image = null;
      if (Array.isArray(w.listings?.photos) && w.listings.photos.length > 0) {
        image = String(w.listings.photos[0]);
      }
      return {
        wishlist_id: w.id,
        saved_at: w.created_at,
        id: w.listings?.id,
        title: w.listings?.title,
        slug: w.listings?.slug,
        price: w.listings?.price,
        listing_type: w.listings?.listing_type,
        image: image,
        category: w.listings?.category,
        seller_id: w.listings?.seller_id
      };
    })

    return NextResponse.json({ items })
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
    const listing = await prisma.listings.findFirst({
      where: { id: listingId, status: 'active' }
    })
    
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    const existing = await prisma.wishlist.findFirst({
      where: { user_id: userId, listing_id: listingId }
    })

    if (existing) {
      // Toggle OFF — remove
      await prisma.wishlist.delete({
        where: { user_id_listing_id: { user_id: userId, listing_id: listingId } }
      })
      return NextResponse.json({ action: 'removed', listing_id: listingId })
    } else {
      // Toggle ON — add
      await prisma.wishlist.create({
        data: { user_id: userId, listing_id: listingId }
      })
      return NextResponse.json({ action: 'added', listing_id: listingId })
    }
  } catch (err) {
    console.error('[POST /api/wishlist] DB error:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
