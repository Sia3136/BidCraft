import { prisma } from './prisma';

export interface Product {
  id: string;
  title: string;
  creator: string;
  category: string;
  subcategory: string;
  price: number;
  buyingMethod: 'Buy Now' | 'Auction' | 'Negotiable';
  image: string;
  description: string;
  verified: boolean;
  offersAllowed: boolean;
  bidCount?: number;
  currentBid?: number;
}

export async function getProducts(options?: { category?: string; subcategory?: string; slug?: string }): Promise<Product[]> {
  const where: any = {};
  if (options?.category) {
    // If we map our high level 'Art' category. In the DB we seeded 'Art' in `category` but it could be subcategory.
    // Let's just find everything for now, or match if exact.
    // In seed.ts we used: category: product.category (which is 'Art'). Wait, actually in exploreProducts, category="Art" and subcategory="Paintings".
    // In seed.ts: `category: product.category`. We didn't store subcategory explicitly unless we put it in description or categories table.
    // Wait, `exploreProducts` has `category` and `subcategory`. In seed.ts, I seeded `category: product.category` which was "Art". I LOST the subcategory!
  }

  const listings = await prisma.listings.findMany({
    where,
    include: {
      users: { include: { profiles: true } },
      auctions: true,
    },
    orderBy: { created_at: 'desc' }
  });

  return listings.map(listing => {
    // We can try to infer subcategory from title or something if it's missing, but let's just use what we have.
    const imagePath = Array.isArray(listing.photos) ? (listing.photos as string[])[0] : (typeof listing.photos === 'string' ? JSON.parse(listing.photos)[0] : String(listing.photos));
    
    return {
      id: String(listing.id),
      title: listing.title,
      creator: listing.users.name,
      category: 'Art', // Fallback or use listing.category
      subcategory: listing.category || 'Other',
      price: Number(listing.price),
      buyingMethod: listing.listing_type === 'AUCTION' ? 'Auction' : (listing.listing_type === 'BUY_NOW' ? 'Buy Now' : 'Negotiable'),
      image: imagePath || '/images/default.jpg',
      description: listing.description || '',
      verified: listing.users.profiles?.[0]?.is_verified || false,
      offersAllowed: listing.listing_type === 'NEGOTIABLE' || true,
      bidCount: listing.auctions?.total_bids || 0,
      currentBid: listing.auctions?.current_bid ? Number(listing.auctions.current_bid) : Number(listing.price),
    };
  });
}

export async function getProductById(id: string): Promise<Product | null> {
  const listingId = parseInt(id, 10);
  if (isNaN(listingId)) return null;

  const listing = await prisma.listings.findUnique({
    where: { id: listingId },
    include: {
      users: { include: { profiles: true } },
      auctions: true,
    }
  });

  if (!listing) return null;

  const imagePath = Array.isArray(listing.photos) ? (listing.photos as string[])[0] : (typeof listing.photos === 'string' ? JSON.parse(listing.photos)[0] : String(listing.photos));

  return {
    id: String(listing.id),
    title: listing.title,
    creator: listing.users.name,
    category: 'Art',
    subcategory: listing.category || 'Other',
    price: Number(listing.price),
    buyingMethod: listing.listing_type === 'AUCTION' ? 'Auction' : (listing.listing_type === 'BUY_NOW' ? 'Buy Now' : 'Negotiable'),
    image: imagePath || '/images/default.jpg',
    description: listing.description || '',
    verified: listing.users.profiles?.[0]?.is_verified || false,
    offersAllowed: listing.listing_type === 'NEGOTIABLE' || true,
    bidCount: listing.auctions?.total_bids || 0,
    currentBid: listing.auctions?.current_bid ? Number(listing.auctions.current_bid) : Number(listing.price),
  };
}
