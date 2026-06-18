/**
 * paymentService.js
 * Razorpay integration wrapper.
 * Mock mode: when RAZORPAY_KEY_ID is absent or 'test', uses deterministic fake responses.
 */
const crypto = require('crypto');

const KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const MOCK_MODE = !KEY_ID || KEY_ID === 'test' || process.env.NODE_ENV === 'test';

let razorpayInstance = null;

function getRazorpay() {
  if (MOCK_MODE) return null;
  if (!razorpayInstance) {
    const Razorpay = require('razorpay');
    razorpayInstance = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });
  }
  return razorpayInstance;
}

/**
 * Create a Razorpay payment order.
 * @param {{ amount: number, currency: string, receipt: string, notes: object }} opts
 * @returns {Promise<{ id: string, amount: number, currency: string, status: string }>}
 */
async function createOrder({ amount, currency = 'INR', receipt, notes = {} }) {
  if (MOCK_MODE) {
    return {
      id: `mock_rporder_${Date.now()}`,
      amount: Math.round(amount * 100),
      currency,
      status: 'created'
    };
  }
  const rp = getRazorpay();
  const order = await rp.orders.create({
    amount: Math.round(amount * 100), // paise
    currency,
    receipt: receipt || `rcpt_${Date.now()}`,
    notes
  });
  return order;
}

/**
 * Verify Razorpay payment signature.
 * @param {{ razorpay_order_id, razorpay_payment_id, razorpay_signature }} params
 * @returns {boolean}
 */
function verifySignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  if (MOCK_MODE) {
    // In mock mode, accept any signature that matches our known mock format
    const expectedMock = `mock_sig_${razorpay_order_id}_${razorpay_payment_id}`;
    return razorpay_signature === expectedMock;
  }
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto
    .createHmac('sha256', KEY_SECRET)
    .update(body)
    .digest('hex');
  return expected === razorpay_signature;
}

/**
 * Verify Razorpay webhook signature.
 * @param {string} rawBody - Raw request body string
 * @param {string} signature - X-Razorpay-Signature header
 * @param {string} secret - Webhook secret (separate from API secret)
 * @returns {boolean}
 */
function verifyWebhookSignature(rawBody, signature, secret) {
  if (MOCK_MODE) return true;
  const expected = crypto
    .createHmac('sha256', secret || KEY_SECRET)
    .update(rawBody)
    .digest('hex');
  return expected === signature;
}

module.exports = { createOrder, verifySignature, verifyWebhookSignature, MOCK_MODE };
