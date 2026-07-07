const axios = require('axios');

async function sendOTPSMS(mobile, otp) {
  const phone = mobile.startsWith('+') ? mobile : `+91${mobile}`;
  
  if (process.env.MSG91_AUTH_KEY) {
    console.log(`[sms] Sending via MSG91 to ${phone}`);
    await axios.post('https://api.msg91.com/api/v5/otp', {
      template_id: process.env.MSG91_TEMPLATE_ID,
      mobile: phone,
      otp,
    }, {
      headers: {
        authkey: process.env.MSG91_AUTH_KEY,
        'Content-Type': 'application/json',
      }
    });
  } else if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    console.log(`[sms] Sending via Twilio to ${phone}`);
    const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await twilio.messages.create({
      body: `Your BidCraft verification code is ${otp}`,
      from: process.env.TWILIO_PHONE,
      to: phone
    });
  } else {
    console.log('[sms] No SMS provider configured — OTP will be logged to console only');
    console.log(`[sms] To: ${phone} | OTP: ${otp}`);
  }
}

module.exports = { sendOTPSMS };
