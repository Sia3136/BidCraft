const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/bidcraft';

const poolConfig = { connectionString };

// Enable SSL in production via env var. For Neon or managed PG, set DB_SSL=true.
if (process.env.DB_SSL === 'true') {
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
