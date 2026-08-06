const axios = require('axios');

async function invalidateCache(paths = [], tags = []) {
  try {
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
    await axios.post(`${FRONTEND_URL}/api/revalidate`, { paths, tags }, { timeout: 2000 });
  } catch (error) {
    console.error('Failed to invalidate cache:', error.message);
  }
}

module.exports = { invalidateCache };
