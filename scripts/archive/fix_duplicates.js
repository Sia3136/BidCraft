const fs = require('fs');
const file = 'c:/Bidcraft/frontend/lib/exploreProducts.ts';
let content = fs.readFileSync(file, 'utf8');

// Regex to remove duplicated keys at the end of the JSON object
// Example:
//     "collections": [
//       "Modern Minimalist"
//     ],
content = content.replace(/,\s*"collections":\s*\[\s*"[^"]*"\s*\]/g, '');
content = content.replace(/,\s*"occasions":\s*\[\s*"[^"]*"\s*\]/g, '');

fs.writeFileSync(file, content);
console.log('Fixed duplicates');
