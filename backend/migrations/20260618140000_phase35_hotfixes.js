exports.up = (pgm) => {
  // 1. Add updated_at column to disputes table
  pgm.sql(`
    ALTER TABLE disputes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
  `);

  // 2. Attach updated_at trigger to disputes table
  pgm.sql(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at') THEN
        BEGIN
          CREATE TRIGGER disputes_updated_at BEFORE UPDATE ON disputes FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
        EXCEPTION WHEN duplicate_object THEN NULL; END;
      END IF;
    END$$;
  `);

  // 3. Convert auctions.start_time and auctions.end_time to TIMESTAMPTZ
  pgm.sql(`
    ALTER TABLE auctions
      ALTER COLUMN start_time TYPE TIMESTAMPTZ USING start_time AT TIME ZONE 'UTC',
      ALTER COLUMN end_time TYPE TIMESTAMPTZ USING end_time AT TIME ZONE 'UTC';
  `);
};

exports.down = (pgm) => {
  // 1. Revert auctions time columns to TIMESTAMP
  pgm.sql(`
    ALTER TABLE auctions
      ALTER COLUMN start_time TYPE TIMESTAMP,
      ALTER COLUMN end_time TYPE TIMESTAMP;
  `);

  // 2. Drop updated_at trigger from disputes table
  pgm.sql(`
    DROP TRIGGER IF EXISTS disputes_updated_at ON disputes;
  `);

  // 3. Drop updated_at column from disputes table
  pgm.sql(`
    ALTER TABLE disputes DROP COLUMN IF EXISTS updated_at;
  `);
};
