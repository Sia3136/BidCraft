const { PrismaClient } = require('./lib/generated/prisma');
const prisma = new PrismaClient();

async function run() {
  const candidates = await prisma.listings.findMany({
    where: {
      listing_type: 'Auction',
      status: 'active',
    },
    include: {
      auctions: true
    },
    take: 50
  });
  
  // Sort by price or current_bid to find premium items
  candidates.sort((a, b) => {
    const aVal = a.auctions?.current_bid || a.price || 0;
    const bVal = b.auctions?.current_bid || b.price || 0;
    return bVal - aVal;
  });

  const best = candidates.slice(0, 10).map(c => ({
    id: c.id,
    title: c.title,
    category: c.category,
    price: c.price,
    bid: c.auctions?.current_bid,
    total_bids: c.auctions?.total_bids,
  }));
  console.log(JSON.stringify(best, null, 2));
}

run().finally(() => prisma.$disconnect());
