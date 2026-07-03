const { Pool } = require('pg');

let connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/bidcraft';

// Ensure connection string safely includes sslmode=verify-full for production to avoid SSL warnings
if (process.env.NODE_ENV === 'production') {
  if (connectionString.includes('sslmode=')) {
    connectionString = connectionString.replace(/sslmode=[^&]+/, 'sslmode=verify-full');
  } else {
    connectionString += connectionString.includes('?') ? '&sslmode=verify-full' : '?sslmode=verify-full';
  }
}

const poolConfig = { connectionString };

poolConfig.ssl = {
  rejectUnauthorized: true
};

const pool = new Pool(poolConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
