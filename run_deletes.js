const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const KEEP = [
  'scripts/archive/seedListings.js',
  'scripts/maintenance/testWebhook.js',
  'backend/src/services/__mocks__/paymentService.js',
  'backend/src/controllers/placeholder.txt'
];

const DELETE_CANDIDATES = [
  // Group A
  'backend/fix-auctions.js', 'backend/fix_auctions.js', 'backend/patch_tests.js',
  'backend/scripts/fix_execute.js', 'backend/scripts/fix_gallery_variants.js',
  'backend/scripts/fix_listings_reviews_and_images.js', 'backend/scripts/fix_seed.js',
  'backend/seed-variations-v2.js', 'backend/seed-variations.js', 'backend/seed_seller.js',
  'scripts/archive/fix.js', 'scripts/archive/fix-imports.js', 'scripts/archive/fix-names.js',
  'scripts/archive/fix_duplicates.js', 'scripts/archive/fix_verified.js',
  'scripts/archive/seed_user.js', 'scripts/dev/generate_seed3.js', 'scripts/dev/seed.ts',
  'scripts/dev/seed_cloudinary.ts',

  // Group B
  'backend/debug.js', 'scripts/archive/debug.js', 'scripts/archive/debug2.js', 'scripts/archive/debug3.js',
  'backend/getListings_error.txt', 'backend/query-out.txt', 'backend/test_output.log',
  'backend/trace.log', 'backend/auctions_test.log', 'backend/original_auctions_test.log',
  'Learning Docs/phase_b.txt', 'Learning Docs/phase_b_utf8.txt',
  'docs/BidCraft.docx.txt', 'docs/bidcraft blueprint 2.0 .docx.txt', 'docs/impt info.docx.txt',
  'contact_us_commits.txt', 'files.txt', 'files_utf8.txt', 'git_diff_design.txt',
  'git_diff_design_utf8.txt', 'git_diff_navbar.txt', 'git_files.txt', 'git_log_navbar.txt',
  'git_log_navbar_head.txt', 'navbar_mega_menu.txt', 'old_pdp.txt', 'old_pdp2.txt',
  'run_replacements.js', 'backend/src/services/settlementService.js.txt',
  'backend/test-exact-missing.js', 'backend/test-exact-missing2.js', 'backend/test-expired-auctions.js',
  'backend/test-expired-listing.js', 'backend/test-frontend-filter.js', 'backend/test-inactive.js',
  'backend/test-missing-seed.js', 'backend/test-null-end.js', 'backend/test-orphaned.js',
  'backend/test-pagination.js', 'backend/test-query.js', 'backend/test-schema.js',
  'backend/test-seed-length.js', 'backend/test-tables.js', 'backend/test-users.js',
  'backend/test_auctions.js', 'backend/test_explore_query.js', 'backend/test_getListings.js',
  'backend/test_query.js', 'backend/test_seller.js', 'backend/test_seller_dashboard.js',
  'backend/test-auctions-schema.js', 'backend/test-auctions.js', 'backend/test-dates.js',
  'backend/cleanup-tests.js', 'backend/stress-test-bids.js', 'frontend/testAllNavbar.ts',
  'frontend/testNavigation.ts', 'frontend/testNavigation2.ts', 'scripts/maintenance/test_eval.js',

  // Group C
  'backend/scripts/seed-reviews.js', 'backend/scripts/seed-shipping.js',
  'scripts/archive/add_art_listings.js', 'scripts/archive/add_handmade.js',
  'scripts/archive/apply_schema.js', 'scripts/archive/check_ids.js', 'scripts/archive/check_ids2.js',
  'scripts/archive/cleanup.js', 'scripts/archive/cleanup_listings.js', 'scripts/archive/create-stub-pages.js',
  'scripts/archive/deleteConflicting.js', 'scripts/archive/delete_all.js', 'scripts/archive/enrich_listings.js',
  'scripts/archive/extract-docx.js', 'scripts/archive/generate-docs.js', 'scripts/archive/generate-lifestyle.js',
  'scripts/archive/generate-pages.js', 'scripts/archive/generate_delete.js', 'scripts/archive/generate_seed.js',
  'scripts/archive/generate_seed2.js', 'scripts/archive/get-products.js', 'scripts/archive/migrate_deposits.js',
  'scripts/archive/migrate_fix12_14.js', 'scripts/archive/parse_seed.js', 'scripts/archive/replace_payloads.js',
  'scripts/archive/run_queries.js', 'scripts/archive/stagger-auctions.js', 'scripts/archive/update-auth.js',
  'scripts/archive/update-client-home-prompt3.js', 'scripts/archive/update-client-home.js',
  'scripts/archive/update-collections-occasions.js', 'scripts/archive/update-contact-form.js',
  'scripts/archive/update-data.js', 'scripts/archive/update-explore.js',
  'scripts/archive/update-navbar-notifications.js', 'scripts/archive/update-navbar-prompt3.js',
  'scripts/archive/update-navbar.js', 'scripts/archive/update-product-card-timer.js',
  'scripts/archive/update-store.js', 'scripts/archive/updateCategories.ts', 'scripts/archive/update_controller.js',
  'scripts/maintenance/audit_schema.js', 'scripts/maintenance/audit_users.js',
  'scripts/maintenance/check_collections.js', 'scripts/maintenance/check_dups.js',
  'scripts/maintenance/parse_fails.js', 'scripts/maintenance/run-audit.js',
  'scripts/maintenance/scan.js', 'scripts/maintenance/verify.js'
];

