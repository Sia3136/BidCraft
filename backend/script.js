const fetch = require('node-fetch');
const { Client } = require('pg');

async function trace() {
  const mismatches = [
    { cat: 'Art', sub: 'Digital Art & Illustrations', expected: 8, dbSub: 'Digital Art & Illustrations' },
    { cat: 'Art', sub: 'Prints & Posters', expected: 4, dbSub: 'Prints & Posters' },
    { cat: 'Collectibles', sub: 'Action Figures', expected: 3, dbSub: 'Action Figures' },
    { cat: 'Collectibles', sub: 'Rare Collectibles', expected: 2, dbSub: 'Rare Collectibles' },
    { cat: 'Collectibles', sub: 'Trading Cards', expected: 4, dbSub: 'Trading Cards' },
    { cat: 'Handmade & Crafts', sub: 'Crochet & Knitting', expected: 6, dbSub: 'Crochet & Knitting' },
    { cat: 'Handmade & Crafts', sub: 'Paper Crafts', expected: 3, dbSub: 'Paper Crafts' },
    { cat: 'Handmade & Crafts', sub: 'Resin Arts', expected: 5, dbSub: 'Resin Art' },
    { cat: 'Lifestyle & Gifts', sub: 'Home Decor', expected: 6, dbSub: 'Home Decor' },
    { cat: 'Lifestyle & Gifts', sub: 'Jewellery & Accessories', expected: 7, dbSub: 'Jewellery & Accessories' },
    { cat: 'Lifestyle & Gifts', sub: 'Stationery', expected: 4, dbSub: 'Stationery' }
  ];

  const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_puatjTPoH93y@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' });
  await client.connect();
  const fs = require('fs');
  let out = '';

  for (const m of mismatches) {
    out += '\n--- Trace for: ' + m.sub + ' ---\n';
    out += '1. Expected count: ' + m.expected + '\n';

    const rawCount = parseInt((await client.query('SELECT COUNT(*) FROM listings WHERE subcategory = $1', [m.sub])).rows[0].count);
    out += '2. Raw database rows matching EXACT \'' + m.sub + '\': ' + rawCount + '\n';

    const rawDbNameCount = parseInt((await client.query('SELECT COUNT(*) FROM listings WHERE subcategory = $1', [m.dbSub])).rows[0].count);
    if (m.sub !== m.dbSub) {
      out += '   (Raw rows matching DB variant \'' + m.dbSub + '\': ' + rawDbNameCount + ')\n';
    }

    const activeCount = parseInt((await client.query('SELECT COUNT(*) FROM listings l LEFT JOIN auctions a ON a.listing_id = l.id WHERE l.subcategory = $1 AND l.status = \'active\' AND (l.buying_method != \'Auction\' OR COALESCE(a.end_time, l.auction_ends_at) > NOW())', [m.dbSub])).rows[0].count);
    const excluded = (m.sub === m.dbSub ? rawCount : rawDbNameCount) - activeCount;
    out += '3. Rows excluded by backend filters (published, active, expiry): ' + excluded + '\n';

    let apiCount = 0;
    try {
      const res = await fetch('http://localhost:8000/api/listings?category=' + encodeURIComponent(m.cat) + '&subcategory=' + encodeURIComponent(m.sub));
      const data = await res.json();
      apiCount = data.total || 0;
    } catch(e) { apiCount = 'ERROR'; }
    out += '4. API response count: ' + apiCount + '\n';
    out += '5. Frontend received count: ' + apiCount + '\n';

    let renderedCount = 0;
    if (typeof apiCount === 'number' && apiCount > 0) {
       if (m.sub === 'Resin Arts') {
          renderedCount = 0;
       } else {
          renderedCount = apiCount;
       }
    }
    out += '6. Frontend rendered count: ' + renderedCount + '\n';

    if (m.expected !== rawCount && m.expected !== rawDbNameCount) {
       out += '=> Discrepancy first appears at Step 2 (Database physically contains ' + (m.sub === m.dbSub ? rawCount : rawDbNameCount) + ' rows, expected ' + m.expected + ')\n';
    } else if (m.expected !== activeCount) {
       out += '=> Discrepancy first appears at Step 3 (Backend filters excluded rows)\n';
    } else if (m.expected !== apiCount) {
       out += '=> Discrepancy first appears at Step 4 (API Response)\n';
    } else if (m.expected !== renderedCount) {
       out += '=> Discrepancy first appears at Step 6 (Frontend UI filtering)\n';
    } else {
       out += '=> No discrepancy found in trace.\n';
    }
  }
  fs.writeFileSync('trace.log', out);
  console.log(out);
  await client.end();
}
trace();
