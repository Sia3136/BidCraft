const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_puatjTPoH93y@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
});

async function run() {
  await client.connect();
  const res = await client.query('SELECT title, image_urls FROM listings LIMIT 5');
  res.rows.forEach(r => {
    console.log(r.title);
    console.log(r.image_urls);
    console.log('Count:', r.image_urls ? r.image_urls.length : 0);
    console.log('---');
  });
  await client.end();
}
run().catch(console.error);
