const fs = require('fs');

const content = fs.readFileSync('C:/Bidcraft/frontend/lib/exploreProducts.ts', 'utf8');
const matches = [...content.matchAll(/"id":\s*"(.*?)"/g)].map(m => m[1]);
console.log(Array.from(new Set(matches.map(id => id.split('-')[0]))));
