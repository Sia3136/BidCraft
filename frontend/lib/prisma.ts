import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Parse and override connection string to prevent pg-connection-string warning
let parsedConnectionString = process.env.DATABASE_URL || '';
if (parsedConnectionString.includes('sslmode=')) {
  parsedConnectionString = parsedConnectionString.replace(/([?&])sslmode=[^&]+(&|$)/, '$1$2').replace(/[?&]$/, '');
}

const pool = new Pool({ 
  connectionString: parsedConnectionString,
  ssl: {
    rejectUnauthorized: true
  }
});
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
