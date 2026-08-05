import { prisma } from '../lib/prisma'

async function main() {
  const activeCount = await prisma.listing.count({ where: { status: 'active' } })
  console.log('Current active:', activeCount)

  if (activeCount >= 106) {
    console.log('Count is fine, no action needed')
    return
  }

  const needed = 106 - activeCount

  // Find inactive/ended listings to reactivate
  const toReactivate = await prisma.listing.findMany({
    where: { status: { not: 'active' } },
    orderBy: { created_at: 'desc' },
    take: needed,
    select: { id: true, status: true }
  })

  if (toReactivate.length === 0) {
    console.log('No inactive listings to reactivate')
    return
  }

  // Reactivate them and extend auction_ends_at by 30 days
  await prisma.listing.updateMany({
    where: { id: { in: toReactivate.map(l => l.id) } },
    data: {
      status: 'active',
      auction_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // extend 30 days
    }
  })

  console.log(`Reactivated ${toReactivate.length} listings`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
