exports.up = (pgm) => {
  pgm.addColumn('orders', {
    shipping_address: { type: 'jsonb' }
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('orders', 'shipping_address');
};
