exports.up = pgm => {
  pgm.createTable('refresh_tokens', {
    token: { type: 'varchar(255)', primaryKey: true },
    user_id: { type: 'integer', notNull: true, references: '"users"', onDelete: 'CASCADE' },
    expires_at: { type: 'timestamp', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('refresh_tokens');
};

