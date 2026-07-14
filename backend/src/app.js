require('dotenv').config();

if (process.env.NODE_ENV !== 'test') {
  const requiredEnvVars = ['JWT_SECRET', 'CRON_SECRET', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_WEBHOOK_SECRET'];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`FATAL: ${envVar} environment variable is missing.`);
    }
  }
} else {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';
  process.env.CRON_SECRET = process.env.CRON_SECRET || 'test_cron_secret';
  process.env.RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'test_razor_key';
  process.env.RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_razor_webhook';
}

const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const logger = require('./utils/logger');
const db = require('./utils/db');

const authRoutes      = require('./routes/auth');
const listingsRoutes  = require('./routes/listings');
const auctionsRoutes  = require('./routes/auctions');
const imagesRoutes    = require('./routes/images');
const profileRoutes   = require('./routes/profile');
const usersRoutes     = require('./routes/users');
const ordersRoutes    = require('./routes/orders');
const paymentsRoutes  = require('./routes/payments');
const reviewsRoutes   = require('./routes/reviews');
const disputesRoutes  = require('./routes/disputes');
const wishlistRoutes  = require('./routes/wishlist');
const followsRoutes   = require('./routes/follows');
const notificationsRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');
const shipmentsRoutes = require('./routes/shipments');
const qaRoutes = require('./routes/qa');
const creatorsRoutes = require('./routes/creators');
const cartRoutes = require('./routes/cart');
const sellerRoutes = require('./routes/seller');
const escrowRoutes = require('./routes/escrow');
const offersRoutes = require('./routes/offers');
const cronRoutes = require('./routes/cron');

const app = express();
app.use(helmet());
app.use(cookieParser());

const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, { stream: { write: message => logger.info(message.trim()) } }));

// Capture raw body for Razorpay webhook signature verification
app.use((req, res, next) => {
  if (req.path === '/api/payments/webhook') {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      req.rawBody = data;
      try { req.body = JSON.parse(data); } catch (e) { req.body = {}; }
      next();
    });
  } else {
    express.json()(req, res, next);
  }
});

app.use(cors({
  origin: process.env.FRONTEND_URL || process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

app.get('/', (req, res) => {
  res.json({
    name: 'BidCraft API',
    version: '0.1.0',
    environment: process.env.NODE_ENV || 'development',
    healthEndpoint: '/api/health'
  });
});

app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', uptime: process.uptime() });
  } catch (err) {
    logger.error('Health check failed', err);
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});
app.use('/api/auth',      authRoutes);
app.use('/api/listings',  listingsRoutes);
app.use('/api/auctions',  auctionsRoutes);
app.use('/api/images',    imagesRoutes);
app.use('/api/profile',   profileRoutes);
app.use('/api/users',     usersRoutes);
app.use('/api/orders',    ordersRoutes);
app.use('/api/payments',  paymentsRoutes);
app.use('/api/reviews',   reviewsRoutes);
app.use('/api/disputes',  disputesRoutes);
app.use('/api/wishlist',  wishlistRoutes);
app.use('/api',           followsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/shipments', shipmentsRoutes);
app.use('/api/qa',        qaRoutes);
app.use('/api/creators',  creatorsRoutes);
app.use('/api/cart',      cartRoutes);
app.use('/api/seller',    sellerRoutes);
app.use('/api/escrow',    escrowRoutes);
app.use('/api/offers',    offersRoutes);
app.use('/api/cron',      cronRoutes);

app.use((err, req, res, next) => {
  logger.error(err.message || 'internal_error', { error: err, stack: err.stack });
  res.status(err.status || 500).json({ error: err.message || 'internal_error' });
});

module.exports = app;
