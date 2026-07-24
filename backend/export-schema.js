const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config();

async function getSnapshot() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 30000,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to Neon PostgreSQL database...');
    await client.connect();
    console.log('Connected successfully. Gathering schema snapshot...');

    const snapshot = {};

    // 1. PostgreSQL Version
    const versionRes = await client.query('SELECT version();');
    snapshot.version = versionRes.rows[0].version;

    // 2. Extensions
    const extRes = await client.query('SELECT extname, extversion FROM pg_extension;');
    snapshot.extensions = extRes.rows;

    // 3. Enums
    const enumRes = await client.query(`
      SELECT t.typname, e.enumlabel, e.enumsortorder
      FROM pg_enum e
      JOIN pg_type t ON e.enumtypid = t.oid
      ORDER BY t.typname, e.enumsortorder;
    `);
    const enums = {};
    for (const row of enumRes.rows) {
      if (!enums[row.typname]) enums[row.typname] = [];
      enums[row.typname].push(row.enumlabel);
    }
    snapshot.enums = enums;

    // 4. Tables and Columns
    const colRes = await client.query(`
      SELECT table_name, column_name, data_type, udt_name, 
             character_maximum_length, numeric_precision, numeric_scale, 
             is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `);
    
    // 5. Table Row Counts (Approximate via pg_class to avoid locking/slow queries)
    const countRes = await client.query(`
      SELECT relname AS table_name, reltuples::bigint AS row_count
      FROM pg_class C
      LEFT JOIN pg_namespace N ON (N.oid = C.relnamespace)
      WHERE nspname = 'public' AND relkind = 'r'
      ORDER BY relname;
    `);
    const rowCounts = countRes.rows.reduce((acc, r) => ({ ...acc, [r.table_name]: r.row_count }), {});

    const tables = {};
    for (const row of colRes.rows) {
      if (!tables[row.table_name]) {
        tables[row.table_name] = {
          row_count: rowCounts[row.table_name] || 0,
          columns: []
        };
      }
      tables[row.table_name].columns.push({
        column_name: row.column_name,
        data_type: row.data_type,
        udt_name: row.udt_name,
        character_maximum_length: row.character_maximum_length,
        numeric_precision: row.numeric_precision,
        numeric_scale: row.numeric_scale,
        is_nullable: row.is_nullable,
        column_default: row.column_default
      });
    }
    snapshot.tables = tables;

    // 6. Constraints (Primary, Foreign, Unique, Check)
    const constraintRes = await client.query(`
      SELECT con.conname AS constraint_name,
             con.contype AS constraint_type,
             rel.relname AS table_name,
             pg_get_constraintdef(con.oid) AS definition
      FROM pg_constraint con
      JOIN pg_class rel ON rel.oid = con.conrelid
      JOIN pg_namespace nsp ON nsp.oid = connamespace
      WHERE nsp.nspname = 'public'
      ORDER BY rel.relname, con.contype, con.conname;
    `);
    snapshot.constraints = constraintRes.rows;

    // 7. Indexes
    const idxRes = await client.query(`
      SELECT tablename AS table_name, indexname AS index_name, indexdef AS definition
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname;
    `);
    snapshot.indexes = idxRes.rows;

    // 8. Triggers
    const triggerRes = await client.query(`
      SELECT event_object_table AS table_name, trigger_name, event_manipulation AS event,
             action_statement AS definition, action_timing AS timing
      FROM information_schema.triggers
      WHERE trigger_schema = 'public'
      ORDER BY event_object_table, trigger_name;
    `);
    snapshot.triggers = triggerRes.rows;

    // 9. Sequences
    const seqRes = await client.query(`
      SELECT sequence_name, data_type, start_value, minimum_value, maximum_value, increment
      FROM information_schema.sequences
      WHERE sequence_schema = 'public'
      ORDER BY sequence_name;
    `);
    snapshot.sequences = seqRes.rows;

    // 10. Views
    const viewRes = await client.query(`
      SELECT table_name AS view_name, view_definition
      FROM information_schema.views
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    snapshot.views = viewRes.rows;

    console.log('Writing snapshot to schema_snapshot.json...');
    fs.writeFileSync('schema_snapshot.json', JSON.stringify(snapshot, null, 2));
    console.log('Done! Snapshot saved to schema_snapshot.json');

  } catch (err) {
    console.error('\\n=== DATABASE INTROSPECTION FAILED ===');
    console.error('Message:', err.message);
    console.error('Code:', err.code);
    console.error('Detail:', err.detail);
    console.error('Hint:', err.hint);
    console.error('Severity:', err.severity);
    console.error('Position:', err.position);
    console.error('Where:', err.where);
    console.error('Schema:', err.schema);
    console.error('Table:', err.table);
    console.error('Column:', err.column);
    console.error('Constraint:', err.constraint);
    console.error('\\nStack Trace:', err.stack);
    console.error('\\nFull Error Object:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    
    // Specifically handle AggregateError or missing message
    if (err instanceof AggregateError) {
      console.error('\\nAggregateError Caught:');
      err.errors.forEach((e, i) => {
        console.error(`Error ${i}:`, e.message);
        console.error(`Code ${i}:`, e.code);
        console.error(`Address ${i}:`, e.address);
        console.error(`Syscall ${i}:`, e.syscall);
      });
    }

    process.exit(1);
  } finally {
    await client.end();
  }
}

getSnapshot();
