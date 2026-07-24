const http = require('http');

async function testFilter(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json;
        try {
          json = JSON.parse(data);
        } catch(e) {
          json = { error: 'Invalid JSON', data };
        }
        resolve({
          status: res.statusCode,
          count: json.listings ? json.listings.length : 0,
          first3: json.listings ? json.listings.slice(0,3).map(l => ({
            id: l.numericId, title: l.title, collections: l.collections, occasions: l.occasions
          })) : json
        });
      });
    }).on('error', (err) => resolve({ error: err.message }));
  });
}

async function run() {
  const tests = [
    'http://localhost:8000/api/listings?search=vintage',
    'http://localhost:8000/api/listings?collection=vintage-retro',
    'http://localhost:8000/api/listings?collection=modern-minimalist',
    'http://localhost:8000/api/listings?collection=traditional-arts',
    'http://localhost:8000/api/listings?gift=birthdays',
    'http://localhost:8000/api/listings?gift=anniversaries',
    'http://localhost:8000/api/listings?gift=housewarming',
    'http://localhost:8000/api/listings?gift=just-because',
  ];

  for (const url of tests) {
    console.log(`\nTesting: ${url}`);
    const result = await testFilter(url);
    console.log(JSON.stringify(result, null, 2));
  }
}

run();
