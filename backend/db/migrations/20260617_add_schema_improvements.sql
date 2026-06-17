-- Migration: add categories, payment fields, indexes, and triggers
-- Run these statements against your Postgres DB in a migration tool or psql.

BEGIN;

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Add category_id to listings (preserve legacy category column for transition)
ALTER TABLE IF EXISTS listings
  ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;

-- 3. Add payment provider fields
ALTER TABLE IF EXISTS payments
  ADD COLUMN IF NOT EXISTS payment_provider VARCHAR(100),
  ADD COLUMN IF NOT EXISTS provider_transaction_id VARCHAR(200),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- 4. Add checks for numeric fields
ALTER TABLE IF EXISTS auctions
  ADD CONSTRAINT IF NOT EXISTS auctions_start_bid_nonneg CHECK (start_bid >= 0);
ALTER TABLE IF EXISTS bids
  ADD CONSTRAINT IF NOT EXISTS bids_amount_nonneg CHECK (bid_amount >= 0);
ALTER TABLE IF EXISTS orders
  ADD CONSTRAINT IF NOT EXISTS orders_total_nonneg CHECK (total_amount >= 0);
ALTER TABLE IF EXISTS escrow
  ADD CONSTRAINT IF NOT EXISTS escrow_amount_nonneg CHECK (amount_held >= 0);
ALTER TABLE IF EXISTS payments
  ADD CONSTRAINT IF NOT EXISTS payments_amount_nonneg CHECK (amount >= 0);

-- 5. Add basic indexes for FK lookups
CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_category_id ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_auctions_seller_id ON auctions(seller_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder_id ON bids(bidder_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);

-- 6. Create update_updated_at function and attach triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach triggers (use DO blocks to avoid errors when run multiple times)
DO $$
BEGIN
  BEGIN
    CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    CREATE TRIGGER listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    CREATE TRIGGER auctions_updated_at BEFORE UPDATE ON auctions FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    CREATE TRIGGER payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    CREATE TRIGGER escrow_updated_at BEFORE UPDATE ON escrow FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
  EXCEPTION WHEN duplicate_object THEN NULL; END;
END$$;

COMMIT;
