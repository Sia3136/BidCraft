const { Client } = require('pg');
require('dotenv').config();

async function connectWithRetry(maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 30000,
      ssl: {
        rejectUnauthorized: false
      }
    });

    try {
      console.log(`Attempt ${i + 1}: Connecting to Neon...`);
      await client.connect();
      console.log('Connected successfully!');
      return client;
    } catch (err) {
      console.error(`Attempt ${i + 1} failed:`, err.message);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
  throw new Error('Failed to connect to Neon DB after all retries.');
}

async function run() {
  let client;
  try {
    client = await connectWithRetry();
    
    // Introspect all tables in public schema
    const res = await client.query(`
      SELECT table_name, column_name, data_type, udt_name, character_maximum_length, 
             numeric_precision, numeric_scale, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `);
    
    // Get primary keys, foreign keys, unique constraints
    const constraints = await client.query(`
      SELECT tc.table_name, tc.constraint_name, tc.constraint_type, kcu.column_name, 
             ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
      LEFT JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.table_schema = 'public'
      ORDER BY tc.table_name, tc.constraint_name;
    `);

    // Get Indexes
    const indexes = await client.query(`
      SELECT tablename, indexname, indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname;
    `);

    console.log("=== SCHEMA DUMP START ===");
    console.log(JSON.stringify({
      columns: res.rows,
      constraints: constraints.rows,
      indexes: indexes.rows
    }, null, 2));
    console.log("=== SCHEMA DUMP END ===");
    
  } catch (err) {
    console.error('Final Error:', err.message);
    process.exit(1);
  } finally {
    if (client) await client.end();
  }
}

run();
