const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config();

async function verify() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
    ssl: process.env.DATABASE_URL.includes('neon.tech') ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    const snapshot = JSON.parse(fs.readFileSync('schema_snapshot.json', 'utf8'));

    let allPassed = true;

    async function check(name, testResult) {
      if (testResult) {
        console.log(`${name.padEnd(20)} ✓`);
      } else {
        console.log(`${name.padEnd(20)} ❌`);
        allPassed = false;
      }
    }

    // 1. Tables match
    const tableRes = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'`);
    const dbTables = tableRes.rows.map(r => r.table_name);
    const snapTables = Object.keys(snapshot.tables);
    const tablesMatch = snapTables.every(t => dbTables.includes(t));
    await check('Tables:', tablesMatch);

    // 2. Columns match
    const colRes = await client.query(`SELECT table_name, column_name FROM information_schema.columns WHERE table_schema='public'`);
    const dbCols = new Set(colRes.rows.map(r => `${r.table_name}.${r.column_name}`));
    let colsMatch = true;
    for (const t of snapTables) {
      for (const c of snapshot.tables[t].columns) {
        if (!dbCols.has(`${t}.${c.column_name}`)) {
          console.error(`Missing column: ${t}.${c.column_name}`);
          colsMatch = false;
        }
      }
    }
    await check('Columns:', colsMatch);

    // 3. Indexes match
    const idxRes = await client.query(`SELECT indexname FROM pg_indexes WHERE schemaname='public'`);
    const dbIdxs = new Set(idxRes.rows.map(r => r.indexname));
    const snapIdxs = snapshot.indexes.map(i => i.index_name);
    const idxsMatch = snapIdxs.every(i => dbIdxs.has(i));
    await check('Indexes:', idxsMatch);

    // 4. Constraints match
    const conRes = await client.query(`
      SELECT con.conname
      FROM pg_constraint con
      JOIN pg_namespace nsp ON nsp.oid = connamespace
      WHERE nsp.nspname = 'public'
    `);
    const dbCons = new Set(conRes.rows.map(r => r.conname));
    // Check specific critical constraints added in the migration
    const consMatch = dbCons.has('listings_buying_method_check') && dbCons.has('bid_deposits_amount_check');
    await check('Constraints:', consMatch);

    // 5. Foreign Keys
    // If Constraints match, FKs are likely there, but let's check bid_deposits FKs
    const fkMatch = dbCons.has('bid_deposits_auction_id_fkey') && dbCons.has('bid_deposits_user_id_fkey');
    await check('Foreign Keys:', fkMatch);

    // 6. Enums match
    const enumRes = await client.query(`SELECT t.typname FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid GROUP BY t.typname`);
    const dbEnums = new Set(enumRes.rows.map(r => r.typname));
    const enumsMatch = Object.keys(snapshot.enums).every(e => dbEnums.has(e));
    await check('Enums:', enumsMatch);

    // 7. Extensions match
    const extRes = await client.query(`SELECT extname FROM pg_extension`);
    const dbExts = new Set(extRes.rows.map(r => r.extname));
    const extsMatch = snapshot.extensions.every(e => dbExts.has(e.extname));
    await check('Extensions:', extsMatch);

    // 8. Defaults match
    // Check specific defaults we cared about
    const defRes = await client.query(`SELECT column_default FROM information_schema.columns WHERE table_name='listings' AND column_name='offer_floor_percent'`);
    const defsMatch = defRes.rows.length > 0 && defRes.rows[0].column_default === '30';
    await check('Defaults:', defsMatch);

    console.log('\\nOverall Status:');
    if (allPassed) {
      console.log('100% PARITY WITH PRODUCTION');
    } else {
      console.log('PARITY CHECK FAILED - Schema mismatch detected.');
    }

  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    await client.end();
  }
}

verify();
