/* pgm:no-transaction */
// ALTER TYPE ... ADD VALUE cannot run inside a transaction.

exports.up = (pgm) => {
  // 1. Add missing order_status value
  pgm.sql(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel='inspection'
        AND enumtypid=(SELECT oid FROM pg_type WHERE typname='order_status')) THEN
        ALTER TYPE order_status ADD VALUE 'inspection' AFTER 'delivered';
      END IF;
    END$$;
  `);

  // 2. Add missing escrow_status values
  const escrowStatuses = ['paid', 'shipped', 'delivered', 'inspection', 'refunded', 'disputed'];
  escrowStatuses.forEach(status => {
    pgm.sql(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel='${status}'
          AND enumtypid=(SELECT oid FROM pg_type WHERE typname='escrow_status')) THEN
          ALTER TYPE escrow_status ADD VALUE '${status}';
        END IF;
      END$$;
    `);
  });

  // 3. Add missing dispute_status value (under_review)
  pgm.sql(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel='under_review'
        AND enumtypid=(SELECT oid FROM pg_type WHERE typname='dispute_status')) THEN
        ALTER TYPE dispute_status ADD VALUE 'under_review' AFTER 'open';
      END IF;
    END$$;
  `);

  // 4. Create listing_questions table
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS listing_questions (
      id SERIAL PRIMARY KEY,
      listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
      asker_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      question TEXT NOT NULL,
      answer TEXT,
      answered_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      is_public BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      answered_at TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_listing_questions_listing_id ON listing_questions(listing_id);
    
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at') THEN
        BEGIN
          CREATE TRIGGER listing_questions_updated_at BEFORE UPDATE ON listing_questions FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
        EXCEPTION WHEN duplicate_object THEN NULL; END;
      END IF;
    END$$;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE IF EXISTS listing_questions CASCADE;`);
  // Enums cannot be easily reversed in PG without dropping and recreating the type,
  // which might drop columns that depend on it. So we leave them.
  pgm.sql('SELECT 1; -- cannot remove enum values');
};
