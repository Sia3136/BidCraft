import { Pool } from 'pg';

let parsedConnectionString = process.env.DATABASE_URL || '';
if (parsedConnectionString.includes('sslmode=')) {
  parsedConnectionString = parsedConnectionString.replace(/([?&])sslmode=[^&]+(&|$)/, '$1$2').replace(/[?&]$/, '');
}

export const db = new Pool({ 
  connectionString: parsedConnectionString,
  ssl: {
    rejectUnauthorized: true
  }
});
