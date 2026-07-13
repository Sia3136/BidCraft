const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const targetDirs = [
  path.join(rootDir, 'backend', 'scripts'),
  path.join(rootDir, 'frontend', 'scripts'),
  path.join(rootDir, 'scripts'),
  rootDir,
  path.join(rootDir, 'backend'),
  path.join(rootDir, 'frontend')
];

let scripts = [];

function findScripts(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isFile() && file.endsWith('.js')) {
      // Exclude config files
      if (['jest.config.js', 'move_scripts.js', 'audit_generator.js'].includes(file)) continue;
      scripts.push(fullPath);
    }
  }
}

for (const dir of targetDirs) {
  findScripts(dir);
}

// Remove duplicates if any
scripts = [...new Set(scripts)];

let markdown = `# JavaScript Scripts Usage Audit\n\n`;
markdown += `| File Name | Current Location | Purpose | Is Currently Used? | How is it Executed? | Safe to Move? | Safe to Delete? | Reasoning |\n`;
markdown += `|---|---|---|---|---|---|---|---|\n`;

let safeToKeep = [];
let safeToMove = [];
let safeToDelete = [];

function searchUsage(filename) {
  try {
    // Search the whole codebase for the filename
    const res = execSync(`git grep -i "${filename}"`, { cwd: rootDir, encoding: 'utf8' });
    return res.split('\n').filter(Boolean);
  } catch (e) {
    return [];
  }
}

for (const scriptPath of scripts) {
  const filename = path.basename(scriptPath);
  const relLocation = path.relative(rootDir, scriptPath).replace(/\\/g, '/');
  
  let content = '';
  try { content = fs.readFileSync(scriptPath, 'utf8'); } catch (e) {}
  
  // Guess purpose
  let purpose = 'Unknown';
  if (filename.includes('seed')) purpose = 'Database seeding';
  else if (filename.includes('delete') || filename.includes('cleanup') || filename.includes('clear')) purpose = 'Data cleanup / deletion';
  else if (filename.includes('audit')) purpose = 'Data / Schema auditing';
  else if (filename.includes('update')) purpose = 'Data / Code update utility';
  else if (filename.includes('generate')) purpose = 'Code / Document generation';
  else if (filename.includes('fix')) purpose = 'One-time fix migration';
  else if (filename.includes('debug')) purpose = 'Debugging utility';
  else if (filename.includes('test_eval') || filename.includes('parse_fails')) purpose = 'Test result parsing';
  
  const usages = searchUsage(filename);
  
  let execution = 'Unknown';
  let isUsed = 'No';
  let safeDelete = 'No';
  let safeMove = 'Yes';
  let reasoning = 'No clear references found in codebase.';
  
  const inPackageJson = usages.some(u => u.includes('package.json:'));
  const inGithubAction = usages.some(u => u.includes('.github/workflows'));
  const inAnotherScript = usages.some(u => !u.includes('package.json') && !u.includes('.md') && !u.includes(filename) && (u.includes('.js:') || u.includes('.ts:')));
  
  if (inPackageJson) {
    execution = 'npm script';
    isUsed = 'Yes';
    safeDelete = 'No';
    safeMove = 'No (Requires package.json update)';
    reasoning = 'Referenced in package.json. Active npm script.';
  } else if (inGithubAction) {
    execution = 'CI/CD';
    isUsed = 'Yes';
    safeDelete = 'No';
    safeMove = 'No (Requires workflow update)';
    reasoning = 'Executed in GitHub Actions workflow.';
  } else if (inAnotherScript) {
    execution = 'imported by another script / child_process';
    isUsed = 'Yes';
    safeDelete = 'No';
    safeMove = 'No (Requires import path updates)';
    reasoning = 'Imported or spawned by other codebase files.';
  } else {
    // Not found in automated places.
    if (purpose === 'One-time fix migration' || purpose.includes('debug') || purpose.includes('cleanup')) {
      execution = 'manual command';
      isUsed = 'No';
      safeDelete = 'Yes';
      safeMove = 'Yes';
      reasoning = 'Appears to be a one-time dev script with no active references.';
    } else {
      execution = 'manual command';
      isUsed = 'Unknown';
      safeDelete = 'No';
      safeMove = 'Yes';
      reasoning = 'Likely executed manually. No automated references found, but purpose might still be needed.';
    }
  }
  
  if (safeDelete === 'Yes') safeToDelete.push(relLocation);
  else if (safeMove === 'Yes' && safeDelete === 'No') safeToMove.push(relLocation);
  else safeToKeep.push(relLocation);

  markdown += `| ${filename} | ${relLocation} | ${purpose} | ${isUsed} | ${execution} | ${safeMove} | ${safeDelete} | ${reasoning} |\n`;
}

markdown += `\n## Lists\n\n### 1. Safe to Keep (In Use / Complex to Move)\n`;
safeToKeep.forEach(f => markdown += `- ${f}\n`);

markdown += `\n### 2. Safe to Move (To centralized scripts/)\n`;
safeToMove.forEach(f => markdown += `- ${f}\n`);

markdown += `\n### 3. Safe to Delete (Obsolete / One-off)\n`;
safeToDelete.forEach(f => markdown += `- ${f}\n`);

fs.writeFileSync(path.join(rootDir, 'js_script_audit.md'), markdown);
console.log('Audit generated at js_script_audit.md');
