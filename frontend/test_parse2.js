const fs = require('fs');
const html = fs.readFileSync('page.html', 'utf8');
const index = html.indexOf('More from');
if (index !== -1) {
  console.log('Context:', html.substring(index - 50, index + 100));
} else {
  console.log('NOT FOUND AT ALL');
}
