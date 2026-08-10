require('dotenv').config();
const db = require('./src/utils/db');

async function testPagination() {
  try {
    const limit = 28;
    const allIds = new Set();
    const duplicateIds = new Set();
    let totalFetched = 0;

    for (let page = 1; page <= 4; page++) {
      const offset = (page - 1) * limit;
      const res = await db.query(`
        SELECT id, created_at FROM listings l
        WHERE l.status = 'active'
        ORDER BY l.created_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset]);
      
      res.rows.forEach(r => {
        if (allIds.has(r.id)) {
          duplicateIds.add(r.id);
        }
        allIds.add(r.id);
      });
      totalFetched += res.rows.length;
    }
    
    console.log('Total fetched across 4 pages:', totalFetched);
    console.log('Unique IDs:', allIds.size);
    console.log('Duplicate IDs across pages:', Array.from(duplicateIds));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

testPagination();
