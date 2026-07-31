const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_puatjTPoH93y@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' });

const transforms = [
  '', // Original
  'c_crop,g_center,w_0.8,h_0.8,fl_relative', // Slight zoom
  'c_crop,g_west,w_0.5,h_1.0,fl_relative', // Left-focused crop
  'c_crop,g_east,w_0.5,h_1.0,fl_relative', // Right-focused crop
  'c_crop,g_auto,w_0.4,h_0.4,fl_relative', // Close-up
  'e_improve,e_sharpen' // Enhanced variation
];

function generateVariants(originalUrl) {
  if (!originalUrl.includes('/upload/')) return Array(6).fill(originalUrl);
  
  const parts = originalUrl.split('/upload/');
  const base = parts[0] + '/upload/';
  const path = parts[1]; // Everything after /upload/
  
  return transforms.map(t => {
    if (!t) return originalUrl;
    return base + t + '/' + path;
  });
}

async function run() {
  try {
    await client.connect();
    console.log("Connected to DB.");

    const res = await client.query('SELECT id, title, image_urls, photos FROM listings');
    let updated = 0;

    for (const row of res.rows) {
      if (!row.image_urls || row.image_urls.length === 0) continue;
      
      const firstUrl = row.image_urls[0];
      
      if (!firstUrl.includes('cloudinary.com')) continue;
      
      const newUrls = generateVariants(firstUrl);
      
      await client.query('UPDATE listings SET image_urls = $1, photos = $2 WHERE id = $3', [newUrls, JSON.stringify(newUrls), row.id]);
      updated++;
    }

    console.log(`Successfully updated ${updated} listings with Cloudinary variants.`);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
