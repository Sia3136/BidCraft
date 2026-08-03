require('dotenv').config();
const db = require('./src/utils/db');

async function runSeed() {
  let client;
  try {
    client = await db.pool.connect();
    console.log('Connected to DB. Seeding exact 6 variations for ALL listings...');

    const res = await client.query('SELECT id, image_urls, photos FROM listings');
    const listings = res.rows;
    let seeded = 0;
    let skipped = 0;

    for (const listing of listings) {
      let currentImages = [];
      if (listing.image_urls && listing.image_urls.length > 0) {
        currentImages = listing.image_urls;
      } else if (listing.photos && listing.photos.length > 0) {
        currentImages = listing.photos.map(p => typeof p === 'string' ? p : p.url);
      }

      if (currentImages.length > 0) {
        const primaryImg = currentImages[0];
        
        // Only works for cloudinary URLs
        if (primaryImg.includes('cloudinary.com') && primaryImg.includes('/upload/')) {
          const parts = primaryImg.split('/upload/');
          const base = parts[0] + '/upload/';
          const rest = parts[1];

          // Strip existing transformations
          let pathParts = rest.split('/');
          let uploadPath = rest;
          if (!pathParts[0].startsWith('v') && !pathParts[0].includes('.')) {
             pathParts.shift();
             uploadPath = pathParts.join('/');
          }

          // Generate exactly 6 variations (Original + 5 distinct crops)
          const variations = [
            base + uploadPath, // 1: original
            base + 'c_fill,w_800,h_800,g_center/' + uploadPath, // 2: center
            base + 'c_fill,w_800,h_800,g_west/' + uploadPath,   // 3: west
            base + 'c_fill,w_800,h_800,g_east/' + uploadPath,   // 4: east
            base + 'c_fill,w_800,h_800,g_north/' + uploadPath,  // 5: north
            base + 'c_fill,w_800,h_800,g_south/' + uploadPath,  // 6: south
          ];

          await client.query('UPDATE listings SET image_urls = $1, photos = $2 WHERE id = $3', [variations, JSON.stringify(variations), listing.id]);
          seeded++;
        } else {
          skipped++;
        }
      } else {
        skipped++;
      }
    }
    console.log(`\nDONE! Seeded: ${seeded}, Skipped: ${skipped}`);
  } catch (err) {
    console.error('Seed crashed:', err);
  } finally {
    if (client) client.release();
    process.exit(0);
  }
}

runSeed();
