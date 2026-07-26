const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_puatjTPoH93y@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' });
client.connect().then(() => {
  return client.query("SELECT id, title, category, subcategory, status FROM listings WHERE category = 'Art' AND status = 'active'");
}).then(res => {
  console.table(res.rows);
  client.end();
}).catch(console.error);