let deleted = [];
let retained = [];

for (const file of DELETE_CANDIDATES) {
  if (KEEP.includes(file)) {
    retained.push({ file, reason: 'Explicitly marked to KEEP by user.' });
    continue;
  }
  
  if (!fs.existsSync(file)) {
    retained.push({ file, reason: 'File does not exist.' });
    continue;
  }
  
  const baseName = path.basename(file);
  
  // Cross-reference search
  try {
    // Only search files that are not the candidate itself. Exclude node_modules.
    // If grep exits with 0, it means it FOUND references.
    // Use powershell syntax to exclude the file itself
    const res = execSync(`git grep -l "${baseName}"`, { stdio: 'pipe' }).toString().trim().split('\n').filter(Boolean);
    const otherReferences = res.filter(r => path.resolve(r) !== path.resolve(file));
    if (otherReferences.length > 0) {
      retained.push({ file, reason: `Referenced by ${otherReferences.join(', ')}` });
      continue;
    }
  } catch (e) {
    // git grep exits with 1 if no matches found, which is exactly what we want!
  }

  // Double check package.json explicitly just in case
  try {
    const pkgSearch = execSync(`findstr /M /I /C:"${baseName}" package.json frontend\\package.json backend\\package.json`, { stdio: 'pipe' }).toString().trim();
    if (pkgSearch) {
      retained.push({ file, reason: `Referenced in package.json files: ${pkgSearch}` });
      continue;
    }
  } catch (e) {
    // findstr exits with 1 if no matches
  }

  // Dockerfile explicit check
  try {
    const dockerSearch = execSync(`findstr /M /I /C:"${baseName}" Dockerfile frontend\\Dockerfile backend\\Dockerfile docker-compose.prod.yml docker-compose.yml`, { stdio: 'pipe' }).toString().trim();
    if (dockerSearch) {
      retained.push({ file, reason: `Referenced in Docker configs: ${dockerSearch}` });
      continue;
    }
  } catch (e) {
    // findstr exits with 1 if no matches
  }

  // Safe to delete!
  fs.unlinkSync(file);
  deleted.push(file);
}

fs.writeFileSync('deletion_report.json', JSON.stringify({ deleted, retained }, null, 2));
console.log('Script completed. Generated deletion_report.json.');
