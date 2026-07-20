-- 1a. Total listings in DB regardless of status
SELECT COUNT(*) as total FROM listings;

-- 1b. Breakdown by status and published flag
SELECT status, is_published, COUNT(*) 
FROM listings 
GROUP BY status, is_published 
ORDER BY status;

-- 1c. Breakdown by category
SELECT category, COUNT(*) 
FROM listings 
GROUP BY category 
ORDER BY category;

-- 1d. Breakdown by listing_type
SELECT listing_type, COUNT(*) 
FROM listings 
GROUP BY listing_type;

-- 1e. Check for soft deletes
SELECT COUNT(*) FROM listings WHERE deleted_at IS NOT NULL;

-- 1f. Check for null or empty critical fields that might cause filtering issues
SELECT COUNT(*) FROM listings 
WHERE title IS NULL 
   OR title = '' 
   OR cloudinary_public_id IS NULL 
   OR cloudinary_public_id = '';

-- 1g. Check auction rows — every auction listing must have a matching auctions row
SELECT COUNT(*) FROM listings l
LEFT JOIN auctions a ON a.listing_id = l.id
WHERE l.listing_type = 'auction' AND a.id IS NULL;

-- 1h. Check seller FK integrity — listings with missing seller
SELECT COUNT(*) FROM listings l
LEFT JOIN users u ON u.id = l.seller_id
WHERE u.id IS NULL;
