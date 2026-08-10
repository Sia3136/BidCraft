const fs = require('fs');

function findMissing() {
  const seedCode = fs.readFileSync('../scripts/archive/seedListings.js', 'utf8');
  const jsonStrMatch = seedCode.match(/const products = \[\] = (\[.*?\]);/s);
  const originalSeed = eval(jsonStrMatch[1]);
  
  const currentDB = JSON.parse(fs.readFileSync('full_dump.json', 'utf8'));
  const fakeListings = currentDB.filter(l => new Date(l.created_at) >= new Date('2026-07-26'));
  const fakeTitles = fakeListings.map(l => l.title);
  
  const originalDBListings = currentDB.filter(l => !fakeTitles.includes(l.title));
  
  let dbList = [...originalDBListings];
  let missing = [];
  
  for (const seed of originalSeed) {
    // Try to find exact title match
    let matchIdx = dbList.findIndex(db => db.title.trim() === seed.title.trim());
    if (matchIdx === -1) {
      // Try to find by description prefix
      matchIdx = dbList.findIndex(db => db.description.substring(0, 50) === seed.description.substring(0, 50));
    }
    
    if (matchIdx !== -1) {
      dbList.splice(matchIdx, 1); // Remove matched to ensure 1-to-1
    } else {
      missing.push(seed);
    }
  }
  
  console.log(`Matched by 1-to-1. Missing count: ${missing.length}`);
  missing.forEach(m => console.log(`- ${m.title}`));
  
  console.log(`Unmatched in DB count: ${dbList.length}`);
  dbList.forEach(m => console.log(`- ${m.title}`));
}

findMissing();
