const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_puatjTPoH93y@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' });

async function run() {
  await client.connect();
  const res = await client.query("SELECT id, title, subcategory FROM listings WHERE subcategory = 'Sketches & Drawings'");
  console.log("Sketches & Drawings:", res.rows);
  
  const res2 = await client.query("SELECT id, title, subcategory, seller_id, price, listing_type FROM listings WHERE subcategory = 'Rare Collectibles' OR subcategory = 'Crochet & Knitting'");
  console.log("Potential duplicates:", res2.rows);

  await client.end();
}
run();
