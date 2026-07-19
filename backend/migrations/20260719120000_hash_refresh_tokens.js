const crypto = require('crypto');

exports.up = async pgm => {
  // Fetch existing plaintext tokens (length 80 from crypto.randomBytes(40).toString('hex'))
  const { rows } = await pgm.db.query("SELECT token FROM refresh_tokens WHERE length(token) = 80");
  
  for (const row of rows) {
    const hashedToken = crypto.createHash('sha256').update(row.token).digest('hex');
    await pgm.db.query("UPDATE refresh_tokens SET token = $1 WHERE token = $2", [hashedToken, row.token]);
  }
};

exports.down = async pgm => {
  // Hashing is irreversible without a backup table.
  // We cannot reconstruct the 80-character plaintext token from the 64-character hash.
};
