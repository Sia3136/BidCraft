const fs = require('fs');

let code = fs.readFileSync('lib/exploreProducts.ts', 'utf8');

const interfaceStr = `export interface Product {
  id: string;
  title: string;
  creator: string;
  category: string;
  subcategory: string;
  price: number;
  buyingMethod: 'Buy Now' | 'Auction' | 'Negotiable';
  image: string;
  description: string;
  verified: boolean;
  offersAllowed: boolean;
  bidCount?: number;
  currentBid?: number;
}

export const exploreProducts: Product[] = `;

// Replace the start of the file
code = code.replace(/export const exploreProducts = /, interfaceStr);

// Find each object in the array and replace it using JSON.parse workaround or regex
// Let's use eval to parse the array, add properties, and stringify
// The file starts with export const exploreProducts = [ ... ];
// We can strip the export part, eval it, modify the array, and reconstruct it.

let arrayStr = fs.readFileSync('lib/exploreProducts.ts', 'utf8').replace('export const exploreProducts = ', '');
// Remove trailing semicolon if any
if(arrayStr.endsWith(';\n')) arrayStr = arrayStr.slice(0, -2);
else if(arrayStr.endsWith(';')) arrayStr = arrayStr.slice(0, -1);

let arr = eval(arrayStr);

let modified = arr.map(p => {
  delete p.rating;
  delete p.reviewCount;
  p.verified = ['Sneha Agarwal', 'Vikram Rao', 'Aisha Malik'].includes(p.creator);
  p.offersAllowed = true;
  if (p.buyingMethod === 'Auction') {
    p.bidCount = Math.floor(Math.random() * 10) + 1;
    p.currentBid = p.price + Math.floor(Math.random() * 500) + 100;
  }
  return p;
});

let output = interfaceStr + JSON.stringify(modified, null, 2) + ';';
fs.writeFileSync('lib/exploreProducts.ts', output);
console.log('Done!');
