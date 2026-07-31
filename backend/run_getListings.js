require('dotenv').config();
const { getListings } = require('./src/controllers/listingsController');
async function run() {
  const req = { query: { limit: '25', offset: '0' } };
  const res = {
    status: (code) => ({ json: (data) => console.log('HTTP', code, data) }),
    json: (data) => console.log('HTTP 200', data)
  };
  await getListings(req, res);
  process.exit(0);
}
run();
