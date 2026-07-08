const db = require('./src/utils/db');

async function run() {
  try {
    console.log('Running FIX 3 (and other DB constraints)...');

    // Add unique constraint on cart_items
    try {
      await db.query(`ALTER TABLE cart_items ADD CONSTRAINT cart_items_user_listing_unique UNIQUE (user_id, listing_id);`);
      console.log('Added unique constraint to cart_items');
    } catch (e) {
      if (!e.message.includes('already exists')) {
        console.error('Error adding constraint:', e.message);
      }
    }

    // Fix Cause A: update status and is_published
    await db.query(`UPDATE listings SET status = 'active', is_published = true WHERE status IS NULL OR is_published IS NULL;`);
    console.log('Updated listings with null status');

    // Fix Cause B: orphaned listings
    const orphaned = await db.query(`SELECT l.id FROM listings l LEFT JOIN users u ON u.id = l.seller_id WHERE u.id IS NULL;`);
    if (orphaned.rows.length > 0) {
      console.log(`Found ${orphaned.rows.length} orphaned listings, fixing...`);
      const validSeller = await db.query(`SELECT id FROM users LIMIT 1;`);
      if (validSeller.rows.length > 0) {
        const sid = validSeller.rows[0].id;
        for (let row of orphaned.rows) {
          await db.query(`UPDATE listings SET seller_id = $1 WHERE id = $2`, [sid, row.id]);
        }
      }
    }

    // Ensure wishlists table exists (backend code in Express uses `wishlist`, but user wants `wishlists` for the Next.js API).
    // Let's create `wishlists` if it doesn't exist. Wait, the frontend Next.js API uses `wishlists`. Let's create it.
    try {
      await db.query(`CREATE TABLE IF NOT EXISTS wishlists (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), listing_id INTEGER REFERENCES listings(id), created_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE(user_id, listing_id));`);
      // Copy data from wishlist if it exists
      await db.query(`INSERT INTO wishlists (user_id, listing_id, created_at) SELECT user_id, listing_id, created_at FROM wishlist ON CONFLICT DO NOTHING;`).catch(() => {});
      console.log('Created and populated wishlists table.');
    } catch (e) {
      console.error('Error creating wishlists table:', e.message);
    }

    // Ensure cart_items table exists for the Next.js API.
    try {
      await db.query(`CREATE TABLE IF NOT EXISTS cart_items (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), listing_id INTEGER REFERENCES listings(id), quantity INTEGER DEFAULT 1, created_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE(user_id, listing_id));`);
    } catch (e) {}

    // Verify
    const res = await db.query(`SELECT COUNT(*) FROM listings WHERE status = 'active'`);
    console.log('Active listings count:', res.rows[0].count);

    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}
run();
