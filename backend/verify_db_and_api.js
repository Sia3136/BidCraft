const { Client } = require('pg');
const http = require('http');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_puatjTPoH93y@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

async function verify() {
  await client.connect();
  
  try {
    console.log("=== 1. DATABASE SQL VERIFICATION ===");
    let res;
    
    res = await client.query(`SELECT COUNT(*) FROM listings;`);
    console.log("SELECT COUNT(*) FROM listings:\n", res.rows);

    res = await client.query(`SELECT buying_method, COUNT(*) FROM listings GROUP BY buying_method;`);
    console.log("\nSELECT buying_method, COUNT(*) FROM listings GROUP BY buying_method:\n", res.rows);

    res = await client.query(`SELECT category, COUNT(*) FROM listings GROUP BY category;`);
    console.log("\nSELECT category, COUNT(*) FROM listings GROUP BY category:\n", res.rows);

    res = await client.query(`SELECT category, subcategory, COUNT(*) FROM listings GROUP BY category, subcategory ORDER BY category, subcategory;`);
    console.log("\nSELECT category, subcategory, COUNT(*) FROM listings GROUP BY category, subcategory:\n", res.rows);

    res = await client.query(`SELECT COUNT(*) FROM listings WHERE buying_method='Auction';`);
    console.log("\nSELECT COUNT(*) FROM listings WHERE buying_method='Auction':\n", res.rows);

    res = await client.query(`SELECT COUNT(*) FROM listings WHERE buying_method='Negotiable';`);
    console.log("\nSELECT COUNT(*) FROM listings WHERE buying_method='Negotiable':\n", res.rows);

    res = await client.query(`SELECT COUNT(*) FROM listings WHERE buying_method='Buy Now';`);
    console.log("\nSELECT COUNT(*) FROM listings WHERE buying_method='Buy Now':\n", res.rows);

    console.log("\n=== 2. API PIPELINE VERIFICATION ===");
    
    // Call the API endpoint
    const fetchApi = (url) => new Promise((resolve, reject) => {
      http.get(url, (resp) => {
        let data = '';
        resp.on('data', chunk => data += chunk);
        resp.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch(e) {
            reject(e);
          }
        });
      }).on("error", reject);
    });

    const apiRes = await fetchApi('http://localhost:8000/api/listings?limit=500');
    console.log(`\nAPI /api/listings?limit=500 -> total count returned: ${apiRes.total}`);
    console.log(`API returned array length: ${apiRes.listings ? apiRes.listings.length : 0}`);
    
    if (apiRes.listings && apiRes.listings.length > 0) {
      const bMethods = {};
      const cats = {};
      apiRes.listings.forEach(l => {
        bMethods[l.buyingMethod] = (bMethods[l.buyingMethod] || 0) + 1;
        cats[l.category] = (cats[l.category] || 0) + 1;
      });
      console.log("API buying methods returned:", bMethods);
      console.log("API categories returned:", cats);
      
      // Let's find one auction in DB and see how API returned it
      const dbAuction = await client.query(`SELECT id, slug, buying_method FROM listings WHERE buying_method = 'Auction' LIMIT 1`);
      if (dbAuction.rows.length > 0) {
        const targetId = dbAuction.rows[0].id;
        const targetSlug = dbAuction.rows[0].slug;
        console.log(`\nFound Auction in DB: id=${targetId}, slug=${targetSlug}, buying_method=${dbAuction.rows[0].buying_method}`);
        
        const apiListing = apiRes.listings.find(l => l.numericId === targetId || l.id === targetSlug);
        if (apiListing) {
          console.log(`API listing representation: buyingMethod=${apiListing.buyingMethod}, category=${apiListing.category}`);
        } else {
          console.log(`Auction listing NOT FOUND in API response!`);
        }
      }
    }

  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

verify();
