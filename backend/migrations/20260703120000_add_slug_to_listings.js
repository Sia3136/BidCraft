exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE listings ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE listings DROP COLUMN IF EXISTS slug;
  `);
};
