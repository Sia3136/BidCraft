const fs = require('fs');
const path = require('path');

const exploreProductsFile = path.join(__dirname, '..', 'frontend', 'lib', 'exploreProducts.ts');
let content = fs.readFileSync(exploreProductsFile, 'utf8');

const tempFile = path.join(__dirname, '..', 'frontend', 'lib', 'exploreProducts.js');
let jsContent = content.replace(/import { Product } from '.\/dbProducts';/g, '')
                       .replace(/export const exploreProducts: any\[\] = /g, 'module.exports.exploreProducts = ')
                       .replace(/export const productReviews: Record<string, any\[\]> = /g, 'module.exports.productReviews = ');
fs.writeFileSync(tempFile, jsContent);

const { exploreProducts, productReviews } = require('./frontend/lib/exploreProducts.js');

try {// 1. Pick 15 New Arrivals
const categories = ['Art', 'Handmade & Crafts', 'Collectibles', 'Gaming & Hobby', 'Lifestyle & Gifts'];
let newArrivals = [];
for (const cat of categories) {
    const catProducts = exploreProducts.filter(p => p.category === cat);
    newArrivals.push(...catProducts.slice(0, 2));
}
const remaining = exploreProducts.filter(p => !newArrivals.includes(p));
newArrivals.push(...remaining.slice(0, 5));

const newArrivalIds = newArrivals.map(p => p.id);

exploreProducts.forEach(p => {
    if (newArrivalIds.includes(p.id)) {
        p.newArrival = true;
    }
});

// 2. Update auctionEndsAt
const auctionProducts = exploreProducts.filter(p => p.buyingMethod === 'Auction');
const refDate = new Date('2026-09-01T00:00:00Z').getTime();
const times = [
    ...Array(4).fill(refDate + 12 * 60 * 60 * 1000),
    ...Array(4).fill(refDate + 2 * 24 * 60 * 60 * 1000),
    ...Array(4).fill(refDate + 4 * 24 * 60 * 60 * 1000)
];
const remainingTime = refDate + 7 * 24 * 60 * 60 * 1000;

auctionProducts.forEach((p, index) => {
    const endTime = index < times.length ? times[index] : remainingTime;
    p.auctionEndsAt = new Date(endTime).toISOString();
});

// 3. Add collections and occasions
const collectionsOptions = ['Vintage & Retro', 'Modern Minimalist', 'Traditional Arts'];
const occasionsOptions = ['Birthdays', 'Anniversaries', 'Housewarming', 'Just Because', 'All Occasions'];

exploreProducts.forEach((p, i) => {
    if (!p.collections) p.collections = [collectionsOptions[i % collectionsOptions.length]];
    if (!p.occasions) p.occasions = [occasionsOptions[i % occasionsOptions.length]];
});

// Write back to ts file
const newContent = `import { Product } from './dbProducts';

export const exploreProducts: any[] = ${JSON.stringify(exploreProducts, null, 2)};

export const productReviews: Record<string, any[]> = ${JSON.stringify(productReviews, null, 2)};
`;
fs.writeFileSync(exploreProductsFile, newContent);

// Create lib/newArrivals.ts
const newArrivalsFile = path.join(__dirname, '..', 'frontend', 'lib', 'newArrivals.ts');
const newArrivalsContent = `export const NEW_ARRIVAL_IDS: string[] = ${JSON.stringify(newArrivalIds, null, 2)};\n`;
fs.writeFileSync(newArrivalsFile, newArrivalsContent);

console.log('Update complete.');

} finally {
    // Clean up intermediate file
    if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
    }
}
