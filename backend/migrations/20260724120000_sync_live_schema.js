/* pgm:no-transaction */
// ALTER TYPE cannot run inside a transaction block, and CREATE INDEX CONCURRENTLY is safer but we don't strictly need concurrently here. We use no-transaction because of the TYPE creation.

exports.up = (pgm) => {
  // 1. Extensions
  pgm.sql(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);

  // 2. Custom Types
  pgm.sql(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bid_deposit_status') THEN
        CREATE TYPE bid_deposit_status AS ENUM ('held', 'refunded', 'forfeited');
      END IF;
    END$$;
  `);

  // 3. Sync 'listings' columns using rigorous checks
  const listingsColumns = [
    { name: 'subcategory', def: 'TEXT' },
    { name: 'buying_method', def: 'TEXT' },
    { name: 'image_urls', def: "TEXT[] DEFAULT '{}'::text[]" },
    { name: 'creator_name', def: 'TEXT' },
    { name: 'creator_rating', def: 'NUMERIC(3,2)' },
    { name: 'creator_review_count', def: 'INTEGER DEFAULT 0' },
    { name: 'creator_badges', def: "TEXT[] DEFAULT '{}'::text[]" },
    { name: 'is_verified', def: 'BOOLEAN DEFAULT false' },
    { name: 'offers_allowed', def: 'BOOLEAN DEFAULT false' },
    { name: 'minimum_offer_percent', def: 'INTEGER DEFAULT 70' },
    { name: 'offer_floor_percent', def: 'INTEGER DEFAULT 30' },
    { name: 'new_arrival', def: 'BOOLEAN DEFAULT false' },
    { name: 'collections', def: "TEXT[] DEFAULT '{}'::text[]" },
    { name: 'occasions', def: "TEXT[] DEFAULT '{}'::text[]" },
    { name: 'auction_ends_at', def: 'TIMESTAMPTZ' },
    { name: 'current_bid', def: 'INTEGER' },
    { name: 'bid_count', def: 'INTEGER DEFAULT 0' },
    { name: 'specifications', def: "JSONB DEFAULT '{}'::jsonb" },
    { name: 'reviews', def: "JSONB DEFAULT '[]'::jsonb" },
    { name: 'is_published', def: 'BOOLEAN DEFAULT true' }
  ];

  listingsColumns.forEach(col => {
    pgm.sql(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='listings' AND column_name='${col.name}'
        ) THEN
          ALTER TABLE listings ADD COLUMN ${col.name} ${col.def};
        END IF;
      END $$;
    `);
  });

  // 4. Sync 'listings' Check constraints
  pgm.sql(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'listings_buying_method_check'
      ) THEN
        ALTER TABLE listings ADD CONSTRAINT listings_buying_method_check 
        CHECK (buying_method IN ('Buy Now', 'Auction', 'Negotiable'));
      END IF;
    END $$;
  `);

  // 5. Sync 'profiles' columns
  pgm.sql(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='profiles' AND column_name='phone'
      ) THEN
        ALTER TABLE profiles ADD COLUMN phone VARCHAR(50);
      END IF;
    END $$;
  `);

  // 6. Create 'bid_deposits' table
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS bid_deposits (
      id SERIAL PRIMARY KEY,
      auction_id INTEGER NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount NUMERIC(12,2) NOT NULL,
      razorpay_payment_id VARCHAR(200),
      status bid_deposit_status DEFAULT 'held',
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now(),
      CONSTRAINT bid_deposits_amount_check CHECK (amount >= 0)
    );
  `);

  // 7. Sync Missing Indexes & Constraints
  pgm.sql(`
    CREATE UNIQUE INDEX IF NOT EXISTS bid_deposits_auction_id_user_id_key ON bid_deposits USING btree (auction_id, user_id);
    CREATE UNIQUE INDEX IF NOT EXISTS auctions_listing_id_key ON auctions USING btree (listing_id);
    
    CREATE INDEX IF NOT EXISTS idx_listings_title_fts ON listings USING gin (to_tsvector('english', title));
    CREATE INDEX IF NOT EXISTS idx_listings_title_trgm ON listings USING gin (title gin_trgm_ops);
    CREATE INDEX IF NOT EXISTS idx_listings_description_trgm ON listings USING gin (description gin_trgm_ops);
  `);
};

exports.down = (pgm) => {
  // Drop Indexes
  pgm.sql(`
    DROP INDEX IF EXISTS idx_listings_description_trgm;
    DROP INDEX IF EXISTS idx_listings_title_trgm;
    DROP INDEX IF EXISTS idx_listings_title_fts;
    DROP INDEX IF EXISTS auctions_listing_id_key;
    DROP INDEX IF EXISTS bid_deposits_auction_id_user_id_key;
  `);

  // Drop Table
  pgm.sql(`DROP TABLE IF EXISTS bid_deposits CASCADE;`);

  // Drop Profiles Column
  pgm.sql(`ALTER TABLE profiles DROP COLUMN IF EXISTS phone;`);

  // Drop Listings Constraints & Columns
  pgm.sql(`ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_buying_method_check;`);

  const listingsColumns = [
    'subcategory', 'buying_method', 'image_urls', 'creator_name', 
    'creator_rating', 'creator_review_count', 'creator_badges', 'is_verified', 
    'offers_allowed', 'minimum_offer_percent', 'offer_floor_percent', 'new_arrival', 
    'collections', 'occasions', 'auction_ends_at', 'current_bid', 'bid_count', 
    'specifications', 'reviews', 'is_published'
  ];

  listingsColumns.forEach(col => {
    pgm.sql(`ALTER TABLE listings DROP COLUMN IF EXISTS ${col};`);
  });

  // Note: We deliberately do NOT drop 'bid_deposit_status' enum or 'pg_trgm' extension
  // because Postgres extensions and types are generally considered shared infrastructure,
  // and rolling them back risks breaking dependencies in other un-tracked manual objects.
  pgm.sql('SELECT 1; -- Enums and Extensions are retained in down migration for safety');
};
