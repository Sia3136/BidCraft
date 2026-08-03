const fs = require('fs');
const html = fs.readFileSync('page.html', 'utf8');
const match = html.match(/<h2[^>]*>More from([^<]*)<\/h2>/);
console.log('H2 content:', match ? match[0] : 'NOT FOUND');
