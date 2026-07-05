# BidCraft Backend

## Purpose
The core backend API for BidCraft, handling authentication, business logic, database transactions, and real-time WebSocket communication for auctions.

## Quick Setup
1. `cd backend`
2. `npm install`
3. `cp .env.example .env` (Configure DB connection and JWT secrets)
4. `npm run dev`

## Technologies
- Node.js
- Express.js
- PostgreSQL (via `pg`)
- Socket.io
- JSON Web Tokens (JWT)

## Important Folders
- `src/routes/`: API route definitions.
- `src/controllers/`: Request handling logic.
- `src/services/`: Core business logic.
- `db/`: Database schemas and migrations.

*For system-wide architecture, see [ARCHITECTURE.md](../ARCHITECTURE.md).*
*For local context and rules, see [CONTEXT.md](CONTEXT.md).*
