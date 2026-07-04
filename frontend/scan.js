const fs = require('fs');
const path = require('path');

// A quick and dirty regex to extract the exploreProducts array since it's hard to import TS
const content = fs.readFileSync(path.join(__dirname, 'lib/exploreProducts.ts'), 'utf-8');

// Better yet, just use esbuild to transpile and bundle it
const { execSync } = require('child_process');
execSync('npx esbuild lib/exploreProducts.ts --bundle --platform=node --outfile=temp_explore.js', { stdio: 'inherit' });

const { exploreProducts } = require('./temp_explore.js');

let duplicates = 0;
let missing = 0;
const seenIds = new Set();
const missingImages = [];

exploreProducts.forEach(p => {
  if (seenIds.has(p.id)) {
    duplicates++;
  } else {
    seenIds.add(p.id);
  }
  
  if (!p.image) {
    missing++;
    missingImages.push({ id: p.id, image: p.image, title: p.title, category: p.category });
    return;
  }
  
  // Check image
  const imgPath = path.join(__dirname, 'public', p.image.replace(/^\//, ''));
  if (!fs.existsSync(imgPath)) {
    missing++;
    missingImages.push({ id: p.id, image: p.image, title: p.title, category: p.category });
  }
});

console.log('Total Products:', exploreProducts.length);
console.log('Duplicate IDs:', duplicates);
console.log('Missing Images:', missing);
console.log(JSON.stringify(missingImages, null, 2));

// Clean up
fs.unlinkSync('./temp_explore.js');
