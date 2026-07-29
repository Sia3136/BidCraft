exports.up = (pgm) => {
  pgm.alterColumn('verification_codes', 'code', {
    type: 'text'
  });
};

exports.down = (pgm) => {
  pgm.alterColumn('verification_codes', 'code', {
    type: 'varchar(10)'
  });
};
