const fs = require('fs');

function reconcile() {
  // 1. Read seedListings.js
  const seedCode = fs.readFileSync('../scripts/archive/seedListings.js', 'utf8');
  let originalSeed = [];
  try {
    const jsonStrMatch = seedCode.match(/const products = \[\] = (\[.*?\]);/s);
    if (jsonStrMatch) {
      originalSeed = eval(jsonStrMatch[1]);
    }
  } catch (e) {
    console.error('Error parsing seedListings:', e);
  }

  // 2. Read dump.json (current DB state)
  const currentDB = JSON.parse(fs.readFileSync('full_dump.json', 'utf8'));

  // 3. Identify fake listings (created_at on or after July 26th)
  const fakeListings = currentDB.filter(l => l.created_at.includes('2026-07-26') || new Date(l.created_at) >= new Date('2026-07-26'));
  const fakeTitles = fakeListings.map(l => l.title);

  // 4. Identify confirmed original DB listings
  const originalDBListings = currentDB.filter(l => !fakeTitles.includes(l.title));

  // 5. Compare titles to find missing or modified
  const currentOriginalTitles = originalDBListings.map(l => l.title.trim());
  const seedTitles = originalSeed.map(s => s.title.trim());

  const missingFromDB = originalSeed.filter(s => !currentOriginalTitles.includes(s.title.trim()));
  
  console.log(`| Source | Count |`);
  console.log(`|---|---:|`);
  console.log(`| Archive seed listings | ${originalSeed.length} |`);
  console.log(`| Current DB | ${currentDB.length} |`);
  console.log(`| Confirmed original DB listings | ${originalDBListings.length} |`);
  console.log(`| Confirmed fake listings | ${fakeListings.length} |`);
  console.log(`| Missing original listings (titles not in DB) | ${missingFromDB.length} |`);

  console.log('\n--- Fake Listings ---');
  fakeListings.forEach(f => console.log(`${f.id}: ${f.title}`));

  console.log('\n--- Missing/Modified Original Listings ---');
  missingFromDB.forEach(m => console.log(`Missing: ${m.title}`));
}

reconcile();
