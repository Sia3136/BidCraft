exports.up = (pgm) => {
  // Additive: add shipping metadata columns to listings.
  // Uses IF NOT EXISTS guards so it's safe to re-run.
  const cols = [
    { name: 'ships_from',      def: "TEXT DEFAULT 'India'" },
    { name: 'dispatch_days',   def: 'INTEGER DEFAULT 3' },
    { name: 'estimated_min',   def: 'INTEGER DEFAULT 5' },
    { name: 'estimated_max',   def: 'INTEGER DEFAULT 10' },
    { name: 'returns_policy',  def: "TEXT DEFAULT 'Returns accepted within 7 days'" },
    { name: 'packaging_note',  def: "TEXT DEFAULT 'Securely packed with protective wrap'" },
  ];

  cols.forEach(col => {
    pgm.sql(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='listings' AND column_name='${col.name}'
        ) THEN
          ALTER TABLE listings ADD COLUMN ${col.name} ${col.def};
        END IF;
      END $$;
    `);
  });
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE listings
      DROP COLUMN IF EXISTS ships_from,
      DROP COLUMN IF EXISTS dispatch_days,
      DROP COLUMN IF EXISTS estimated_min,
      DROP COLUMN IF EXISTS estimated_max,
      DROP COLUMN IF EXISTS returns_policy,
      DROP COLUMN IF EXISTS packaging_note;
  `);
};
