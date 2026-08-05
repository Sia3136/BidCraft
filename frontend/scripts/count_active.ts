import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const activeCount = await prisma.listing.count({ where: { status: 'active' } });
  console.log('ACTIVE_LISTINGS_COUNT:', activeCount);
}
main().catch(console.error).finally(() => prisma.$disconnect());
