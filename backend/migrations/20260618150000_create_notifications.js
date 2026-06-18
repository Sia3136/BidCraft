exports.up = (pgm) => {
  // Create notifications table
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      data JSONB DEFAULT '{}',
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Index on notifications for user's feed
  pgm.sql(`
    CREATE INDEX IF NOT EXISTS idx_notifications_user_feed ON notifications(user_id, is_read, created_at DESC);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP INDEX IF EXISTS idx_notifications_user_feed;`);
  pgm.sql(`DROP TABLE IF EXISTS notifications CASCADE;`);
};
