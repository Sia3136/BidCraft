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
  pgm.addColumns('profiles', {
    kyc_status: {
      type: 'varchar(30)',
      default: 'none',
    },
    kyc_document_type: {
      type: 'varchar(50)',
      default: null,
    },
    kyc_document_url: {
      type: 'varchar(500)',
      default: null,
    },
    kyc_rejection_reason: {
      type: 'text',
      default: null,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropColumns('profiles', [
    'kyc_status',
    'kyc_document_type',
    'kyc_document_url',
    'kyc_rejection_reason',
  ]);
};
