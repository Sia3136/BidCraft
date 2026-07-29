const express = require('express');
const router = express.Router();
const categoriesData = require('../utils/categories');

router.get('/', (req, res) => {
  // Return lightweight categories for onboarding (id, name)
  const formatted = categoriesData.categories.map((c, index) => ({
    id: index + 1,
    name: c.name,
    slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  }));
  res.json({ categories: formatted });
});

module.exports = router;
