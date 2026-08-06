/**
 * paymentService.js
 * Razorpay integration wrapper.
 * Mock mode: when RAZORPAY_KEY_ID is absent or 'test', uses deterministic fake responses.
 */
const crypto = require('crypto');

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;
let razorpayInstance = null;

function getRazorpay() {
  if (!razorpayInstance) {
    if (!KEY_ID || !KEY_SECRET) {
      throw new Error('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured. Set it in .env.');
    }
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
  const expected = crypto
    .createHmac('sha256', secret || WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');
  return expected === signature;
}

/**
 * Create a Razorpay Customer.
 */
async function createCustomer({ name, email, phone }) {
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
  const rp = getRazorpay();
  return await rp.payments.fetch(paymentId);
}

/**
 * Refund a Razorpay Payment.
 */
async function refundPayment(paymentId, { amount, notes } = {}) {
  const rp = getRazorpay();
  const payload = notes ? { notes } : {};
  if (amount) {
    payload.amount = Math.round(amount * 100);
  }
  return await rp.payments.refund(paymentId, payload);
}

module.exports = {
  createOrder,
  createTransfer,
  verifySignature,
  verifyWebhookSignature,
  createCustomer,
  fetchPayment,
  refundPayment
};
