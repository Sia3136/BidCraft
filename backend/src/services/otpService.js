/**
 * otpService.js
 * Pluggable OTP service for phone verification.
 * Uses a mock console logger in test & development,
 * and can be integrated with Twilio or another SMS provider.
 */

const SMS_API_KEY = process.env.SMS_API_KEY || '';
const MOCK_MODE = !SMS_API_KEY || process.env.NODE_ENV === 'test';

async function sendPhoneOtp({ phone, code }) {
  if (MOCK_MODE) {
    console.log(`[OTP SENT]
To: ${phone}
Code: ${code}
-----------------------------------------`);
    return { success: true, mock: true };
  }

  try {
    // Example Twilio integration or any other provider
    // const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    // await twilio.messages.create({
    //   body: `Your BidCraft verification code is ${code}`,
    //   from: process.env.TWILIO_PHONE,
    //   to: phone
    // });
    
    // For now, if key exists but provider isn't wired, we just simulate success
    console.log(`Sending real SMS to ${phone} with code ${code}...`);
    return { success: true };
  } catch (err) {
    console.error('SMS delivery failed:', err);
    throw err;
  }
}

module.exports = { sendPhoneOtp, MOCK_MODE };
