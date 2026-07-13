const fs = require('fs');
let content = fs.readFileSync('backend/tests/listings.test.js', 'utf8');

content = content.replace('expect(res.body.listing.id).toBe(testListingId);', 'expect(res.body.id).toBe(testListingId);');
content = content.replace("expect(res.body.error).toBe('listing_not_found');", "expect(res.body.error).toBe('Listing not found');");

fs.writeFileSync('backend/tests/listings.test.js', content);
