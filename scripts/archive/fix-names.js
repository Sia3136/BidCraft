const fs = require('fs');
let content = fs.readFileSync('c:/Bidcraft/frontend/lib/lifestyleProducts.ts', 'utf8');

const indianNames = [
  'Aarav Sharma', 'Diya Patel', 'Meera Reddy', 'Kavya Singh',
  'Rohan Gupta', 'Sneha Desai', 'Vikram Malhotra', 'Neha Joshi',
  'Arjun Nair', 'Pooja Verma', 'Aditya Iyer', 'Riya Kapoor',
  'Karan Mehta', 'Ananya Rao', 'Rahul Choudhury', 'Isha Menon',
  'Dev Bhatt', 'Zara Sheikh', 'Vivaan Das'
];

let nameIndex = 0;
let verifiedCount = 0;

// Since it's an array of objects
const regex = /"creator":\s*"([^"]+)"/g;
content = content.replace(regex, (match) => {
  const newName = indianNames[nameIndex % indianNames.length];
  nameIndex++;
  return `"creator": "${newName}"`;
});

// Also replace `"verified": true` / `"verified": false`
// and `"creatorBadges": ["Verified Creator"]`
const verifiedRegex = /"verified":\s*(true|false)/g;
content = content.replace(verifiedRegex, (match) => {
  const isVerified = verifiedCount < 2;
  verifiedCount++;
  return `"verified": ${isVerified}`;
});

// Remove "Verified Creator" from creatorBadges if not verified?
// Actually simpler: just reset verifiedCount and do a full regex on the whole object if possible.
// For now let's just run it. If verified: true was set, it'll update.

fs.writeFileSync('c:/Bidcraft/frontend/lib/lifestyleProducts.ts', content, 'utf8');
console.log(`Fixed ${nameIndex} creator names and updated verified.`);
