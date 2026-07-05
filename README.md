# BidCraft

## Purpose
BidCraft is an online marketplace connecting independent creators, artists, and collectors in India, providing a safe platform for buying and selling unique items through auctions and fixed-price listings, protected by escrow.

## Quick Setup
1. Clone the repository.
2. Setup Backend:
   - Navigate to `backend/`
   - Run `npm install`
   - Copy `.env.example` to `.env` and configure.
   - Run `npm run dev`
3. Setup Frontend:
   - Navigate to `frontend/`
   - Run `npm install`
   - Copy `.env.example` to `.env.local` and configure.
   - Run `npm run dev`

## Technologies
- **Frontend**: Next.js 16 (App Router), React, TypeScript, Tailwind CSS, Zustand.
- **Backend**: Node.js, Express.js, PostgreSQL, WebSockets.

## Important Folders
- `frontend/`: Next.js client application. See [Frontend README](frontend/README.md).
- `backend/`: Express.js server application. See [Backend README](backend/README.md).

*Note: For architecture details, see [ARCHITECTURE.md](ARCHITECTURE.md).*
