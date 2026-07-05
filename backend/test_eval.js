const fs = require('fs');
const content = fs.readFileSync('C:/Bidcraft/frontend/lib/exploreProducts.ts', 'utf8');
const startIndex = content.indexOf('[');
const endIndex = content.lastIndexOf(']') + 1;
const arrayStr = content.substring(startIndex, endIndex);

try {
  // We use Function constructor to evaluate safely-ish
  const getProducts = new Function('return ' + arrayStr);
  const products = getProducts();
  console.log("Success! Products length:", products.length);
  fs.writeFileSync('C:/Bidcraft/backend/products.json', JSON.stringify(products, null, 2));
} catch (e) {
  console.error("Eval failed:", e);
}
