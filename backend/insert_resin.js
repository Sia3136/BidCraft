const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_puatjTPoH93y@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' });

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
    [imgUrl, imgUrl, imgUrl, imgUrl, imgUrl, imgUrl], 
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

async function run() {
  await client.connect();
  
  await client.query(insertQuery, getFormat('Resin Art Pendant (Pack of 2)', 'Handmade & Crafts', 'Resin Art', 250, 'https://res.cloudinary.com/duzlsyzwa/image/upload/v1785061583/bidcraft_listings/vcu7n9lt0fwzfj4jo03i.jpg', 'hc-resin-pendant-2'));
  await client.query(insertQuery, getFormat('Resin Art Wall Hanging', 'Handmade & Crafts', 'Resin Art', 1800, 'https://res.cloudinary.com/duzlsyzwa/image/upload/v1785061584/bidcraft_listings/rxiaajszoexm7dujdalm.webp', 'hc-resin-wall-hanging'));
  await client.query(insertQuery, getFormat('Resin Beach Themed Earring', 'Handmade & Crafts', 'Resin Art', 600, 'https://res.cloudinary.com/duzlsyzwa/image/upload/v1785061585/bidcraft_listings/obsrf4v879inwz5vmowk.jpg', 'hc-resin-beach-earring'));
  await client.query(insertQuery, getFormat('Resin Art Decorated Mirror', 'Handmade & Crafts', 'Resin Art', 1000, 'https://res.cloudinary.com/duzlsyzwa/image/upload/v1785061587/bidcraft_listings/drialcxe4e1khfuuisq7.jpg', 'hc-resin-decorated-mirror'));
  await client.query(insertQuery, getFormat('Resin Art Bookmark (Pack of 3)', 'Handmade & Crafts', 'Resin Art', 350, 'https://res.cloudinary.com/duzlsyzwa/image/upload/v1785061588/bidcraft_listings/h4k2f7txuvpiazw2sbnl.webp', 'hc-resin-bookmark-3'));

  const count = await client.query("SELECT COUNT(*) FROM listings");
  console.log("New Total:", count.rows[0]);
  
  await client.end();
}
run();
