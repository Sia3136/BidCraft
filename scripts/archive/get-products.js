const fs = require('fs');
const content = fs.readFileSync('./lib/exploreProducts.ts', 'utf8');

const products = [];
const regex = /"id":\s*"([^"]+)",[^}]*"title":\s*"([^"]+)",[^}]*"creator":\s*"([^"]+)",[^}]*"buyingMethod":\s*"([^"]+)",[^}]*"image":\s*"([^"]+)"/g;

let match;
while ((match = regex.exec(content)) !== null) {
  products.push({
    id: match[1],
    title: match[2],
    creator: match[3],
    buyingMethod: match[4],
    image: match[5]
  });
}

console.log("AUCTIONS:");
console.log(products.filter(p => p.buyingMethod === 'Auction').slice(0, 3));
console.log("BUY NOW:");
console.log(products.filter(p => p.buyingMethod === 'Buy Now').slice(0, 3));
