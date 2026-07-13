const fs = require('fs');
const files = [
  'tests/listings.test.js',
  'tests/auctions.test.js',
  'tests/settlement.test.js',
  'tests/notifications.test.js',
  'tests/wishlist.test.js',
  'tests/redis.test.js'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  
  // Find the end of the beforeAll block
  if (!content.includes('UPDATE users SET email_verified = true')) {
    content = content.replace(
      /otherUserToken = otherRes.body.accessToken;/g,
      "otherUserToken = otherRes.body.accessToken;\n    await db.query(\"UPDATE users SET email_verified = true\");"
    );
  }
  
  fs.writeFileSync(f, content);
  console.log('Processed ' + f);
});
console.log('Done');
