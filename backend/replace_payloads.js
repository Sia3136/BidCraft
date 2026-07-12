const fs = require('fs');
const files = [
  'tests/listings.test.js',
  'tests/auctions.test.js',
  'tests/settlement.test.js',
  'tests/notifications.test.js',
  'tests/wishlist.test.js',
  'tests/redis.test.js'
];
const newPayload = `title: 'Test Listing 1',
          description: 'This is a highly detailed description of the test item that meets the minimum length requirement. ' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          category: 'Art',
          subcategory: 'Paintings',
          imageUrls: ['https://example.com/p1.jpg', 'https://example.com/p2.jpg'],
          buyingMethod: 'Buy Now',`;

files.forEach(f => {
  if (!fs.existsSync(f)) {
      console.log('Skipping ' + f);
      return;
  }
  let content = fs.readFileSync(f, 'utf8');
  
  // Replace the creation payloads
  content = content.replace(/title: '.*?',\s+description: '.*?',\s+category_id: categoryId,\s+condition: '.*?',\s+photos: \[.*?\],\s+listing_type: '.*?',/g, newPayload);
  
  // also fix missing field test in listings.test.js
  if (f.includes('listings.test.js')) {
    content = content.replace(
      /description: 'No title provided',\s+category_id: categoryId,\s+condition: 'New',\s+photos: \[.*?\],\s+listing_type: 'fixed'/g,
      `description: 'No title provided',
          category: 'Art',
          subcategory: 'Paintings',
          imageUrls: ['https://example.com/p1.jpg'],
          buyingMethod: 'Buy Now'`
    );
  }
  
  fs.writeFileSync(f, content);
  console.log('Processed ' + f);
});
console.log('Done');
