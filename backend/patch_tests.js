const fs = require('fs');
const path = require('path');
const files = [
  'auctions.test.js',
  'notifications.test.js',
  'settlement.test.js',
  'follows.test.js',
  'search.test.js',
  'redis.test.js',
  'wishlist.test.js'
];
for (const file of files) {
  const p = path.join(__dirname, 'tests', file);
  if (!fs.existsSync(p)) continue;
  let content = fs.readFileSync(p, 'utf8');
  if (content.includes('email_verified = true')) continue;
  
  const insertStr = '\n    await db.query("UPDATE users SET email_verified = true");\n';
  // Try to find the first call to create a listing
  const rx = /([ \t]*)(const \w+ = )?await request\(app\)\s*\.post\(['"`]\/api\/listings['"`]\)/;
  if (rx.test(content)) {
    content = content.replace(rx, insertStr + '$1$2await request(app)\n      .post(\'/api/listings\')');
    fs.writeFileSync(p, content);
    console.log('Updated', file);
  } else {
    console.log('Skipped (no listing post found)', file);
  }
}
