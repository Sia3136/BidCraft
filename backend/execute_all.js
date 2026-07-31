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

async function uploadImage(localPath) {
  try {
    const res = await cloudinary.uploader.upload(localPath, { folder: 'bidcraft_listings' });
    return res.secure_url;
  } catch (err) {
    console.error("Cloudinary error for " + localPath + ": ", err.message);
    return "https://res.cloudinary.com/demo/image/upload/sample.jpg"; 
  }
}

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
  const path = parts[1];
  
  return transforms.map(t => {
    if (!t) return originalUrl;
    return base + t + '/' + path;
  });
}

async function run() {
  await client.connect();

  console.log("Starting execution...");

  const images = [
    { p: 'c:/Bidcraft/images/art/digital art & illustrations/bb790b3ed435f058d2b30f6fe364cacd.webp', varName: 'img_st' },
    { p: 'c:/Bidcraft/images/art/prints & posters/80891aa6bb34af3854d903c9a40bde21.jpg', varName: 'img_poster' },
    { p: 'c:/Bidcraft/images/art/sketches & drawings/4cf20961ee9c8dccc7dfb51c2f561af8.jpg', varName: 'img_abstract' },
    { p: 'c:/Bidcraft/images/collectibles/trading cards/66e294a293cc3c416e41028c1f2ce8ed.jpg', varName: 'img_cards9' },
    { p: 'c:/Bidcraft/images/collectibles/trading cards/f0624341bbd467383ede272db639ed38.jpg', varName: 'img_cards25' },
    { p: 'c:/Bidcraft/images/handmade & crafts/resin art/90340c0fe5f04ef94056bb544a98ad79.jpg', varName: 'img_resin1' },
    { p: 'c:/Bidcraft/images/handmade & crafts/resin art/6825197426036f192e947bf86984bbb3.webp', varName: 'img_resin2' },
    { p: 'c:/Bidcraft/images/handmade & crafts/resin art/ce4c6e8df736e34bd96ca50c3c6cfb11.jpg', varName: 'img_resin3' },
    { p: 'c:/Bidcraft/images/handmade & crafts/resin art/e0e8112d8f5b16d5612a0e69efbae352.jpg', varName: 'img_resin4' },
    { p: 'c:/Bidcraft/images/handmade & crafts/resin art/f41872e1978e36adfa877aff0029dcad.webp', varName: 'img_resin5' },
    { p: 'c:/Bidcraft/images/lifestyle & gifts/jewellery & accessories/5cf84872e9e0ed2dcee303bf9e245b28.jpg', varName: 'img_jewel1' },
    { p: 'c:/Bidcraft/images/lifestyle & gifts/jewellery & accessories/454b1c36b55a7aac07a46dec81f95a6f.jpg', varName: 'img_jewel2' },
    { p: 'c:/Bidcraft/images/lifestyle & gifts/jewellery & accessories/f6204ef69bbc9c82643e82677284e8bf.webp', varName: 'img_jewel3' },
  ];

  const uploaded = {};
  for (const img of images) {
    if (fs.existsSync(img.p)) {
      uploaded[img.varName] = await uploadImage(img.p);
    }
  }

  const getFormat = (title, cat, sub, price, imgUrl, slug) => {
    return [
      999999, 
      title,
      "This stunning " + title + " represents the pinnacle of craftsmanship in the " + sub + " category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
      cat,
      1,
      "New",
      JSON.stringify(Array(6).fill("/images/" + path.basename(imgUrl))), 
      "buy_now",
      price,
      "active",
      slug,
      sub,
      "Buy Now",
      generateVariants(imgUrl), 
      "BidCraft Verified",
      "4.80",
      100,
      ["Top Rated"], 
      true,
      false,
      0,
      false,
      [], 
      [], 
      JSON.stringify({ "Ships From": "India" }), 
      JSON.stringify([]), 
      0,
      true
    ];
  };

  const insertQuery = `INSERT INTO listings (seller_id, title, description, category, category_id, condition, photos, listing_type, price, status, slug, subcategory, buying_method, image_urls, creator_name, creator_rating, creator_review_count, creator_badges, is_verified, offers_allowed, minimum_offer_percent, new_arrival, collections, occasions, specifications, reviews, offer_floor_percent, is_published) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)`;

  try {
    await client.query(insertQuery, getFormat('Stranger Things Digital Art', 'Art', 'Digital Art & Illustrations', 1500, uploaded.img_st, 'art-st-digital-art'));
    await client.query("UPDATE listings SET price = 1000 WHERE title = 'Spiderman' AND subcategory = 'Digital Art & Illustrations'");
    await client.query("UPDATE listings SET price = 1500 WHERE title = 'Whimsical Character Illustration' AND subcategory = 'Digital Art & Illustrations'");
    await client.query("UPDATE listings SET price = 1000 WHERE title = 'Surreal Dreamscape' AND subcategory = 'Digital Art & Illustrations'");
    await client.query("UPDATE listings SET price = 1500 WHERE title = 'Cyberpunk Cityscape' AND subcategory = 'Digital Art & Illustrations'");

    await client.query("UPDATE listings SET title = 'Vintage Retro Painting' WHERE title = 'Vintage Retro Poster'");
    await client.query("UPDATE listings SET title = 'The Rainy London Street' WHERE title = 'Noir Cinema'");
    await client.query("UPDATE listings SET title = 'The Ballerine Boxer' WHERE title = 'En Pointe & Fighting Back'");
    await client.query("UPDATE listings SET title = 'The Movie Scenario', price = 5000 WHERE title = 'The Tiger'");
    await client.query("UPDATE listings SET price = 1400 WHERE title = 'Floral Reverie'");
    await client.query("UPDATE listings SET price = 4700 WHERE title = 'The Ballerine Boxer'");
    await client.query("UPDATE listings SET price = 2000 WHERE title = 'Candlelight'");
    await client.query("UPDATE listings SET price = 2200 WHERE title = 'Pink & White Florals'");
    await client.query("UPDATE listings SET price = 5000 WHERE title = 'The Eye-Abstract Portrait'");

    await client.query("DELETE FROM listings WHERE title = 'Stranger Things - Poster Art'");
    await client.query("DELETE FROM listings WHERE title = 'Resin Art Mirror'");
    await client.query(insertQuery, getFormat('Limited Edition Comic Poster', 'Art', 'Prints & Posters', 1800, uploaded.img_poster, 'art-limited-edition-comic'));

    await client.query("UPDATE listings SET price = 5000 WHERE title = 'Modern Abstract Sculpture'");

    await client.query(insertQuery, getFormat('Abstract City Drawing', 'Art', 'Sketches & Drawings', 3000, uploaded.img_abstract, 'art-abstract-city-drawing'));
    await client.query("UPDATE listings SET price = 4500 WHERE title LIKE 'Lord Ganesha%'"); 

    await client.query("DELETE FROM listings WHERE title ILIKE 'Vintage Hand-carved Chess Set'"); 

    await client.query("DELETE FROM listings WHERE id = 1311087966"); 

    await client.query("DELETE FROM listings WHERE title = 'Limited Edition Comic #1'");
    await client.query(insertQuery, getFormat('Pack of 9 Super Cards', 'Collectibles', 'Trading Cards', 300, uploaded.img_cards9, 'col-pack-9-super-cards'));
    await client.query(insertQuery, getFormat('Pack of 25 Pokémon Cards', 'Collectibles', 'Trading Cards', 500, uploaded.img_cards25, 'col-pack-25-pokemon-cards'));
    await client.query("UPDATE listings SET price = 400 WHERE title = 'Rare Pokémon Card'");
    await client.query("UPDATE listings SET price = 450 WHERE title = 'Unique Sabrina Carpenter Trading Card'");

    await client.query("DELETE FROM listings WHERE id = 1311087962"); 

    await client.query("DELETE FROM listings WHERE title = 'Handcrafted Shell Jewellery Stand'");
    await client.query("UPDATE listings SET price = 200 WHERE title = 'Floral Paper Craft Card'");

    await client.query(insertQuery, getFormat('Resin Art Pendant (Pack of 2)', 'Handmade & Crafts', 'Resin Art', 250, uploaded.img_resin1, 'hc-resin-pendant-2'));
    await client.query(insertQuery, getFormat('Resin Art Wall Hanging', 'Handmade & Crafts', 'Resin Art', 1800, uploaded.img_resin2, 'hc-resin-wall-hanging'));
    await client.query(insertQuery, getFormat('Resin Beach Themed Earring', 'Handmade & Crafts', 'Resin Art', 600, uploaded.img_resin3, 'hc-resin-beach-earring'));
    await client.query(insertQuery, getFormat('Resin Art Decorated Mirror', 'Handmade & Crafts', 'Resin Art', 1000, uploaded.img_resin4, 'hc-resin-decorated-mirror'));
    await client.query(insertQuery, getFormat('Resin Art Bookmark (Pack of 3)', 'Handmade & Crafts', 'Resin Art', 350, uploaded.img_resin5, 'hc-resin-bookmark-3'));

    await client.query("DELETE FROM listings WHERE title = 'Shell Jewellery Stand'");
    await client.query("DELETE FROM listings WHERE title = 'Customised Birthday Candle'");

    await client.query(insertQuery, getFormat('Crochet Mobile Cover with Accessory', 'Lifestyle & Gifts', 'Jewellery & Accessories', 1000, uploaded.img_jewel1, 'ls-crochet-mobile-cover'));
    await client.query(insertQuery, getFormat('Handmade Shell Jewellery Stand', 'Lifestyle & Gifts', 'Jewellery & Accessories', 800, uploaded.img_jewel2, 'ls-handmade-shell-jewellery-stand'));
    await client.query(insertQuery, getFormat('Solar System Themed Cute Pendant', 'Lifestyle & Gifts', 'Jewellery & Accessories', 500, uploaded.img_jewel3, 'ls-solar-system-pendant'));
    await client.query("UPDATE listings SET title = '1 Set of Gold Minimalist Earrings' WHERE title = 'Gold-Plated Minimalist Ring'");
    await client.query("UPDATE listings SET price = 500 WHERE title = 'Set of 3 Cute Rings'");

    await client.query("DELETE FROM listings WHERE title = 'Crochet Case Cover'");
    await client.query("UPDATE listings SET price = 2000 WHERE title = '25 Posca Markers'");

    await client.query("UPDATE listings SET subcategory = 'Resin Art' WHERE subcategory = 'Resin Arts'");

    const finalCounts = await client.query("SELECT category, subcategory, COUNT(*) as cnt FROM listings GROUP BY category, subcategory ORDER BY category, subcategory");
    console.log("FINAL COUNTS:", JSON.stringify(finalCounts.rows, null, 2));
  } catch(e) {
    console.error("DB Error: ", e);
  }

  await client.end();
  console.log("DB Operations done.");
  
  const files = [
    'c:/Bidcraft/shared/categories.json', 
    'c:/Bidcraft/backend/src/utils/categories.js', 
    'c:/Bidcraft/frontend/lib/categories.ts', 
    'c:/Bidcraft/frontend/app/search/page.tsx'
  ];
  for (const f of files) {
    if (fs.existsSync(f)) {
      const cnt = fs.readFileSync(f, 'utf8');
      if (cnt.includes('Resin Arts')) {
        fs.writeFileSync(f, cnt.replace(/Resin Arts/g, 'Resin Art'));
        console.log(`Replaced Resin Arts in ${f}`);
      }
    }
  }

  const navbarPath = 'c:/Bidcraft/frontend/components/navbar.tsx';
  if (fs.existsSync(navbarPath)) {
    let nav = fs.readFileSync(navbarPath, 'utf8');
    let changed = false;
    if (nav.includes('href={`/explore?category=${openDropdown}&subcategory=${sub.slug}`}\n                          className=')) {
      nav = nav.replace(
        /href=\{`\/explore\?category=\$\{openDropdown\}&subcategory=\$\{sub\.slug\}`\}\n\s+className=/g,
        `href={\`/explore?category=\${openDropdown}&subcategory=\${sub.slug}\`}\n                          onClick={() => setOpenDropdown(null)}\n                          className=`
      );
      changed = true;
    }
    if (nav.includes('href={`/explore?category=${category.slug}&subcategory=${subSlug}`}\n                            className=')) {
      nav = nav.replace(
        /href=\{`\/explore\?category=\$\{category\.slug\}&subcategory=\$\{subSlug\}`\}\n\s+className=/g,
        `href={\`/explore?category=\${category.slug}&subcategory=\${subSlug}\`}\n                            onClick={() => { setOpenDropdown(null); setIsMobileMenuOpen(false); }}\n                            className=`
      );
      changed = true;
    }
    if (changed) {
      fs.writeFileSync(navbarPath, nav);
      console.log("Updated navbar.tsx");
    } else {
      console.log("Navbar update failed or already applied");
    }
  }

  console.log("Uploaded images:");
  console.log(JSON.stringify(uploaded, null, 2));
}

run().catch(console.error);
