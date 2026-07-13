const fs = require('fs');
const path = require('path');

const filePath = path.join('C:', 'Bidcraft', 'frontend', 'lib', 'exploreProducts.ts');
let content = fs.readFileSync(filePath, 'utf8');

const now = Date.now();
let idx = 0;

content = content.replace(/,\s*"auctionEndsAt":\s*["'][^"']+["']/g, '');

content = content.replace(/"buyingMethod":\s*"Auction"/g, (match) => {
  const staggerMs = (5 * 60 * 1000) + (idx * 115 * 60 * 1000) + (Math.floor(Math.random() * 30 * 60 * 1000));
  const newDate = new Date(now + staggerMs).toISOString();
  idx++;
  return `"buyingMethod": "Auction",\n    "auctionEndsAt": "${newDate}"`;
});

fs.writeFileSync(filePath, content);
console.log(`Added ${idx} auction end times in exploreProducts.ts`);
