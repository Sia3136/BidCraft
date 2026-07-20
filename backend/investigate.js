const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_puatjTPoH93y@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

async function investigate() {
  await client.connect();
  try {
    const q1a = await client.query('SELECT COUNT(*) as total FROM listings');
    console.log('-- 1a. Total listings in DB regardless of status\n', q1a.rows);

    const q1b = await client.query('SELECT status, is_published, COUNT(*) FROM listings GROUP BY status, is_published ORDER BY status');
    console.log('-- 1b. Breakdown by status and published flag\n', q1b.rows);

    const q1c = await client.query('SELECT category, COUNT(*) FROM listings GROUP BY category ORDER BY category');
    console.log('-- 1c. Breakdown by category\n', q1c.rows);

    const q1d = await client.query('SELECT listing_type, COUNT(*) FROM listings GROUP BY listing_type');
    console.log('-- 1d. Breakdown by listing_type\n', q1d.rows);

    const q1e = await client.query('SELECT COUNT(*) FROM listings WHERE deleted_at IS NOT NULL');
    console.log('-- 1e. Check for soft deletes\n', q1e.rows);

    const q1f = await client.query(`SELECT COUNT(*) FROM listings WHERE title IS NULL OR title = '' OR cloudinary_public_id IS NULL OR cloudinary_public_id = ''`);
    console.log('-- 1f. Check for null or empty critical fields\n', q1f.rows);

    const q1g = await client.query(`SELECT COUNT(*) FROM listings l LEFT JOIN auctions a ON a.listing_id = l.id WHERE l.listing_type = 'auction' AND a.id IS NULL`);
    console.log('-- 1g. Check auction rows\n', q1g.rows);

    const q1h = await client.query(`SELECT COUNT(*) FROM listings l LEFT JOIN users u ON u.id = l.seller_id WHERE u.id IS NULL`);
    console.log('-- 1h. Check seller FK integrity\n', q1h.rows);

  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

investigate();
