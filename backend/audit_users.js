require('dotenv').config();
const db = require('./src/utils/db');

async function auditUsers() {
  const result = await db.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'users';
  `);
  console.log("USERS COLUMNS:");
  console.log(result.rows);
  
  process.exit(0);
}

auditUsers().catch(err => {
  console.error(err);
  process.exit(1);
});
