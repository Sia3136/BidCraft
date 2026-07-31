const fs = require('fs');
const file = 'c:/Bidcraft/scripts/archive/seedListings.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/"images":\s*\[([^\]]+)\]/g, (match, arr) => {
  const urls = arr.split(',').map(s => s.trim().replace(/"/g, ''));
  if (urls.length > 1 && urls.every(u => u === urls[0])) {
    return `"images": [\n      "${urls[0]}"\n    ]`;
  }
  return match;
});

fs.writeFileSync(file, content);
console.log("Fixed seedListings.js");
