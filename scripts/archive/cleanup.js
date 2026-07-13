require('dotenv').config({ path: 'C:/Bidcraft/backend/.env' });
const db = require('C:/Bidcraft/backend/src/utils/db');

async function cleanup() {
  await db.query('DELETE FROM listings WHERE seller_id = 999999');
  console.log('Cleaned up');
  process.exit(0);
}

cleanup();
