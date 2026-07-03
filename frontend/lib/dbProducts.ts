import { prisma } from './prisma';
import { redis, cacheGet, cacheSet } from './redis';

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

function mapListingToProduct(listing: any): Product {
  const imagePath = Array.isArray(listing.photos) 
    ? (listing.photos as string[])[0] 
    : (typeof listing.photos === 'string' ? JSON.parse(listing.photos)[0] : String(listing.photos));
  
  return {
    id: String(listing.id),
    title: listing.title,
    creator: listing.users?.name || 'Unknown',
    category: listing.category || 'Other',
    subcategory: listing.subcategory || listing.category || 'Other',
    price: Number(listing.price),
    buyingMethod: listing.listing_type === 'AUCTION' ? 'Auction' : (listing.listing_type === 'BUY_NOW' ? 'Buy Now' : 'Make Offer'),
    image: imagePath || '/images/default.jpg',
    description: listing.description || '',
    verified: listing.users?.profiles?.[0]?.is_verified || false,
    offersAllowed: listing.listing_type === 'NEGOTIABLE' || true,
    bidCount: listing.auctions?.total_bids || 0,
    currentBid: listing.auctions?.current_bid ? Number(listing.auctions.current_bid) : Number(listing.price),
    auctionEndTime: listing.auctions?.end_time ? listing.auctions.end_time.toISOString() : undefined,
  };
}

export async function invalidateListingCache(id: string) {
  try {
    if (redis) {
      await redis.del(`listing:${id}`);
      await redis.del('home:live-auctions');
    }
  } catch (e) {
    console.warn('Redis cache invalidate error:', e);
  }
}

export async function getProducts(options?: { category?: string; subcategory?: string; search?: string; page?: number; sort?: string }): Promise<Product[]> {
  const category = options?.category || 'all';
  const subcategory = options?.subcategory || 'all';
  const page = options?.page || 1;
  const sort = options?.sort || 'recent';
  
  const cacheKey = options?.search 
    ? `explore:search:${options.search}:${page}`
    : `explore:${category}:${subcategory}:${page}:${sort}`;
    
  const ttl = options?.search ? 60 : 120;

  try {
    const cached = await cacheGet(cacheKey);
    if (cached) return typeof cached === 'string' ? JSON.parse(cached) : cached;
  } catch (e) {
    console.warn('Redis cache read error:', e);
  }

  const where: any = { status: 'active' };
  if (options?.category && options.category !== 'all') {
    where.category = options.category;
  }
  if (options?.subcategory && options.subcategory !== 'all') {
    where.subcategory = options.subcategory;
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
    orderBy: sort === 'newest' ? { created_at: 'desc' } : { created_at: 'desc' },
    take: 20,
    skip: (page - 1) * 20
  });

  const results = listings.map(mapListingToProduct);
  
  try {
    await cacheSet(cacheKey, results, ttl);
  } catch (e) {
    console.warn('Redis cache write error:', e);
  }
  
  return results;
}

export async function getNewArrivals(): Promise<Product[]> {
  const cacheKey = 'home:new-arrivals';
  
  try {
    const cached = await cacheGet(cacheKey);
    if (cached) return typeof cached === 'string' ? JSON.parse(cached) : cached;
  } catch (e) {
    console.warn('Redis cache read error:', e);
  }

  const listings = await prisma.listings.findMany({
    where: { status: 'active' },
    include: { users: { include: { profiles: true } }, auctions: true },
    orderBy: { created_at: 'desc' },
    take: 8
  });

  const results = listings.map(mapListingToProduct);
  
  try {
    await cacheSet(cacheKey, results, 180);
  } catch (e) {
    console.warn('Redis cache write error:', e);
  }
  
  return results;
}

export async function getLiveAuctions(): Promise<Product[]> {
  const cacheKey = 'home:live-auctions';
  
  try {
    const cached = await cacheGet(cacheKey);
    if (cached) return typeof cached === 'string' ? JSON.parse(cached) : cached;
  } catch (e) {
    console.warn('Redis cache read error:', e);
  }

  const listings = await prisma.listings.findMany({
    where: { 
      listing_type: 'AUCTION',
      status: 'active'
    },
    include: { users: { include: { profiles: true } }, auctions: true },
    orderBy: { created_at: 'desc' },
    take: 6
  });

  const results = listings.map(mapListingToProduct);
  
  try {
    await cacheSet(cacheKey, results, 30);
  } catch (e) {
    console.warn('Redis cache write error:', e);
  }
  
  return results;
}

export async function getProductById(idOrSlug: string): Promise<Product | null> {
  const cacheKey = `listing:${idOrSlug}`;
  
  try {
    const cached = await cacheGet(cacheKey);
    if (cached) return typeof cached === 'string' ? JSON.parse(cached) : cached;
  } catch (e) {
    console.warn('Redis cache read error:', e);
  }

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

  const result = mapListingToProduct(listing);

  try {
    await cacheSet(cacheKey, result, 300);
  } catch (e) {
    console.warn('Redis cache write error:', e);
  }

  return result;
}

export async function getSellerById(sellerId: string): Promise<any | null> {
  const cacheKey = `seller:${sellerId}`;
  
  try {
    const cached = await cacheGet(cacheKey);
    if (cached) return typeof cached === 'string' ? JSON.parse(cached) : cached;
  } catch (e) {
    console.warn('Redis cache read error:', e);
  }

  const numericId = parseInt(sellerId, 10);
  if (isNaN(numericId)) return null;

  const seller = await prisma.users.findUnique({
    where: { id: numericId, role: 'seller' },
    include: { profiles: true }
  });

  if (!seller) return null;

  try {
    await cacheSet(cacheKey, seller, 600);
  } catch (e) {
    console.warn('Redis cache write error:', e);
  }

  return seller;
}
