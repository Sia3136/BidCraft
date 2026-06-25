const createOrder = jest.fn(async ({ amount, currency = 'INR', receipt, notes = {}, transfers }) => ({
  id: `mock_rporder_${Date.now()}`,
  amount: Math.round(amount * 100),
  currency,
  status: 'created'
}));

const createTransfer = jest.fn(async (paymentId, { account, amount, currency = 'INR', notes = {}, on_hold = false }) => ({
  id: `mock_tr_${Date.now()}`, entity: 'transfer', amount: Math.round(amount * 100)
}));

const verifySignature = jest.fn(({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  return razorpay_signature === `mock_sig_${razorpay_order_id}_${razorpay_payment_id}`;
});

const verifyWebhookSignature = jest.fn(() => true);

const createCustomer = jest.fn(async ({ name, email, phone }) => ({
  id: `mock_cust_${Date.now()}`, name, email, contact: phone
}));

const fetchPayment = jest.fn(async (paymentId) => ({
  id: paymentId, status: 'authorized', amount: 500, currency: 'INR',
  customer_id: 'mock_cust_123', token_id: `mock_tok_${Date.now()}`
}));

const refundPayment = jest.fn(async (paymentId, { amount, notes } = {}) => ({
  id: `mock_rfnd_${Date.now()}`, payment_id: paymentId, status: 'processed'
}));

module.exports = {
  createOrder,
  createTransfer,
  verifySignature,
  verifyWebhookSignature,
  createCustomer,
  fetchPayment,
  refundPayment
};
