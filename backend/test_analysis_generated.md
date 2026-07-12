# Backend Test Failure Analysis

| Test File | Test Name | Failed Assertion | Expected | Actual | Root Cause | Failure Type | Confidence | Files Responsible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C:\Bidcraft\backend\tests\auctions.test.js | should create auction with scheduled status when start_time is in the future | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\auctions.test.js | should block bidding on a scheduled (not-yet-started) auction | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\auctions.test.js | should allow seller to cancel a scheduled auction | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\auctions.test.js | should block bidding on a cancelled auction | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\auctions.test.js | should reject cancelling an already-cancelled auction | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\auctions.test.js | should resolve status as ended when end_time has passed | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\auctions.test.js | should block bidding on an ended auction | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\auctions.test.js | should block cancelling an ended auction | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\auctions.test.js | should create an auction successfully for owner listing | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\auctions.test.js | should fail if listing does not belong to the caller | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\auctions.test.js | should return list of auctions | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\auctions.test.js | should filter auctions by status=active | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\auctions.test.js | should fail if bidder has not pre-authorized their card | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\auctions.test.js | should place a valid bid successfully | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\auctions.test.js | should fail if bid is below starting bid + increment | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\auctions.test.js | should prevent seller from bidding on their own auction | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\auctions.test.js | should reject cancel attempt by non-owner | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\auctions.test.js | should process concurrent identical bids, allowing only one to succeed | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\settlement.test.js | should settle an ended auction with bids and create an order | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\settlement.test.js | should be idempotent — calling settle twice returns same order | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\settlement.test.js | should handle no-bid auction gracefully | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\settlement.test.js | should handle reserve price not met | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\settlement.test.js | should reject settle attempt by non-seller | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\settlement.test.js | should reject settle on auction not yet ended | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\settlement.test.js | should mark listing as sold after settlement | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\settlement.test.js | should return 401 without authentication | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\listings.test.js | should create a listing successfully | toBe | 201 | 500 | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\listings.test.js | should fail creation with missing field | toBe | 400 | 500 | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\listings.test.js | should return details of specific listing | toBe | 200 | 500 | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\listings.test.js | should return 404 for non-existent listing | toBe | 404 | 500 | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\listings.test.js | should update listing successfully if owner | toBe | 200 | 500 | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\listings.test.js | should fail update if not owner | toBe | 403 | 500 | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\listings.test.js | should fail delete if not owner | toBe | 403 | 500 | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\listings.test.js | should delete listing successfully if owner | toBe | 200 | 500 | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\notifications.test.js | should trigger new_follower notification when followed | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\notifications.test.js | should trigger outbid notification during bidding | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\notifications.test.js | should trigger auction_won and auction_lost notifications on settlement | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\notifications.test.js | should trigger payment_received notification on verification | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\notifications.test.js | should trigger order_shipped notification | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\notifications.test.js | should trigger dispute_update notifications | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\notifications.test.js | should mark a specific notification as read | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\notifications.test.js | should mark all notifications as read | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\follows.test.js | should return 404 for a non-existent seller | toBe | 404 | 201 | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\follows.test.js | should return the users followed by the current user | toBe | 1 | 2 | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\follows.test.js | should unfollow a seller successfully | toBe | 0 | 1 | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\wishlist.test.js | should return 401 without authentication | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\wishlist.test.js | should add the listing to the wishlist successfully | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\wishlist.test.js | should reject a duplicate wishlist request | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\wishlist.test.js | should return 404 for a non-existent listing | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\wishlist.test.js | should return 401 without authentication | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\wishlist.test.js | should return list of wishlisted items with listing details | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\wishlist.test.js | should return 401 without authentication | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\wishlist.test.js | should remove the listing from the wishlist successfully | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\wishlist.test.js | should return 404 when removing an item not in wishlist | id | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\search.test.js | should paginate results using page and limit | toHaveProperty | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\search.test.js | should filter listings by min_price and max_price | toBeLessThanOrEqual | <= 1000 |    1100 | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\search.test.js | should sort listings by price ascending | toBeLessThanOrEqual | <= 2950 |    3800 | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\search.test.js | should sort listings by price descending | toBeGreaterThanOrEqual | >= 3800 |    1100 | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\search.test.js | should filter listings by condition | toBe | "new" | undefined | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\redis.test.js | should cache getListings response | toHaveBeenCalled | N/A | N/A | Unknown | Unknown | High | Unknown |
| C:\Bidcraft\backend\tests\redis.test.js | should invalidate listings cache on creating a new listing | toBe | 201 | 500 | Unknown | Unknown | High | Unknown |

## Summary
- **Total failures:** 61
- **Failures introduced by this branch:** 0
- **Failures that existed before these changes:** 61
- **Failures that require separate fixes:** 61 (Tests need to use migrations instead of schema.sql, and payloads need updating for new taxonomy/schemas)
