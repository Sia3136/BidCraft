const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const auctions = await prisma.listings.findMany({
    where: { listing_type: 'AUCTION' },
    select: { 
      id: true, 
      title: true, 
      category: true,
      subcategory: true,
      photos: true, 
      auctions: { 
        select: { current_bid: true, total_bids: true } 
      } 
    },
    orderBy: { created_at: 'desc' },
    take: 30
  });
  console.log(JSON.stringify(auctions, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
