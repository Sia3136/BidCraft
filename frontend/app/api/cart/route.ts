import { NextRequest, NextResponse } from 'next/server'
import { getServerSession, authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const userId = parseInt(String(session.user.id), 10)
  
  try {
    const result = await prisma.cart_items.findMany({
      where: {
        user_id: userId,
        listings: {
          status: 'active',
          listing_type: { not: 'AUCTION' }
        }
      },
      include: {
        listings: {
          select: {
            id: true,
            title: true,
            price: true,
            photos: true,
            listing_type: true,
            category: true,
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })
    
    const items = result.map((c: any) => {
      let image = null;
      if (Array.isArray(c.listings?.photos) && c.listings.photos.length > 0) {
        image = String(c.listings.photos[0]);
      }
      return {
        cart_item_id: c.id,
        quantity: 1,
        id: c.listings?.id,
        title: c.listings?.title,
        price: c.listings?.price,
        image: image,
        listing_type: c.listings?.listing_type,
        category: c.listings?.category
      };
    })

    return NextResponse.json({ items })
  } catch (err) {
    console.error('[GET /api/cart] DB error:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const userId = parseInt(String(session.user.id), 10)
  const body = await req.json()
  const listingId = parseInt(String(body.listing_id), 10)

  try {
    // Verify listing exists and is not an auction
    const listing = await prisma.listings.findFirst({
      where: { id: listingId, status: 'active' },
      select: { id: true, listing_type: true }
    })
    
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    if (listing.listing_type === 'AUCTION') {
      return NextResponse.json({ error: 'Auction items cannot be added to cart' }, { status: 400 })
    }

    // Use upsert to handle ON CONFLICT DO NOTHING equivalent
    const existing = await prisma.cart_items.findFirst({
      where: { user_id: userId, listing_id: listingId }
    })
    
    if (!existing) {
      await prisma.cart_items.create({
        data: { user_id: userId, listing_id: listingId }
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[POST /api/cart] DB error:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const userId = parseInt(String(session.user.id), 10)
  const { searchParams } = new URL(req.url)
  const listingId = parseInt(String(searchParams.get('listing_id')), 10)

  if (isNaN(listingId)) return NextResponse.json({ error: 'Invalid listing id' }, { status: 400 })

  try {
    // Use deleteMany because we are deleting by unique compound key, but Prisma requires it formatted differently, deleteMany is safer here
    await prisma.cart_items.deleteMany({
      where: { user_id: userId, listing_id: listingId }
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/cart] DB error:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
