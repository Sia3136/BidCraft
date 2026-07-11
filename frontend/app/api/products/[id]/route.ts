import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cacheGet, cacheSet } from '@/lib/redis';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const numericId = parseInt(id, 10);
    let cacheKey = `product:detail:${id}`;
    let listingId = !isNaN(numericId) ? numericId : null;

    try {
      const cached = await cacheGet(cacheKey);
      if (cached) {
        return NextResponse.json(typeof cached === 'string' ? JSON.parse(cached) : cached, {
          headers: {
            'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
          }
        });
      }
    } catch (e) {
      console.warn('Redis cache read error:', e);
    }

    let listing;
    
    if (listingId !== null) {
      listing = await prisma.listings.findUnique({
        where: { id: listingId },
        include: {
          users: {
            include: { profiles: true }
          },
          auctions: true,
        }
      });
    }

    if (!listing) {
      listing = await prisma.listings.findUnique({
        where: { slug: id },
        include: {
          users: {
            include: { profiles: true }
          },
          auctions: true,
        }
      });
    }

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
      verified: listing.users.profiles?.is_verified || false,
      offersAllowed: listing.listing_type === 'NEGOTIABLE' || true,
      bidCount: listing.auctions?.total_bids || 0,
      currentBid: listing.auctions?.current_bid ? Number(listing.auctions.current_bid) : Number(listing.price),
    };

    try {
      await cacheSet(cacheKey, product, 300);
    } catch (e) {
      console.warn('Redis cache write error:', e);
    }

    return NextResponse.json(product, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
      }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
