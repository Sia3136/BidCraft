const crypto = require('crypto');
const http = require('http');

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_secret';
const PORT = process.env.PORT || 8000;

// Example payload for a captured payment
const payload = {
  entity: "event",
  account_id: "acc_Test123",
  event: "payment.captured",
  contains: ["payment"],
  payload: {
    payment: {
      entity: {
        id: "pay_MockPayment" + Date.now(),
        entity: "payment",
        amount: 10000,
        currency: "INR",
        status: "captured",
        order_id: process.argv[2] || "order_MockRazorpayOrder",
        notes: {
          bidcraft_order_id: process.argv[3] || "1"
        }
      }
    }
  },
  created_at: Math.floor(Date.now() / 1000)
};

const payloadString = JSON.stringify(payload);
const signature = crypto.createHmac('sha256', WEBHOOK_SECRET).update(payloadString).digest('hex');

const options = {
  hostname: 'localhost',
  port: PORT,
  path: '/api/payments/webhook',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payloadString),
    'x-razorpay-signature': signature
  }
};

console.log('Sending webhook simulation to localhost...');
const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { console.log(`RESPONSE: ${data}`); });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(payloadString);
req.end();
