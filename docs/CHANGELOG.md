# Repository Changelog

## [Unreleased]
- **Deprecated**: The `POST /api/auctions` endpoint is deprecated and no longer part of the active production workflow. Auctions are now automatically created via `POST /api/listings`. The endpoint is intentionally retained for architectural flexibility (see ADR-001).

## [0.1.0] - Initial Setup
- Added Next.js frontend with App Router.
- Added Express.js backend with PostgreSQL schema.
- Implemented static Informational Pages (Privacy, Terms, Escrow).
- Added static Notifications dropdown logic in the UI.
