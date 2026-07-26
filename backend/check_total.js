const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_puatjTPoH93y@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' });
client.connect().then(() => client.query("SELECT COUNT(*) FROM listings")).then(res => { console.log(res.rows[0]); client.end(); });
