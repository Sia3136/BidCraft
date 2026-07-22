const axios = require('axios');
const io = require('socket.io-client');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function runTest() {
  console.log('--- Simultaneous Bidding Stress Test ---');

  // 1. Get an active auction
  const res = await pool.query(`
    SELECT a.id, l.title, a.current_bid 
    FROM auctions a
    JOIN listings l ON a.listing_id = l.id
    WHERE a.status = 'active' AND a.end_time > NOW()
    LIMIT 1
  `);

  if (res.rows.length === 0) {
    console.log('No active auctions found for testing.');
    process.exit(0);
  }

  const auction = res.rows[0];
  console.log(`Testing on Auction ID: ${auction.id} (${auction.title}) - Current Bid: ${auction.current_bid}`);

  // 2. Create 3 test users directly in DB
  console.log('Creating 3 test users...');
  const testUsers = [];
  for (let i = 1; i <= 3; i++) {
    const email = `bidtest${i}_${Date.now()}@example.com`;
    const userRes = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, email_verified) VALUES ($1, $2, 'password', 'buyer', true) RETURNING id`,
      [`Test User ${i}`, email]
    );
    const userId = userRes.rows[0].id;
    
    // Insert profile to pass VERIFICATION_REQUIRED
    await pool.query(`INSERT INTO profiles (user_id, is_verified) VALUES ($1, true)`, [userId]);
    
    // Insert bid deposit to pass deposit check
    await pool.query(`INSERT INTO bid_deposits (auction_id, user_id, amount, status) VALUES ($1, $2, 100, 'held')`, [auction.id, userId]);

    testUsers.push({ id: userId, email });
  }

  // 3. Generate tokens for users
  const jwt = require('jsonwebtoken');
  const tokens = testUsers.map(u => jwt.sign({ userId: u.id }, process.env.JWT_SECRET, { expiresIn: '1h' }));

  // 4. Connect 3 WebSockets
  let eventsReceived = [];
  const sockets = tokens.map((token, index) => {
    const socket = io('http://localhost:8000', { transports: ['websocket'], auth: { token } });
    
    socket.on('connect', () => {
      socket.emit('join_auction', auction.id, (res) => {
        // joined
      });
    });

    socket.on('outbid', (data) => {
      eventsReceived.push(`[User ${index+1}] Received OUTBID: Highest is now ${data.highestBid}`);
    });

    socket.on('bid_placed', (data) => {
      eventsReceived.push(`[User ${index+1}] Received BID_PLACED: ${data.bid_amount} by ${data.bidder_id}`);
    });

    return socket;
  });

  // Wait for connections
  await new Promise(r => setTimeout(r, 1000));

  // 5. Fire 3 bids simultaneously
  console.log('Firing 3 simultaneous bids...');
  let startBid = Number(auction.current_bid || 0);
  
  const bidRequests = [
    axios.post(`http://localhost:8000/api/auctions/${auction.id}/bids`, 
      { bid_amount: startBid + 50 },
      { headers: { Authorization: `Bearer ${tokens[0]}` } }
    ).then(res => res.data).catch(e => e.response?.data || e),
    
    axios.post(`http://localhost:8000/api/auctions/${auction.id}/bids`, 
      { bid_amount: startBid + 100 },
      { headers: { Authorization: `Bearer ${tokens[1]}` } }
    ).then(res => res.data).catch(e => e.response?.data || e),
    
    axios.post(`http://localhost:8000/api/auctions/${auction.id}/bids`, 
      { bid_amount: startBid + 150 },
      { headers: { Authorization: `Bearer ${tokens[2]}` } }
    ).then(res => res.data).catch(e => e.response?.data || e)
  ];

  const results = await Promise.all(bidRequests);
  
  console.log('--- API Responses ---');
  results.forEach((r, i) => {
    if (r.success || r.message) {
      console.log(`User ${i+1}: Success! New bid: ${r.bidAmount || r.bid_amount || 'OK'}`);
    } else {
      console.log(`User ${i+1}: Failed: ${r.error || JSON.stringify(r)}`);
    }
  });

  // Wait for socket events to propagate
  await new Promise(r => setTimeout(r, 1000));

  console.log('--- Socket Events Received ---');
  eventsReceived.forEach(e => console.log(e));

  // Verify final state
  const finalRes = await pool.query(`SELECT current_bid, (SELECT COUNT(*) FROM bids WHERE auction_id = $1) as bid_count FROM auctions WHERE id = $1`, [auction.id]);
  console.log(`Final DB State: Current Bid = ${finalRes.rows[0].current_bid}, Total Bids = ${finalRes.rows[0].bid_count}`);

  // Cleanup
  sockets.forEach(s => s.disconnect());
  await pool.query(`DELETE FROM users WHERE id = ANY($1)`, [testUsers.map(u => u.id)]);
  pool.end();
  console.log('Done.');
}

runTest();
