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
    if (stat.isFile()) {
      const isJs = file.endsWith('.js');
      // Only include .ts files if they are inside a 'scripts' directory or specifically named (not app code)
      const isScriptsDir = dir.includes('scripts');
      const isTsScript = file.endsWith('.ts') && isScriptsDir && !file.endsWith('.d.ts');
      
      if (isJs || isTsScript) {
        if (['jest.config.js', 'move_scripts.js', 'audit_generator.js', 'gather_scripts.js', 'generate_detailed_audit.js', 'generate_final_audit.js', 'generate_architecture_audit.js', 'tailwind.config.js', 'next.config.js', 'postcss.config.js', 'jest.setup.js'].includes(file)) continue;
        scripts.push(fullPath);
      }
    }
  }
}

for (const dir of targetDirs) {
  findScripts(dir);
}
scripts = [...new Set(scripts)];

let result = [];

function searchUsage(filename) {
  try {
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
  
  const usages = searchUsage(filename);
  
  result.push({
    filename,
    relLocation,
    content: content.length > 3000 ? content.substring(0, 3000) + '... (truncated)' : content,
    usages
  });
}

fs.writeFileSync(path.join(rootDir, 'script_contents.json'), JSON.stringify(result, null, 2));
console.log(`Gathered ${result.length} scripts (JS and TS).`);
