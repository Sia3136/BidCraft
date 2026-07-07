const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error('[mailer] SMTP connection FAILED:', err.message);
    if (process.env.SMTP_HOST === 'smtp.gmail.com') {
      console.log('[mailer] Using Gmail SMTP — ensure App Password is used, not account password');
    }
  } else {
    console.log('[mailer] SMTP connection verified — ready to send');
  }
});

async function sendOTPEmail(toEmail, otp) {
  await transporter.sendMail({
    from: `"BidCraft" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Your BidCraft verification code',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#2B2A28">Your verification code</h2>
        <p style="font-size:32px;font-weight:700;letter-spacing:8px;color:#C8643A">${otp}</p>
        <p style="color:#56524A">This code expires in 10 minutes. Do not share it with anyone.</p>
        <p style="color:#8A8478;font-size:13px">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}

module.exports = { sendOTPEmail };
