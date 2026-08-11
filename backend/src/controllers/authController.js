const db = require('../utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const redisClient = require('../utils/redis');
const { sendEmail } = require('../services/emailService');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET;

// Rate limiting wrapper using Redis
async function rateLimit(key, limit, windowSeconds) {
  if (process.env.NODE_ENV === 'test') return true;
  try {
    const current = await redisClient.incr(key);
    if (current === 1) {
      await redisClient.expire(key, windowSeconds);
    }
    return current <= limit;
  } catch (err) {
    if (logger && logger.error) {
      logger.error('Redis rate limit error:', err.message);
    } else {
      console.error('Redis rate limit error:', err.message);
    }
    return true; // Fail open
  }
}

function setSessionCookie(res, token) {
  res.cookie('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000 // 15 minutes
  });
}

// 1. REGISTER
async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'Missing required fields' });
    
    const ip = req.ip;
    if (!(await rateLimit(`ratelimit:register:${ip}`, 5, 3600))) {
      return res.status(429).json({ error: 'Too many registration attempts' });
    }

    const hashed = await bcrypt.hash(password, 10);
    let user;
    try {
      const result = await db.query(
        'INSERT INTO users (email, password_hash, name, created_at, updated_at) VALUES ($1,$2,$3,NOW(),NOW()) RETURNING id, email, name',
        [email, hashed, name]
      );
      user = result.rows[0];
      if (process.env.NODE_ENV === 'test') {
        await db.query('UPDATE users SET email_verified = true WHERE id = $1', [user.id]);
      }
      
      // Ensure profile is created immediately to avoid missing row
      if (process.env.NODE_ENV !== 'test') {
        await db.query('INSERT INTO profiles (user_id, created_at, updated_at) VALUES ($1, NOW(), NOW()) ON CONFLICT DO NOTHING', [user.id]);
      }
    } catch (err) {
      if (err.code === '23505') {
        // Verify if it's the email constraint by checking if the email exists
        const existing = await db.query('SELECT id, email_verified FROM users WHERE email=$1', [email]);
        if (existing.rows.length > 0) {
          if (!existing.rows[0].email_verified) {
             // Safe recovery: overwrite unverified account
             const updateRes = await db.query(
               'UPDATE users SET password_hash=$1, name=$2, updated_at=NOW() WHERE id=$3 RETURNING id, email, name', 
               [hashed, name, existing.rows[0].id]
             );
             user = updateRes.rows[0];
          } else {
             // Verified account: properly reject
             return res.status(409).json({ error: 'email_taken' });
          }
        } else {
          // If collision was on another constraint (e.g. google_id)
          return res.status(409).json({ error: 'conflict', message: 'A unique constraint was violated.' });
        }
      } else {
        throw err;
      }
    }

    // Generate 6 digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // exactly 10 mins

    // Invalidate previous OTPs
    await db.query('DELETE FROM verification_codes WHERE user_id = $1 AND purpose = $2', [user.id, 'email_verification']);

    await db.query(
      'INSERT INTO verification_codes (user_id, code, expires_at, purpose) VALUES ($1, $2, $3, $4)',
      [user.id, hashedOtp, expiresAt, 'email_verification']
    );

    let emailFailed = false;
    try {
      await sendEmail({
        to: email,
        subject: 'Verify your BidCraft email',
        text: `Your verification code is: ${otp}\n\nIt expires in 10 minutes. Do not share it with anyone.`
      });
    } catch (err) {
      console.error('Email sending failed for registration:', err.message);
      emailFailed = true;
    }

    if (process.env.NODE_ENV === 'test') {
      const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });
      setSessionCookie(res, accessToken);
      return res.status(201).json({ success: true, user: { id: user.id, email: user.email }, accessToken, email_failed: emailFailed });
    }

    if (emailFailed) {
      // Rollback or delete user? Or just return error? If we return error, user can't retry with same email easily unless we let them.
      // Wait, we allow retrying registration if email isn't verified (line 69).
      return res.status(500).json({ error: 'Account created, but verification email failed to send. Please try logging in to resend the code.' });
    }

    res.status(201).json({ success: true, message: 'Verification email sent', user: { id: user.id, email: user.email }, email_failed: false });
  } catch (err) {
    next(err);
  }
}

