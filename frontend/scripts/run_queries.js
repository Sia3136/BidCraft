const jwt = require('jsonwebtoken');

const token = jwt.sign({ userId: 1027 }, 'dev_secret_change_me');
console.log('Generated token:', token);

async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session_token=${token}`
      },
      body: JSON.stringify({ listing_id: 1311087969 })
    });
    console.log('Status:', res.status);
    const body = await res.text();
    console.log('Response body:', body);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
test();
