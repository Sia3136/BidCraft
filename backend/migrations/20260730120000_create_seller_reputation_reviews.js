exports.up = (pgm) => {
  // New narrow table for generated/seeded seller reputation reviews.
  // Decoupled from orders intentionally — this stores display-only reputation data.
  // The production `reviews` table (tied to orders) remains the source of truth for real transactions.
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS seller_reputation_reviews (
      id           SERIAL PRIMARY KEY,
      seller_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      reviewer_name VARCHAR(100) NOT NULL,
      rating        INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_seller_rep_reviews_seller_id
      ON seller_reputation_reviews (seller_id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS seller_reputation_reviews CASCADE;
  `);
};
