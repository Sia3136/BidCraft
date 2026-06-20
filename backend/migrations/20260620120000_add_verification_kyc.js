exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('verification_codes', {
    id: 'id',
    user_id: { type: 'integer', notNull: true, references: '"users"', onDelete: 'CASCADE' },
    code: { type: 'varchar(10)', notNull: true },
    purpose: { type: 'varchar(50)', default: 'email_verification' },
    expires_at: { type: 'timestamp', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addColumns('profiles', {
    pan_number: { type: 'varchar(50)' },
    bank_account_number: { type: 'varchar(100)' },
    bank_ifsc: { type: 'varchar(50)' },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('profiles', ['pan_number', 'bank_account_number', 'bank_ifsc']);
  pgm.dropTable('verification_codes');
};
