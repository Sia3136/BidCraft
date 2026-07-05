require('dotenv').config({ path: 'C:/Bidcraft/backend/.env' });
const db = require('C:/Bidcraft/backend/src/utils/db');

async function debug() {
  const res = await db.query("SELECT seller_id, id FROM listings WHERE slug = 'art-001'");
  console.log(res.rows);
  process.exit(0);
}

debug();
