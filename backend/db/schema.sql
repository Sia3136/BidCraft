-- BidCraft DB Schema (core tables)

-- Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  name VARCHAR(200),
  avatar_url VARCHAR(500),
  role VARCHAR(20) DEFAULT 'buyer',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Profiles (extended)
CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  social_links JSONB,
  is_verified BOOLEAN DEFAULT FALSE,
  trust_score NUMERIC(3,2) DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  total_revenue NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Listings (category is free-text; categories list maintained in app)
CREATE TABLE IF NOT EXISTS listings (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(250) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  condition VARCHAR(40),
  photos JSONB NOT NULL,
  listing_type VARCHAR(20) NOT NULL,
  price NUMERIC(12,2),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Auctions
CREATE TABLE IF NOT EXISTS auctions (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER UNIQUE NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  seller_id INTEGER NOT NULL REFERENCES users(id),
  start_bid NUMERIC(12,2) NOT NULL,
  current_bid NUMERIC(12,2),
  reserve_price NUMERIC(12,2),
  min_bid_increment NUMERIC(12,2) DEFAULT 10.00,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  total_bids INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bids
CREATE TABLE IF NOT EXISTS bids (
  id SERIAL PRIMARY KEY,
  auction_id INTEGER NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  bidder_id INTEGER NOT NULL REFERENCES users(id),
  bid_amount NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  buyer_id INTEGER NOT NULL REFERENCES users(id),
  seller_id INTEGER NOT NULL REFERENCES users(id),
  listing_id INTEGER REFERENCES listings(id),
  auction_id INTEGER REFERENCES auctions(id),
  total_amount NUMERIC(12,2) NOT NULL,
  status VARCHAR(30) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  razorpay_order_id VARCHAR(200),
  razorpay_payment_id VARCHAR(200),
  status VARCHAR(50),
  method VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Escrow
CREATE TABLE IF NOT EXISTS escrow (
  id SERIAL PRIMARY KEY,
  order_id INTEGER UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(30) DEFAULT 'pending',
  buyer_id INTEGER NOT NULL REFERENCES users(id),
  seller_id INTEGER NOT NULL REFERENCES users(id),
  amount_held NUMERIC(12,2) NOT NULL,
  timeout_at TIMESTAMP,
  released_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Escrow audit log
CREATE TABLE IF NOT EXISTS escrow_audit_log (
  id SERIAL PRIMARY KEY,
  escrow_id INTEGER NOT NULL REFERENCES escrow(id) ON DELETE CASCADE,
  old_status VARCHAR(30),
  new_status VARCHAR(30) NOT NULL,
  actor_id INTEGER REFERENCES users(id),
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Shipments
CREATE TABLE IF NOT EXISTS shipments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  tracking_number VARCHAR(200),
  carrier VARCHAR(100),
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  status VARCHAR(30),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  reviewer_id INTEGER NOT NULL REFERENCES users(id),
  reviewee_id INTEGER NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >=1 AND rating <=5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Disputes
CREATE TABLE IF NOT EXISTS disputes (
  id SERIAL PRIMARY KEY,
  escrow_id INTEGER NOT NULL REFERENCES escrow(id) ON DELETE CASCADE,
  initiator_id INTEGER NOT NULL REFERENCES users(id),
  reason TEXT,
  evidence_urls JSONB,
  status VARCHAR(30) DEFAULT 'open',
  resolution VARCHAR(30),
  resolved_by INTEGER REFERENCES users(id),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Wishlist
CREATE TABLE IF NOT EXISTS wishlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  listing_id INTEGER NOT NULL REFERENCES listings(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, listing_id)
);

-- Follows
CREATE TABLE IF NOT EXISTS follows (
  id SERIAL PRIMARY KEY,
  follower_id INTEGER NOT NULL REFERENCES users(id),
  seller_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (follower_id, seller_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_auctions_end_time ON auctions(end_time);
CREATE INDEX IF NOT EXISTS idx_bids_auction_id_amount ON bids(auction_id, bid_amount DESC);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_title_fts ON listings USING GIN (to_tsvector('english', title));
