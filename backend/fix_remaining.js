const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_puatjTPoH93y@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

async function fixRemaining() {
  await client.connect();
  
  // Fix buying_method based on listing_type
  await client.query(`UPDATE listings SET buying_method = 'Buy Now' WHERE listing_type = 'buy_now' AND buying_method IS NULL`);
  await client.query(`UPDATE listings SET buying_method = 'Auction' WHERE listing_type = 'auction' AND buying_method IS NULL`);
  await client.query(`UPDATE listings SET buying_method = 'Negotiable' WHERE listing_type = 'negotiable' AND buying_method IS NULL`);
  
  // Fix categories casing
  await client.query(`UPDATE listings SET category = 'Art' WHERE category = 'art'`);
  await client.query(`UPDATE listings SET category = 'Collectibles' WHERE category = 'collectibles'`);
  await client.query(`UPDATE listings SET category = 'Gaming & Hobby' WHERE category = 'gaming-and-hobby'`);
  await client.query(`UPDATE listings SET category = 'Handmade & Crafts' WHERE category = 'handmade-and-crafts'`);
  await client.query(`UPDATE listings SET category = 'Lifestyle & Gifts' WHERE category = 'lifestyle-and-gifts'`);

  // Subcategories casing
  const mappings = {
    'digital-art-and-illustrations': 'Digital Art & Illustrations',
    'paintings': 'Paintings',
    'prints-and-posters': 'Prints & Posters',
    'sculptures': 'Sculptures',
    'sketches-and-drawings': 'Sketches & Drawings',
    'action-figures': 'Action Figures',
    'funko-pops': 'Funko Pops',
    'hot-wheels': 'Hot Wheels',
    'rare-collectibles': 'Rare Collectibles',
    'trading-cards': 'Trading Cards',
    'anime-merchandise': 'Anime Merchandise',
    'board-games': 'Board Games',
    'cosplay-props': 'Cosplay Props',
    'puzzle-collections': 'Puzzle Collections',
    'resin-arts': 'Resin Arts',
    'candles-and-soaps': 'Candles & Soaps',
    'clay-and-pottery': 'Clay & Pottery',
    'crochet-and-knitting': 'Crochet & Knitting',
    'paper-crafts': 'Paper Crafts',
    'home-decor': 'Home Decor',
    'jewellery-and-accessories': 'Jewellery & Accessories',
    'miniatures': 'Miniatures',
    'stationery': 'Stationery'
  };

  for (const [key, value] of Object.entries(mappings)) {
    await client.query(`UPDATE listings SET subcategory = $1 WHERE subcategory = $2`, [value, key]);
  }

  // Now, what about the 47 listings with subcategory NULL?
  // User says: "If the original category/subcategory mappings exist, restore them."
  // Wait, let's see if we can deduce subcategory from image URLs!
  const nullSubcats = await client.query(`SELECT id, title, image_urls FROM listings WHERE subcategory IS NULL`);
  for (const row of nullSubcats.rows) {
    // We'll leave them as NULL if they were originally seeded that way, 
    // unless they can be matched.
  }
  console.log(`Found ${nullSubcats.rows.length} listings with NULL subcategory.`);

  await client.end();
}

fixRemaining();
