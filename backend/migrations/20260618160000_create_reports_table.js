exports.up = pgm => {
  pgm.createType('report_status', ['pending', 'reviewed', 'dismissed', 'action_taken']);

  pgm.createTable('reports', {
    id: 'id',
    reporter_id: { type: 'integer', notNull: true, references: '"users"' },
    reported_user_id: { type: 'integer', references: '"users"' },
    reported_listing_id: { type: 'integer', references: '"listings"' },
    reason: { type: 'text', notNull: true },
    status: { type: 'report_status', default: 'pending' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.sql(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at') THEN
        CREATE TRIGGER reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
      END IF;
    END$$;
  `);
};

exports.down = pgm => {
  pgm.dropTable('reports');
  pgm.dropType('report_status');
};

