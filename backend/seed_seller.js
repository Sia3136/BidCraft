const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function seed() {
  try {
    const userRes = await pool.query("SELECT id FROM users WHERE email = 'siyarozani31@gmail.com'");
    if (userRes.rows.length === 0) return console.log('User not found');
    const sellerId = userRes.rows[0].id;

    await pool.query("UPDATE users SET role = 'seller' WHERE id = $1", [sellerId]);
    console.log('User role updated to seller.');

    // Clear existing for a clean slate
    const existing = await pool.query("SELECT id FROM listings WHERE seller_id = $1", [sellerId]);
    for (let row of existing.rows) {
      const aucRows = await pool.query("SELECT id FROM auctions WHERE listing_id = $1", [row.id]);
      for (let auc of aucRows.rows) {
        await pool.query("DELETE FROM bids WHERE auction_id = $1", [auc.id]);
      }
      await pool.query("DELETE FROM auctions WHERE listing_id = $1", [row.id]);
      await pool.query("DELETE FROM offers WHERE listing_id = $1", [row.id]);
      const orders = await pool.query("SELECT id FROM orders WHERE listing_id = $1", [row.id]);
      for (let order of orders.rows) {
        await pool.query("DELETE FROM escrow WHERE order_id = $1", [order.id]);
      }
      await pool.query("DELETE FROM orders WHERE listing_id = $1", [row.id]);
      await pool.query("DELETE FROM listings WHERE id = $1", [row.id]);
    }

    // Ensure profile exists for seller metrics
    const profile = await pool.query("SELECT * FROM profiles WHERE user_id = $1", [sellerId]);
    if (profile.rows.length === 0) {
      await pool.query("INSERT INTO profiles (user_id, is_verified, trust_score, total_sales, bio, created_at, updated_at) VALUES ($1, true, 4.8, 120, 'Passionate creator.', NOW(), NOW())", [sellerId]);
    }

    // Insert 3 listings
    const q = `INSERT INTO listings (seller_id, creator_name, title, description, category, subcategory, price, buying_method, listing_type, status, image_urls, photos, condition, current_bid, bid_count, auction_ends_at)
               VALUES ($1, 'Siya Rozani', $2, $3, 'Art', 'Painting', $4, $5, 'physical', 'active', '{"https://res.cloudinary.com/dcbx3s608/image/upload/v1723146465/327fc0ffdd0263fbf9ecae99b820a068_csqx96.webp"}', '["https://res.cloudinary.com/dcbx3s608/image/upload/v1723146465/327fc0ffdd0263fbf9ecae99b820a068_csqx96.webp"]', 'New', $6, $7, NOW() + INTERVAL '7 days') RETURNING id`;

    const buyNowRes = await pool.query(q, [sellerId, 'Vintage Handcrafted Vase', 'A beautiful vase.', 100, 'Buy Now', null, null]);
    const offerRes = await pool.query(q, [sellerId, 'Custom Painting', 'A custom painting.', 200, 'Negotiable', null, null]);
    const auctionRes = await pool.query(q, [sellerId, 'Antique Wooden Clock', 'A classic clock.', 50, 'Auction', 55, 1]);

    const buyNowId = buyNowRes.rows[0].id;
    const offerId = offerRes.rows[0].id;
    const auctionId = auctionRes.rows[0].id;

    // Buyer ID (just pick any other user)
    const buyerRes = await pool.query("SELECT id FROM users WHERE id != $1 LIMIT 1", [sellerId]);
    const buyerId = buyerRes.rows.length > 0 ? buyerRes.rows[0].id : 1;

    // Insert Order for Buy Now
    const orderRes = await pool.query(`INSERT INTO orders (listing_id, buyer_id, seller_id, total_amount, status) VALUES ($1, $2, $3, 100, 'completed') RETURNING id`, [buyNowId, buyerId, sellerId]);
    await pool.query(`INSERT INTO escrow (order_id, buyer_id, seller_id, amount_held, status) VALUES ($1, $2, $3, 100, 'held')`, [orderRes.rows[0].id, buyerId, sellerId]);

    // Insert Offer for Negotiable
    await pool.query(`INSERT INTO offers (listing_id, buyer_id, amount, status) VALUES ($1, $2, 180, 'pending')`, [offerId, buyerId]);

    // Insert Auction & Bid
    const auctionInsert = await pool.query(`INSERT INTO auctions (listing_id, seller_id, start_bid, status, start_time, end_time) VALUES ($1, $2, 50, 'active', NOW() - INTERVAL '1 day', NOW() + INTERVAL '7 days') RETURNING id`, [auctionId, sellerId]);
    await pool.query(`INSERT INTO bids (auction_id, bidder_id, bid_amount) VALUES ($1, $2, 55)`, [auctionInsert.rows[0].id, buyerId]);

    console.log('Seeded successfully!');
  } catch(e) { console.error(e); } finally { pool.end(); }
}
seed();
