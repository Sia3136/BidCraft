import { prisma } from './prisma';
import { redis } from './redis';

export interface Product {
  id: string;
  title: string;
  creator: string;
  category: string;
  subcategory: string;
  price: number;
  buyingMethod: 'Buy Now' | 'Auction' | 'Make Offer';
  image: string;
  description: string;
  verified: boolean;
  offersAllowed: boolean;
  bidCount?: number;
  currentBid?: number;
  auctionEndTime?: string;
}

export async function getProducts(options?: { category?: string; subcategory?: string; slug?: string; search?: string }): Promise<Product[]> {
  const cacheKey = `products:explore:${JSON.stringify(options || {})}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) return typeof cached === 'string' ? JSON.parse(cached) : cached;
  } catch (e) {
    console.warn('Redis cache read error:', e);
  }

  const where: any = {};
  if (options?.category) {
    where.category = options.category;
  }
  if (options?.search) {
    where.OR = [
      { title: { contains: options.search, mode: 'insensitive' } },
      { description: { contains: options.search, mode: 'insensitive' } }
    ];
  }

  const listings = await prisma.listings.findMany({
    where,
    include: {
      users: { include: { profiles: true } },
      auctions: true,
    },
    orderBy: { created_at: 'desc' }
  });

  const results = listings.map(listing => {
    const imagePath = Array.isArray(listing.photos) ? (listing.photos as string[])[0] : (typeof listing.photos === 'string' ? JSON.parse(listing.photos)[0] : String(listing.photos));
    
    return {
      id: String(listing.id),
      title: listing.title,
      creator: listing.users.name || 'Unknown',
      category: 'Art',
      subcategory: listing.category || 'Other',
      price: Number(listing.price),
      buyingMethod: listing.listing_type === 'AUCTION' ? 'Auction' : (listing.listing_type === 'BUY_NOW' ? 'Buy Now' : 'Make Offer'),
      image: imagePath || '/images/default.jpg',
      description: listing.description || '',
      verified: listing.users.profiles?.[0]?.is_verified || false,
      offersAllowed: listing.listing_type === 'NEGOTIABLE' || true, // TODO: verify this logic
      bidCount: listing.auctions?.total_bids || 0,
      currentBid: listing.auctions?.current_bid ? Number(listing.auctions.current_bid) : Number(listing.price),
      auctionEndTime: listing.auctions?.end_time ? listing.auctions.end_time.toISOString() : undefined,
    };
  });
  
  try {
    await redis.set(cacheKey, JSON.stringify(results), 'EX', 120);
  } catch (e) {
    console.warn('Redis cache write error:', e);
  }
  
  return results;
}

export async function getProductById(idOrSlug: string): Promise<Product | null> {
  let listing;
  const numericId = parseInt(idOrSlug, 10);

  if (!isNaN(numericId)) {
    listing = await prisma.listings.findUnique({
      where: { id: numericId },
      include: {
        users: { include: { profiles: true } },
        auctions: true,
      }
    });
  }

  // Fallback to slug lookup if numeric lookup fails or isn't a number
  if (!listing) {
    listing = await prisma.listings.findUnique({
      where: { slug: idOrSlug },
      include: {
        users: { include: { profiles: true } },
        auctions: true,
      }
    });
  }

  if (!listing) return null;

  const imagePath = Array.isArray(listing.photos) ? (listing.photos as string[])[0] : (typeof listing.photos === 'string' ? JSON.parse(listing.photos)[0] : String(listing.photos));

  const result: Product = {
    id: String(listing.id),
    title: listing.title,
    creator: listing.users.name || 'Unknown',
    category: 'Art',
    subcategory: listing.category || 'Other',
    price: Number(listing.price),
    buyingMethod: listing.listing_type === 'AUCTION' ? 'Auction' : (listing.listing_type === 'BUY_NOW' ? 'Buy Now' : 'Make Offer'),
    image: imagePath || '/images/default.jpg',
    description: listing.description || '',
    verified: listing.users.profiles?.[0]?.is_verified || false,
    offersAllowed: listing.listing_type === 'NEGOTIABLE' || true,
    bidCount: listing.auctions?.total_bids || 0,
    currentBid: listing.auctions?.current_bid ? Number(listing.auctions.current_bid) : Number(listing.price),
    auctionEndTime: listing.auctions?.end_time ? listing.auctions.end_time.toISOString() : undefined,
  };

  try {
    await redis.set(cacheKey, JSON.stringify(result), 'EX', 300);
  } catch (e) {
    console.warn('Redis cache write error:', e);
  }

  return result;
}
