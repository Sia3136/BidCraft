const db = require('../utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');

const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

function setSessionCookie(res, token) {
  res.cookie('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000
  });
}

async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email_password_required' });
    const hashed = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (email, password_hash, name, created_at, updated_at) VALUES ($1,$2,$3,NOW(),NOW()) RETURNING id, email, name',
      [email, hashed, name || null]
    );
    const user = result.rows[0];
    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.query('INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)', [hashedRefreshToken, user.id, expiresAt]);
    setSessionCookie(res, accessToken);
    res.json({ user, accessToken, refreshToken });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'email_taken' });
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email_password_required' });
    const result = await db.query('SELECT id, email, password_hash, name FROM users WHERE email=$1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'invalid_credentials' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'invalid_credentials' });
    
    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.query('INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)', [hashedRefreshToken, user.id, expiresAt]);
    
    setSessionCookie(res, accessToken);
    res.json({ user: { id: user.id, email: user.email, name: user.name }, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

async function googleLogin(req, res, next) {
  try {
    const { token } = req.body;
    if (!token || typeof token !== 'string') return res.status(400).json({ error: 'invalid_token' });

    let payload;
    if (token.startsWith('mock_token_') && process.env.NODE_ENV === 'test') {
      const userId = token.replace('mock_token_', '');
      payload = {
        sub: `google_mock_id_${userId}`,
        email: `google_mock_${userId}@example.com`,
        name: `Google Mock User ${userId}`,
        picture: 'https://example.com/avatar.png'
      };
    } else {
      if (!googleClient) {
        return res.status(500).json({ error: 'google_oauth_not_configured' });
      }
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID
      });
      payload = ticket.getPayload();
    }

    const { sub: googleId, email, name, picture: avatarUrl } = payload;

    let userResult = await db.query('SELECT id, email, name, role, avatar_url, google_id FROM users WHERE google_id=$1 OR email=$2', [googleId, email]);
    let user = userResult.rows[0];

    if (user) {
      if (!user.google_id) {
        await db.query('UPDATE users SET google_id=$1, avatar_url=COALESCE(avatar_url, $2), updated_at=NOW() WHERE id=$3', [googleId, avatarUrl, user.id]);
        user.google_id = googleId;
        user.avatar_url = user.avatar_url || avatarUrl;
      }
    } else {
      const createResult = await db.query(
        'INSERT INTO users (email, google_id, name, avatar_url, role, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,NOW(),NOW()) RETURNING id, email, name, role, avatar_url',
        [email, googleId, name, avatarUrl, 'buyer']
      );
      user = createResult.rows[0];
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });
    const refreshTokenStr = crypto.randomBytes(40).toString('hex');
    const hashedRefreshToken = crypto.createHash('sha256').update(refreshTokenStr).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.query('INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)', [hashedRefreshToken, user.id, expiresAt]);

    setSessionCookie(res, accessToken);
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role, avatarUrl: user.avatar_url }, accessToken, refreshToken: refreshTokenStr });
  } catch (err) {
    if (err.message && err.message.includes('verifyIdToken')) {
      return res.status(401).json({ error: 'invalid_google_token' });
    }
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const userId = req.userId;
    const result = await db.query('SELECT id, email, name, avatar_url, role FROM users WHERE id=$1', [userId]);
    if (!result.rows[0]) return res.status(404).json({ error: 'not_found' });
    res.json({ user: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  // If the client sends the refresh token to logout, delete it
  const { refreshToken } = req.body;
  if (refreshToken && typeof refreshToken === 'string') {
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await db.query('DELETE FROM refresh_tokens WHERE token=$1', [hashedToken]);
  }
  res.clearCookie('session_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.json({ success: true });
}

async function refreshToken(req, res, next) {
  try {
    const { token } = req.body;
    if (!token || typeof token !== 'string') return res.status(400).json({ error: 'invalid_token' });
    
    const hashedIncomingToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      
      // Atomically find and delete the token to prevent race conditions (duplicate sessions)
      const result = await client.query('DELETE FROM refresh_tokens WHERE token=$1 RETURNING user_id, expires_at', [hashedIncomingToken]);
      const rt = result.rows[0];
      
      if (!rt) {
        await client.query('ROLLBACK');
        return res.status(401).json({ error: 'invalid_refresh_token' });
      }
      
      if (new Date() > new Date(rt.expires_at)) {
        await client.query('ROLLBACK');
        return res.status(401).json({ error: 'refresh_token_expired' });
      }
      
      const accessToken = jwt.sign({ userId: rt.user_id }, JWT_SECRET, { expiresIn: '15m' });
      const newRefreshToken = crypto.randomBytes(40).toString('hex');
      const hashedNewRefreshToken = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      await client.query('INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)', [hashedNewRefreshToken, rt.user_id, expiresAt]);
      await client.query('COMMIT');
      
      setSessionCookie(res, accessToken);
      res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
}

const { sendOTPEmail } = require('../utils/mailer');
const { sendOTPSMS } = require('../utils/sms');

async function sendVerification(req, res, next) {
  try {
    const userId = req.userId;
    const userRes = await db.query('SELECT email FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0];
    if (!user) return res.status(404).json({ error: 'user_not_found' });

    // Check if already verified
    const profileRes = await db.query('SELECT is_verified FROM profiles WHERE user_id = $1', [userId]);
    if (profileRes.rows[0]?.is_verified) {
      return res.status(400).json({ error: 'already_verified' });
    }

    // Generate 6 digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await db.query(
      'INSERT INTO verification_codes (user_id, code, expires_at, purpose) VALUES ($1, $2, $3, $4)',
      [userId, hashedOtp, expiresAt, 'email_verification']
    );

    const logger = require('../utils/logger');
    logger.info('OTP generated', { userId, purpose: 'email_verification' });

    await sendOTPEmail(user.email, otp);

    res.json({ success: true, message: 'verification_sent' });
  } catch (err) {
    next(err);
  }
}

async function verifyEmail(req, res, next) {
  try {
    const userId = req.userId;
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'code_required' });

    const hashedOtp = crypto.createHash('sha256').update(code).digest('hex');
    const codeRes = await db.query(
      'SELECT * FROM verification_codes WHERE user_id = $1 AND purpose = $2 ORDER BY created_at DESC LIMIT 1',
      [userId, 'email_verification']
    );
    const vCode = codeRes.rows[0];

    const logger = require('../utils/logger');
    if (!vCode) {
      logger.warn('OTP verification failed', { userId, purpose: 'email_verification' });
      return res.status(400).json({ error: 'invalid_code' });
    }
    if (new Date() > new Date(vCode.expires_at)) {
      return res.status(400).json({ error: 'code_expired' });
    }

    const providedBuffer = Buffer.from(hashedOtp);
    const storedBuffer = Buffer.from(vCode.code);
    if (providedBuffer.length !== storedBuffer.length || !crypto.timingSafeEqual(providedBuffer, storedBuffer)) {
      logger.warn('OTP verification failed', { userId, purpose: 'email_verification' });
      return res.status(400).json({ error: 'invalid_code' });
    }

    // Mark email as checked, but do not set is_verified=TRUE yet (must do phone next)
    await db.query(`
      INSERT INTO profiles (user_id, is_verified, created_at, updated_at) 
      VALUES ($1, FALSE, NOW(), NOW()) 
      ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW()
    `, [userId]);

    // Delete used codes
    await db.query('DELETE FROM verification_codes WHERE user_id = $1 AND purpose = $2', [userId, 'email_verification']);

    res.json({ success: true, message: 'verified' });
  } catch (err) {
    next(err);
  }
}

async function sendPhoneVerification(req, res, next) {
  try {
    const userId = req.userId;
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'phone_required' });

    // Check if already verified
    const profileRes = await db.query('SELECT is_verified FROM profiles WHERE user_id = $1', [userId]);
    if (profileRes.rows[0]?.is_verified) {
      return res.status(400).json({ error: 'already_verified' });
    }

    // Generate 6 digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await db.query(
      'INSERT INTO verification_codes (user_id, code, expires_at, purpose) VALUES ($1, $2, $3, $4)',
      [userId, hashedOtp, expiresAt, 'phone_verification']
    );

    const logger = require('../utils/logger');
    logger.info('OTP generated', { userId, purpose: 'phone_verification' });

    // Update profile with the phone number
    await db.query(
      `INSERT INTO profiles (user_id, phone, created_at, updated_at) 
       VALUES ($1, $2, NOW(), NOW()) 
       ON CONFLICT (user_id) DO UPDATE SET phone = $2, updated_at = NOW()`,
      [userId, phone]
    );

    await sendOTPSMS(phone, otp);

    res.json({ success: true, message: 'verification_sent' });
  } catch (err) {
    next(err);
  }
}

