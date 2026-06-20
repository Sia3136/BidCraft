/**
 * shippingService.js
 * Pluggable abstraction for shipping providers (Shiprocket, Delhivery, etc).
 */

const MOCK_MODE = !process.env.SHIPROCKET_API_KEY || process.env.NODE_ENV === 'test';

/**
 * Generate a mock or real tracking number and label for an order.
 */
async function createShipment(orderDetails) {
  if (MOCK_MODE) {
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
  if (MOCK_MODE) {
    // In mock mode, we just say it's in transit or delivered randomly if polled
    return {
      status: 'in_transit',
      location: 'Sorting Facility',
      timestamp: new Date()
    };
  }
  
  throw new Error('shipping_provider_not_configured');
}

module.exports = {
  createShipment,
  getTrackingStatus,
  MOCK_MODE
};
