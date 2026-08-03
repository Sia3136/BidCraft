const http = require('http');

function fetchUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });
}

async function run() {
  const all = await fetchUrl('http://localhost:8000/api/listings?limit=100');
  const counts = {};
  for (const l of all.listings) {
    counts[l.sellerId] = (counts[l.sellerId] || 0) + 1;
  }
  console.log(counts);
}
run();
