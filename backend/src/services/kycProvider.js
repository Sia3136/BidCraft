/**
 * kycProvider.js
 * Pluggable provider for PAN and Bank Account validation.
 */

const KYC_API_KEY = process.env.KYC_API_KEY || '';

/**
 * Verify PAN Number
 */
async function verifyPAN(panNumber) {
  const { isDevelopmentMockEnabled } = require('../utils/mockHelper');
  if (isDevelopmentMockEnabled('kyc')) {
    console.log(`[DEV MOCK][KYC] Verifying PAN: ${panNumber}`);
    // Simulate valid if length is 10
    return { 
      isValid: panNumber && panNumber.length === 10,
      name: 'MOCK USER'
    };
  }

  // Placeholder for real provider integration (e.g. Setu, Razorpay KYC)
  return { isValid: true, name: 'REAL USER' };
}

/**
 * Verify Bank Account and IFSC
 */
async function verifyBank(accountNumber, ifsc) {
  const { isDevelopmentMockEnabled } = require('../utils/mockHelper');
  if (isDevelopmentMockEnabled('kyc')) {
    console.log(`[DEV MOCK][KYC] Verifying Bank Account: ${accountNumber}, IFSC: ${ifsc}`);
    return {
      isValid: accountNumber && accountNumber.length > 5 && ifsc && ifsc.length > 3,
      beneficiaryName: 'MOCK USER'
    };
  }

  // Placeholder for real penny-drop / bank verification API
  return { isValid: true, beneficiaryName: 'REAL USER' };
}

module.exports = { verifyPAN, verifyBank };
