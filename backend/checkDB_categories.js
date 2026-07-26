const db = require('./src/utils/db');

async function checkSubcategories() {
  try {
    const res = await db.query('SELECT category, subcategory, count(*) FROM listings GROUP BY category, subcategory');
    console.log(res.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}
checkSubcategories();
