import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { exploreProducts } from '../lib/exploreProducts';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function getCloudinaryPublicId(category: string, subcategory: string, imagePath: string) {
  // Extract filename from /images/filename.ext
  const filename = imagePath.split('/').pop()?.split('.')[0] || 'default';
  
  // Map category and subcategory to folder
  let folder = 'bidcraft/misc';
  
  const cat = category.toLowerCase();
  const sub = subcategory.toLowerCase();
  
  if (cat.includes('art')) {
    if (sub.includes('painting')) folder = 'bidcraft/art/paintings';
    else if (sub.includes('digital')) folder = 'bidcraft/art/digital-art';
    else if (sub.includes('sculpture')) folder = 'bidcraft/art/sculptures';
    else folder = 'bidcraft/art/prints';
  } else if (cat.includes('handmade')) {
    if (sub.includes('textile')) folder = 'bidcraft/handmade/textiles';
    else if (sub.includes('pottery') || sub.includes('clay')) folder = 'bidcraft/handmade/pottery';
    else folder = 'bidcraft/handmade/crafts';
  } else if (cat.includes('collectible')) {
    if (sub.includes('rare') || sub.includes('hot wheels')) folder = 'bidcraft/collectibles/rare';
    else folder = 'bidcraft/collectibles/general';
  } else if (cat.includes('gaming')) {
    if (sub.includes('board')) folder = 'bidcraft/gaming/board-games';
    else folder = 'bidcraft/gaming/general';
  } else if (cat.includes('lifestyle')) {
    if (sub.includes('decor')) folder = 'bidcraft/lifestyle/home-decor';
    else folder = 'bidcraft/lifestyle/gifts';
  }
  
  return `${folder}/${filename}`;
}

async function main() {
  console.log('Starting Cloudinary seed...');

  // Wipe existing listings and auctions
  await prisma.auctions.deleteMany({});
  await prisma.listings.deleteMany({});
  console.log('Wiped existing listings and auctions.');

  for (const product of exploreProducts) {
    // 1. Find or create User (creator)
    const email = `${product.creator.replace(/\s+/g, '').toLowerCase()}@bidcraft.local`;
    
    let user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.users.create({
        data: {
          email,
          name: product.creator,
          avatar_url: '/creator-1.png',
          role: 'seller',
        },
      });
      await prisma.profiles.create({
        data: {
          user_id: user.id,
          is_verified: product.verified || false,
          trust_score: 4.5,
          total_sales: Math.floor(Math.random() * 50),
        },
      });
      console.log(`Created user: ${user.name}`);
    }

    // 2. Create Listing
    const listingType = product.buyingMethod === 'Auction' ? 'AUCTION' : 'BUY_NOW';
    
    // Map image to Cloudinary public_id
    const publicId = getCloudinaryPublicId(product.category, product.subcategory, product.image);
    
    // Generate random price between 50 and 5000 if not set realistically
    let price = product.price;
    if (price > 5000) {
      price = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
    }

    const listing = await prisma.listings.create({
      data: {
        seller_id: user.id,
        title: product.title,
        description: product.description + " Handcrafted with premium materials. This unique piece showcases the rich heritage of Indian craftsmanship.",
        category: product.category,
        slug: product.id,
        condition: 'new',
        photos: [publicId],
        listing_type: listingType,
        price: price,
        status: 'active',
      },
    });

    console.log(`Created listing: ${listing.title} (${publicId})`);

    // 3. If Auction, create Auction record
    if (listingType === 'AUCTION') {
      const now = new Date();
      const endTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days
      
      await prisma.auctions.create({
        data: {
          listing_id: listing.id,
          seller_id: user.id,
          start_bid: price,
          current_bid: product.currentBid || price,
          start_time: now,
          end_time: endTime,
          status: 'active',
          total_bids: product.bidCount || 0,
        },
      });
      console.log(`Created auction for: ${listing.title}`);
    }
  }

  console.log('Cloudinary Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
