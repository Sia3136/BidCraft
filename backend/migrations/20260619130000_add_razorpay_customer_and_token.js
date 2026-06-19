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
    razorpay_customer_id: {
      type: 'varchar(100)',
      default: null,
    },
    razorpay_card_token: {
      type: 'varchar(200)',
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
  pgm.dropColumns('profiles', ['razorpay_customer_id', 'razorpay_card_token']);
};
