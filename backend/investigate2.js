const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_puatjTPoH93y@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

async function investigate() {
  await client.connect();
  try {
    const q1 = await client.query(`SELECT buying_method, listing_type, COUNT(*) FROM listings GROUP BY buying_method, listing_type`);
    console.log('-- Breakdown of buying_method vs listing_type\n', q1.rows);

    const q2 = await client.query(`SELECT category, subcategory, COUNT(*) FROM listings GROUP BY category, subcategory ORDER BY category, subcategory`);
    console.log('-- Breakdown of categories\n', q2.rows);

  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

investigate();
