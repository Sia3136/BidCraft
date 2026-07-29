/**
 * emailService.js
 * Handles sending transactional emails using Resend.
 */

const { Resend } = require('resend');
const nodemailer = require('nodemailer');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || 'BidCraft <siarozani3136@gmail.com>';

let smtpTransporter = null;
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  smtpTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendEmail({ to, subject, text, html, ctaLink, ctaText }) {
  if (process.env.NODE_ENV === 'test') {
    console.log(`[EMAIL SENT]
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
    if (process.env.NODE_ENV === 'production') {
      const data = await resend.emails.send({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html: html || defaultHtml
      });
      
      if (data.error) {
        console.error('Email delivery error from Resend:', data.error);
        throw new Error(data.error.message);
      }
      return { success: true, data };
    } else {
      if (!smtpTransporter) throw new Error('SMTP transporter not configured');
      const info = await smtpTransporter.sendMail({
        from: FROM_EMAIL,
        to,
        subject,
        text,
        html: html || defaultHtml
      });
      console.log(`[SMTP EMAIL SENT] MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    }
  } catch (err) {
    console.error('Email delivery failed:', err);
    throw err;
  }
}

module.exports = { sendEmail };
