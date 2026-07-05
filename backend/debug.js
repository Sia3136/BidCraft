require('dotenv').config({ path: 'C:/Bidcraft/backend/.env' });
const db = require('C:/Bidcraft/backend/src/utils/db');

async function debug() {
  const res = await db.query("SELECT id, slug, title FROM listings WHERE slug LIKE 'art-%'");
  console.log(res.rows);
  process.exit(0);
}

debug();
