const { Client } = require('pg');
require('dotenv').config({ path: __dirname + '/../.env' });

const dbUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_kwi2pm0tZdJX@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({ connectionString: dbUrl });

const REVIEW_POOL = [
  { buyer: "Rohan V.", rating: 5, text: "Exquisite craftsmanship! The details on this handmade piece are unbelievable. Packaging was very secure and seller answered all my questions promptly." },
  { buyer: "Ananya Sharma", rating: 4, text: "Beautiful product and true to the photos. Dispatch took an extra day than expected, but the seller kept me updated throughout." },
  { buyer: "Kavita Nair", rating: 5, text: "Outstanding quality! You can tell how much care went into creating this. Highly recommend this seller to anyone who values authentic Indian craft." },
  { buyer: "Amitabh Sen", rating: 3, text: "Decent item. Quality is good overall, though the color in person is slightly darker than in the listing photos. Still a solid purchase." },
  { buyer: "Meera Joshi", rating: 4, text: "Very happy with my order. Well packaged and arrived safely via Delhivery. Would buy from this creator again!" },
  { buyer: "Siddharth Rao", rating: 5, text: "Top-notch seller! Great communication and authentic handmade artwork. Worth every rupee." },
  { buyer: "Priya Sundaram", rating: 4, text: "Good experience overall. The item has a nice handmade weight to it. Seller included a handwritten thank you note which was a lovely touch." },
  { buyer: "Vikramaditya K.", rating: 2, text: "Product is fine, but delivery packaging had a small dent on the outer box. Thankfully the item inside was unharmed because of heavy bubble wrap." },
  { buyer: "Neha Gupta", rating: 5, text: "Absolutely stunning craftsmanship! Delivered faster than estimated. Escrow made the transaction completely stress-free." },
  { buyer: "Tarun Banerjee", rating: 4, text: "Solid seller. Good responsiveness on messages. The craft quality matches description perfectly." }
];

const transforms = [
  '', // 1. Original / Full
  'c_crop,g_center,w_0.75,h_0.75,fl_relative', // 2. Zoomed in
  'c_pad,w_1.1,h_1.1,b_auto', // 3. Wide / Padded
  'c_crop,g_west,w_0.6,h_1.0,fl_relative', // 4. Left detail
  'c_crop,g_east,w_0.6,h_1.0,fl_relative', // 5. Right detail
  'c_crop,g_north,w_0.8,h_0.7,fl_relative' // 6. Top detail
];

function generate6Variants(originalUrl) {
  if (!originalUrl) return [];
  if (originalUrl.includes('/upload/')) {
    const parts = originalUrl.split('/upload/');
    const base = parts[0] + '/upload/';
    const path = parts[1];
    return transforms.map(t => t ? `${base}${t}/${path}` : originalUrl);
  }
  // For non-cloudinary URLs, append query params so URLs are distinct
  return [
    originalUrl,
    `${originalUrl}#zoom=center`,
    `${originalUrl}#view=wide`,
    `${originalUrl}#crop=left`,
    `${originalUrl}#crop=right`,
    `${originalUrl}#crop=top`
  ];
}

async function run() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL DB.");

    const res = await client.query('SELECT id, title, image_urls, creator_name FROM listings');
    console.log(`Found ${res.rows.length} listings to update.`);

    let count = 0;
    for (const listing of res.rows) {
      const numId = Math.abs(parseInt(listing.id) || 1);
      const existingImages = Array.isArray(listing.image_urls) ? listing.image_urls : [];
      const firstImage = existingImages[0] || 'https://res.cloudinary.com/duzlsyzwa/image/upload/v1785425296/bidcraft/listings/crochet-flower.jpg';

      // 1. Generate 6 distinct image URLs
      const newImages = generate6Variants(firstImage);

      // 2. Select 3 or 4 reviews deterministically per listing ID
      const numReviews = (numId % 2 === 0) ? 4 : 3;
      const startIndex = (numId * 3) % REVIEW_POOL.length;
      
      const selectedReviews = [];
      for (let i = 0; i < numReviews; i++) {
        const rev = REVIEW_POOL[(startIndex + i) % REVIEW_POOL.length];
        const daysAgo = (i + 1) * 7 + (numId % 10);
        const date = new Date(Date.now() - daysAgo * 24 * 3600 * 1000).toISOString();
        selectedReviews.push({
          name: rev.buyer,
          buyer: rev.buyer,
          rating: rev.rating,
          text: rev.text,
          date
        });
      }

      // Calculate rating & review count
      const totalRating = selectedReviews.reduce((acc, r) => acc + r.rating, 0);
      const avgRating = parseFloat((totalRating / selectedReviews.length).toFixed(1));

      // Update Database
      await client.query(`
        UPDATE listings
        SET 
          image_urls = $1,
          photos = $2,
          reviews = $3,
          creator_rating = $4,
          creator_review_count = $5
        WHERE id = $6
      `, [
        newImages,
        JSON.stringify(newImages),
        JSON.stringify(selectedReviews),
        avgRating,
        selectedReviews.length,
        listing.id
      ]);

      count++;
    }

    console.log(`Successfully updated ${count} listings with 6 image variants and realistic reviews!`);
  } catch (err) {
    console.error("Database update error:", err);
  } finally {
    await client.end();
  }
}

run();
