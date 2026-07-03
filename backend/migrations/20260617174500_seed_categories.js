exports.up = (pgm) => {
  pgm.sql(`
    -- Insert root categories
    INSERT INTO categories (name, slug, parent_id, created_at)
    VALUES 
      ('Art', 'art', NULL, NOW()),
      ('Handmade & Crafts', 'handmade-crafts', NULL, NOW()),
      ('Collectibles', 'collectibles', NULL, NOW()),
      ('Gaming & Hobby', 'gaming-hobby', NULL, NOW()),
      ('Lifestyle & Gifts', 'lifestyle-gifts', NULL, NOW())
    ON CONFLICT (slug) DO NOTHING;

    -- Insert subcategories
    -- We use DO NOTHING so this is idempotent
    DO $$
    DECLARE
      art_id INT := (SELECT id FROM categories WHERE slug='art');
      handmade_id INT := (SELECT id FROM categories WHERE slug='handmade-crafts');
      collect_id INT := (SELECT id FROM categories WHERE slug='collectibles');
      gaming_id INT := (SELECT id FROM categories WHERE slug='gaming-hobby');
      lifestyle_id INT := (SELECT id FROM categories WHERE slug='lifestyle-gifts');
    BEGIN
      INSERT INTO categories (name, slug, parent_id) VALUES 
        ('Paintings', 'paintings', art_id),
        ('Prints', 'prints', art_id),
        ('Digital Art', 'digital-art', art_id),
        
        ('Jewellery', 'jewellery', handmade_id),
        ('Pottery & Ceramics', 'pottery-ceramics', handmade_id),
        ('Textiles', 'textiles', handmade_id),
        ('Home Decor', 'home-decor-handmade', handmade_id),
        
        ('Vintage & Antiques', 'vintage-antiques', collect_id),
        ('Stamps & Coins', 'stamps-coins', collect_id),
        ('Memorabilia', 'memorabilia', collect_id),
        
        ('Board Games', 'board-games', gaming_id),
        ('TTRPG', 'ttrpg', gaming_id),
        ('Miniatures', 'miniatures', gaming_id),
        
        ('Home Decor', 'home-decor-lifestyle', lifestyle_id),
        ('Apparel', 'apparel', lifestyle_id)
      ON CONFLICT (slug) DO NOTHING;
    END
    $$;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DELETE FROM categories WHERE slug IN (
      'art', 'handmade-crafts', 'collectibles', 'gaming-hobby', 'lifestyle-gifts',
      'paintings', 'prints', 'digital-art', 'jewellery', 'pottery-ceramics', 'textiles',
      'home-decor-handmade', 'vintage-antiques', 'stamps-coins', 'memorabilia',
      'board-games', 'ttrpg', 'miniatures', 'home-decor-lifestyle', 'apparel'
    );
  `);
};
