const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

if (process.env.NODE_ENV === 'production' || process.env.DATABASE_URL.includes('neon.tech')) {
  pool.options.ssl = { rejectUnauthorized: false };
}

async function runTest() {
  console.log("=== Query Equivalence & Performance Verification ===");
  try {
    const filters = [
      { name: "No Filters", conditions: ["l.status = 'active'"], values: [] },
      { name: "Auctions Only", conditions: ["l.status = 'active'", "l.buying_method = 'Auction'"], values: [] },
      { name: "Buy Now Only", conditions: ["l.status = 'active'", "l.buying_method = 'Buy Now'"], values: [] }
    ];

    for (const filter of filters) {
      console.log(`\n--- Testing: ${filter.name} ---`);
      
      const oldWhere = `WHERE ${filter.conditions.join(' AND ')} AND (l.buying_method != 'Auction' OR COALESCE(a.end_time::timestamptz, l.auction_ends_at) > NOW())`;
      const oldQuery = `SELECT COUNT(*) FROM listings l LEFT JOIN auctions a ON a.listing_id = l.id ${oldWhere}`;
      
      const newWhere = `WHERE ${filter.conditions.join(' AND ')} AND (l.buying_method != 'Auction' OR l.auction_ends_at > NOW())`;
      const newQuery = `SELECT COUNT(*) FROM listings l ${newWhere}`;

      // Test Old Query
      console.log("Executing Old Query...");
      let start = Date.now();
      const oldRes = await pool.query(oldQuery, filter.values);
      const oldTime = Date.now() - start;
      const oldCount = oldRes.rows[0].count;
      console.log(`Old Count: ${oldCount} | Time: ${oldTime}ms`);

      // Test New Query
      console.log("Executing New Query...");
      start = Date.now();
      const newRes = await pool.query(newQuery, filter.values);
      const newTime = Date.now() - start;
      const newCount = newRes.rows[0].count;
      console.log(`New Count: ${newCount} | Time: ${newTime}ms`);

      if (oldCount !== newCount) {
        console.error(`❌ MISMATCH! Old: ${oldCount}, New: ${newCount}. Reverting optimization.`);
        process.exit(1);
      } else {
        console.log(`✅ MATCH! Performance: Old=${oldTime}ms, New=${newTime}ms`);
      }

      // EXPLAIN ANALYZE
      const oldExplain = await pool.query(`EXPLAIN ANALYZE ${oldQuery}`, filter.values);
      const newExplain = await pool.query(`EXPLAIN ANALYZE ${newQuery}`, filter.values);
      
      console.log(`\nOld Query Plan:\n${oldExplain.rows.map(r => r['QUERY PLAN']).join('\n')}`);
      console.log(`\nNew Query Plan:\n${newExplain.rows.map(r => r['QUERY PLAN']).join('\n')}`);
    }

  } catch (err) {
    console.error("Database connection failed or query error:", err);
  } finally {
    pool.end();
  }
}

runTest();
