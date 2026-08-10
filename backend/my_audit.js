const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runAudit() {
  try {
    // 1. DB count
    const res = await pool.query('SELECT id, title, created_at, seller_id, status FROM listings');
    const dbCount = res.rows.length;
    console.log(`DB Count: ${dbCount}`);
    
    // Sort to easily identify newest
    const sorted = [...res.rows].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    console.log('\n--- First 10 listings (newest) ---');
    sorted.slice(0, 10).forEach(l => console.log(`${l.id} | ${l.title} | ${l.created_at} | Status: ${l.status} | Seller: ${l.seller_id}`));

    console.log('\n--- First 10 listings (oldest) ---');
    const sortedAsc = [...res.rows].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    sortedAsc.slice(0, 10).forEach(l => console.log(`${l.id} | ${l.title} | ${l.created_at} | Status: ${l.status} | Seller: ${l.seller_id}`));

    console.log('\n--- Identifying potential fakes ---');
    const fakes = res.rows.filter(l => 
      l.title.toLowerCase().includes('test') || 
      l.title.match(/listing\s*\d+/i)
    );
    fakes.forEach(l => console.log(`Potential Fake: ${l.id} | ${l.title}`));

    // Check sellers
    const sellers = await pool.query('SELECT id FROM users');
    const sellerIds = new Set(sellers.rows.map(s => s.id));
    const badSellers = res.rows.filter(l => !sellerIds.has(l.seller_id));
    if (badSellers.length > 0) {
      console.log('\n--- Listings with missing sellers ---');
      badSellers.forEach(l => console.log(`${l.id} | ${l.title} | Seller: ${l.seller_id}`));
    }

    // Checking status distribution
    const statuses = {};
    res.rows.forEach(l => statuses[l.status] = (statuses[l.status] || 0) + 1);
    console.log('\n--- Status Distribution ---');
    console.log(statuses);
    
    // 2. API Count
    console.log('\n--- Querying API... ---');
    try {
      const apiRes = await fetch('http://localhost:8000/api/listings?limit=1000');
      if (apiRes.ok) {
        const data = await apiRes.json();
        // The API might return { listings: [...] } or { data: [...] }
        const arr = Array.isArray(data) ? data : (data.listings || data.data || []);
        console.log(`API Count: ${arr.length}`);
      } else {
        console.log(`API Fetch failed with status ${apiRes.status}`);
      }
    } catch (e) {
      console.log('Failed to fetch from API. Is the server running?', e.message);
    }
    
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

runAudit();
