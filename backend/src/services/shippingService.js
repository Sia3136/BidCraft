/**
 * shippingService.js
 * Pluggable abstraction for shipping providers (Shiprocket, Delhivery, etc).
 */

const delhiveryService = require('./delhiveryService');

/**
 * Generate a mock or real tracking number and label for an order.
 */
async function createShipment(orderDetails) {
  const { isDevelopmentMockEnabled } = require('../utils/mockHelper');
  if (isDevelopmentMockEnabled('shipping')) {
    const trackingNumber = `MOCK_TRK_${Date.now()}`;
    return {
      success: true,
      tracking_number: trackingNumber,
      carrier: 'Mock Post',
      label_url: `https://example.com/labels/${trackingNumber}.pdf`,
      status: 'shipped'
    };
  }

  // Integration with Shiprocket/Delhivery goes here
  throw new Error('shipping_provider_not_configured');
}

/**
 * Check tracking status (could be called via webhook or polling).
 */
async function getTrackingStatus(trackingNumber, carrier) {
  const { isDevelopmentMockEnabled } = require('../utils/mockHelper');
  if (isDevelopmentMockEnabled('shipping')) {
    // In mock mode, we just say it's in transit or delivered randomly if polled
    return {
      status: 'in_transit',
      location: 'Sorting Facility',
      timestamp: new Date()
    };
  }
  
  if (carrier === 'Delhivery') {
    return await delhiveryService.trackShipment(trackingNumber);
  }
  
  throw new Error('shipping_provider_not_configured');
}

module.exports = {
  createShipment,
  getTrackingStatus
};
