const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const scriptsDir = path.join(rootDir, 'scripts');

// 1. Create Directories
const dirs = ['dev', 'build', 'maintenance', 'archive'].map(d => path.join(scriptsDir, d));
dirs.forEach(d => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
    console.log('Created directory:', d);
  }
});

// 2. Define Moves
const devFiles = ['generate_seed3.js', 'make_admin.js', 'upload_handmade.js', 'clear_redis.js', 'processListings.ts', 'seed.ts', 'seed_cloudinary.ts', 'upload-images.ts'];
const buildFiles = ['consistencyPass.ts'];
const maintFiles = ['audit_schema.js', 'audit_users.js', 'check_dups.js', 'verify.js', 'check_collections.js', 'testWebhook.js', 'test_eval.js', 'parse_fails.js', 'run-audit.js', 'scan.js'];
const archiveFiles = ['apply_schema.js', 'check_ids.js', 'check_ids2.js', 'cleanup.js', 'debug.js', 'debug2.js', 'debug3.js', 'deleteConflicting.js', 'delete_all.js', 'fix.js', 'fix_verified.js', 'generate_delete.js', 'generate_seed.js', 'generate_seed2.js', 'migrate_deposits.js', 'migrate_fix12_14.js', 'replace_payloads.js', 'seedListings.js', 'seed_user.js', 'update_controller.js', 'add_art_listings.js', 'add_handmade.js', 'cleanup_listings.js', 'create-stub-pages.js', 'enrich_listings.js', 'fix-imports.js', 'fix-names.js', 'fix_duplicates.js', 'generate-lifestyle.js', 'generate-pages.js', 'get-products.js', 'parse_seed.js', 'run_queries.js', 'stagger-auctions.js', 'update-auth.js', 'update-client-home-prompt3.js', 'update-client-home.js', 'update-collections-occasions.js', 'update-contact-form.js', 'update-explore.js', 'update-navbar-notifications.js', 'update-navbar-prompt3.js', 'update-navbar.js', 'update-product-card-timer.js', 'update-store.js', 'updateCategories.ts', 'extract-docx.js', 'generate-docs.js'];

// Special cases
const updateDataRoot = path.join(rootDir, 'scripts', 'update-data.js'); // root
const updateDataFrontend = path.join(rootDir, 'frontend', 'scripts', 'update-data.js'); // frontend
const tmpMigrate = 'tmp_migrate.js';

// Search locations for files
const searchLocs = [
  path.join(rootDir, 'backend', 'scripts'),
  path.join(rootDir, 'frontend', 'scripts'),
  path.join(rootDir, 'scripts'),
  rootDir
];

let filesMoved = 0;
let pathUpdates = {}; // oldRelativePath -> newRelativePath

function findAndMove(fileArray, destFolder) {
  fileArray.forEach(file => {
    let found = false;
    for (const loc of searchLocs) {
      const fullPath = path.join(loc, file);
      if (fs.existsSync(fullPath)) {
        const destPath = path.join(scriptsDir, destFolder, file);
        if (fullPath !== destPath) {
          fs.renameSync(fullPath, destPath);
          console.log(`Moved ${file} -> scripts/${destFolder}/`);
          filesMoved++;
          pathUpdates[path.relative(rootDir, fullPath).replace(/\\/g, '/')] = `scripts/${destFolder}/${file}`;
        }
        found = true;
        break;
      }
    }
    if (!found) {
      console.log(`WARNING: Could not find ${file} anywhere!`);
    }
  });
}

findAndMove(devFiles, 'dev');
findAndMove(buildFiles, 'build');
findAndMove(maintFiles, 'maintenance');
findAndMove(archiveFiles, 'archive');

// Handle update-data.js
if (fs.existsSync(updateDataRoot)) {
  const dest = path.join(scriptsDir, 'build', 'update-data.js');
  if (updateDataRoot !== dest) {
    fs.renameSync(updateDataRoot, dest);
    pathUpdates['scripts/update-data.js'] = 'scripts/build/update-data.js';
    console.log('Moved root update-data.js -> scripts/build/');
  }
}
if (fs.existsSync(updateDataFrontend)) {
  const dest = path.join(scriptsDir, 'archive', 'update-data.js');
  if (updateDataFrontend !== dest) {
    fs.renameSync(updateDataFrontend, dest);
    pathUpdates['frontend/scripts/update-data.js'] = 'scripts/archive/update-data.js';
    console.log('Moved frontend update-data.js -> scripts/archive/');
  }
}

// 3. Delete tmp_migrate.js
let tmpFound = false;
for (const loc of searchLocs) {
  const fullPath = path.join(loc, tmpMigrate);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log(`Deleted ${tmpMigrate}`);
    tmpFound = true;
    break;
  }
}

fs.writeFileSync(path.join(rootDir, 'path_updates.json'), JSON.stringify(pathUpdates, null, 2));
console.log('Moves completed. Mappings saved to path_updates.json');
