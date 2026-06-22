const { Pool } = require('pg');

let connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/bidcraft';
let sslRequired = false;

if (connectionString.includes('?sslmode=require')) {
  connectionString = connectionString.replace('?sslmode=require', '');
  sslRequired = true;
} else if (connectionString.includes('&sslmode=require')) {
  connectionString = connectionString.replace('&sslmode=require', '');
  sslRequired = true;
}

const poolConfig = { connectionString };

// Enable SSL in production via env var or if URL specifies it. For Neon or managed PG, this is required.
if (process.env.DB_SSL === 'true' || sslRequired) {
  poolConfig.ssl = {
    // By default, allow rejecting unauthorized based on env var; set DB_SSL_REJECT=false for self-signed certs
    rejectUnauthorized: process.env.DB_SSL_REJECT !== 'false'
  };
}

const pool = new Pool(poolConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
