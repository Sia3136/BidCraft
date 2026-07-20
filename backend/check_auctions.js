const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_puatjTPoH93y@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

async function check() {
  await client.connect();
  const res = await client.query(`
    SELECT l.id, l.title, l.auction_ends_at, a.end_time, NOW() as current_time
    FROM listings l 
    LEFT JOIN auctions a ON a.listing_id = l.id 
    WHERE l.buying_method = 'Auction' 
    LIMIT 5
  `);
  console.log(res.rows);
  await client.end();
}
check();
