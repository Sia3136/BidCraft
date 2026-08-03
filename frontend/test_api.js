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
  const listing = await fetchUrl('http://localhost:8000/api/listings/593');
  const all = await fetchUrl('http://localhost:8000/api/listings?limit=5');
  console.log('listing sellerId:', listing.sellerId);
  console.log('all listings sellerIds:', all.listings.map(l => l.sellerId));
}
run();
