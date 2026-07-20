const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_puatjTPoH93y@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

async function fixAuctions() {
  await client.connect();
  await client.query(`UPDATE auctions SET end_time = NOW() + INTERVAL '30 days'`);
  await client.query(`UPDATE listings SET auction_ends_at = NOW() + INTERVAL '30 days' WHERE buying_method = 'Auction'`);
  console.log('Auction dates updated.');
  await client.end();
}
fixAuctions();
