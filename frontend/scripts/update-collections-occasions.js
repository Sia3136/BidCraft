const fs = require('fs');
const path = require('path');

const exploreProductsPath = path.join('C:', 'Bidcraft', 'frontend', 'lib', 'exploreProducts.ts');
let exploreContent = fs.readFileSync(exploreProductsPath, 'utf8');

const products = [];
// This regex specifically targets "id": "..."
const idRegex = /"id":\s*"([^"]+)"/g;
let m;
while ((m = idRegex.exec(exploreContent)) !== null) {
  const startIndex = m.index;
  const objectEnd = exploreContent.indexOf('}', startIndex);
  const objectContent = exploreContent.substring(startIndex, objectEnd);
  
  const id = m[1];
  
  const catMatch = objectContent.match(/"category":\s*"([^"]+)"/);
  const titleMatch = objectContent.match(/"title":\s*"([^"]+)"/);
  
  const category = catMatch ? catMatch[1] : '';
  const title = titleMatch ? titleMatch[1] : '';
  
  products.push({ id, category, title });
}

console.log(`Found ${products.length} products`);

const vintageIds = products.filter(p => p.title.toLowerCase().includes('vintage') || p.title.toLowerCase().includes('traditional') || p.category.includes('Art')).map(p => p.id).slice(0, 10);
const modernIds = products.filter(p => p.title.toLowerCase().includes('modern') || p.title.toLowerCase().includes('minimalist') || p.category.includes('Lifestyle')).map(p => p.id).slice(0, 10);
const traditionalIds = products.filter(p => p.title.toLowerCase().includes('traditional') || p.title.toLowerCase().includes('folk') || p.category.includes('Handmade')).map(p => p.id).slice(0, 10);

const occasionSets = {
  'birthdays': products.slice(0, 15).map(p => p.id),
  'anniversaries': products.slice(10, 25).map(p => p.id),
  'housewarming': products.slice(20, 35).map(p => p.id),
  'just-because': products.slice(30, 45).map(p => p.id),
  'all-occasions': products.slice(40, 55).map(p => p.id)
};

const occasionSetsCode = `export const OCCASION_SETS: Record<string, string[]> = ${JSON.stringify(occasionSets, null, 2)};`;
fs.writeFileSync(path.join('C:', 'Bidcraft', 'frontend', 'lib', 'occasionSets.ts'), occasionSetsCode);

const updatedContent = exploreContent.replace(/"id":\s*"([^"]+)",/g, (match, id) => {
  const occs = [];
  for (const [key, ids] of Object.entries(occasionSets)) {
    if (ids.includes(id)) occs.push(key);
  }
  
  const cols = [];
  if (vintageIds.includes(id)) cols.push('vintage-retro');
  if (modernIds.includes(id)) cols.push('modern-minimalist');
  if (traditionalIds.includes(id)) cols.push('traditional-arts');

  let injection = ``;
  if (occs.length > 0) injection += ` "occasions": ${JSON.stringify(occs)},`;
  if (cols.length > 0) injection += ` "collections": ${JSON.stringify(cols)},`;
  
  return `${match}${injection}`;
});

// Remove existing empty collections/occasions if they exist
let finalContent = updatedContent.replace(/"occasions":\s*\[\],\s*/g, '');
finalContent = finalContent.replace(/"collections":\s*\[\],\s*/g, '');

// If the previous script added unquoted occasions: []
finalContent = finalContent.replace(/occasions:\s*\[\],\s*/g, '');
finalContent = finalContent.replace(/collections:\s*\[\],\s*/g, '');

fs.writeFileSync(exploreProductsPath, finalContent);
console.log('Successfully updated exploreProducts.ts and created occasionSets.ts');
