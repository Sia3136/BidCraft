const db = require('../utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

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
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.query('INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)', [refreshToken, user.id, expiresAt]);
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
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.query('INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)', [refreshToken, user.id, expiresAt]);
    
    res.json({ user: { id: user.id, email: user.email, name: user.name }, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

async function googleLogin(req, res, next) {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'token_required' });

    let payload;
    if (token.startsWith('mock_token_') && (process.env.NODE_ENV === 'test' || !GOOGLE_CLIENT_ID)) {
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
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.query('INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)', [refreshTokenStr, user.id, expiresAt]);

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
  if (refreshToken) {
    await db.query('DELETE FROM refresh_tokens WHERE token=$1', [refreshToken]);
  }
  res.json({ success: true });
}

async function refreshToken(req, res, next) {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'token_required' });
    
    const result = await db.query('SELECT user_id, expires_at FROM refresh_tokens WHERE token=$1', [token]);
    const rt = result.rows[0];
    if (!rt) return res.status(401).json({ error: 'invalid_refresh_token' });
    
    if (new Date() > new Date(rt.expires_at)) {
      await db.query('DELETE FROM refresh_tokens WHERE token=$1', [token]);
      return res.status(401).json({ error: 'refresh_token_expired' });
    }
    
    const accessToken = jwt.sign({ userId: rt.user_id }, JWT_SECRET, { expiresIn: '15m' });
    const newRefreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    await db.query('DELETE FROM refresh_tokens WHERE token=$1', [token]);
    await db.query('INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)', [newRefreshToken, rt.user_id, expiresAt]);
    
    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, googleLogin, me, logout, refreshToken };
