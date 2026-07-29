exports.up = (pgm) => {
  pgm.addColumns('profiles', {
    state: { type: 'varchar(100)' }
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('profiles', ['state']);
};
