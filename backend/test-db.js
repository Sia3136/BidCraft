require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const client = await pool.connect();
  try {
    console.log("=== SELECT COUNT(*) FROM listings; ===");
    let res = await client.query("SELECT COUNT(*) FROM listings;");
    console.table(res.rows);

    console.log("\n=== SELECT buying_method, COUNT(*) FROM listings GROUP BY buying_method; ===");
    res = await client.query("SELECT buying_method, COUNT(*) FROM listings GROUP BY buying_method;");
    console.table(res.rows);

    console.log("\n=== SELECT category, COUNT(*) FROM listings GROUP BY category; ===");
    res = await client.query("SELECT category, COUNT(*) FROM listings GROUP BY category;");
    console.table(res.rows);

    console.log("\n=== SELECT COUNT(*) FROM auctions; ===");
    res = await client.query("SELECT COUNT(*) FROM auctions;");
    console.table(res.rows);

    console.log("\n=== SELECT COUNT(*) FROM auctions WHERE end_time > NOW(); ===");
    res = await client.query("SELECT COUNT(*) FROM auctions WHERE end_time > NOW();");
    console.table(res.rows);

    console.log("\n=== SELECT COUNT(*) FROM listings WHERE buying_method='Auction'; ===");
    res = await client.query("SELECT COUNT(*) FROM listings WHERE buying_method='Auction';");
    console.table(res.rows);

    console.log("\n=== SELECT COUNT(*) FROM listings WHERE buying_method='Negotiable'; ===");
    res = await client.query("SELECT COUNT(*) FROM listings WHERE buying_method='Negotiable';");
    console.table(res.rows);

    // Get one Auction for STEP 4
    console.log("\n=== ONE AUCTION LISTING ===");
    res = await client.query("SELECT id, title, category, buying_method, status FROM listings WHERE buying_method='Auction' LIMIT 1;");
    console.table(res.rows);
    if(res.rows.length > 0) {
        console.log("Auction ID for trace: ", res.rows[0].id);
    }
    
    // Get one Negotiable for STEP 5
    console.log("\n=== ONE NEGOTIABLE LISTING ===");
    res = await client.query("SELECT id, title, category, buying_method, status FROM listings WHERE buying_method='Negotiable' LIMIT 1;");
    console.table(res.rows);
    if(res.rows.length > 0) {
        console.log("Negotiable ID for trace: ", res.rows[0].id);
    }

  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(console.error);
