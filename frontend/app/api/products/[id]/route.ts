import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const listingId = parseInt(id, 10);
    if (isNaN(listingId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const cacheKey = `product:detail:${listingId}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return NextResponse.json(JSON.parse(cached), {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=59',
          }
        });
      }
    } catch (e) {
      console.warn('Redis cache read error:', e);
    }

    const listing = await prisma.listings.findUnique({
      where: { id: listingId },
      include: {
        users: {
          include: { profiles: true }
        },
        auctions: true,
      }
    });

    if (!listing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = {
      id: String(listing.id),
      title: listing.title,
      creator: listing.users.name || 'Unknown',
      category: 'Art',
      subcategory: listing.category || 'Other',
      price: Number(listing.price),
      buyingMethod: listing.listing_type === 'AUCTION' ? 'Auction' : (listing.listing_type === 'BUY_NOW' ? 'Buy Now' : 'Make Offer'),
      image: Array.isArray(listing.photos) ? listing.photos[0] : (typeof listing.photos === 'string' ? JSON.parse(listing.photos)[0] : listing.photos),
      description: listing.description || '',
      verified: listing.users.profiles?.[0]?.is_verified || false,
      offersAllowed: listing.listing_type === 'NEGOTIABLE' || true,
      bidCount: listing.auctions?.total_bids || 0,
      currentBid: listing.auctions?.current_bid ? Number(listing.auctions.current_bid) : Number(listing.price),
    };

    try {
      await redis.set(cacheKey, JSON.stringify(product), 'EX', 300);
    } catch (e) {
      console.warn('Redis cache write error:', e);
    }

    return NextResponse.json(product, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=59',
      }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
