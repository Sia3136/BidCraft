exports.up = (pgm) => {
  pgm.sql(`
    INSERT INTO categories (name, slug, parent_id, created_at)
    VALUES 
      ('Art', 'art', NULL, NOW()),
      ('Crafts', 'crafts', NULL, NOW()),
      ('Collectibles', 'collectibles', NULL, NOW()),
      ('Hot Wheels', 'hot-wheels', NULL, NOW()),
      ('Books', 'books', NULL, NOW()),
      ('Electronics', 'electronics', NULL, NOW())
    ON CONFLICT (slug) DO NOTHING;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DELETE FROM categories WHERE slug IN ('art', 'crafts', 'collectibles', 'hot-wheels', 'books', 'electronics');
  `);
};
