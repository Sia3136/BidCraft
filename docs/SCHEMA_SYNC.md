# Schema Synchronization (2026-07-24)

## Why This Catch-Up Migration Exists
During the final pre-production stabilization phase, a rigorous audit comparing the version-controlled `backend/migrations/*.js` against the live AWS Neon database revealed massive, undocumented schema drift. Over 20 columns, the `bid_deposits` table, constraints, and several Full-Text Search and Trigram indexes existed in production but were absent in the repository.

This catch-up migration (`20260724120000_sync_live_schema.js`) exists to completely eradicate this technical debt. It safely formalizes all live-database edits into a single version-controlled source of truth.

## What Schema Drift It Resolves
1. **Extensions**: The `pg_trgm` extension was active in production for fuzzy text search.
2. **Missing Table**: The `bid_deposits` table, including its ENUM `bid_deposit_status`, foreign keys (`ON DELETE CASCADE`), and unique indexes (`auction_id`, `user_id`).
3. **Missing Columns**: 
   - `listings` was missing 19 columns including arrays (`collections`, `occasions`, `image_urls`, `creator_badges`), numeric ratings, counters, and metadata.
   - `profiles` was missing the `phone` column.
4. **Missing Constraints & Indexes**: 
   - The `listings_buying_method_check` constraint.
   - Unique constraints on `auctions.listing_id`.
   - GIN indexes for trigram (`gin_trgm_ops`) and standard full-text search (`to_tsvector`).

## Why `schema.sql` is Considered Legacy
The file `db/schema.sql` is formally classified as **LEGACY**. 
The repository uses `node-pg-migrate`, and the very first migration (`20260617_initial_schema.js`) executes `schema.sql` to establish the initial baseline. Because modifying `schema.sql` would destroy the checksum/repeatability of that V1 migration on existing test environments, we leave it untouched. The Javascript migrations in `backend/migrations/` are the singular, authoritative source of truth for the database schema.

## How Future Schema Changes Should Be Made
- **NEVER execute `ALTER TABLE`, `CREATE INDEX`, or `CREATE TABLE` manually via `psql` or GUI clients in production.**
- All schema alterations MUST be authored as a new migration file using `npm run migrate create <name>`.
- Code changes requiring new columns must only be merged *after* the corresponding migration file is written and tested locally using `npm run migrate`. 
- This guarantees 100% schema parity across local, staging, and production environments.
