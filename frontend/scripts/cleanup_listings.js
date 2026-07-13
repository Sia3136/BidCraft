const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Bundle exploreProducts.ts
execSync('npx esbuild lib/exploreProducts.ts --bundle --platform=node --outfile=temp_explore.js', { stdio: 'inherit' });
const { exploreProducts } = require('./temp_explore.js');

let finalProducts = [];
const seenIds = new Set();
const seenImagesByCategory = new Map();
const deletedListings = [];

for (const p of exploreProducts) {
  // 1. Check duplicate ID
  if (seenIds.has(p.id)) {
    deletedListings.push({ id: p.id, title: p.title, reason: 'Duplicate ID' });
    continue;
  }
  seenIds.add(p.id);

  // 2. Fix known Handcraft image names
  if (p.image === '/images/images.jpeg') {
    p.image = '/images/crochet-sunflower-pot.jpeg';
  } else if (p.image === '/images/beautifully-crafted-colorful-crochet-flowers-in-a-blue-pot-on-a-dark-background-free-photo (1).jpeg') {
    p.image = '/images/crochet-flowers-blue-pot.jpeg';
  }

  // 3. Check if image exists
  if (!p.image) {
    deletedListings.push({ id: p.id, title: p.title, reason: 'No image path' });
    continue;
  }

  const imgName = p.image.replace(/^\/images\//, '');
  const imgPath = path.join(__dirname, 'public', 'images', imgName);
  
  if (!fs.existsSync(imgPath)) {
    // If it's handmade & crafts, let's see if we can find it in C:\Bidcraft\images
    if (p.category === 'Handmade & Crafts') {
      let found = false;
      // Search in C:\Bidcraft\images\handmade & crafts
      const baseSearch = path.join('C:', 'Bidcraft', 'images', 'handmade & crafts');
      if (fs.existsSync(baseSearch)) {
        const subs = fs.readdirSync(baseSearch);
        for (const sub of subs) {
          const subPath = path.join(baseSearch, sub);
          if (fs.statSync(subPath).isDirectory()) {
            const fileSearch = path.join(subPath, imgName);
            if (fs.existsSync(fileSearch)) {
              fs.copyFileSync(fileSearch, imgPath);
              found = true;
              break;
            }
          }
        }
      }
      if (!found) {
        deletedListings.push({ id: p.id, title: p.title, reason: 'Missing image file (Handmade)' });
        continue;
      }
    } else {
      deletedListings.push({ id: p.id, title: p.title, reason: `Missing image file: ${imgName}` });
      continue;
    }
  }

  // 4. Duplicate image in same category
  const catImageKey = `${p.category}::${p.image}`;
  if (seenImagesByCategory.has(catImageKey)) {
    // Determine which is more complete. We'll just count properties for simplicity
    const existing = seenImagesByCategory.get(catImageKey);
    const existingCount = Object.keys(existing).length;
    const newCount = Object.keys(p).length;
    
    if (newCount > existingCount) {
      // Replace existing
      deletedListings.push({ id: existing.id, title: existing.title, reason: 'Duplicate image (less complete)' });
      seenImagesByCategory.set(catImageKey, p);
      
      // Remove existing from finalProducts
      finalProducts = finalProducts.filter(x => x.id !== existing.id);
      finalProducts.push(p);
    } else {
      deletedListings.push({ id: p.id, title: p.title, reason: 'Duplicate image (less complete)' });
    }
    continue;
  }
  
  seenImagesByCategory.set(catImageKey, p);
  finalProducts.push(p);
}

// Write the result back to exploreProducts.ts
let newFileContent = `import { Product } from './dbProducts';\n\nexport const exploreProducts: Product[] = ` + JSON.stringify(finalProducts, null, 2) + `;\n`;
fs.writeFileSync(path.join(__dirname, 'lib/exploreProducts.ts'), newFileContent, 'utf-8');

console.log('--- Deleted Listings ---');
console.table(deletedListings);
console.log(`Remaining products: ${finalProducts.length}`);

// Cleanup
fs.unlinkSync('./temp_explore.js');
