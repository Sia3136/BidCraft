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
 * @param {{ amount: number, currency: string, receipt: string, notes: object, transfers?: object[] }} opts
 * @returns {Promise<{ id: string, amount: number, currency: string, status: string }>}
 */
async function createOrder({ amount, currency = 'INR', receipt, notes = {}, transfers }) {
  if (MOCK_MODE) {
    return {
      id: `mock_rporder_${Date.now()}`,
      amount: Math.round(amount * 100),
      currency,
      status: 'created'
    };
  }
  const rp = getRazorpay();
  const payload = {
    amount: Math.round(amount * 100), // paise
    currency,
    receipt: receipt || `rcpt_${Date.now()}`,
    notes
  };
  if (transfers && transfers.length > 0) {
    payload.transfers = transfers;
  }
  const order = await rp.orders.create(payload);
  return order;
}

/**
 * Create a direct transfer from a captured payment or account balance.
 */
async function createTransfer(paymentId, { account, amount, currency = 'INR', notes = {}, on_hold = false }) {
  if (MOCK_MODE) {
    return { id: `mock_tr_${Date.now()}`, entity: 'transfer', amount: Math.round(amount * 100) };
  }
  const rp = getRazorpay();
  // If paymentId is provided, transfer from that payment.
  // Otherwise, direct transfer from account balance.
  const payload = {
    account,
    amount: Math.round(amount * 100),
    currency,
    notes,
    on_hold
  };
  
  if (paymentId) {
    return await rp.payments.transfer(paymentId, payload);
  } else {
    return await rp.transfers.create(payload);
  }
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

/**
 * Create a Razorpay Customer.
 */
async function createCustomer({ name, email, phone }) {
  if (MOCK_MODE) {
    return { id: `mock_cust_${Date.now()}`, name, email, contact: phone };
  }
  const rp = getRazorpay();
  return await rp.customers.create({
    name,
    email,
    contact: phone || undefined
  });
}

/**
 * Fetch details of a Razorpay Payment.
 */
async function fetchPayment(paymentId) {
  if (MOCK_MODE) {
    return {
      id: paymentId,
      status: 'authorized',
      amount: 500,
      currency: 'INR',
      customer_id: 'mock_cust_123',
      token_id: `mock_tok_${Date.now()}`
    };
  }
  const rp = getRazorpay();
  return await rp.payments.fetch(paymentId);
}

module.exports = {
  createOrder,
  createTransfer,
  verifySignature,
  verifyWebhookSignature,
  createCustomer,
  fetchPayment,
  MOCK_MODE
};
