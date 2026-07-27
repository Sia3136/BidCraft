const { Pool } = require('pg');
require('dotenv').config();

const { categories } = require('./src/utils/categories.js');
const slugify = (str) => str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

const resolveDisplayTitle = (slug) => {
  if (!slug) return null;
  for (const cat of categories) {
    for (const sub of cat.subcategories) {
      if (slugify(sub) === slug) return sub;
    }
    if (slugify(cat.name) === slug) return cat.name;
  }
  return null;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true }
});

async function run() {
  console.log("Display Name | Frontend slug | Generated URL | Parsed URL (Backend gets) | DB Search Condition | DB Value Exists | Listings | PASS / FAIL");
  console.log("---|---|---|---|---|---|---|---");
  
  for (const cat of categories) {
    for (const sub of cat.subcategories) {
      const display = sub;
      const slug = slugify(sub);
      const url = `/explore?category=${slugify(cat.name)}&subcategory=${slug}`;
      const parsedCat = resolveDisplayTitle(slugify(cat.name));
      const parsedSub = resolveDisplayTitle(slug);
      
      const mappedCats = [parsedCat].map(cat => categories.find(c => slugify(c.name) === cat) || cat);
      const VALID_SUBCATEGORIES = categories.flatMap(c => c.subcategories);
      const mappedSub = VALID_SUBCATEGORIES.find(s => slugify(s) === parsedSub) || parsedSub;
      
      const res = await pool.query('SELECT COUNT(*) FROM listings WHERE category = $1 AND subcategory = $2', [parsedCat, mappedSub]);
      const count = parseInt(res.rows[0].count);
      
      const passFail = count > 0 ? "PASS" : "FAIL";
      console.log(`${display} | ${slug} | ${url} | ${parsedCat} / ${parsedSub} | cat=$1, sub=$2 | ${parsedCat}, ${mappedSub} | ${count} | ${passFail}`);
    }
  }
  await pool.end();
}

run().catch(console.error);
