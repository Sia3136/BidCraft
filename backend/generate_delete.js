const fs = require('fs');

const productsCode = fs.readFileSync('C:/Bidcraft/frontend/lib/exploreProducts.ts', 'utf8');
const startIndex = productsCode.indexOf('[');
const endIndex = productsCode.indexOf('];') + 1;
const arrayStr = productsCode.substring(startIndex, endIndex);
const jsCode = `const products = ${arrayStr};`;

const code = `
require('dotenv').config({ path: '../.env' });
const db = require('../src/utils/db');

${jsCode}

async function run() {
  const slugs = products.map(p => p.id);
  
  for (let i = 0; i < slugs.length; i += 10) {
    const batch = slugs.slice(i, i + 10);
    const placeholders = batch.map((_, idx) => '$' + (idx + 1)).join(',');
    await db.query(\`DELETE FROM listings WHERE slug IN (\${placeholders})\`, batch);
  }
  console.log("Deleted existing conflicting slugs.");
  process.exit(0);
}
run();
`;

fs.writeFileSync('C:/Bidcraft/backend/scripts/deleteConflicting.js', code);
