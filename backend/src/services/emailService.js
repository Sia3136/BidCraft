/**
 * emailService.js
 * Handles sending transactional emails.
 * Uses a mock console logger in test & development,
 * and SendGrid if SENDGRID_API_KEY is present.
 */

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@bidcraft.com';

async function sendEmail({ to, subject, text, html }) {
  if (!SENDGRID_API_KEY || process.env.NODE_ENV === 'test') {
    // Mock mode / console logger
    console.log(`[EMAIL SENT]
To: ${to}
Subject: ${subject}
Text Body: ${text}
-----------------------------------------`);
    return { success: true, mock: true };
  }

  try {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(SENDGRID_API_KEY);
    const msg = {
      to,
      from: FROM_EMAIL,
      subject,
      text,
      html
    };
    await sgMail.send(msg);
    return { success: true };
  } catch (err) {
    console.error('Email delivery failed:', err);
    throw err;
  }
}

module.exports = { sendEmail };
