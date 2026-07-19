# ADR-001: Auction Creation Flow

## Context
Originally, creating an auction on BidCraft required a two-step process:
1. Create a listing (`POST /api/listings`)
2. Attach an auction to the listing (`POST /api/auctions`)

To streamline the seller experience and reduce the likelihood of orphaned listings or inconsistent state, the auction creation logic was integrated directly into `POST /api/listings`. When a user creates a listing with `buyingMethod: 'Auction'`, the system automatically provisions the associated auction record in a single transaction.

As a result, the standalone `POST /api/auctions` endpoint became unreachable by the active frontend application and standard production workflows.

## Decision
We decided to **deprecate but intentionally retain** the `POST /api/auctions` endpoint. 

## Rationale
While it is no longer used in the current production workflow, retaining this endpoint preserves architectural flexibility for future product requirements. Removing it now would complicate future shifts that may require explicit, decoupled auction provisioning.

Future scenarios where this endpoint may become primary or active again include:
- **Draft Auctions**: Sellers create draft listings and configure auction parameters later.
- **Manual Moderation**: Listings must be reviewed by an admin before the auction can be explicitly provisioned and scheduled.
- **Scheduled Publishing**: A listing is created in advance, but the auction is activated at a specific future date via a distinct API call.

## Status
**Deprecated** - Maintained for structural flexibility only.

## Consequences
- The API contract and current JSON response behavior (e.g., returning `409` or `400` with existing error keys) remains unchanged to ensure integration tests and potential unknown consumers do not break.
- Developers should use `POST /api/listings` to create new auctions.
- Code duplication between `ListingsController` and `AuctionsController` exists. A future refactor into a centralized `AuctionService` is recommended if `POST /api/auctions` is revived.

## Conditions for Removal
This endpoint should only be permanently deleted if:
1. A definitive product decision is made that Draft Auctions, Manual Moderation, or decoupled creation will *never* be implemented.
2. The duplicated logic in `ListingsController` is successfully extracted into an `AuctionService`, rendering the controller endpoint entirely obsolete without sacrificing flexibility.
