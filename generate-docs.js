const fs = require('fs');
const path = require('path');

const writeDoc = (filePath, content) => {
  const fullPath = path.join('C:', 'Bidcraft', ...filePath);
  fs.writeFileSync(fullPath, content.trim() + '\n');
};

// --- ROOT DOCS ---

writeDoc(['README.md'], `
# BidCraft

## Purpose
BidCraft is an online marketplace connecting independent creators, artists, and collectors in India, providing a safe platform for buying and selling unique items through auctions and fixed-price listings, protected by escrow.

## Quick Setup
1. Clone the repository.
2. Setup Backend:
   - Navigate to \`backend/\`
   - Run \`npm install\`
   - Copy \`.env.example\` to \`.env\` and configure.
   - Run \`npm run dev\`
3. Setup Frontend:
   - Navigate to \`frontend/\`
   - Run \`npm install\`
   - Copy \`.env.example\` to \`.env.local\` and configure.
   - Run \`npm run dev\`

## Technologies
- **Frontend**: Next.js 16 (App Router), React, TypeScript, Tailwind CSS, Zustand.
- **Backend**: Node.js, Express.js, PostgreSQL, WebSockets.

## Important Folders
- \`frontend/\`: Next.js client application. See [Frontend README](frontend/README.md).
- \`backend/\`: Express.js server application. See [Backend README](backend/README.md).

*Note: For architecture details, see [ARCHITECTURE.md](ARCHITECTURE.md).*
`);

writeDoc(['ARCHITECTURE.md'], `
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
- **Authorization**: Protected API routes require the JWT in the \`Authorization\` header. The Backend verifies the token and user role (\`buyer\`, \`seller\`, \`admin\`).

## API Flow
The backend exposes RESTful endpoints under \`/api\`. 
Controllers handle the request/response cycle, while Services contain the core business logic.

## WebSocket Flow
WebSockets are used for real-time auction bidding.
- Clients connect to the WebSocket server using their JWT for authentication.
- Clients emit \`place_bid\` events.
- The server validates the bid, updates the database, and broadcasts \`bid_updated\` events to all clients connected to that auction room.

## Database Flow
The Backend interacts with the PostgreSQL database using raw SQL queries (via the \`pg\` library) or Prisma for specific frontend tooling. The canonical schema is defined in \`backend/db/schema.sql\`.

## Deployment Overview
- **Frontend**: Deployed on Vercel or similar Next.js-optimized hosting.
- **Backend**: Deployed on a Node.js hosting provider (e.g., Render, Railway, AWS).
- **Database**: Managed PostgreSQL instance.
`);

writeDoc(['AI_CONTEXT.md'], `
# AI Context & Coding Conventions

This document contains rules and conventions for AI assistants working on this repository.

## Coding Conventions
- **TypeScript**: Use strict typing. Avoid \`any\`. Use interfaces over types where possible.
- **React**: Use functional components and hooks. Prefer server components in Next.js where state isn't needed.
- **Styling**: Use Tailwind CSS utility classes and CSS variables (e.g., \`var(--color-ink-900)\`). Avoid arbitrary values when a design token exists.

## Naming Conventions
- **Files/Folders**: \`kebab-case\` (e.g., \`product-card.tsx\`, \`auth-controller.js\`).
- **Variables/Functions**: \`camelCase\`.
- **Components**: \`PascalCase\`.
- **Constants**: \`UPPER_SNAKE_CASE\`.

## Reusable Patterns & Utilities
- **State Management**: Use Zustand (\`frontend/lib/store.ts\`) for global client state.
- **Class Merging**: Use \`cn()\` utility (\`frontend/lib/utils.ts\`) for merging Tailwind classes safely.
- **Data Fetching**: Use standard \`fetch\` API in server components or inside \`useEffect\`/\`SWR\` in client components.

## Architectural Principles
- **Separation of Concerns**: Keep UI logic in components, business logic in backend services, and database queries in repositories/models.
- **Escrow First**: All monetary transactions must route through the simulated escrow flow.

## AI Editing Rules
- Do NOT rewrite working code unless explicitly requested.
- Audit code first before making changes.
- Ensure all React hooks are properly imported from \`react\`.
- Maintain existing UI aesthetics (spacing, colors, animations) precisely.
- Read this file and the specific \`CONTEXT.md\` of the module you are modifying before starting.
`);

writeDoc(['CHANGELOG.md'], `
# Repository Changelog

## [0.1.0] - Initial Setup
- Added Next.js frontend with App Router.
- Added Express.js backend with PostgreSQL schema.
- Implemented static Informational Pages (Privacy, Terms, Escrow).
- Added static Notifications dropdown logic in the UI.
`);


// --- FRONTEND DOCS ---

writeDoc(['frontend', 'README.md'], `
# BidCraft Frontend

## Purpose
The frontend application for BidCraft, providing the user interface for buyers and sellers to interact with the marketplace, browse listings, place bids, and manage their dashboards.

## Quick Setup
1. \`cd frontend\`
2. \`npm install\`
3. \`cp .env.example .env.local\` (Configure API URL)
4. \`npm run dev\`

## Technologies
- Next.js 16 (App Router)
- React
- TypeScript
- Tailwind CSS
- Zustand
- Framer Motion

## Important Folders
- \`app/\`: Next.js routing and page definitions.
- \`components/\`: Reusable UI components.
- \`lib/\`: Utility functions and state management.

*For system-wide architecture, see [ARCHITECTURE.md](../ARCHITECTURE.md).*
*For local context and rules, see [CONTEXT.md](CONTEXT.md).*
`);

