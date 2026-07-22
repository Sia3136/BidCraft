require('dotenv').config();
const db = require('./src/utils/db');

async function audit() {
  const client = await db.pool.connect();
  try {
    const { rows: candidateListings } = await client.query("SELECT * FROM listings WHERE NOT (image_urls::text LIKE '%cloudinary.com%')");
    
    let total = candidateListings.length;
    let safeToDelete = 0;
    let keep = 0;
    let manualReview = 0;
    
    const report = [];

    const placeholderRegex = /test|sample|example|lorem|random/i;

    for (const listing of candidateListings) {
      const isPlaceholderTitle = placeholderRegex.test(listing.title);
      const isPlaceholderDesc = listing.description ? placeholderRegex.test(listing.description) : false;
      
      const { rows: creatorRows } = await client.query('SELECT id FROM users WHERE id = $1', [listing.creator_id]);
      const creatorExists = creatorRows.length > 0;

      const { rows: auctionRows } = await client.query('SELECT id, status, current_bid FROM auctions WHERE listing_id = $1', [listing.id]);
      const auctionCount = auctionRows.length;
      const activeAuctions = auctionRows.filter(a => a.status === 'active').length;
      
      let bidCount = 0;
      if (auctionCount > 0) {
        const auctionIds = auctionRows.map(a => a.id);
        const { rows: bidRows } = await client.query('SELECT count(*) FROM bids WHERE auction_id = ANY($1)', [auctionIds]);
        bidCount = parseInt(bidRows[0].count, 10);
      }

      const { rows: orderRows } = await client.query('SELECT count(*) FROM orders WHERE listing_id = $1', [listing.id]);
      const orderCount = parseInt(orderRows[0].count, 10);

      const { rows: wishlistRows } = await client.query('SELECT count(*) FROM wishlist WHERE listing_id = $1', [listing.id]);
      const wishlistCount = parseInt(wishlistRows[0].count, 10);

      let offerCount = 0;
      try {
        const { rows: offerRows } = await client.query('SELECT count(*) FROM offers WHERE listing_id = $1', [listing.id]);
        offerCount = parseInt(offerRows[0].count, 10);
      } catch (e) {
      }

      const hasMissingImage = !listing.image_urls || listing.image_urls.length === 0 || listing.image_urls.every(u => !u.includes('cloudinary.com'));

      const hasRefs = bidCount > 0 || orderCount > 0 || wishlistCount > 0 || offerCount > 0;

      let classification = 'MANUAL REVIEW';
      
      if (
        hasMissingImage &&
        (isPlaceholderTitle || isPlaceholderDesc) &&
        bidCount === 0 &&
        offerCount === 0 &&
        orderCount === 0 &&
        wishlistCount === 0 &&
        activeAuctions === 0 &&
        !hasRefs
      ) {
        classification = 'SAFE TO DELETE';
        safeToDelete++;
      } else if (
        bidCount > 0 ||
        orderCount > 0 ||
        activeAuctions > 0 ||
        wishlistCount > 0 ||
        offerCount > 0 ||
        (!isPlaceholderTitle && !isPlaceholderDesc)
      ) {
        classification = 'KEEP';
        keep++;
      } else {
        manualReview++;
      }

      report.push({
        id: listing.id,
        title: listing.title,
        descriptionSnippet: listing.description ? listing.description.substring(0, 30) : '',
        creatorId: listing.creator_id,
        creatorExists,
        createdAt: listing.created_at,
        updatedAt: listing.updated_at,
        status: listing.status,
        price: listing.price,
        imageUrls: listing.image_urls,
        isPlaceholderTitle,
        isPlaceholderDesc,
        auctionCount,
        activeAuctions,
        bidCount,
        orderCount,
        wishlistCount,
        offerCount,
        classification
      });
    }

    const fs = require('fs');
    fs.writeFileSync('audit_results.json', JSON.stringify({
      summary: { total, safeToDelete, keep, manualReview },
      report: report
    }, null, 2));
    console.log('Audit complete.');
  } finally {
    client.release();
    process.exit(0);
  }
}
audit();
