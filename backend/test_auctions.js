const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const candidates = await prisma.listing.findMany({
    where: {
      status: 'active',
      buying_method: 'Auction',
    },
    orderBy: [
      { view_count: 'desc' },
      { created_at: 'desc' },
    ],
    take: 20,
    select: { id: true, title: true, images: true, price: true }
  })
  console.log(candidates.map(c => ({ id: c.id, title: c.title, hasImages: Array.isArray(c.images) && c.images.length > 0 })))
}
run().finally(() => prisma.$disconnect());
