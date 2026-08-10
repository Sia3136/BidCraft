const fs = require('fs');

function findMissing() {
  const seedCode = fs.readFileSync('../scripts/archive/seedListings.js', 'utf8');
  const jsonStrMatch = seedCode.match(/const products = \[\] = (\[.*?\]);/s);
  const originalSeed = eval(jsonStrMatch[1]);
  
  const currentDB = JSON.parse(fs.readFileSync('full_dump.json', 'utf8'));
  const fakeListings = currentDB.filter(l => new Date(l.created_at) >= new Date('2026-07-26'));
  const fakeTitles = fakeListings.map(l => l.title);
  
  const originalDBListings = currentDB.filter(l => !fakeTitles.includes(l.title));
  
  console.log(`Original DB count: ${originalDBListings.length}`);
  console.log(`Original Seed count: ${originalSeed.length}`);
  
  // Try to match each seed listing to a DB listing, allowing for title changes
  // We can match by description, or by original ID if IDs are preserved.
  // Wait, does full_dump.json have slug? Let's match by slug if possible!
  // Or match by ID!
  // Let's see if original DB listings have the same IDs.
  
  const originalDbIds = originalDBListings.map(l => l.id.toString());
  
  // Seed listings have string IDs like "exp-003", maybe they don't match the DB int IDs.
  // Let's match by description prefix (first 50 chars).
  
  const dbDesc = originalDBListings.map(l => l.description.substring(0, 50));
  
  let missing = [];
  for (const seed of originalSeed) {
    const sDesc = seed.description.substring(0, 50);
    if (!dbDesc.includes(sDesc)) {
      missing.push(seed);
    }
  }
  
  console.log(`Matched by description. Missing count: ${missing.length}`);
  missing.forEach(m => console.log(`- ${m.title}`));
}

findMissing();