writeDoc(['frontend', 'CONTEXT.md'], `
# Frontend Context

## Purpose
The frontend module is responsible for rendering the UI, managing client-side state, and routing user interactions to the backend API.

## Responsibilities
- Rendering pages using Next.js App Router (Server and Client components).
- Managing global state (cart, user session, notifications) via Zustand.
- Handling real-time UI updates for auctions via WebSockets.
- Validating user input before API submission.

## Important Files
- \`app/layout.tsx\`: Root layout containing global providers and UI wrappers.
- \`lib/store.ts\`: Zustand global state store.
- \`lib/utils.ts\`: Shared utility functions (e.g., \`cn\`).

## Dependencies
- \`next\`, \`react\`, \`tailwindcss\`, \`zustand\`, \`framer-motion\`, \`lucide-react\`.

## Extension Points
- New routes are added in \`app/\`.
- New UI components belong in \`components/\` and should use existing design tokens.

## Common Pitfalls
- **Hydration Errors**: Avoid using \`window\` or browser APIs in Server Components. Ensure Zustand state initialization matches server render.
- **Client vs Server**: Default to Server Components. Add \`'use client'\` only when hooks (\`useState\`, \`useEffect\`) or browser APIs are required.
- **Missing Imports**: Always ensure React hooks are imported from \`'react'\`.
`);

writeDoc(['frontend', 'CHANGELOG.md'], `
# Frontend Changelog

## [0.1.0] - Initial Development
- Configured Next.js App Router.
- Implemented Explore page with multi-faceted filtering.
- Implemented static Informational and Legal pages.
- Added Notification Bell dropdown with Zustand state.
- Updated authentication form disclaimers.
`);


// --- BACKEND DOCS ---

writeDoc(['backend', 'README.md'], `
# BidCraft Backend

## Purpose
The core backend API for BidCraft, handling authentication, business logic, database transactions, and real-time WebSocket communication for auctions.

## Quick Setup
1. \`cd backend\`
2. \`npm install\`
3. \`cp .env.example .env\` (Configure DB connection and JWT secrets)
4. \`npm run dev\`

## Technologies
- Node.js
- Express.js
- PostgreSQL (via \`pg\`)
- Socket.io
- JSON Web Tokens (JWT)

## Important Folders
- \`src/routes/\`: API route definitions.
- \`src/controllers/\`: Request handling logic.
- \`src/services/\`: Core business logic.
- \`db/\`: Database schemas and migrations.

*For system-wide architecture, see [ARCHITECTURE.md](../ARCHITECTURE.md).*
*For local context and rules, see [CONTEXT.md](CONTEXT.md).*
`);

writeDoc(['backend', 'CONTEXT.md'], `
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
- \`src/server.js\`: Entry point, Express configuration, and WebSocket attachment.
- \`src/middleware/auth.js\`: JWT validation middleware.
- \`db/schema.sql\`: Core database schema definition (See [SCHEMA.md](SCHEMA.md)).

## Dependencies
- \`express\`, \`pg\`, \`socket.io\`, \`jsonwebtoken\`, \`bcrypt\`.

## Extension Points
- New API endpoints are defined in \`src/routes/\` and mapped to handlers in \`src/controllers/\`.
- Reusable logic should reside in \`src/services/\`.

## Common Pitfalls
- **SQL Injection**: Always use parameterized queries (\`$1, $2\`) when using the \`pg\` library. Never concatenate user input into SQL strings.
- **Async/Await**: Ensure all asynchronous operations are properly awaited and wrapped in try/catch blocks to prevent unhandled promise rejections.
- **WebSocket State**: WebSockets can disconnect; clients must gracefully handle reconnections and state syncing via standard API calls if necessary.
`);

writeDoc(['backend', 'CHANGELOG.md'], `
# Backend Changelog

## [0.1.0] - Initial Development
- Configured Express.js server.
- Defined PostgreSQL schema (\`schema.sql\`).
- Implemented Authentication routes (JWT).
- Implemented Listings and Orders routes.
- Added Socket.io integration for auctions.
`);

// To generate SCHEMA.md, we can quickly read schema.sql to extract basic details
const schemaSqlPath = path.join('C:', 'Bidcraft', 'backend', 'db', 'schema.sql');
let schemaDoc = '# Database Schema\n\nThis document outlines the core tables derived from `db/schema.sql`.\n\n';
if (fs.existsSync(schemaSqlPath)) {
  const schemaSql = fs.readFileSync(schemaSqlPath, 'utf8');
  // Simple extraction of table names
  const matches = [...schemaSql.matchAll(/CREATE TABLE IF NOT EXISTS ([a-z_]+) \(/g)];
  if (matches.length > 0) {
    schemaDoc += '## Tables\n';
    matches.forEach(m => {
      schemaDoc += "- **" + m[1] + "**\n";
    });
  }
}
schemaDoc += '\n*Note: For the exact column definitions, constraints, and enums, refer directly to `db/schema.sql`.*\n';
writeDoc(['backend', 'SCHEMA.md'], schemaDoc);

console.log('Documentation generated successfully.');
