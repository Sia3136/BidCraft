const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_puatjTPoH93y@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' });

async function run() {
  await client.connect();

  console.log("--- PHASE 1.1 PRICE AUDIT ---");
  const titlesToCheck = [
    'Spiderman', 'Whimsical Character Illustration', 'Surreal Dreamscape', 'Cyberpunk Cityscape',
    'The Movie Scenario', 'Floral Reverie', 'The Ballerine Boxer', 'Candlelight',
    'Pink & White Florals', 'The Eye-Abstract Portrait', 'Modern Abstract Sculpture',
    'Lord Ganesha - Intricate Ink Study', 'Floral Paper Craft Card', 'Rare Pokémon Card',
    'Unique Sabrina Carpenter Trading Card', '1 Set of Gold Minimalist Earrings',
    'Set of 3 Cute Rings', '25 Posca Markers',
    'Vintage Retro Painting', 'The Rainy London Street'
  ];
  const res1 = await client.query("SELECT title, price FROM listings WHERE title = ANY($1)", [titlesToCheck]);
  console.log(res1.rows);

  console.log("--- PHASE 1.2 NEW LISTINGS AUDIT ---");
  const newTitles = [
    'Stranger Things Digital Art', 'Limited Edition Comic Poster', 'Abstract City Drawing',
    'Pack of 9 Super Cards', 'Pack of 25 Pokémon Cards', 'Resin Art Pendant (Pack of 2)',
    'Resin Art Wall Hanging', 'Resin Beach Themed Earring', 'Resin Art Decorated Mirror',
    'Resin Art Bookmark (Pack of 3)', 'Crochet Mobile Cover with Accessory',
    'Handmade Shell Jewellery Stand', 'Solar System Themed Cute Pendant'
  ];
  const res2 = await client.query("SELECT id, title, photos, description, specifications, seller_id, reviews, listing_type FROM listings WHERE title = ANY($1)", [newTitles]);
  res2.rows.forEach(r => {
    console.log(r.title, "- Photos:", r.photos, "- Seller:", r.seller_id, "- Type:", r.listing_type);
  });

  console.log("--- PHASE 1.4 EXISTING LISTINGS REFERENCE ---");
  const res3 = await client.query("SELECT title, photos, description, specifications, seller_id, reviews FROM listings WHERE id < 100 LIMIT 3");
  console.log(JSON.stringify(res3.rows, null, 2));

  console.log("--- PHASE 1.5 SELLER POOL ---");
  const res4 = await client.query("SELECT id, name FROM users WHERE role = 'seller' LIMIT 8");
  console.log(res4.rows);
  if (res4.rows.length === 0) {
     const res4_alt = await client.query("SELECT seller_id, COUNT(*) FROM listings GROUP BY seller_id LIMIT 8");
     console.log("Listings sellers:", res4_alt.rows);
  }

  await client.end();
}
run();
