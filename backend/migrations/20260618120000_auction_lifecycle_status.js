/* pgm:no-transaction */
// ALTER TYPE ... ADD VALUE cannot run inside a transaction.
// node-pg-migrate skips wrapping this file in BEGIN/COMMIT when
// the first line contains the no-transaction pragma above.

exports.up = (pgm) => {
  pgm.sql(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_enum
        WHERE enumlabel = 'scheduled'
          AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'auction_status')
      ) THEN
        ALTER TYPE auction_status ADD VALUE 'scheduled' BEFORE 'active';
      END IF;
    END$$;
  `);

  pgm.sql(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_enum
        WHERE enumlabel = 'ended'
          AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'auction_status')
      ) THEN
        ALTER TYPE auction_status ADD VALUE 'ended' AFTER 'active';
      END IF;
    END$$;
  `);
};

exports.down = (pgm) => {
  // PostgreSQL does not support removing enum values in older versions.
  // Safe no-op — re-running down won't break anything.
  pgm.sql('SELECT 1; -- cannot remove enum values in PostgreSQL');
};
