const fs = require('fs');
const code = fs.readFileSync('scripts/archive/seedListings.js', 'utf8');

const startIndex = code.indexOf('const products = [] = [');
if (startIndex === -1) {
  console.log("Could not find products array");
  process.exit(1);
}

// Just match "id": "exp-" to count the number of objects
const matches = code.match(/"id":/g);
console.log("Number of objects based on 'id':", matches ? matches.length : 0);
