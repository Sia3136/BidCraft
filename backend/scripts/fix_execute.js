const fs = require('fs');
let content = fs.readFileSync('c:/Bidcraft/backend/execute_phase1_v4.js', 'utf8');

const insertion = `
const transforms = [
  '',
  'c_crop,g_center,w_0.8,h_0.8,fl_relative',
  'c_crop,g_west,w_0.5,h_1.0,fl_relative',
  'c_crop,g_east,w_0.5,h_1.0,fl_relative',
  'c_crop,g_auto,w_0.4,h_0.4,fl_relative',
  'e_improve,e_sharpen'
];

function generateVariants(originalUrl) {
  if (!originalUrl.includes('/upload/')) return Array(6).fill(originalUrl);
  const parts = originalUrl.split('/upload/');
  const base = parts[0] + '/upload/';
  const path = parts[1];
  return transforms.map(t => {
    if (!t) return originalUrl;
    return base + t + '/' + path;
  });
}
`;

content = content.replace('const fs = require(\'fs\');', 'const fs = require(\'fs\');\n' + insertion);
content = content.replace('newUrls.push(uploadRes.secure_url);', 'newUrls.push(...generateVariants(uploadRes.secure_url));');

fs.writeFileSync('c:/Bidcraft/backend/execute_phase1_v4.js', content);
console.log('Fixed execute_phase1_v4.js');
