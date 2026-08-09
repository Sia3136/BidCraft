const { Pool } = require('pg');
const logger = require('./logger');

let connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/bidcraft';

// Ensure connection string safely includes sslmode=verify-full for production to avoid SSL warnings
if (process.env.NODE_ENV === 'production') {
  if (connectionString.includes('sslmode=')) {
    connectionString = connectionString.replace(/sslmode=[^&]+/, 'sslmode=verify-full');
  } else {
    connectionString += connectionString.includes('?') ? '&sslmode=verify-full' : '?sslmode=verify-full';
  }
}

const poolConfig = {
  connectionString,
  // Neon serverless drops idle connections after ~5min.
  // Keep pool idle timeout below that so pg-pool reaps idle clients
  // before Neon terminates them, preventing unhandled ECONNRESET crashes.
  idleTimeoutMillis: 30000,      // release idle client after 30s
  connectionTimeoutMillis: 10000, // give up acquiring new client after 10s
  max: 10
};

poolConfig.ssl = {
  rejectUnauthorized: true
};

const pool = new Pool(poolConfig);

// CRITICAL: handle pool-level errors so a dropped idle connection (Neon
// serverless behaviour) does not emit an unhandled 'error' event and crash Node.
pool.on('error', (err, client) => {
  logger.error('[db] Idle client error — connection dropped by server', { message: err.message });
  // Do NOT re-throw. The pool will remove the client automatically.
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
