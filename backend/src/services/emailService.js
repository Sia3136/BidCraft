/**
 * emailService.js
 * Handles sending transactional emails using Resend.
 */

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || 'BidCraft <siarozani3136@gmail.com>';

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
  } catch (err) {
    console.error('Email delivery failed:', err);
    throw err;
  }
}

module.exports = { sendEmail };
