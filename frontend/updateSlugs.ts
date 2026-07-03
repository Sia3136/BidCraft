import { PrismaClient } from './lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { exploreProducts } from './lib/exploreProducts';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Updating existing listings with slugs...');

  for (const product of exploreProducts) {
    // try to find the listing by title (assuming title hasn't changed)
    const listings = await prisma.listings.findMany({
      where: { title: product.title }
    });

    for (const listing of listings) {
      if (!listing.slug) {
        await prisma.listings.update({
          where: { id: listing.id },
          data: { slug: product.id }
        });
        console.log(`Updated slug for listing ID ${listing.id}: ${product.id}`);
      }
    }
  }

  console.log('Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
