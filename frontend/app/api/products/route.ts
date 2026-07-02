import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');

  try {
    const where: any = {};
    if (category) {
      // Just returning everything for now or filter if needed
    }
    if (subcategory) {
      where.category = subcategory;
    }

    const listings = await prisma.listings.findMany({
      where,
      include: {
        users: {
          include: { profiles: true }
        },
        auctions: true,
      },
      orderBy: { created_at: 'desc' }
    });

    const products = listings.map(listing => ({
      id: String(listing.id),
      title: listing.title,
      creator: listing.users.name,
      category: 'Art', // Map to high-level category
      subcategory: listing.category || 'Other',
      price: Number(listing.price),
      buyingMethod: listing.listing_type === 'AUCTION' ? 'Auction' : (listing.listing_type === 'BUY_NOW' ? 'Buy Now' : 'Negotiable'),
      image: Array.isArray(listing.photos) ? listing.photos[0] : (typeof listing.photos === 'string' ? JSON.parse(listing.photos)[0] : listing.photos),
      description: listing.description || '',
      verified: listing.users.profiles?.[0]?.is_verified || false,
      offersAllowed: listing.listing_type === 'NEGOTIABLE' || true,
      bidCount: listing.auctions?.total_bids || 0,
      currentBid: listing.auctions?.current_bid ? Number(listing.auctions.current_bid) : Number(listing.price),
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
