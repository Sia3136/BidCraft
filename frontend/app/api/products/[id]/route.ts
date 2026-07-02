import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const listingId = parseInt(id, 10);
    if (isNaN(listingId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
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
      creator: listing.users.name,
      category: 'Art',
      subcategory: listing.category || 'Other',
      price: Number(listing.price),
      buyingMethod: listing.listing_type === 'AUCTION' ? 'Auction' : (listing.listing_type === 'BUY_NOW' ? 'Buy Now' : 'Negotiable'),
      image: Array.isArray(listing.photos) ? listing.photos[0] : (typeof listing.photos === 'string' ? JSON.parse(listing.photos)[0] : listing.photos),
      description: listing.description || '',
      verified: listing.users.profiles?.[0]?.is_verified || false,
      offersAllowed: listing.listing_type === 'NEGOTIABLE' || true,
      bidCount: listing.auctions?.total_bids || 0,
      currentBid: listing.auctions?.current_bid ? Number(listing.auctions.current_bid) : Number(listing.price),
    };

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