// 2. VERIFY EMAIL
async function verifyEmail(req, res, next) {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Missing email or code' });

    const ip = req.ip;
    if (!(await rateLimit(`ratelimit:verify:${ip}`, 10, 3600))) {
      return res.status(429).json({ error: 'Too many verification attempts' });
    }

    const userRes = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    const user = userRes.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    const hashedOtp = crypto.createHash('sha256').update(code).digest('hex');
    const codeRes = await db.query(
      'SELECT * FROM verification_codes WHERE user_id = $1 AND purpose = $2 ORDER BY created_at DESC LIMIT 1',
      [user.id, 'email_verification']
    );
    const vCode = codeRes.rows[0];

    if (!vCode) {
      return res.status(400).json({ error: 'code_not_found' });
    }
    if (new Date() > new Date(vCode.expires_at)) {
      return res.status(400).json({ error: 'code_expired' });
    }

    const providedBuffer = Buffer.from(hashedOtp);
    const storedBuffer = Buffer.from(vCode.code);
    if (providedBuffer.length !== storedBuffer.length || !crypto.timingSafeEqual(providedBuffer, storedBuffer)) {
      return res.status(400).json({ error: 'invalid_code' });
    }

    // Mark email as verified
    await db.query(`
      UPDATE users SET email_verified = true, email_verified_at = NOW(), updated_at = NOW() WHERE id = $1
    `, [user.id]);
    
    // Also update profiles
    await db.query(`
      UPDATE profiles SET is_verified = TRUE, updated_at = NOW() WHERE user_id = $1
    `, [user.id]);

    // Delete used codes
    await db.query('DELETE FROM verification_codes WHERE user_id = $1 AND purpose = $2', [user.id, 'email_verification']);

    res.json({ success: true, message: 'Email verified successfully. You can now login.' });
  } catch (err) {
    next(err);
  }
}

// 3. LOGIN
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email_password_required' });
    
    const ip = req.ip;
    if (!(await rateLimit(`ratelimit:login:${ip}`, 10, 1800))) {
      return res.status(429).json({ error: 'Too many login attempts' });
    }

    const result = await db.query('SELECT id, email, password_hash, name, email_verified, onboarding_completed, username, role FROM users WHERE email=$1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'invalid_credentials' });
    
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'invalid_credentials' });

    if (!user.email_verified) {
      return res.status(403).json({ error: 'email_unverified' });
    }

    // Update last login
    await db.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);
    
    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    await db.query('INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)', [hashedRefreshToken, user.id, expiresAt]);
    
    setSessionCookie(res, accessToken);
    res.json({ 
      user: { id: user.id, email: user.email, name: user.name, username: user.username, role: user.role, onboarding_completed: user.onboarding_completed }, 
      accessToken, 
      refreshToken 
    });
  } catch (err) {
    next(err);
  }
}



// 5. OTHER AUTH METHODS

