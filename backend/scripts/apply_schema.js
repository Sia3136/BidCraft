const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL not set in environment');
    process.exit(1);
  }

  const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: process.env.DB_SSL_REJECT !== 'false' } });
  try {
    await client.connect();
    const sqlPath = path.join(__dirname, '..', 'db', 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('Applying schema from', sqlPath);
    try {
      // Execute function definition separately to avoid quoting/parsing ambiguities,
      // then execute the remainder of the schema.
      const marker = '$$ LANGUAGE plpgsql;';
      const idx = sql.indexOf(marker);
      if (idx !== -1) {
        const part1 = sql.slice(0, idx + marker.length);
        const part2 = sql.slice(idx + marker.length);
        await client.query(part1);
        try {
          await client.query(part2);
          console.log('Schema applied successfully');
        } catch (err2) {
          console.error('Migration failed during second part:', err2.message || err2);
          if (err2.position) {
            const pos = parseInt(err2.position, 10);
            const contextStart = Math.max(0, pos - 80);
            const contextEnd = Math.min(sql.length, pos + 80);
            console.error('Error context:', sql.slice(contextStart, contextEnd));
          }
          process.exit(1);
        }
      } else {
        await client.query(sql);
        console.log('Schema applied successfully');
      }
    } catch (err) {
      console.error('Migration failed:', err.message || err);
      process.exit(1);
    }
    await client.end();
  } catch (err) {
    console.error('Migration failed:', err.message || err);
    process.exit(1);
  }
}

run();
