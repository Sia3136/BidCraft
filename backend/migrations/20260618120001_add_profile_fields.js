exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE profiles
      ADD COLUMN IF NOT EXISTS bio TEXT,
      ADD COLUMN IF NOT EXISTS phone VARCHAR(30);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE profiles
      DROP COLUMN IF EXISTS bio,
      DROP COLUMN IF EXISTS phone;
  `);
};