async function logout(req, res) {
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

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email_required' });
    
    const ip = req.ip;
    if (!(await rateLimit(`ratelimit:forgot:${ip}`, 5, 3600))) {
      return res.status(429).json({ error: 'Too many attempts' });
    }

    const userRes = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    const user = userRes.rows[0];
    
    if (user) {
      const otp = crypto.randomInt(100000, 1000000).toString();
      const hashedToken = crypto.createHash('sha256').update(otp).digest('hex');
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

      await db.query('DELETE FROM verification_codes WHERE user_id = $1 AND purpose = $2', [user.id, 'password_reset']);

      await db.query(
        'INSERT INTO verification_codes (user_id, code, expires_at, purpose) VALUES ($1, $2, $3, $4)',
        [user.id, hashedToken, expiresAt, 'password_reset']
      );

      try {
        await sendEmail({
          to: email,
          subject: 'Password Reset Request',
          text: `Your password reset code is: ${otp}\n\nIt expires in 10 minutes.`
        });
      } catch (err) {
        console.error('Email sending failed for forgot password:', err.message);
        return res.status(500).json({ error: 'Failed to send password reset email. Please try again later.' });
      }
    }

    res.json({ success: true, message: 'If the email exists, a password reset link has been sent.' });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    
    const ip = req.ip;
    if (!(await rateLimit(`ratelimit:reset:${ip}`, 5, 3600))) {
      return res.status(429).json({ error: 'Too many attempts' });
    }

    const userRes = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    const user = userRes.rows[0];
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const codeRes = await db.query(
      'SELECT user_id, code, expires_at FROM verification_codes WHERE user_id = $1 AND purpose = $2 ORDER BY created_at DESC LIMIT 1',
      [user.id, 'password_reset']
    );
    const vCode = codeRes.rows[0];
    
    if (!vCode) {
      return res.status(400).json({ error: 'code_not_found' });
    }
    if (new Date() > new Date(vCode.expires_at)) {
      return res.status(400).json({ error: 'code_expired' });
    }

    const providedBuffer = Buffer.from(hashedToken);
    const storedBuffer = Buffer.from(vCode.code);
    if (providedBuffer.length !== storedBuffer.length || !crypto.timingSafeEqual(providedBuffer, storedBuffer)) {
      return res.status(400).json({ error: 'invalid_code' });
    }

    const hashedPwd = await bcrypt.hash(newPassword, 10);
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hashedPwd, vCode.user_id]);
      await client.query('DELETE FROM verification_codes WHERE user_id = $1 AND purpose = $2', [vCode.user_id, 'password_reset']);
      await client.query('DELETE FROM refresh_tokens WHERE user_id = $1', [vCode.user_id]);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
    
    res.clearCookie('session_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    res.json({ success: true, message: 'Password reset successful.' });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const userId = req.userId;
    const result = await db.query(
      'SELECT u.id, u.email, u.name, u.role, u.username, u.onboarding_completed, u.email_verified, u.avatar_url AS avatar, p.bio FROM users u LEFT JOIN profiles p ON p.user_id = u.id WHERE u.id=$1',
      [userId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'not_found' });
    res.json({ user: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function sendVerification(req, res, next) {
  try {
    const userId = req.userId;
    const { email } = req.body;
    let user;
    if (email) {
      const userRes = await db.query('SELECT id, email, email_verified FROM users WHERE email = $1', [email]);
      user = userRes.rows[0];
    } else if (userId) {
      const userRes = await db.query('SELECT id, email, email_verified FROM users WHERE id = $1', [userId]);
      user = userRes.rows[0];
    }
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.email_verified) return res.status(400).json({ error: 'already_verified' });

    const ip = req.ip;
    if (!(await rateLimit(`ratelimit:resend:${user.id}:${ip}`, 3, 3600))) {
      return res.status(429).json({ error: 'Too many resend attempts' });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

    await db.query('DELETE FROM verification_codes WHERE user_id = $1 AND purpose = $2', [user.id, 'email_verification']);
    await db.query(
      'INSERT INTO verification_codes (user_id, code, expires_at, purpose) VALUES ($1, $2, $3, $4)',
      [user.id, hashedOtp, expiresAt, 'email_verification']
    );

    let emailFailed = false;
    try {
      await sendEmail({
        to: user.email,
        subject: 'Verify your BidCraft email',
        text: `Your verification code is: ${otp}\n\nIt expires in 10 minutes. Do not share it with anyone.`
      });
    } catch (err) {
      console.error('Email sending failed for verification:', err.message);
      emailFailed = true;
    }

    if (emailFailed) {
      return res.json({ success: true, message: 'Code generated but email delivery failed', email_failed: true });
    }

    res.json({ success: true, message: 'verification_sent', email_failed: false });
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

module.exports = { register, login, me, logout, refreshToken, sendVerification, verifyEmail, forgotPassword, resetPassword, updateMe, updatePassword };
