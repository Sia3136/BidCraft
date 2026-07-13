const fs = require('fs');

function parseListings() {
  const text = fs.readFileSync('C:/Bidcraft/frontend/extracted_listings.txt', 'utf8');
  const listings = [];
  let currentListing = {};
  
  const lines = text.split('\n');
  for (const line of lines) {
    if (line.match(/^\d+\.\s+title:/) || line.match(/^\d+\.\s+public_id:/)) {
      if (Object.keys(currentListing).length > 0) {
        listings.push(currentListing);
      }
      currentListing = {};
    }
    
    // Extract key-value pairs
    const kvMatch = line.match(/^(?:\d+\.\s+)?\s*([a-zA-Z_]+):\s*(.*)/);
    if (kvMatch) {
      let key = kvMatch[1];
      let value = kvMatch[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      // Handle inline tags like: tags: [x, y, z]
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.substring(1, value.length - 1).split(',').map(s => s.trim());
      } else if (!isNaN(Number(value)) && value !== '') {
        value = Number(value);
      } else if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      }
      
      currentListing[key] = value;
    }
    
    // Handle inline properties like listing_type: buy_now · price: 850 · offers_allowed: false
    if (line.includes('·')) {
      const parts = line.split('·').map(p => p.trim());
      for (const p of parts) {
        const pMatch = p.match(/^([a-zA-Z_]+):\s*(.*)/);
        if (pMatch) {
          let k = pMatch[1];
          let v = pMatch[2].trim();
          if (v === 'true') v = true;
          else if (v === 'false') v = false;
          else if (!isNaN(Number(v)) && v !== '') v = Number(v);
          currentListing[k] = v;
        }
      }
    }
  }
  if (Object.keys(currentListing).length > 0) {
    listings.push(currentListing);
  }

  fs.writeFileSync('C:/Bidcraft/frontend/scripts/seed_data.json', JSON.stringify(listings, null, 2));
  console.log('Wrote ' + listings.length + ' listings');
}

parseListings();
