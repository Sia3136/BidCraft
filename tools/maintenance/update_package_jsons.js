const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const updatesPath = path.join(rootDir, 'path_updates.json');
if (!fs.existsSync(updatesPath)) {
  console.error('No path_updates.json found!');
  process.exit(1);
}

const updates = JSON.parse(fs.readFileSync(updatesPath, 'utf8'));
const packageJsonFiles = [
  path.join(rootDir, 'package.json'),
  path.join(rootDir, 'frontend', 'package.json'),
  path.join(rootDir, 'backend', 'package.json')
];

packageJsonFiles.forEach(pkgPath => {
  if (!fs.existsSync(pkgPath)) return;
  
  let content = fs.readFileSync(pkgPath, 'utf8');
  let originalContent = content;
  
  for (const [oldRel, newRel] of Object.entries(updates)) {
    // If the package.json is inside frontend/ or backend/, the old path reference in its scripts
    // might be e.g. "scripts/seed.ts" (relative to frontend/)
    // oldRel is relative to root, e.g. "frontend/scripts/seed.ts"
    // newRel is relative to root, e.g. "scripts/dev/seed.ts"
    
    // We need to match the filename exactly and replace the path.
    const filename = path.basename(oldRel);
    const newPath = newRel;
    
    // In root package.json, we might have node backend/scripts/generate_seed.js
    // We replace 'backend/scripts/generate_seed.js' with 'scripts/archive/generate_seed.js'
    const oldRelUnix = oldRel.replace(/\\/g, '/');
    const newRelUnix = newRel.replace(/\\/g, '/');
    content = content.replace(new RegExp(oldRelUnix, 'g'), newRelUnix);
    
    // Also try matching just the file name with node or ts-node
    // e.g., "node update-data.js" -> "node ../scripts/build/update-data.js" (if in frontend)
    if (pkgPath.includes('frontend')) {
      // old was e.g. scripts/update-data.js (from frontend root) -> new is ../scripts/build/update-data.js
      const oldSubRel = oldRelUnix.startsWith('frontend/') ? oldRelUnix.replace('frontend/', '') : oldRelUnix;
      const newSubRel = '../' + newRelUnix;
      content = content.replace(new RegExp(oldSubRel, 'g'), newSubRel);
    } else if (pkgPath.includes('backend')) {
      const oldSubRel = oldRelUnix.startsWith('backend/') ? oldRelUnix.replace('backend/', '') : oldRelUnix;
      const newSubRel = '../' + newRelUnix;
      content = content.replace(new RegExp(oldSubRel, 'g'), newSubRel);
    }
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(pkgPath, content);
    console.log(`Updated ${pkgPath}`);
  }
});
