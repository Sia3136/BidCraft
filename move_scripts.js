const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const backendDir = path.join(rootDir, 'backend');
const rootScriptsDir = path.join(rootDir, 'scripts');
const backendScriptsDir = path.join(backendDir, 'scripts');

if (!fs.existsSync(rootScriptsDir)) fs.mkdirSync(rootScriptsDir);
if (!fs.existsSync(backendScriptsDir)) fs.mkdirSync(backendScriptsDir);

const backendFilesToMove = [
  'audit_schema.js', 'audit_users.js', 'check_dups.js', 'check_ids.js', 'check_ids2.js',
  'cleanup.js', 'debug.js', 'debug2.js', 'debug3.js', 'delete_all.js', 'fix.js',
  'fix_verified.js', 'generate_delete.js', 'generate_seed.js', 'generate_seed2.js',
  'generate_seed3.js', 'make_admin.js', 'seed_user.js', 'tmp_migrate.js',
  'upload_handmade.js', 'verify.js', 'replace_payloads.js', 'test_eval.js',
  'update_controller.js', 'parse_fails.js'
];

const rootFilesToMove = [
  'extract-docx.js', 'generate-docs.js', 'update-data.js'
];

// Move backend files
for (const file of backendFilesToMove) {
  const oldPath = path.join(backendDir, file);
  const newPath = path.join(backendScriptsDir, file);
  
  if (fs.existsSync(oldPath)) {
    let content = fs.readFileSync(oldPath, 'utf8');
    // update relative requires from ./src to ../src, ./utils to ../utils, ./final_failures to ../final_failures, etc.
    content = content.replace(/require\(['"]\.\/src/g, "require('../src");
    content = content.replace(/require\(['"]\.\/utils/g, "require('../utils");
    content = content.replace(/require\(['"]\.\/jest-results/g, "require('../jest-results");
    content = content.replace(/require\(['"]\.\/final_failures/g, "require('../final_failures");
    content = content.replace(/require\(['"]\.\/test_failures/g, "require('../test_failures");
    content = content.replace(/require\(['"]\.\/new_failures/g, "require('../new_failures");
    content = content.replace(/require\(['"]\.\/parsed_fails/g, "require('../parsed_fails");
    content = content.replace(/fs\.readFileSync\(['"](\w+\.json)['"]/g, "fs.readFileSync(path.join(__dirname, '..', '$1')");
    content = content.replace(/fs\.writeFileSync\(['"](\w+\.json)['"]/g, "fs.writeFileSync(path.join(__dirname, '..', '$1')");
    
    // Some scripts might read/write 'test_output.log'
    content = content.replace(/['"]test_output\.log['"]/g, "path.join(__dirname, '..', 'test_output.log')");
    
    // Add path import if needed
    if (content.includes('path.join') && !content.includes("require('path')")) {
        content = "const path = require('path');\n" + content;
    }
    
    fs.writeFileSync(newPath, content);
    fs.unlinkSync(oldPath);
    console.log(`Moved and updated ${file} -> backend/scripts/`);
  }
}

// Move root files
for (const file of rootFilesToMove) {
  const oldPath = path.join(rootDir, file);
  const newPath = path.join(rootScriptsDir, file);
  
  if (fs.existsSync(oldPath)) {
    let content = fs.readFileSync(oldPath, 'utf8');
    
    // update __dirname to path.join(__dirname, '..') when referencing frontend
    content = content.replace(/__dirname, ['"]frontend['"]/g, "__dirname, '..', 'frontend'");
    
    fs.writeFileSync(newPath, content);
    fs.unlinkSync(oldPath);
    console.log(`Moved and updated ${file} -> scripts/`);
  }
}

console.log('Done moving scripts.');
