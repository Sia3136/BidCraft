const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_puatjTPoH93y@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' });
client.connect().then(() => client.query("DELETE FROM listings WHERE title = 'Stranger Things — Poster Art' OR title = 'Resin Art Mirror'")).then(res => { console.log(res.rowCount + " deleted"); client.end(); });
