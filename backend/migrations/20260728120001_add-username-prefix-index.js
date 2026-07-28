exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`CREATE INDEX IF NOT EXISTS idx_users_username_prefix ON users (username text_pattern_ops);`);
};

exports.down = pgm => {
  pgm.sql(`DROP INDEX IF NOT EXISTS idx_users_username_prefix;`);
};
