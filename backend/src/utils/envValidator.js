/**
 * envValidator.js
 * Validates the presence of required environment variables at startup.
 */

function validateEnvironment() {
  if (process.env.NODE_ENV === 'test') {
    // Inject test defaults to avoid breaking test suites
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';
    process.env.CRON_SECRET = process.env.CRON_SECRET || 'test_cron_secret';
    process.env.RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'test_razor_key_id';
    process.env.RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'test_razor_key';
    process.env.RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_razor_webhook';
    return;
  }

  const requiredEnvVars = [
    'JWT_SECRET',
    'CRON_SECRET',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'RAZORPAY_WEBHOOK_SECRET'
    // Note: Other keys like CLOUDINARY_URL, RESEND_API_KEY could be added here
    // based on full production requirements.
  ];

  const missing = [];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    console.error('FATAL: The following required environment variables are missing:');
    missing.forEach(v => console.error(` - ${v}`));
    console.error('Server refuses to start. Please configure them in .env');
    process.exit(1);
  }
}

module.exports = {
  validateEnvironment
};
