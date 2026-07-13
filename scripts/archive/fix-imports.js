const fs = require('fs');
const path = require('path');

const filesToFix = [
  path.join('C:', 'Bidcraft', 'frontend', 'components', 'marketplace', 'mobile-filter-drawer.tsx'),
  path.join('C:', 'Bidcraft', 'frontend', 'components', 'marketplace', 'price-slider.tsx')
];

filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // It looks like `import * as React, { useState } from 'react'`
    // Change to `import React, { useState } from 'react'`
    // or separate them.
    content = content.replace(/import\s+\*\s+as\s+React,\s*\{([^}]+)\}\s+from\s+['"]react['"]/g, 'import React, { $1 } from \'react\'');
    fs.writeFileSync(file, content);
  }
});
console.log('Fixed imports in mobile-filter-drawer.tsx and price-slider.tsx');
