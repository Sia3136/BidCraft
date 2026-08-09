/**
 * emailService.js
 * Handles sending transactional emails using Resend (all environments).
 * Falls back to SMTP only if RESEND_API_KEY is not set.
 */

const { Resend } = require('resend');
const nodemailer = require('nodemailer');

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || 'BidCraft <onboarding@resend.dev>';

// SMTP fallback — only used if Resend is not configured
let smtpTransporter = null;
if (!RESEND_API_KEY && process.env.NODE_ENV !== 'test') {
  smtpTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: (process.env.SMTP_PASS || '').replace(/\s/g, ''),
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false
    }
  });
  smtpTransporter.verify((err) => {
    if (err) {
      console.error('[emailService] SMTP verification FAILED:', err.message);
    } else {
      console.log('[emailService] SMTP connection verified');
    }
  });
} else if (RESEND_API_KEY) {
  console.log('[emailService] Using Resend for email delivery');
}

async function sendEmail({ to, subject, text, html, ctaLink, ctaText }) {
  const { isDevelopmentMockEnabled } = require('../utils/mockHelper');
  if (isDevelopmentMockEnabled('email')) {
    console.log(`[EMAIL MOCK]
To: ${to}
Subject: ${subject}
Text Body: ${text}
CTA: ${ctaText} -> ${ctaLink}
-----------------------------------------`);
    return { success: true, mock: true };
  }

  const frontendUrl = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
  const fullCtaLink = ctaLink ? (ctaLink.startsWith('http') ? ctaLink : `${frontendUrl}${ctaLink}`) : null;

  const defaultHtml = `
    <div style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p style="white-space: pre-wrap;">${text}</p>
      ${fullCtaLink ? `
      <div style="margin-top: 30px;">
        <a href="${fullCtaLink}" style="background-color: #E25E3E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">${ctaText || 'View Details'}</a>
      </div>` : ''}
    </div>
  `;

  try {
    if (resend) {
      // Resend — works in all environments with valid API key
      const data = await resend.emails.send({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html: html || defaultHtml
      });

      if (data.error) {
        console.error('[emailService] Resend delivery error:', data.error);
        throw new Error(data.error.message);
      }
      console.log(`[emailService] Resend email sent to ${to}`);
      return { success: true, data };
    } else if (smtpTransporter) {
      const info = await smtpTransporter.sendMail({
        from: FROM_EMAIL,
        to,
        subject,
        text,
        html: html || defaultHtml
      });
      console.log(`[emailService] SMTP email sent to ${to} — MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } else {
      throw new Error('No email transport configured (RESEND_API_KEY or SMTP required)');
    }
  } catch (err) {
    console.error('[emailService] Email delivery FAILED:', err.message, err.code || '');
    throw err;
  }
}

module.exports = { sendEmail };
