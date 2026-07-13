const fs = require('fs');
const content = fs.readFileSync('C:/Bidcraft/frontend/lib/exploreProducts.ts', 'utf8');
const ids = [...content.matchAll(/id:\s*['"](.*?)['"]/g)].map(m => m[1]);
const seen = new Set();
ids.forEach(id => {
  if (seen.has(id)) console.log('Duplicate:', id);
  seen.add(id);
});
