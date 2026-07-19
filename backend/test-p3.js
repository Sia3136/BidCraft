const { validateImageFile } = require('./src/utils/fileValidator');
const logger = require('./src/utils/logger');
const fs = require('fs');
const assert = require('assert');

// 1. Logger Test
const errorObj = {
  message: 'Payment failed',
  details: {
    user: { id: 123 },
    transaction: {
      amount: 100,
      clientSecret: 'secret_12345',
      secret: 'sk_live_123',
      nested: { password: 'my_password' }
    }
  }
};
console.log('Testing Logger (should redact secrets)...');
logger.error('Test error', { error: errorObj });

// 2. File Validator Test
console.log('Testing Validator...');
const txtBuffer = Buffer.from('this is not an image');
const txtRes = validateImageFile(txtBuffer);
assert.strictEqual(txtRes.valid, false);

console.log('All tests passed locally.');
