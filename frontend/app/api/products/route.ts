import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');

  try {
    const sort = searchParams.get('sort') || 'Newest';

    const where: any = {};
    if (category) {
      where.category = category;
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
      orderBy: sort.toLowerCase() === 'price: low to high' || sort === 'price-asc' ? { price: 'asc' } :
               sort.toLowerCase() === 'price: high to low' || sort === 'price-desc' ? { price: 'desc' } :
               sort.toLowerCase() === 'oldest' ? { created_at: 'asc' } :
               { created_at: 'desc' }
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
      verified: listing.users?.profiles?.is_verified || false,
      offersAllowed: listing.listing_type === 'NEGOTIABLE',
      bidCount: listing.auctions?.total_bids || 0,
      currentBid: listing.auctions?.current_bid ? Number(listing.auctions.current_bid) : Number(listing.price),
    }));

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
