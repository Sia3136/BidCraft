const db = require('../utils/db');
const Joi = require('joi');

const createListingSchema = Joi.object({
  title: Joi.string().max(250).required(),
  description: Joi.string().allow('', null),
  category_id: Joi.number().integer().required(),
  condition: Joi.string().max(40).required(),
  photos: Joi.array().items(Joi.string()).min(1).required(),
  listing_type: Joi.string().valid('fixed', 'auction').required(),
  price: Joi.number().precision(2).positive().allow(null),
  status: Joi.string().valid('active', 'paused', 'sold', 'archived').default('active')
});

const updateListingSchema = Joi.object({
  title: Joi.string().max(250),
  description: Joi.string().allow('', null),
  category_id: Joi.number().integer(),
  condition: Joi.string().max(40),
  photos: Joi.array().items(Joi.string()).min(1),
  price: Joi.number().precision(2).positive().allow(null),
  status: Joi.string().valid('active', 'paused', 'sold', 'archived')
});

async function createListing(req, res, next) {
  try {
    const { error, value } = createListingSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const sellerId = req.userId;
    const { title, description, category_id, condition, photos, listing_type, price, status } = value;

    // Check category exists
    const categoryCheck = await db.query('SELECT id FROM categories WHERE id = $1', [category_id]);
    if (categoryCheck.rows.length === 0) {
      return res.status(400).json({ error: 'invalid_category_id' });
    }

    const photosJson = JSON.stringify(photos);

    const result = await db.query(
      `INSERT INTO listings (seller_id, title, description, category_id, condition, photos, listing_type, price, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
       RETURNING *`,
      [sellerId, title, description || null, category_id, condition, photosJson, listing_type, price || null, status || 'active']
    );

    res.status(201).json({ listing: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function getListings(req, res, next) {
  try {
    const { category_id, listing_type, status, search } = req.query;

    let queryText = 'SELECT * FROM listings WHERE 1=1';
    const params = [];

    if (category_id) {
      params.push(category_id);
      queryText += ` AND category_id = $${params.length}`;
    }

    if (listing_type) {
      params.push(listing_type);
      queryText += ` AND listing_type = $${params.length}`;
    }

    if (status) {
      params.push(status);
      queryText += ` AND status = $${params.length}`;
    } else {
      queryText += " AND status != 'archived'";
    }

    if (search) {
      params.push(search);
      queryText += ` AND to_tsvector('english', title) @@ plainto_tsquery('english', $${params.length})`;
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await db.query(queryText, params);
    res.json({ listings: result.rows });
  } catch (err) {
    next(err);
  }
}

async function getListingById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM listings WHERE id = $1', [id]);
    const listing = result.rows[0];
    if (!listing) return res.status(404).json({ error: 'listing_not_found' });

    res.json({ listing });
  } catch (err) {
    next(err);
  }
}

async function updateListing(req, res, next) {
  try {
    const { id } = req.params;
    const { error, value } = updateListingSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Check listing ownership
    const ownershipCheck = await db.query('SELECT seller_id FROM listings WHERE id = $1', [id]);
    const listing = ownershipCheck.rows[0];
    if (!listing) return res.status(404).json({ error: 'listing_not_found' });
    if (listing.seller_id !== req.userId) return res.status(403).json({ error: 'unauthorized_action' });

    const updates = [];
    const params = [id];

    Object.keys(value).forEach((key) => {
      let val = value[key];
      if (key === 'photos') {
        val = JSON.stringify(val);
      }
      params.push(val);
      updates.push(`${key} = $${params.length}`);
    });

    if (updates.length === 0) {
      return res.status(400).json({ error: 'no_updates_provided' });
    }

    const queryText = `
      UPDATE listings 
      SET ${updates.join(', ')}, updated_at = NOW() 
      WHERE id = $1 
      RETURNING *`;

    const result = await db.query(queryText, params);
    res.json({ listing: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function deleteListing(req, res, next) {
  try {
    const { id } = req.params;

    // Check ownership
    const ownershipCheck = await db.query('SELECT seller_id FROM listings WHERE id = $1', [id]);
    const listing = ownershipCheck.rows[0];
    if (!listing) return res.status(404).json({ error: 'listing_not_found' });
    if (listing.seller_id !== req.userId) return res.status(403).json({ error: 'unauthorized_action' });

    // Mark as archived or physically delete. Let's do delete since cascade exists, but setting status to archived is safer for orders.
    // However, if we do cascade delete, let's just physically delete it as requested by standard CRUD.
    await db.query('DELETE FROM listings WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing
};
