const fs = require('fs');
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_puatjTPoH93y@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

async function recover() {
  await client.connect();
  
  // Read seed file
  const fileContent = fs.readFileSync('../scripts/archive/seedListings.js', 'utf8');
  
  // Extract products array using a trick
  // The file has: const products = [] = [ ... ];
  // We can find the start of the array and the end.
  const startIdx = fileContent.indexOf('const products = [] = [') + 'const products = [] = '.length;
  let endIdx = fileContent.indexOf('];', startIdx) + 1;
  // Actually, there's a function seedListings() after the array. We can just use eval.
  const arrayString = fileContent.substring(startIdx, endIdx);
  
  let products;
  try {
    products = eval(arrayString);
  } catch (e) {
    console.error("Failed to parse array", e);
    return;
  }
  
  console.log(`Extracted ${products.length} products from seed file.`);
  
  let updatedCount = 0;
  
  for (const p of products) {
    // p.title is our unique key since it wasn't modified
    const res = await client.query(
      `UPDATE listings SET 
         category = $1, 
         subcategory = $2, 
         buying_method = $3 
       WHERE title = $4`,
      [p.category, p.subcategory, p.buyingMethod, p.title]
    );
    if (res.rowCount > 0) updatedCount += res.rowCount;
  }
  
  console.log(`Successfully restored metadata for ${updatedCount} listings.`);
  
  // Now verify
  const q1 = await client.query(`SELECT buying_method, COUNT(*) FROM listings GROUP BY buying_method`);
  console.log('Post-recovery buying methods:\n', q1.rows);
  
  const q2 = await client.query(`SELECT category, COUNT(*) FROM listings GROUP BY category`);
  console.log('Post-recovery categories:\n', q2.rows);

  const q3 = await client.query(`SELECT subcategory, COUNT(*) FROM listings GROUP BY subcategory`);
  console.log('Post-recovery subcategories count:', q3.rows.length, 'distinct subcategories');

  await client.end();
}

recover();
