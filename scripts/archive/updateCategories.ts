import 'dotenv/config';
import { prisma } from '../lib/prisma';
import { exploreProducts } from '../lib/exploreProducts';

async function main() {
  console.log('Updating categories...');
  for (const p of exploreProducts) {
    if (p.subcategory) {
      await prisma.listings.updateMany({
        where: { title: p.title },
        data: { category: p.subcategory }
      });
      console.log(`Updated ${p.title} to category ${p.subcategory}`);
    }
  }
  console.log('Done!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
