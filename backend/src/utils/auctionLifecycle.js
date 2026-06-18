/**
 * auctionLifecycle.js
 * Pure helper — computes the effective (live) auction status from DB data.
 * No DB calls. Used to avoid stale stored status in a cron-free architecture.
 *
 * Lifecycle states:
 *   scheduled → (start_time passes) → active → (end_time passes) → ended
 *   Any state → (manual) → cancelled  [terminal]
 */

/**
 * Resolve the live status of an auction based on timestamps.
 * @param {object} auction - Raw row from the auctions table
 * @returns {'scheduled'|'active'|'ended'|'cancelled'} effective status
 */
function resolveStatus(auction) {
  // Cancelled is always terminal — never override it
  if (auction.status === 'cancelled') return 'cancelled';

  const now = new Date();
  const startTime = auction.start_time ? new Date(auction.start_time) : null;
  const endTime = auction.end_time ? new Date(auction.end_time) : null;

  if (endTime && now >= endTime) return 'ended';
  if (startTime && now < startTime) return 'scheduled';
  return 'active';
}

/**
 * Apply resolveStatus to an auction row object, returning a new object
 * with the `status` field set to the resolved value.
 * @param {object} auction
 * @returns {object}
 */
function withResolvedStatus(auction) {
  return { ...auction, status: resolveStatus(auction) };
}

module.exports = { resolveStatus, withResolvedStatus };
