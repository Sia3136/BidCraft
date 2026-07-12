exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('users', {
    email_verified: { type: 'boolean', default: false },
    mobile_verified: { type: 'boolean', default: false },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('users', ['email_verified', 'mobile_verified']);
};
