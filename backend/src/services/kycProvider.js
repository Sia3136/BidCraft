/**
 * kycProvider.js
 * Pluggable provider for PAN and Bank Account validation.
 */

const KYC_API_KEY = process.env.KYC_API_KEY || '';
const MOCK_MODE = !KYC_API_KEY || process.env.NODE_ENV === 'test';

/**
 * Verify PAN Number
 */
async function verifyPAN(panNumber) {
  if (MOCK_MODE) {
    console.log(`[MOCK KYC] Verifying PAN: ${panNumber}`);
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
  if (MOCK_MODE) {
    console.log(`[MOCK KYC] Verifying Bank Account: ${accountNumber}, IFSC: ${ifsc}`);
    return {
      isValid: accountNumber && accountNumber.length > 5 && ifsc && ifsc.length > 3,
      beneficiaryName: 'MOCK USER'
    };
  }

  // Placeholder for real penny-drop / bank verification API
  return { isValid: true, beneficiaryName: 'REAL USER' };
}

module.exports = { verifyPAN, verifyBank, MOCK_MODE };
