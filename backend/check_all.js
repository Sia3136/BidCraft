const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_puatjTPoH93y@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' });
client.connect().then(() => client.query("SELECT subcategory, COUNT(*) as cnt FROM listings GROUP BY subcategory ORDER BY subcategory")).then(res => { console.log(JSON.stringify(res.rows, null, 2)); const total = res.rows.reduce((sum, r) => sum + parseInt(r.cnt), 0); console.log("Total: ", total); client.end(); });
