require('dotenv').config();
const db = require('../src/utils/db');

async function seedUser() {
  try {
    await db.query(`
      INSERT INTO users (id, email, name, role, created_at, updated_at)
      VALUES (
        999999,
        'seed@bidcraft.in',
        'BidCraft Seed',
        'seller',
        NOW(),
        NOW()
      ) ON CONFLICT (id) DO NOTHING;
    `);
    console.log("Seed user 999999 created.");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

seedUser();
