require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./src/utils/db');
const cloudinary = require('cloudinary').v2;

db.pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const FRONTEND_PUBLIC_DIR = path.join(__dirname, '..', 'frontend', 'public');

async function runMigration() {
  let client;
  try {
    client = await db.pool.connect();
  } catch (err) {
    console.error('Failed to connect to db:', err);
    process.exit(1);
  }
  let processed = 0;
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  try {
    const res = await client.query('SELECT id, image_urls, photos FROM listings');
    const listings = res.rows;

    for (const listing of listings) {
      processed++;
      
      let currentImages = [];
      if (listing.image_urls && listing.image_urls.length > 0) {
        currentImages = listing.image_urls;
      } else if (listing.photos && listing.photos.length > 0) {
        currentImages = listing.photos.map(p => typeof p === 'string' ? p : p.url);
      }

      if (currentImages.length === 0) {
        console.log('SKIPPED: Listing ' + listing.id + ' (no images to migrate)');
        skipped++;
        continue;
      }

      // Check if ANY image is not a cloudinary URL
      const hasLocalImages = currentImages.some(img => !img.includes('cloudinary.com'));
      
      if (!hasLocalImages) {
        console.log('SKIPPED: Listing ' + listing.id + ' (already uses Cloudinary)');
        skipped++;
        continue;
      }

      let success = true;
      const newImageUrls = [];

      for (const img of currentImages) {
        if (img.includes('cloudinary.com')) {
          newImageUrls.push(img);
          continue;
        }

        // It's a local image (usually starts with /images/...)
        const localPath = path.join(FRONTEND_PUBLIC_DIR, img);
        
        if (!fs.existsSync(localPath)) {
          console.error('FAILED: Listing ' + listing.id + ' (File not found: ' + localPath + ')');
          success = false;
          break;
        }

        try {
          const uploadRes = await cloudinary.uploader.upload(localPath, {
            folder: 'bidcraft_listings'
          });
          newImageUrls.push(uploadRes.secure_url);
        } catch (err) {
          const errMsg = err && err.message ? err.message : JSON.stringify(err) || String(err);
          console.error('FAILED: Listing ' + listing.id + ' (Cloudinary upload error: ' + errMsg + ')');
          success = false;
          break;
        }
      }

      if (success && newImageUrls.length > 0) {
        try {
          await client.query('UPDATE listings SET image_urls = $1 WHERE id = $2', [newImageUrls, listing.id]);
          console.log('SUCCESS: Listing ' + listing.id + ' (Uploaded ' + newImageUrls.length + ' images)');
          uploaded++;
        } catch (dbErr) {
          console.error('FAILED: Listing ' + listing.id + ' (DB Update error: ' + dbErr.message + ')');
          failed++;
        }
      } else {
        failed++;
      }
    }

    console.log('\n=== MIGRATION SUMMARY ===');
    console.log('Processed:', processed);
    console.log('Uploaded:', uploaded);
    console.log('Skipped:', skipped);
    console.log('Failed:', failed);
    console.log('=========================');

  } catch (err) {
    console.error('Migration crashed:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

runMigration();
