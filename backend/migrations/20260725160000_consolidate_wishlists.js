exports.up = (pgm) => {
  pgm.sql(`
    DO $$ 
    DECLARE
      constraint_exists BOOLEAN;
      before_wishlist INT;
      before_wishlists INT;
      after_wishlist INT;
      inserted_count INT := 0;
      skipped_count INT := 0;
    BEGIN
      -- 1. Check if 'wishlists' table actually exists. If not, exit safely.
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wishlists') THEN
        RAISE NOTICE 'Table "wishlists" does not exist. Nothing to consolidate.';
        RETURN;
      END IF;

      -- 2. Verify unique constraint exists on wishlist
      SELECT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'wishlist_user_id_listing_id_key' 
        AND conrelid = 'wishlist'::regclass
      ) INTO constraint_exists;

      IF NOT constraint_exists THEN
        RAISE EXCEPTION 'Safety Check Failed: Unique constraint wishlist_user_id_listing_id_key does not exist on wishlist. Aborting migration.';
      END IF;

      -- 3. Gather Initial Counts
      SELECT COUNT(*) INTO before_wishlist FROM wishlist;
      SELECT COUNT(*) INTO before_wishlists FROM wishlists;

      RAISE NOTICE '--- Migration Stats ---';
      RAISE NOTICE 'wishlist rows before: %', before_wishlist;
      RAISE NOTICE 'wishlists rows before: %', before_wishlists;

      -- 4. Perform Data Copy
      WITH inserted_rows AS (
        INSERT INTO wishlist (user_id, listing_id, created_at)
        SELECT user_id, listing_id, created_at
        FROM wishlists
        WHERE user_id IS NOT NULL AND listing_id IS NOT NULL
        ON CONFLICT (user_id, listing_id) DO NOTHING
        RETURNING 1
      )
      SELECT COUNT(*) INTO inserted_count FROM inserted_rows;

      skipped_count := before_wishlists - inserted_count;
      
      -- 5. Gather Final Counts
      SELECT COUNT(*) INTO after_wishlist FROM wishlist;

      RAISE NOTICE 'rows inserted: %', inserted_count;
      RAISE NOTICE 'rows skipped: %', skipped_count;
      RAISE NOTICE 'wishlist rows after: %', after_wishlist;
      RAISE NOTICE '-----------------------';

      -- 6. Reset Sequence
      PERFORM setval('wishlist_id_seq', COALESCE((SELECT MAX(id)+1 FROM wishlist), 1), false);
    END $$;
  `);

  // 7. Drop wishlists safely (RESTRICT prevents cascading destruction of other tables/objects)
  pgm.sql(`DROP TABLE IF EXISTS wishlists RESTRICT;`);
};

exports.down = (pgm) => {
  // Re-create the wishlists table in case of rollback
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS wishlists (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE (user_id, listing_id)
    );
  `);
  
  // Repopulate wishlists from wishlist
  pgm.sql(`
    INSERT INTO wishlists (user_id, listing_id, created_at)
    SELECT user_id, listing_id, created_at
    FROM wishlist
    ON CONFLICT DO NOTHING;
  `);
};