async function verifyPhone(req, res, next) {
  try {
    const userId = req.userId;
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'code_required' });

    const hashedOtp = crypto.createHash('sha256').update(code).digest('hex');
    const codeRes = await db.query(
      'SELECT * FROM verification_codes WHERE user_id = $1 AND purpose = $2 ORDER BY created_at DESC LIMIT 1',
      [userId, 'phone_verification']
    );
    const vCode = codeRes.rows[0];

    const logger = require('../utils/logger');
    if (!vCode) {
      logger.warn('OTP verification failed', { userId, purpose: 'phone_verification' });
      return res.status(400).json({ error: 'invalid_code' });
    }
    if (new Date() > new Date(vCode.expires_at)) {
      return res.status(400).json({ error: 'code_expired' });
    }

    const providedBuffer = Buffer.from(hashedOtp);
    const storedBuffer = Buffer.from(vCode.code);
    if (providedBuffer.length !== storedBuffer.length || !crypto.timingSafeEqual(providedBuffer, storedBuffer)) {
      logger.warn('OTP verification failed', { userId, purpose: 'phone_verification' });
      return res.status(400).json({ error: 'invalid_code' });
    }

    // Mark as verified
    await db.query(`
      INSERT INTO profiles (user_id, is_verified, created_at, updated_at) 
      VALUES ($1, TRUE, NOW(), NOW()) 
      ON CONFLICT (user_id) DO UPDATE SET is_verified = TRUE, updated_at = NOW()
    `, [userId]);

    // Delete used codes
    await db.query('DELETE FROM verification_codes WHERE user_id = $1 AND purpose = $2', [userId, 'phone_verification']);

    res.json({ success: true, message: 'verified' });
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters' });
    }
    const result = await db.query(
      `UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email`,
      [name.trim(), req.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updatePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Invalid passwords provided. Minimum 6 characters.' });
    }
    const userRes = await db.query('SELECT password_hash FROM users WHERE id=$1', [req.userId]);
    const user = userRes.rows[0];
    if (!user) return res.status(404).json({ error: 'user_not_found' });
    
    const match = await bcrypt.compare(currentPassword, user.password_hash);
    if (!match) return res.status(400).json({ error: 'Incorrect current password' });
    
    const hashed = await bcrypt.hash(newPassword, 10);
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hashed, req.userId]);
      await client.query('DELETE FROM refresh_tokens WHERE user_id = $1', [req.userId]);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
    
    res.clearCookie('session_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    res.json({ success: true, message: 'Password updated. Please log in again.' });
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email_required' });
    const userRes = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    const user = userRes.rows[0];
    
    // Always return success to prevent enumeration
    res.json({ success: true, message: 'If the email exists, a password reset link has been sent.' });

    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

      await db.query(
        'INSERT INTO verification_codes (user_id, code, expires_at, purpose) VALUES ($1, $2, $3, $4)',
        [user.id, hashedToken, expiresAt, 'password_reset']
      );

      const logger = require('../utils/logger');
      logger.info('Password reset requested', { userId: user.id });

      const emailService = require('../services/emailService');
      await emailService.sendEmail({
        to: email,
        subject: 'Password Reset',
        text: `Your password reset token is: ${token}\n\nIt expires in 15 minutes.`
      });
    }
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const codeRes = await db.query(
      'SELECT user_id, code, expires_at FROM verification_codes WHERE purpose = $1 AND code = $2 ORDER BY created_at DESC LIMIT 1',
      ['password_reset', hashedToken]
    );
    const vCode = codeRes.rows[0];
    
    const logger = require('../utils/logger');
    if (!vCode || new Date() > new Date(vCode.expires_at)) {
      if (vCode) logger.warn('Password reset failed - expired', { userId: vCode.user_id });
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const providedBuffer = Buffer.from(hashedToken);
    const storedBuffer = Buffer.from(vCode.code);
    if (providedBuffer.length !== storedBuffer.length || !crypto.timingSafeEqual(providedBuffer, storedBuffer)) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const hashedPwd = await bcrypt.hash(newPassword, 10);
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hashedPwd, vCode.user_id]);
      await client.query('DELETE FROM verification_codes WHERE user_id = $1 AND purpose = $2', [vCode.user_id, 'password_reset']);
      await client.query('DELETE FROM refresh_tokens WHERE user_id = $1', [vCode.user_id]);
      await client.query('COMMIT');
      
      logger.info('Password reset completed', { userId: vCode.user_id });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
    
    res.clearCookie('session_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, googleLogin, me, logout, refreshToken, sendVerification, verifyEmail, sendPhoneVerification, verifyPhone, updateMe, updatePassword, forgotPassword, resetPassword };
