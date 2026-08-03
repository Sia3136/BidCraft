require('dotenv').config();
const db = require('./src/utils/db');

async function runSeed() {
  let client;
  try {
    client = await db.pool.connect();
    console.log('Connected to DB. Seeding variations...');

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

      // ONLY generate variants for listings that genuinely contain exactly 1 image
      if (currentImages.length === 1) {
        const primaryImg = currentImages[0];
        
        // Only works for cloudinary URLs
        if (primaryImg.includes('cloudinary.com') && primaryImg.includes('/upload/')) {
          const parts = primaryImg.split('/upload/');
          const base = parts[0] + '/upload/';
          const rest = parts[1]; // e.g. f_auto,q_auto/v1722704152/bidcraft_listings/... or just v1722704152/...

          // We'll strip any existing transformations
          let pathParts = rest.split('/');
          let uploadPath = rest;
          if (!pathParts[0].startsWith('v') && !pathParts[0].includes('.')) {
             // first part is a transformation
             pathParts.shift();
             uploadPath = pathParts.join('/');
          }

          // Generate variations: original, zoom/crop center, left crop, right crop
          // e.g. c_fill,w_800,h_800,g_center
          const variations = [
            base + uploadPath, // original
            base + 'c_fill,w_800,h_800,g_center/' + uploadPath,
            base + 'c_fill,w_800,h_800,g_west/' + uploadPath,
            base + 'c_fill,w_800,h_800,g_east/' + uploadPath,
          ];

          await client.query('UPDATE listings SET image_urls = $1 WHERE id = $2', [variations, listing.id]);
          console.log(`Updated listing ${listing.id} with ${variations.length} variations.`);
          seeded++;
        } else {
          console.log(`SKIPPED listing ${listing.id}: primary image not a standard Cloudinary URL`);
          skipped++;
        }
      } else {
        console.log(`SKIPPED listing ${listing.id}: already has ${currentImages.length} images`);
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
