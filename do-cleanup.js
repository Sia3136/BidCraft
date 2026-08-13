const fs = require('fs');
const path = require('path');

const root = __dirname;
const backend = path.join(root, 'backend');
const frontend = path.join(root, 'frontend');

// Known artifacts that are 100% safe to delete
const exactFiles = [
  'auction_backup_2026-08-06.json',
  'db_schema_dump.json',
  'dump.json',
  'final_failures.json',
  'full_dump.json',
  'jest-results.json',
  'new_failures.json',
  'recent-test-results.json',
  'schema_snapshot.json',
  'test_failures.json',
  'test_failures_parsed.json',
  'test_output.log',
  'trace.log',
  'getListings_error.txt',
  'query-out.txt',
  'test_analysis_generated.md'
].map(f => path.join(backend, f));

// Root artifacts
const rootArtifacts = [
  'chat_temp.tsx',
  'chat_temp2.tsx',
  'chat_temp3.tsx',
  'client_home_8dec59fb.tsx',
  'client_home_9061b2d5.tsx',
  'deletion_report.json',
  'frontend_app_history.patch',
  'frontend_components_history.patch',
  'frontend_tsx_history.patch',
  'old_navbar.tsx',
  'old_navbar_utf8.tsx',
  'run_deletes.js',
  'trending_section.tsx',
  'update_client_home.js'
].map(f => path.join(root, f));

const directoriesToRemove = [
  path.join(root, 'archive'),
  path.join(root, 'tools'),
  path.join(root, 'scripts', 'archive')
];

let deleted = {
  exact: [],
  scripts: [],
  root: [],
  dirs: []
};

// 1. Delete exact backend JSON/log dumps
for (const f of exactFiles) {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    deleted.exact.push(f);
  }
}

// 2. Delete root artifacts
for (const f of rootArtifacts) {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    deleted.root.push(f);
  }
}

// 3. Delete directories
for (const d of directoriesToRemove) {
  if (fs.existsSync(d)) {
    fs.rmSync(d, { recursive: true, force: true });
    deleted.dirs.push(d);
  }
}

// 4. Delete one-off backend scripts in root of backend/ (NOT backend/src/)
const backendFiles = fs.readdirSync(backend);
for (const file of backendFiles) {
  const fullPath = path.join(backend, file);
  // Only target .js files in the root of backend/
  if (fs.statSync(fullPath).isFile() && file.endsWith('.js')) {
    // DO NOT delete jest.config.js
    if (file === 'jest.config.js') continue;
    
    // Everything else in root of backend/ that is a .js file is a one-off script
    fs.unlinkSync(fullPath);
    deleted.scripts.push(file);
  }
}

// 5. Check frontend for prev_navbar
const prevNavbar = path.join(frontend, 'prev_navbar.tsx');
if (fs.existsSync(prevNavbar)) {
  fs.unlinkSync(prevNavbar);
  deleted.root.push('frontend/prev_navbar.tsx');
}

console.log(JSON.stringify(deleted, null, 2));
