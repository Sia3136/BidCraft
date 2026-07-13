import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting Cloudinary seed...');

  // Wipe existing listings and auctions
  await prisma.auctions.deleteMany({});
  await prisma.listings.deleteMany({});
  console.log('Wiped existing listings and auctions.');

  const dataPath = 'C:/Bidcraft/frontend/scripts/seed_data.json';
  const listingsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  let i = 0;
  for (const item of listingsData) {
    i++;
    if (!item.title || !item.public_id) continue;
    
    // 1. Find or create User (creator)
    // Extract a name from seller string: '"Pixels by Priya"' -> 'Pixels by Priya'
    const sellerName = item.seller ? item.seller.replace(/"/g, '') : 'Unknown Seller';
    const email = `${sellerName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}@bidcraft.local`;
    
    let user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.users.create({
        data: {
          email,
          name: sellerName,
          avatar_url: '/creator-1.png',
          role: 'seller',
        },
      });
      await prisma.profiles.create({
        data: {
          user_id: user.id,
          is_verified: true,
          trust_score: 4.8,
          total_sales: Math.floor(Math.random() * 50),
        },
      });
      console.log(`Created user: ${user.name}`);
    }

    // 2. Create Listing
    const listingType = item.listing_type === 'auction' ? 'AUCTION' : 'BUY_NOW';
    let price = item.price || item.starting_bid || 500;
    
    let category = 'Art';
    if (item.public_id.includes('collectibles')) {
      category = 'Collectibles';
    } else if (item.public_id.includes('handmade')) {
      category = 'Handmade & Crafts';
    }

    const listing = await prisma.listings.create({
      data: {
        seller_id: user.id,
        title: item.title,
        description: item.description,
        category: category,
        slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i,
        condition: 'new',
        photos: [item.public_id],
        listing_type: listingType,
        price: price,
        status: 'active', // Ensure status is active!
      },
    });

    console.log(`Created listing: ${listing.title} (${item.public_id})`);

    // 3. If Auction, create Auction record
    if (listingType === 'AUCTION') {
      const now = new Date();
      // auction_end_offset_days defaults to 7 if not specified
      const offsetDays = item.auction_end_offset_days || 7;
      // add [listing_id % 24] hours to ensure unique end times
      const hoursOffset = listing.id % 24;
      
      const endTime = new Date(now.getTime() + (offsetDays * 24 * 60 * 60 * 1000) + (hoursOffset * 60 * 60 * 1000));
      
      await prisma.auctions.create({
        data: {
          listing_id: listing.id,
          seller_id: user.id,
          start_bid: price,
          current_bid: item.current_bid || price,
          start_time: now,
          end_time: endTime,
          status: 'active',
          total_bids: Math.floor(Math.random() * 10) + 1, // dummy bid count
        },
      });
      console.log(`Created auction for: ${listing.title} ending at ${endTime.toISOString()}`);
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
