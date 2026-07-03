import 'dotenv/config';
import { prisma } from './lib/prisma';

async function main() {
  console.log('Fetching existing auctions...');
  const auctions = await prisma.auctions.findMany();
  
  console.log(`Found ${auctions.length} auctions. Updating end_time...`);
  
  for (const auction of auctions) {
    const daysToAdd = (auction.id % 7) + 1;
    const hoursToAdd = (auction.id % 24);
    
    const newEndTime = new Date();
    newEndTime.setDate(newEndTime.getDate() + daysToAdd);
    newEndTime.setHours(newEndTime.getHours() + hoursToAdd);
    
    await prisma.auctions.update({
      where: { id: auction.id },
      data: {
        end_time: newEndTime,
      }
    });
    
    console.log(`Updated auction ${auction.id}: end_time = ${newEndTime.toISOString()}`);
  }
  
  console.log('Finished updating auction end times.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
