require('dotenv').config({ path: 'C:/Bidcraft/backend/.env' });
const db = require('C:/Bidcraft/backend/src/utils/db');

async function debug() {
  await db.query("DELETE FROM listings WHERE slug LIKE 'exp-%' OR slug LIKE 'art-%' OR slug LIKE 'hc-%' OR slug LIKE 'ls-%' OR slug LIKE 'gh-%' OR slug LIKE 'col-%'");
  console.log("Deleted all successfully!");
  process.exit(0);
}

debug();
