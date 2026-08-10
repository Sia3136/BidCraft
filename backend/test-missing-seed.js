const fs = require('fs');

function readSeed() {
  const code = fs.readFileSync('../scripts/archive/seedListings.js', 'utf8');
  // Simple extraction
  const jsonStrMatch = code.match(/const products = \[\] = (\[.*?\]);/s);
  if (!jsonStrMatch) return [];
  // Evaluate the array
  let products = [];
  try {
    products = eval(jsonStrMatch[1]);
  } catch (e) {
    console.error(e);
  }
  return products;
}

const original = readSeed();
console.log('Original listings count:', original.length);

const current = JSON.parse(fs.readFileSync('dump.json'));
console.log('Current listings count:', current.length);

// Let's find missing titles
const currentTitles = current.map(c => c.title);
const missing = original.filter(o => !currentTitles.includes(o.title));
console.log('Missing titles:', missing.map(m => m.title));
