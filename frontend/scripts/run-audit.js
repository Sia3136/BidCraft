const fs = require('fs');
const path = require('path');

const walk = (dir, ext) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file, ext));
    } else {
      if (file.endsWith(ext)) results.push(file);
    }
  });
  return results;
};

const components = walk(path.join('C:', 'Bidcraft', 'frontend', 'components'), '.tsx');
const pages = walk(path.join('C:', 'Bidcraft', 'frontend', 'app'), '.tsx');
const allFiles = [...components, ...pages];

let auditLogs = [];

const hooks = ['useState', 'useEffect', 'useRef', 'useCallback', 'useMemo', 'useContext'];

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const usedHooks = hooks.filter(hook => {
    // Just simple index of for now to avoid regex escaping hell
    const idx = content.indexOf(hook);
    if (idx !== -1) {
      // Check if it's imported
      return true;
    }
    return false;
  });
  
  if (usedHooks.length > 0) {
    const importRegex = /import\s+.*\{[^}]*\}\s+from\s+['"]react['"]|import\s+.*from\s+['"]react['"]/;
    const hasReactImport = importRegex.test(content);
    
    let importedHooks = [];
    if (hasReactImport) {
      const match = content.match(/import\s+(?:[^,{]*,\s*)?\{([^}]+)\}\s+from\s+['"]react['"]/);
      if (match) {
        importedHooks = match[1].split(',').map(s => s.trim());
      }
    }

    const missingHooks = usedHooks.filter(h => !importedHooks.includes(h) && !content.includes("import React, { " + h));
    
    if (missingHooks.length > 0 || !hasReactImport) {
      if (hasReactImport) {
        content = content.replace(/import\s+(.*?)\s+from\s+['"]react['"]/, (match, p1) => {
          if (p1.includes('{')) {
            return match.replace('{', "{ " + missingHooks.join(', ') + ", ");
          } else {
            return "import " + p1 + ", { " + missingHooks.join(', ') + " } from 'react'";
          }
        });
      } else {
        const newImport = "import React, { " + usedHooks.join(', ') + " } from 'react';\n";
        if (content.includes("'use client'")) {
          content = content.replace(/'use client'[;]?\n*/, "'use client'\n\n" + newImport);
        } else if (content.includes('"use client"')) {
          content = content.replace(/"use client"[;]?\n*/, '"use client"\n\n' + newImport);
        } else {
          content = newImport + content;
        }
      }
      changed = true;
      auditLogs.push("Added missing React imports (" + missingHooks.join(', ') + ") to " + path.basename(file));
    }
  }

  if (changed) {
    fs.writeFileSync(file, content);
  }
});

const explorePath = path.join('C:', 'Bidcraft', 'frontend', 'components', 'client-explore.tsx');
if (fs.existsSync(explorePath)) {
  let content = fs.readFileSync(explorePath, 'utf8');
  if (content.includes('key={method}')) {
    content = content.replace(/key=\{method\}/g, 'key={method + "-" + Math.random()}');
    fs.writeFileSync(explorePath, content);
    auditLogs.push('Fixed duplicate key in client-explore.tsx');
  }
}

console.log(auditLogs.join('\n'));
if (auditLogs.length === 0) console.log('No issues found during audit.');
