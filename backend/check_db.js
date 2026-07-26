const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_puatjTPoH93y@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' });
client.connect().then(() => {
  return client.query('SELECT subcategory, COUNT(*) as count FROM listings GROUP BY subcategory');
}).then(res => {
  console.table(res.rows);
  return client.query("SELECT category, COUNT(*) as count FROM listings GROUP BY category");
}).then(res => {
  console.table(res.rows);
  client.end();
}).catch(console.error);
