require('dotenv').config();
const { Client } = require('pg');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const fs = require('fs');

const transforms = [
  '',
  'c_crop,g_center,w_0.8,h_0.8,fl_relative',
  'c_crop,g_west,w_0.5,h_1.0,fl_relative',
  'c_crop,g_east,w_0.5,h_1.0,fl_relative',
  'c_crop,g_auto,w_0.4,h_0.4,fl_relative',
  'e_improve,e_sharpen'
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

const path = require('path');
const https = require('https');

const client = new Client({ connectionString: process.env.DATABASE_URL });

const STATS = {
  audited: 0, modified: 0,
  sellersCreated: 0, sellersUpdated: 0,
  reviewsCreated: 0, specsRepaired: 0,
  imagesVerified: 0, imagesUploaded: 0, urlsUpdated: 0,
  brokenRefsRepaired: 0, checksPassed: 0, checksUnable: 0
};

const SELLER_NAMES = [
  'Aarti Sharma', 'Rajiv Menon', 'Pooja Desai', 'Vikram Singh', 'Sneha Kapoor',
  'Anand Iyer', 'Meera Rao', 'Sanjay Kumar', 'Riya Sen', 'Karan Gupta',
  'Sunita Verma', 'Rahul Joshi', 'Neha Patel', 'Amit Shah', 'Kavita Reddy',
  'Tarun Mehta', 'Simran Kaur', 'Arjun Nair', 'Priya Patel', 'Rohan Desai'
];

const SPECS_TEMPLATES = {
  'Art': { 'Medium': 'Oil on Canvas', 'Surface': 'Canvas Board', 'Dimensions': '24x36 inches', 'Orientation': 'Portrait', 'Finish': 'Matte', 'Frame Included': 'No' },
  'Collectibles': { 'Brand': 'Various', 'Series': 'Limited Edition', 'Release Year': '2023', 'Condition': 'Near Mint', 'Packaging': 'Original Box', 'Authenticity': 'Certificate Included' },
  'Jewellery': { 'Material': 'Sterling Silver', 'Finish': 'Polished', 'Weight': '15g', 'Size': 'Adjustable', 'Care': 'Wipe with dry soft cloth' },
  'Handmade': { 'Material': 'Cotton/Resin', 'Handmade': 'Yes', 'Dimensions': '10x10 cm', 'Finish': 'Glossy', 'Care Instructions': 'Keep away from direct sunlight' },
  'Gaming & Hobby': { 'Material': 'Plastic/Cardboard', 'Condition': 'New', 'Type': 'Gaming Accessory', 'Dimensions': 'Standard', 'Weight': 'Lightweight', 'Warranty': 'None' },
  'Home & Living': { 'Material': 'Wood/Ceramic', 'Handmade': 'Yes', 'Dimensions': 'Varies', 'Finish': 'Smooth', 'Care Instructions': 'Wipe clean', 'Usage': 'Indoor' }
};

const REVIEW_TEMPLATES = [
  { rating: 5, text: "Absolutely stunning craftsmanship. Arrived perfectly packaged and exactly as described." },
  { rating: 5, text: "Excellent quality and fast shipping. Will definitely buy from this seller again." },
  { rating: 4, text: "Very good product. Took slightly longer to arrive than expected, but the quality makes up for it." },
  { rating: 5, text: "Better than the pictures! The detail is incredible." },
  { rating: 4, text: "Beautiful piece. Packaging could be slightly better, but it arrived safe." },
  { rating: 3, text: "It's decent, but the colors are a bit different from what I saw on my screen." },
  { rating: 5, text: "A wonderful addition to my collection. High quality." }
];

async function run() {
  await client.connect();
  console.log("Connected to DB.");

  try {
    console.log("\n--- PART 1 & 2: TARGETED FIXES ---");
    const fixes = [
      { old: 'Spiderman', newTitle: 'Spiderman', price: 1000 },
      { old: 'Whimsical Character Illustration', newTitle: 'Whimsical Character Illustration', price: 1500 },
      { old: 'Surreal Dreamscape', newTitle: 'Surreal Dreamscape', price: 1000 },
      { old: 'Cyberpunk Cityscape', newTitle: 'Cyberpunk Cityscape', price: 1500 },
      { old: 'Vintage Retro Poster', newTitle: 'Vintage Retro Painting', price: null },
      { old: 'Noir Cinema', newTitle: 'The Rainy London Street', price: null },
      { old: 'The Tiger', newTitle: 'Movie Scenario', price: 5000 },
      { old: 'Floral Reverie', newTitle: 'Floral Reverie', price: 1400 },
      { old: 'En Pointe & Fighting Back', newTitle: 'The Ballerina Boxer', price: 4700 }
    ];

    await client.query('BEGIN');
    for (const f of fixes) {
      let q = "UPDATE listings SET title = $1";
      const params = [f.newTitle];
      if (f.price !== null) {
        q += ", price = $2";
        params.push(f.price);
      }
      q += ` WHERE title = $${params.length + 1}`;
      params.push(f.old);
      
      const res = await client.query(q, params);
      if (res.rowCount > 0) {
        STATS.modified += res.rowCount;
        console.log(`Updated: ${f.old} -> ${f.newTitle}`);
      }
    }
    
    // Replace specific image
    const oldImg = "C:\\Bidcraft\\images\\art\\digital art & illustrations\\bb790b3ed435f058d2b30f6fe364cacd.webp";
    const newImg = "https://res.cloudinary.com/duzlsyzwa/image/upload/v1785061579/bidcraft_listings/x8hs8dwuc7ifqln0looc.webp";
    const resImg = await client.query(`
      UPDATE listings SET 
      photos = (
        SELECT jsonb_agg(CASE WHEN value::text LIKE '%bb790b3ed435f058d2b30f6fe364cacd.webp%' THEN $1::jsonb ELSE value END)
        FROM jsonb_array_elements(photos)
      ),
      image_urls = array_replace(image_urls, $2, $3)
      WHERE image_urls @> ARRAY[$2]::text[] OR photos::text LIKE '%bb790b3ed435f058d2b30f6fe364cacd.webp%'
    `, [`"${newImg}"`, oldImg, newImg]);
    if (resImg.rowCount > 0) STATS.modified += resImg.rowCount;

    await client.query('COMMIT');

    console.log("\n--- PART 3: SELLER ECOSYSTEM ---");
    let usersRes = await client.query("SELECT * FROM users WHERE role = 'seller'");
    let sellers = usersRes.rows;

    if (sellers.length < 20) {
      console.log(`Only ${sellers.length} sellers found. Creating up to 20.`);
      for (let i = sellers.length; i < 20; i++) {
        const name = SELLER_NAMES[i];
        const email = name.toLowerCase().replace(' ', '.') + '@example.com';
        const res = await client.query(`
          INSERT INTO users (email, name, role, created_at, updated_at) 
          VALUES ($1, $2, 'seller', NOW(), NOW()) ON CONFLICT (email) DO NOTHING RETURNING *
        `, [email, name]);
        if (res.rows.length > 0) {
          sellers.push(res.rows[0]);
          STATS.sellersCreated++;
        }
      }
      usersRes = await client.query("SELECT * FROM users WHERE role = 'seller'");
      sellers = usersRes.rows;
    }

    const categories = ['Art', 'Collectibles', 'Gaming & Hobby', 'Handmade & Crafts', 'Lifestyle', 'Home & Living'];
    const sellerCategories = {};
    sellers.forEach((s, i) => {
      sellerCategories[s.id] = categories[i % categories.length];
    });

    for (const seller of sellers) {
      const profileCheck = await client.query("SELECT * FROM profiles WHERE user_id = $1", [seller.id]);
      const trustScore = 4.0 + Math.random();
      const sales = Math.floor(Math.random() * 500) + 10;
      if (profileCheck.rows.length === 0) {
        await client.query(`
          INSERT INTO profiles (user_id, is_verified, trust_score, total_sales, bio, created_at, updated_at)
          VALUES ($1, true, $2, $3, $4, NOW(), NOW())
        `, [seller.id, trustScore.toFixed(2), sales, `Passionate creator specializing in ${sellerCategories[seller.id]}.`]);
        STATS.sellersUpdated++;
      } else if (!profileCheck.rows[0].bio || profileCheck.rows[0].trust_score == 0) {
        await client.query(`
          UPDATE profiles SET trust_score = $1, total_sales = $2, bio = $3, is_verified = true, updated_at = NOW()
          WHERE user_id = $4
        `, [trustScore.toFixed(2), sales, `Passionate creator specializing in ${sellerCategories[seller.id]}.`, seller.id]);
        STATS.sellersUpdated++;
      }
    }

    console.log("\n--- PART 4: LISTING RELATIONSHIP & SPECS ---");
    const listingsRes = await client.query("SELECT * FROM listings");
    const listings = listingsRes.rows;
    STATS.audited += listings.length;

    let buyNowCount = 0;
    let auctionCount = 0;
    let negotiableCount = 0;

    for (const listing of listings) {
      let needsUpdate = false;
      
      // 1. Ensure valid seller based on category
      let sellerId = listing.seller_id;
      if (sellerId === 9999 || sellerId === 999999) {
        const eligibleSellers = sellers.filter(s => sellerCategories[s.id] === listing.category);
        const assignedSeller = eligibleSellers.length > 0 ? eligibleSellers[Math.floor(Math.random() * eligibleSellers.length)] : sellers[Math.floor(Math.random() * sellers.length)];
        sellerId = assignedSeller.id;
        needsUpdate = true;
      }
      
      const sProfRes = await client.query("SELECT * FROM profiles WHERE user_id = $1", [sellerId]);
      const sUserRes = await client.query("SELECT name FROM users WHERE id = $1", [sellerId]);
      const sProf = sProfRes.rows[0];
      const sUser = sUserRes.rows[0];
      
      const trust = parseFloat(sProf.trust_score);
      const revCount = Math.floor(sProf.total_sales * 0.3);

      if (
        listing.seller_id !== sellerId || 
        listing.creator_name !== sUser.name ||
        listing.creator_rating !== trust ||
        listing.creator_review_count !== revCount
      ) {
        await client.query(`
          UPDATE listings SET 
            seller_id = $1, creator_name = $2, creator_rating = $3, 
            creator_review_count = $4, is_verified = $5, creator_badges = ARRAY['Top Rated']::text[]
          WHERE id = $6
        `, [sellerId, sUser.name, trust, revCount, true, listing.id]);
        needsUpdate = true;
      }

      // 2. Specifications
      const specs = listing.specifications || {};
      if (Object.keys(specs).length < 6) {
        const template = SPECS_TEMPLATES[listing.category] || SPECS_TEMPLATES['Handmade'];
        const newSpecs = { ...template, ...specs }; // Preserve existing
        await client.query("UPDATE listings SET specifications = $1 WHERE id = $2", [JSON.stringify(newSpecs), listing.id]);
        STATS.specsRepaired++;
        needsUpdate = true;
      }

      // 3. Buying Methods Distribution (Target: ~40% BN, ~30% Neg, ~30% Auction)
      let method = listing.buying_method;
      if (method === 'buy_now') method = 'Buy Now';
      if (method === 'auction') method = 'Auction';
      if (method === 'negotiable') method = 'Negotiable';

      if (buyNowCount > listings.length * 0.45 && method === 'Buy Now') {
         method = auctionCount < negotiableCount ? 'Auction' : 'Negotiable';
      }

      if (method === 'Buy Now') buyNowCount++;
      else if (method === 'Auction') auctionCount++;
      else if (method === 'Negotiable') negotiableCount++;

      if (method !== listing.buying_method) {
        let q = "UPDATE listings SET buying_method = $1";
        const p = [method];
        if (method === 'Auction') {
          q += ", current_bid = $2, auction_ends_at = $3";
          p.push(Math.floor(parseFloat(listing.price) * 0.65), new Date(Date.now() + 7*24*60*60*1000).toISOString());
        } else if (method === 'Negotiable') {
          q += ", offers_allowed = true, minimum_offer_percent = 70";
        }
        q += ` WHERE id = $${p.length + 1}`;
        p.push(listing.id);
        await client.query(q, p);
        needsUpdate = true;
      }

      if (needsUpdate) STATS.modified++;
    }

    console.log("\n--- PART 5: REVIEWS ---");
    for (const seller of sellers) {
      const dbReviews = await client.query("SELECT COUNT(*) FROM reviews WHERE reviewee_id = $1", [seller.id]);
      let currentReviews = parseInt(dbReviews.rows[0].count);
      
      const targetReviews = Math.floor(Math.random() * 15) + 5; // 5 to 20
      
      if (currentReviews < targetReviews) {
        // Find orders to attach to
        const ordersRes = await client.query("SELECT id, buyer_id FROM orders WHERE seller_id = $1 LIMIT 20", [seller.id]);
        let orders = ordersRes.rows;
        
        // If not enough orders, create dummy buyers and orders
        if (orders.length < targetReviews) {
           for (let i = orders.length; i < targetReviews; i++) {
             const buyerRes = await client.query("INSERT INTO users (email, name, role) VALUES ($1, $2, 'buyer') ON CONFLICT DO NOTHING RETURNING id", [`buyer_${seller.id}_${i}@test.com`, `Buyer ${i}`]);
             let buyerId = buyerRes.rows.length > 0 ? buyerRes.rows[0].id : 1;
             
             const oRes = await client.query("INSERT INTO orders (buyer_id, seller_id, total_amount, status) VALUES ($1, $2, 100, 'completed') RETURNING id", [buyerId, seller.id]);
             orders.push({id: oRes.rows[0].id, buyer_id: buyerId});
           }
        }
        
        const sProf = await client.query("SELECT trust_score FROM profiles WHERE user_id = $1", [seller.id]);
        const score = parseFloat(sProf.rows[0].trust_score);
        
        for (let i = currentReviews; i < targetReviews; i++) {
          const tpl = REVIEW_TEMPLATES[Math.floor(Math.random() * REVIEW_TEMPLATES.length)];
          // Correlate rating with trust score
          let rating = tpl.rating;
          if (score < 4.2 && rating === 5) rating = 4;
          if (score < 4.0 && rating >= 4) rating = Math.random() > 0.5 ? 3 : 4;
          
          await client.query(`
            INSERT INTO reviews (order_id, reviewer_id, reviewee_id, rating, comment, created_at)
            VALUES ($1, $2, $3, $4, $5, NOW() - interval '1 day' * floor(random() * 30))
            ON CONFLICT (order_id, reviewer_id) DO NOTHING
          `, [orders[i].id, orders[i].buyer_id, seller.id, rating, tpl.text]);
          STATS.reviewsCreated++;
        }
      }
    }

    console.log("\n--- PART 6: CLOUDINARY UPLOAD INTEGRITY ---");
    // Get all listings again
    const finalRes = await client.query("SELECT id, image_urls, photos FROM listings");
    let allCloudinary = true;

    for (const l of finalRes.rows) {
      let urls = [];
      if (Array.isArray(l.image_urls)) urls = [...l.image_urls];
      if (Array.isArray(l.photos)) {
        l.photos.forEach(p => { if (!urls.includes(p)) urls.push(p); });
      }

      let newUrls = [];
      let changed = false;

      for (const url of urls) {
        STATS.imagesVerified++;
        if (!url.includes('cloudinary.com') && !url.startsWith('http')) {
          allCloudinary = false;
          let absolutePath = url;
          if (url.startsWith('/images/')) {
            absolutePath = path.join('C:\\Bidcraft\\frontend\\public', url);
          } else if (url.startsWith('C:\\')) {
            absolutePath = url;
          }
          
          if (fs.existsSync(absolutePath)) {
            console.log(`Uploading missing asset: ${absolutePath}`);
            try {
              const uploadRes = await cloudinary.uploader.upload(absolutePath, { folder: 'bidcraft_listings' });
              if (uploadRes && uploadRes.secure_url) {
                newUrls.push(...generateVariants(uploadRes.secure_url));
                STATS.imagesUploaded++;
                STATS.urlsUpdated++;
                changed = true;
              } else {
                console.error("Upload failed for", absolutePath);
                newUrls.push(url);
              }
            } catch(e) {
              console.error("Cloudinary error:", e.message);
              newUrls.push(url);
            }
          } else {
             console.log("File not found locally:", absolutePath);
             newUrls.push(url);
          }
        } else {
          newUrls.push(url);
        }
      }

      if (changed) {
        await client.query("UPDATE listings SET image_urls = $1, photos = $2 WHERE id = $3", [newUrls, JSON.stringify(newUrls), l.id]);
      }
    }

    if (allCloudinary) {
      console.log("All images are mapped to Cloudinary. Zero local dependencies.");
      STATS.checksPassed++;
    } else {
      console.log("Some local images remain or failed to upload.");
    }

    console.log("\n--- FINAL AUDIT OUTPUT ---");
    const auditQuery = await client.query(`
      SELECT l.id, l.title, l.seller_id, u.name as seller_name, l.category, l.subcategory, l.buying_method, l.price, l.image_urls
      FROM listings l JOIN users u ON l.seller_id = u.id
    `);
    
    // Just count for the script output to not overflow console, write details to file
    let validCount = 0;
    auditQuery.rows.forEach(r => {
      let isVerified = r.image_urls && r.image_urls.length > 0 && r.image_urls[0].includes('cloudinary.com') ? 'Y' : 'N';
      if (isVerified === 'Y') validCount++;
    });
    
    console.log(`\nVerified ${validCount} / ${auditQuery.rows.length} primary images as Cloudinary.`);

    console.log("\n================ QUANTITATIVE SUMMARY ================");
    console.log(`Total listings audited: ${STATS.audited}`);
    console.log(`Total listings modified: ${STATS.modified}`);
    console.log(`Total sellers created: ${STATS.sellersCreated}`);
    console.log(`Total sellers updated: ${STATS.sellersUpdated}`);
    console.log(`Total reviews created: ${STATS.reviewsCreated}`);
    console.log(`Total specifications repaired: ${STATS.specsRepaired}`);
    console.log(`Total images verified: ${STATS.imagesVerified}`);
    console.log(`Total images uploaded: ${STATS.imagesUploaded}`);
    console.log(`Total Cloudinary URLs updated: ${STATS.urlsUpdated}`);
    console.log(`Total verification checks passed: ${STATS.checksPassed}`);
    console.log("======================================================");

  } catch(e) {
    console.error("FATAL ERROR:", e);
    await client.query('ROLLBACK');
  } finally {
    await client.end();
  }
}

run();
