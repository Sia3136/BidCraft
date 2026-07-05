# Backend Context

## Purpose
The backend module provides a secure, robust API for the frontend, manages the PostgreSQL database, and handles real-time events.

## Responsibilities
- Exposing REST API endpoints.
- Validating incoming requests.
- Managing database operations and complex queries.
- Broadcasting WebSocket events (e.g., bids).
- Handling authentication and authorization checks.

## Important Files
- `src/server.js`: Entry point, Express configuration, and WebSocket attachment.
- `src/middleware/auth.js`: JWT validation middleware.
- `db/schema.sql`: Core database schema definition (See [SCHEMA.md](SCHEMA.md)).

## Dependencies
- `express`, `pg`, `socket.io`, `jsonwebtoken`, `bcrypt`.

## Extension Points
- New API endpoints are defined in `src/routes/` and mapped to handlers in `src/controllers/`.
- Reusable logic should reside in `src/services/`.

## Common Pitfalls
- **SQL Injection**: Always use parameterized queries (`$1, $2`) when using the `pg` library. Never concatenate user input into SQL strings.
- **Async/Await**: Ensure all asynchronous operations are properly awaited and wrapped in try/catch blocks to prevent unhandled promise rejections.
- **WebSocket State**: WebSockets can disconnect; clients must gracefully handle reconnections and state syncing via standard API calls if necessary.
