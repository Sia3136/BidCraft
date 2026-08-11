const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function runTest() {
  try {
    // Setup test users
    const user1Res = await pool.query(`INSERT INTO users (email, password_hash, name, role, email_verified, avatar_url, updated_at) VALUES ('seller1@test.com', 'hash', 'Seller One', 'seller', true, 'https://example.com/avatar1.png', NOW()) RETURNING id`);
    const seller1Id = user1Res.rows[0].id;
    await pool.query(`INSERT INTO profiles (user_id, bio, updated_at) VALUES ($1, 'Bio for seller 1', NOW())`, [seller1Id]);

    const user2Res = await pool.query(`INSERT INTO users (email, password_hash, name, role, email_verified, updated_at) VALUES ('seller2@test.com', 'hash', 'Seller Two', 'seller', true, NOW()) RETURNING id`);
    const seller2Id = user2Res.rows[0].id;
    // Missing profile row for user 2

    const buyerRes = await pool.query(`INSERT INTO users (email, password_hash, name, role, email_verified, updated_at) VALUES ('buyer@test.com', 'hash', 'Test Buyer', 'buyer', true, NOW()) RETURNING id`);
    const buyerId = buyerRes.rows[0].id;

    // Setup listings
    const l1Res = await pool.query(`INSERT INTO listings (title, description, price, category, subcategory, buying_method, seller_id, status, image_urls, updated_at) VALUES ('Listing 1', 'Desc', 100, 'Art', 'Digital', 'Buy Now', $1, 'active', '{"http://img1.png"}', NOW()) RETURNING id`, [seller1Id]);
    const l1Id = l1Res.rows[0].id;

    // Setup orders
    const orderRes = await pool.query(`INSERT INTO orders (buyer_id, listing_id, total_amount, status, updated_at) VALUES ($1, $2, 100, 'paid', NOW()) RETURNING id`, [buyerId, l1Id]);
    const oId = orderRes.rows[0].id;

    // Setup offers
    await pool.query(`INSERT INTO offers (buyer_id, listing_id, amount, status, updated_at) VALUES ($1, $2, 90, 'pending', NOW())`, [buyerId, l1Id]);

    console.log("=== TESTS ===");
    
    // Test authController /api/auth/me query
    const meQuery = 'SELECT u.id, u.email, u.name, u.role, u.username, u.onboarding_completed, u.email_verified, u.avatar_url AS avatar, p.bio FROM users u LEFT JOIN profiles p ON p.user_id = u.id WHERE u.id=$1';
    
    const me1 = await pool.query(meQuery, [seller1Id]);
    console.log("Seller 1 Auth Me (With Profile):", me1.rows[0].bio === 'Bio for seller 1' && me1.rows[0].avatar === 'https://example.com/avatar1.png' ? 'PASS' : 'FAIL');
    
    const me2 = await pool.query(meQuery, [seller2Id]);
    console.log("Seller 2 Auth Me (Without Profile):", me2.rows[0].bio === null ? 'PASS' : 'FAIL');

    // Test listings query
    const listingsQuery = 'SELECT id, title, price, buying_method AS "buyingMethod", status, image_urls[1] AS image, current_bid AS "currentBid", bid_count AS "bidCount", auction_ends_at AS "auctionEndsAt", created_at AS "createdAt", updated_at AS "updatedAt" FROM listings WHERE seller_id = $1 ORDER BY created_at DESC';
    const listings1 = await pool.query(listingsQuery, [seller1Id]);
    console.log("Seller 1 Listings Count (Expected 1):", listings1.rows.length === 1 ? 'PASS' : 'FAIL');
    const listings2 = await pool.query(listingsQuery, [seller2Id]);
    console.log("Seller 2 Listings Count (Expected 0):", listings2.rows.length === 0 ? 'PASS' : 'FAIL');

    // Clean up
    await pool.query('DELETE FROM offers WHERE buyer_id = $1', [buyerId]);
    await pool.query('DELETE FROM orders WHERE buyer_id = $1', [buyerId]);
    await pool.query('DELETE FROM listings WHERE seller_id IN ($1, $2)', [seller1Id, seller2Id]);
    await pool.query('DELETE FROM profiles WHERE user_id IN ($1, $2)', [seller1Id, seller2Id]);
    await pool.query('DELETE FROM users WHERE id IN ($1, $2, $3)', [seller1Id, seller2Id, buyerId]);

  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

runTest();
