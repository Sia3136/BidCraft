const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

execSync('npx esbuild lib/exploreProducts.ts --bundle --platform=node --outfile=temp_explore.js', { stdio: 'inherit' });
const { exploreProducts } = require('./temp_explore.js');

const collections = [
  { slug: 'vintage-retro', keywords: ['vintage', 'retro', 'antique', 'traditional', 'old', 'classic', 'heritage', 'garba', 'terracotta', 'brass', 'handpainted', 'block print'] },
  { slug: 'modern-minimalist', keywords: ['minimalist', 'modern', 'geometric', 'digital', 'abstract', 'ceramic', 'resin', 'contemporary'] },
  { slug: 'traditional-arts', keywords: ['traditional', 'folk', 'tribal', 'clay', 'pottery', 'mandala', 'ganesha', 'garba', 'handloom', 'block', 'terracotta', 'warli'] }
];

let modified = false;

for (const coll of collections) {
  let matches = 0;
  for (const p of exploreProducts) {
    const text = (p.title + ' ' + (p.description || '') + ' ' + p.category + ' ' + (p.subcategory || '')).toLowerCase();
    if (p.collections && p.collections.includes(coll.slug)) {
      matches++;
    } else if (coll.keywords.some(kw => text.includes(kw))) {
      matches++;
    }
  }

  console.log(`Collection ${coll.slug} has ${matches} items.`);
  
  if (matches < 7) {
    console.log(`Need ${7 - matches} more items for ${coll.slug}. Tagging...`);
    let added = 0;
    for (const p of exploreProducts) {
      if (added >= 7 - matches) break;
      const text = (p.title + ' ' + (p.description || '') + ' ' + p.category + ' ' + (p.subcategory || '')).toLowerCase();
      
      const alreadyHas = p.collections && p.collections.includes(coll.slug);
      const naturallyMatches = coll.keywords.some(kw => text.includes(kw));
      
      if (!alreadyHas && !naturallyMatches) {
        if (!p.collections) p.collections = [];
        p.collections.push(coll.slug);
        added++;
        modified = true;
      }
    }
  }
}

if (modified) {
  let newFileContent = `import { Product } from './dbProducts';\n\nexport const exploreProducts: Product[] = ` + JSON.stringify(exploreProducts, null, 2) + `;\n`;
  fs.writeFileSync(path.join(__dirname, 'lib/exploreProducts.ts'), newFileContent, 'utf-8');
  console.log("Updated exploreProducts.ts with manual tags.");
}

fs.unlinkSync('./temp_explore.js');
