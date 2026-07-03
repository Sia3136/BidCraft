import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { exploreProducts } from '../lib/exploreProducts';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  // Delete all existing to avoid duplicates if we run multiple times? 
  // No, the prompt says "Migrate the contents of lib/exploreProducts.ts into the real products table via a migration/seed script".
  // Let's clear listings and auctions first to be clean, but wait, the backend might have other users.
  // We'll just clear the listings we're about to add or just rely on title uniqueness?
  // Let's just insert them.

  await prisma.$transaction(async (tx) => {
    for (const product of exploreProducts) {
      // 1. Find or create User (creator)
      const email = `${product.creator.replace(/\s+/g, '').toLowerCase()}@bidcraft.local`;
      
      let user = await tx.users.findUnique({
        where: { email },
      });

      if (!user) {
        user = await tx.users.create({
          data: {
            email,
            name: product.creator,
            avatar_url: '/creator-1.png', // fallback
            role: 'seller',
          },
        });
        // create profile
        await tx.profiles.create({
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

      const listing = await tx.listings.create({
        data: {
          seller_id: user.id,
          title: product.title,
          description: product.description,
          category: product.category,
          slug: product.id,
          condition: 'new',
          photos: [product.image],
          listing_type: listingType,
          price: product.price,
          status: 'active',
        },
      });

      console.log(`Created listing: ${listing.title} (${listingType})`);

      // 3. If Auction, create Auction record
      if (listingType === 'AUCTION') {
        const now = new Date();
        const endTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days
        
        await tx.auctions.create({
          data: {
            listing_id: listing.id,
            seller_id: user.id,
            start_bid: product.price,
            current_bid: product.currentBid || product.price,
            start_time: now,
            end_time: endTime,
            status: 'active',
            total_bids: product.bidCount || 0,
          },
        });
        console.log(`Created auction for: ${listing.title}`);
      }
    }
  }, { timeout: 30000 });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
