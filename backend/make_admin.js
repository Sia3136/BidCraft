require('dotenv').config();
const db = require('./src/utils/db');

async function makeAdmin() {
  try {
    console.log('Connecting to db...');
    const result = await db.query(
      `UPDATE users SET role = 'admin' WHERE email = 'siarozani3136@gmail.com' RETURNING id, email, role`
    );
    if (result.rows.length > 0) {
      console.log('Successfully updated user to admin:', result.rows[0]);
    } else {
      console.log('User not found. Could not update role. You might need to sign up with this email first.');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

makeAdmin();
