exports.up = (pgm) => {
  // Update listings category and subcategory string values
  pgm.sql(`
    -- Art mappings
    UPDATE listings SET subcategory = 'Digital Art & Illustrations' WHERE subcategory IN ('Digital Art', 'digital-art');
    UPDATE listings SET subcategory = 'Prints & Posters' WHERE subcategory IN ('Prints', 'prints');
    
    -- Handmade mappings
    UPDATE listings SET category = 'Lifestyle & Gifts', subcategory = 'Jewellery & Accessories' WHERE subcategory IN ('Jewellery', 'jewellery');
    UPDATE listings SET subcategory = 'Clay & Pottery' WHERE subcategory IN ('Pottery & Ceramics', 'pottery-ceramics');
    UPDATE listings SET subcategory = 'Paper Crafts' WHERE subcategory IN ('Textiles', 'textiles');
    UPDATE listings SET category = 'Lifestyle & Gifts', subcategory = 'Home Decor' WHERE subcategory IN ('Home Decor', 'home-decor-handmade', 'home-decor-lifestyle');
    
    -- Collectibles mappings
    UPDATE listings SET subcategory = 'Rare Collectibles' WHERE subcategory IN ('Vintage & Antiques', 'vintage-antiques', 'Memorabilia', 'memorabilia');
    UPDATE listings SET subcategory = 'Trading Cards' WHERE subcategory IN ('Stamps & Coins', 'stamps-coins');
    
    -- Gaming mappings
    UPDATE listings SET category = 'Gaming & Hobby', subcategory = 'Cosplay Props' WHERE subcategory IN ('TTRPG', 'ttrpg');
    UPDATE listings SET category = 'Lifestyle & Gifts', subcategory = 'Miniatures' WHERE subcategory IN ('Miniatures', 'miniatures');
    
    -- Lifestyle mappings
    UPDATE listings SET category = 'Gaming & Hobby', subcategory = 'Anime Merchandise' WHERE subcategory IN ('Apparel', 'apparel');

    -- Other mappings to match the exact new taxonomy
    UPDATE listings SET subcategory = 'Resin Arts' WHERE subcategory IN ('Resin Art', 'resin-art');
  `);

  // Wipe out the old subcategories from categories table
  pgm.sql(`
    DELETE FROM categories WHERE parent_id IS NOT NULL;
  `);

  // Insert the new exact subcategories
  pgm.sql(`
    DO $$
    DECLARE
      art_id INT := (SELECT id FROM categories WHERE slug='art');
      handmade_id INT := (SELECT id FROM categories WHERE slug='handmade-crafts');
      collect_id INT := (SELECT id FROM categories WHERE slug='collectibles');
      gaming_id INT := (SELECT id FROM categories WHERE slug='gaming-hobby');
      lifestyle_id INT := (SELECT id FROM categories WHERE slug='lifestyle-gifts');
    BEGIN
      INSERT INTO categories (name, slug, parent_id) VALUES 
        ('Digital Art & Illustrations', 'digital-art-illustrations', art_id),
        ('Paintings', 'paintings', art_id),
        ('Prints & Posters', 'prints-posters', art_id),
        ('Sculptures', 'sculptures', art_id),
        ('Sketches & Drawings', 'sketches-drawings', art_id),
        
        ('Action Figures', 'action-figures', collect_id),
        ('Funko Pops', 'funko-pops', collect_id),
        ('Hot Wheels', 'hot-wheels', collect_id),
        ('Rare Collectibles', 'rare-collectibles', collect_id),
        ('Trading Cards', 'trading-cards', collect_id),
        
        ('Anime Merchandise', 'anime-merchandise', gaming_id),
        ('Board Games', 'board-games', gaming_id),
        ('Cosplay Props', 'cosplay-props', gaming_id),
        ('Puzzle Collections', 'puzzle-collections', gaming_id),
        
        ('Clay & Pottery', 'clay-pottery', handmade_id),
        ('Candles & Soaps', 'candles-soaps', handmade_id),
        ('Crochet & Knitting', 'crochet-knitting', handmade_id),
        ('Paper Crafts', 'paper-crafts', handmade_id),
        ('Resin Arts', 'resin-arts', handmade_id),
        
        ('Home Decor', 'home-decor', lifestyle_id),
        ('Jewellery & Accessories', 'jewellery-accessories', lifestyle_id),
        ('Miniatures', 'miniatures', lifestyle_id),
        ('Stationery', 'stationery', lifestyle_id)
      ON CONFLICT (slug) DO NOTHING;
    END
    $$;
  `);

  // Optionally set the new category_id if needed, by matching subcategory string
  pgm.sql(`
    UPDATE listings l
    SET category_id = c.id
    FROM categories c
    WHERE c.name = l.subcategory;
  `);
};

exports.down = (pgm) => {};
