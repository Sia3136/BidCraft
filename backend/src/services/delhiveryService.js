const DELIVERY_API_KEY = process.env.DELIVERY_API_KEY || process.env.DELHIVERY_API_KEY;
const BASE_URL = 'https://track.delhivery.com/api/v1/packages/json';

async function trackShipment(waybill) {
  if (!DELIVERY_API_KEY) {
    throw new Error('DELIVERY_API_KEY not configured');
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const response = await fetch(`${BASE_URL}?waybill=${waybill}&token=${DELIVERY_API_KEY}`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 404) throw new Error('shipment_not_found');
      throw new Error('delhivery_api_error');
    }
    
    const data = await response.json();
    
    if (!data || !data.ShipmentData || data.ShipmentData.length === 0) {
      throw new Error('shipment_not_found');
    }
    
    const shipment = data.ShipmentData[0].Shipment;
    const scans = shipment.Scans || [];
    
    return {
      trackingNumber: shipment.AWB,
      carrier: 'Delhivery',
      status: shipment.Status?.Status || 'Unknown',
      statusType: shipment.Status?.StatusType || 'Unknown',
      currentLocation: shipment.Status?.StatusLocation || '',
      expectedDelivery: shipment.ExpectedDeliveryDate || null,
      scans: scans.map(scan => ({
        timestamp: scan.Scan?.ScanDateTime,
        location: scan.Scan?.ScannedLocation,
        status: scan.Scan?.Scan,
        instructions: scan.Scan?.Instructions
      })).filter(s => s.status)
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('api_timeout');
    }
    throw error;
  }
}

module.exports = { trackShipment };
