const fs = require('fs');
const path = require('path');

exports.up = (pgm) => {
  const sqlPath = path.join(__dirname, '..', 'db', 'schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  pgm.sql(sql);
};

exports.down = (pgm) => {
  // For fresh deployments this will drop the public schema and recreate it.
  pgm.sql(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
};
