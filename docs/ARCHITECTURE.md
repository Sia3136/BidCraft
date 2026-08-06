# System Architecture

This document describes the high-level system design of BidCraft.

## System Overview
BidCraft uses a client-server architecture. The frontend is a Next.js (App Router) application, and the backend is an Express.js REST API with WebSocket support for real-time features. Data is persisted in a PostgreSQL database.

## Module Relationships
- **Frontend**: Handles UI, client-side routing, and local state management via Zustand. Communicates with the Backend via REST API and WebSockets.
- **Backend**: Handles business logic, database transactions, escrow state, and real-time event broadcasting.
- **Database**: Managed by the Backend. See [SCHEMA.md](backend/SCHEMA.md) for schema details.

## Request Lifecycle
1. **Client**: User interacts with the UI in the Frontend.
2. **API Call**: Frontend sends an HTTP request to the Backend API.
3. **Authentication**: Backend middleware validates the JWT token.
4. **Processing**: Backend controllers/services process the request and interact with the Database.
5. **Response**: Backend returns JSON data to the Frontend.

## Authentication & Authorization Flow
- **Registration/Login**: Users authenticate via email/password or mobile OTP.
- **Tokens**: The Backend issues a JWT (JSON Web Token) upon successful login.
- **Client Storage**: The Frontend stores the JWT in local storage (via Zustand persistence).
- **Authorization**: Protected API routes require the JWT in the `Authorization` header. The Backend verifies the token and user role (`buyer`, `seller`, `admin`).

## API Flow
The backend exposes RESTful endpoints under `/api`. 
Controllers handle the request/response cycle, while Services contain the core business logic.

## WebSocket Flow
WebSockets are used for real-time auction bidding.
- Clients connect to the WebSocket server using their JWT for authentication.
- Clients emit `place_bid` events.
- The server validates the bid, updates the database, and broadcasts `bid_updated` events to all clients connected to that auction room.

## Database Flow
The Backend interacts with the PostgreSQL database using raw SQL queries (via the `pg` library) or Prisma for specific frontend tooling. The canonical schema is defined in `backend/db/schema.sql`.

## Deployment Overview
- **Frontend**: Deployed on Vercel or similar Next.js-optimized hosting.
- **Backend**: Deployed on a Node.js hosting provider (e.g., Render, Railway, AWS).
- **Database**: Managed PostgreSQL instance.
