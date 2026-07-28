/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Add users columns
  pgm.addColumns('users', {
    onboarding_completed: { type: 'boolean', default: false },
    username: { type: 'varchar(100)', unique: true },
    email_verified_at: { type: 'timestamp' },
    google_account: { type: 'boolean', default: false },
    last_login_at: { type: 'timestamp' }
  });

  // Add profiles columns
  pgm.addColumns('profiles', {
    city: { type: 'varchar(100)' },
    country: { type: 'varchar(100)' },
    interests: { type: 'jsonb' },
    marketplace_role: { type: 'varchar(20)', default: 'buyer' }
  });

  // Create recently_viewed table
  pgm.createTable('recently_viewed', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE'
    },
    listing_id: {
      type: 'integer',
      notNull: true,
      references: '"listings"',
      onDelete: 'CASCADE'
    },
    viewed_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp')
    }
  });

  // Unique constraint to avoid duplicate entry per listing per user
  pgm.addConstraint('recently_viewed', 'recently_viewed_user_id_listing_id_key', {
    unique: ['user_id', 'listing_id']
  });

  // Create addresses table
  pgm.createTable('addresses', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE'
    },
    type: { type: 'varchar(50)', default: 'shipping' },
    full_name: { type: 'varchar(200)' },
    phone: { type: 'varchar(50)' },
    street_address: { type: 'text' },
    city: { type: 'varchar(100)' },
    state: { type: 'varchar(100)' },
    postal_code: { type: 'varchar(50)' },
    country: { type: 'varchar(100)' },
    is_default: { type: 'boolean', default: false },
    created_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp')
    },
    updated_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp')
    }
  });
  
  // Create trigger for addresses updated_at
  pgm.sql(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at') THEN
        BEGIN
          CREATE TRIGGER addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
        EXCEPTION WHEN duplicate_object THEN NULL; END;
      END IF;
    END$$;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('addresses');
  pgm.dropTable('recently_viewed');
  
  pgm.dropColumns('profiles', ['city', 'country', 'interests', 'marketplace_role']);
  pgm.dropColumns('users', ['onboarding_completed', 'username', 'email_verified_at', 'google_account', 'last_login_at']);
};
