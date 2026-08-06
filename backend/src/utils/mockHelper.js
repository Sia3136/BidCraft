/**
 * mockHelper.js
 * Standardized helper for checking if mock behavior should be enabled.
 * Mocks should ONLY be enabled in non-production environments when USE_MOCKS is 'true'.
 */

function isDevelopmentMockEnabled(serviceName) {
  if (process.env.NODE_ENV === 'test') {
    return true;
  }
  const isDev = process.env.NODE_ENV === 'development';
  const useMocks = process.env.USE_MOCKS === 'true';

  if (isDev && useMocks) {
    if (serviceName) {
      console.warn(`[DEV MOCK][${serviceName.toUpperCase()}] Using mock behavior`);
    }
    return true;
  }
  
  return false;
}

module.exports = {
  isDevelopmentMockEnabled
};
