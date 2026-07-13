require('dotenv').config({ path: 'C:/Bidcraft/backend/.env' });
const db = require('C:/Bidcraft/backend/src/utils/db');

async function debug() {
  const res = await db.query("SELECT id, seller_id, slug FROM listings WHERE slug = 'art-025'");
  console.log(res.rows);
  process.exit(0);
}

debug();
