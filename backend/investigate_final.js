const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_puatjTPoH93y@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

async function investigate() {
  await client.connect();
  try {
    const q1 = await client.query(`SELECT COUNT(*) FROM listings WHERE status = 'active' AND is_published = true`);
    console.log('-- Final count — should be 156\n', q1.rows);

    const q2 = await client.query(`SELECT category, subcategory, COUNT(*) FROM listings WHERE status = 'active' GROUP BY category, subcategory ORDER BY category, subcategory`);
    console.log('-- Confirm no category is empty\n', q2.rows);

    const q3 = await client.query(`SELECT COUNT(*) FROM listings l LEFT JOIN auctions a ON a.listing_id = l.id WHERE l.listing_type = 'auction' AND a.id IS NULL`);
    console.log('-- Confirm all auctions have timer rows\n', q3.rows);
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

investigate();
