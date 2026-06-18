/* pgm:no-transaction */
// ALTER TYPE ... ADD VALUE cannot run inside a transaction.

exports.up = (pgm) => {
  // 1. Add missing order_status values
  pgm.sql(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel='awaiting_payment'
        AND enumtypid=(SELECT oid FROM pg_type WHERE typname='order_status')) THEN
        ALTER TYPE order_status ADD VALUE 'awaiting_payment' AFTER 'pending';
      END IF;
    END$$;
  `);
  pgm.sql(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel='delivered'
        AND enumtypid=(SELECT oid FROM pg_type WHERE typname='order_status')) THEN
        ALTER TYPE order_status ADD VALUE 'delivered' AFTER 'shipped';
      END IF;
    END$$;
  `);

  // 2. Add winner_bid_id to orders
  pgm.sql(`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS winner_bid_id INTEGER REFERENCES bids(id);
  `);

  // 3. Unique constraint: one order per auction (prevents duplicate settlement)
  pgm.sql(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'orders_auction_id_unique'
      ) THEN
        ALTER TABLE orders ADD CONSTRAINT orders_auction_id_unique UNIQUE (auction_id);
      END IF;
    END$$;
  `);

  // 4. Unique constraint: one review per order per reviewer
  pgm.sql(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'reviews_order_reviewer_unique'
      ) THEN
        ALTER TABLE reviews ADD CONSTRAINT reviews_order_reviewer_unique UNIQUE (order_id, reviewer_id);
      END IF;
    END$$;
  `);

  // 5. Add order_id to disputes (nullable; complements escrow_id)
  pgm.sql(`
    ALTER TABLE disputes ADD COLUMN IF NOT EXISTS order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL;
  `);

  // 6. Add provider_order_id to payments (canonical Razorpay order ID column)
  pgm.sql(`
    ALTER TABLE payments ADD COLUMN IF NOT EXISTS provider_order_id VARCHAR(200);
  `);

  // 7. Index on disputes.order_id
  pgm.sql(`
    CREATE INDEX IF NOT EXISTS idx_disputes_order_id ON disputes(order_id);
  `);

  // 8. Index on orders.auction_id
  pgm.sql(`
    CREATE INDEX IF NOT EXISTS idx_orders_auction_id ON orders(auction_id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP INDEX IF EXISTS idx_disputes_order_id;`);
  pgm.sql(`DROP INDEX IF EXISTS idx_orders_auction_id;`);
  pgm.sql(`ALTER TABLE disputes DROP COLUMN IF EXISTS order_id;`);
  pgm.sql(`ALTER TABLE payments DROP COLUMN IF EXISTS provider_order_id;`);
  pgm.sql(`ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_auction_id_unique;`);
  pgm.sql(`ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_order_reviewer_unique;`);
  pgm.sql(`ALTER TABLE orders DROP COLUMN IF EXISTS winner_bid_id;`);
  // Cannot remove enum values in PostgreSQL
  pgm.sql('SELECT 1; -- cannot remove enum values');
};
