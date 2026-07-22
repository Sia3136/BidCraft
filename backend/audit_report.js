require('dotenv').config();
const fs = require('fs');
const db = require('./src/utils/db');
const seedDataStr = fs.readFileSync('../scripts/archive/seedListings.js', 'utf8');

let seedListings = [];
try {
  const match = seedDataStr.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (match) {
    seedListings = eval(match[0]);
  }
} catch (e) {
  console.error('Failed to parse seedListings:', e);
  process.exit(1);
}

async function runAudit() {
  const client = await db.pool.connect();
  try {
    const result = await client.query('SELECT * FROM listings');
    const currentListings = result.rows;

    let originalCount = 0;
    let duplicateCount = 0;
    let missingImagesCount = 0;
    let localImagesCount = 0;
    let placeholderCount = 0;
    let validAdditionalCount = 0;
    
    const seenOriginals = new Set();
    const duplicates = [];
    const placeholders = [];

    for (const listing of currentListings) {
      const seedMatch = seedListings.find(s => 
        s.title === listing.title && 
        s.description === listing.description
      );

      if (seedMatch) {
        if (!seenOriginals.has(seedMatch.id)) {
          seenOriginals.add(seedMatch.id);
          originalCount++;
        } else {
          duplicateCount++;
          duplicates.push(listing.id);
        }
      } else {
        if (listing.title.toLowerCase().includes('test') || 
            (listing.description && listing.description.toLowerCase().includes('test'))) {
          placeholderCount++;
          placeholders.push(listing.id);
        } else {
          validAdditionalCount++;
        }
      }

      let imagePaths = [];
      if (listing.image_urls && listing.image_urls.length > 0) {
        imagePaths = listing.image_urls;
      } else if (listing.photos && listing.photos.length > 0) {
        imagePaths = listing.photos.map(p => typeof p === 'string' ? p : p.url);
      }

      if (imagePaths.length === 0) {
        missingImagesCount++;
      } else {
        let onlyLocal = true;
        for (const img of imagePaths) {
          if (img.includes('cloudinary.com')) {
            onlyLocal = false;
          }
        }
        if (onlyLocal) {
          localImagesCount++;
        }
      }
    }

    console.log('=== LISTING INTEGRITY AUDIT REPORT ===');
    console.log('Total listings:', currentListings.length);
    console.log('Original listings:', originalCount);
    console.log('Duplicates:', duplicateCount);
    console.log('Valid additional listings:', validAdditionalCount);
    console.log('Placeholder/Corrupted:', placeholderCount);
    console.log('Listings with missing images:', missingImagesCount);
    console.log('Listings using local images:', localImagesCount);
    
  } catch (err) {
    console.error('Audit error:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

runAudit();
