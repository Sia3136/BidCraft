# BidCraft — Creator Marketplace Platform

> A full-stack, escrow-protected marketplace for artists, crafters, collectors, and creators — supporting fixed-price listings, live auctions, bidding, storefronts, and escrow-backed transactions.

---

## Current Status

**Stage:** Active Development · Pre-MVP

The backend is substantively complete. The frontend has a functioning marketplace shell with live API connections. Critical paths (auth, listings, auctions, bidding, payments, escrow, disputes, watchlist, storefronts) are wired end-to-end. Several flows lack frontend UI counterparts despite having working backend APIs.

---

## Table of Contents

1. [Vision](#vision)
2. [Feature Status](#feature-status)
3. [Technology Stack](#technology-stack)
4. [Architecture Overview](#architecture-overview)
5. [Database Overview](#database-overview)
6. [Backend Overview](#backend-overview)
7. [Frontend Overview](#frontend-overview)
8. [API Reference](#api-reference)
9. [Authentication & Security](#authentication--security)
10. [Payment & Escrow System](#payment--escrow-system)
11. [Background Jobs](#background-jobs)
12. [Testing](#testing)
13. [Setup Instructions](#setup-instructions)
14. [Environment Variables](#environment-variables)
15. [Repository Structure](#repository-structure)
16. [Learning Guide](#learning-guide)
17. [Known Issues & Technical Debt](#known-issues--technical-debt)
18. [Roadmap](#roadmap)
19. [Contribution Guide](#contribution-guide)

---

## Vision

BidCraft is a creator-focused marketplace that prioritises:

- **Trust** — Every transaction is escrow-protected. Funds are never released until delivery is confirmed.
- **Fair Value Discovery** — Live auctions with reserve prices, bid increments, and auto-settlement.
- **Community** — Creator storefronts, follower graphs, trust scores, and verified seller badges.
- **Creator Control** — Sell fixed-price, auction, or both. Full listing management.

**Design Philosophy:** Pinterest + Etsy + premium startup aesthetic. Warm, artisan-forward. Not Amazon. Not eBay.

---

## Feature Status

Derived from actual code inspection. `Missing` means no corresponding backend or frontend code exists.

| Feature | Status | Evidence |
|---|---|---|
| User Registration (email + password) | ✅ Fully Implemented | `authController.js`, `auth.test.js` |
| Login with JWT | ✅ Fully Implemented | `authController.js`, `middleware/auth.js` |
| Google OAuth Login | ✅ Fully Implemented | `authController.js` (verifies Google ID token) |
| Refresh Token Rotation | ✅ Fully Implemented | `refresh_tokens` table, `authController.js` |
| Logout (token invalidation) | ✅ Fully Implemented | `authController.js`, `refresh_tokens` DELETE |
| Email Verification (OTP) | ✅ Backend Implemented | `authController.js` `sendVerification`/`verifyEmail`, `verification_codes` table. **No frontend UI.** |
| User Profile (get/update) | ✅ Fully Implemented | `profileController.js`, frontend auth context |
| KYC Document Submission | ✅ Backend Implemented | `profileController.js` `submitKyc` with PAN + bank details. **No frontend form.** |
| Admin KYC Review | ✅ Backend Implemented | `adminController.js` `reviewKyc` / `getPendingKyc` |
| Admin Dashboard | ⚠️ Backend Only | All admin routes implemented. No frontend admin panel exists. |
| Listings (CRUD) | ✅ Fully Implemented | `listingsController.js`, `/app/listings/create/page.tsx` |
| Guided 6-Photo Upload (UX) | ✅ Implemented | `components/upload/guided-upload.tsx`, enforced in backend schema |
| Image Upload to Cloudinary | ✅ Backend Implemented | `imageService.js` streams buffers to Cloudinary. **Frontend uses mock `createObjectURL`.** |
| Full-Text Search (listings) | ✅ Backend Implemented | PostgreSQL `to_tsvector` / `plainto_tsquery`. Frontend `/listings` page queries with `?search=`. |
| Auctions (create/list/get/cancel) | ✅ Fully Implemented | `auctionsController.js`, `auctionService.js`, frontend PDP shows auction block |
| Live Auction Status (computed) | ✅ Fully Implemented | `auctionLifecycle.js` resolves `scheduled/active/ended` from timestamps — no stale state |
| Auction Auto-Settlement (cron) | ✅ Implemented | `auctionJobs.js` runs every minute, calls `settlementService.closeAuction()` |
| Bidding | ✅ Fully Implemented | `bidsController.js`, `auctionService.js` (atomic tx with row-level lock), PDP bid form |
| Pre-Authorization for Bidding | ✅ Fully Implemented | Bidder requires `razorpay_card_token` in profile. Backend enforces. Frontend shows auth modal with Razorpay setup. |
| Order Creation (Buy Now) | ✅ Fully Implemented | `ordersController.js` `createOrder`, validation, price fetch |
| Dedicated Checkout Page | ✅ Implemented | `/app/checkout/[id]/page.tsx` — order creation, Razorpay flow, mock fallback |
| Razorpay Payment Order | ✅ Fully Implemented | `paymentsController.js`, `paymentService.js` (real + mock mode) |
| Payment Verification (signature) | ✅ Fully Implemented | HMAC-SHA256 verification, `payments` table update, escrow creation |
| Razorpay Webhook | ✅ Implemented | `POST /api/payments/webhook`, raw body capture, signature verification |
| Card Save / Pre-Auth Token | ✅ Fully Implemented | `saveCard`, `createSetupOrder` (1 INR setup intent + token storage) |
| Escrow (held on payment) | ✅ Fully Implemented | `escrow` table, created on `payment.captured` and verify-payment |
| Escrow Release (manual) | ✅ Fully Implemented | `ordersController.js` on delivery confirmation, triggers Razorpay transfer |
| Escrow Auto-Release (14-day) | ✅ Implemented | `escrowAutoRelease.js` hourly cron, checks `shipments.delivered_at + 14 days` |
| Escrow Audit Log | ✅ Backend Implemented | `escrow_audit_log` table, written during auto-release. Not written on manual release. |
| Disputes | ✅ Backend Implemented | `disputesController.js` — create, get, list, update status. **No frontend dispute UI.** |
| Admin Dispute Resolution | ✅ Backend Implemented | `adminController.js` `adminResolveDispute` |
| Shipment Tracking | ⚠️ Partially Implemented | `shipments` table exists. `updateOrderStatus` handles `shipped`/`delivered`. No tracking number UI. |
| Reviews (post-delivery) | ✅ Backend Implemented | `reviewsController.js`, trust score recalculation. **No frontend review form.** |
| Watchlist / Wishlist | ✅ Fully Implemented | `wishlistController.js`, `/app/watchlist/page.tsx`, heart toggle on `product-card.tsx` |
| Creator Storefronts | ✅ Fully Implemented | `/app/creator/[id]/page.tsx` — profile, listings tabs, follow/unfollow |
| Creator Spotlight Section | ✅ Implemented | Fetches live sellers from listings API, links to storefronts |
| Follow / Unfollow Creators | ✅ Fully Implemented | `followsController.js`, follow/unfollow buttons on storefront |
| In-App Notifications | ✅ Fully Implemented | `notificationsController.js`, `notificationService.js`, `notifications` table. Frontend API bindings exist. **No notification bell UI.** |
| Email Notifications | ✅ Implemented | `emailService.js` wraps SendGrid. Triggers on: outbid, auction won/lost, payment received, escrow released. Console mock in dev. |
| Admin Reports | ✅ Backend Implemented | `adminController.js`, `reports` table. **No frontend report UI.** |
| Real-Time Bidding (WebSocket) | ❌ Missing | No Socket.IO or WebSocket infrastructure exists anywhere in the codebase. |
| Make Offer | ❌ Missing | No offer negotiation table, controller, or frontend UI exists. |
| Seller Payout Dashboard | ❌ Missing | No frontend payout management page exists. |
| Shipping Address Collection | ⚠️ Scaffolded | Checkout page has a textarea placeholder. No backend address table. |
| Email Verification Frontend | ❌ Missing | OTP endpoints exist on backend. No frontend modal/page. |
| KYC Submission Frontend | ❌ Missing | Backend endpoint accepts PAN + bank details. No frontend form. |
| Notification Bell UI | ❌ Missing | API bindings exist. No bell icon or notification dropdown in Navbar. |
| Admin Frontend Panel | ❌ Missing | All admin APIs exist. No admin UI. |

---

## Technology Stack

### Backend

| Technology | Purpose | Key Files |
|---|---|---|
| **Node.js + Express** | HTTP server, routing, middleware | `app.js`, `server.js`, `routes/` |
| **PostgreSQL (Neon)** | Primary relational database | `db/schema.sql`, `utils/db.js` |
| **node-pg-migrate** | Database migrations | `migrations/` (13 files) |
| **JWT (jsonwebtoken)** | Stateless access token auth (15 min expiry) | `middleware/auth.js`, `authController.js` |
| **bcryptjs** | Password hashing (10 rounds) | `authController.js` |
| **Razorpay** | Payment processing, transfers, tokenization | `paymentService.js`, `paymentsController.js` |
| **Cloudinary** | Image hosting (buffer stream, no disk I/O) | `imageService.js` |
| **Multer** | Multipart file parsing (memoryStorage) | `routes/images.js` |
| **node-cron** | Scheduled background jobs | `auctionJobs.js`, `escrowAutoRelease.js` |
| **SendGrid** | Transactional email (console mock in dev) | `emailService.js` |
| **Helmet** | HTTP security headers | `app.js` |
| **CORS** | Cross-origin request control | `app.js` |
| **express-rate-limit** | Rate limiting (200 req/15 min global, auth routes stricter) | `middleware/rateLimiter.js`, `app.js` |
| **Winston** | Structured JSON logging | `utils/logger.js` |
| **Morgan** | HTTP access logging | `app.js` |
| **Joi** | Request body validation | All controllers |
| **Google Auth Library** | Google ID token verification | `authController.js` |
| **Jest + Supertest** | Integration testing | `tests/` (14 test files) |

### Frontend

| Technology | Purpose | Key Files |
|---|---|---|
| **Next.js 16** (App Router) | React framework, SSR/SSG, routing | `app/`, `next.config.mjs` |
| **React 19** | Component-based UI | All `.tsx` files |
| **TypeScript** | Type safety | All frontend code |
| **Tailwind CSS v4** | Utility-first CSS styling | `globals.css`, all components |
| **Shadcn/UI** | Component primitives (via `components/ui/`) | `components.json` |
| **Lucide React** | Icon library | Components throughout |
| **Razorpay JS SDK** | Client-side payment checkout | Loaded via `next/script` in PDP |
| **localStorage** | Auth token persistence | `auth-context.tsx` |
| **React Context** | Global auth state | `lib/auth-context.tsx` |

### Infrastructure & External Services

| Service | Status | Notes |
|---|---|---|
| **Neon PostgreSQL** | ✅ Active | Serverless Postgres. URL in `.env`. |
| **Cloudinary** | ✅ Configured | Cloud name + keys in `.env`. |
| **Razorpay** | ✅ Test Mode Active | Test keys present in `.env`. Production keys needed for go-live. |
| **Google OAuth** | ✅ Configured | Client ID + secret in `.env`. |
| **Redis** | ❌ Not implemented | `REDIS_URL` defined in `.env` but no code uses it. |
| **BullMQ** | ❌ Not implemented | No queue infrastructure. Jobs use `node-cron`. |
| **Socket.IO** | ❌ Not implemented | No real-time infrastructure. |
| **SendGrid** | ⚠️ Configured, mock in dev | `SENDGRID_API_KEY` not set → console log only. |

---

## Architecture Overview

```
┌─────────────────────────────────┐     ┌──────────────────────────────┐
│   Next.js 16 Frontend           │     │   Express.js Backend         │
│   (localhost:3000)              │     │   (localhost:8000)           │
│                                 │     │                              │
│  app/                           │     │  Routes  → Controllers       │
│  ├── page.tsx (home)           │◄────►│  Auth    → authController    │
│  ├── listings/[id]             │     │  Listings → listingsController│
│  ├── listings/create           │     │  Auctions → auctionsController│
│  ├── creator/[id]              │     │  Payments → paymentsController│
│  ├── checkout/[id]             │     │  Orders  → ordersController   │
│  └── watchlist/                │     │  Disputes → disputesController│
│                                 │     │                              │
│  lib/                           │     │  Services                    │
│  ├── api.ts (fetch client)     │     │  ├── paymentService.js       │
│  └── auth-context.tsx          │     │  ├── settlementService.js    │
│                                 │     │  ├── auctionService.js       │
└─────────────────────────────────┘     │  ├── escrowService.js        │
                                         │  ├── emailService.js         │
                                         │  ├── imageService.js         │
                                         │  └── notificationService.js  │
                                         │                              │
                                         │  Background Jobs             │
                                         │  ├── auctionJobs.js (1 min) │
                                         │  └── escrowAutoRelease.js(1h)│
                                         │                              │
                                         │       PostgreSQL (Neon)      │
                                         │       Cloudinary             │
                                         │       Razorpay               │
                                         └──────────────────────────────┘
```

### Request Flow

```
Browser → Next.js App → lib/api.ts (fetch) → Express → Middleware → Controller → Service → DB
                              ↑ JWT Bearer token in localStorage
```

### Authentication Flow

```
Register/Login → JWT (15 min) + Refresh Token (7 days) stored in DB
↓
localStorage.setItem('token', accessToken)
↓
Every API request: Authorization: Bearer <token>
↓
auth middleware: jwt.verify() → req.userId → controller
↓
Token refresh: POST /api/auth/refresh → new access + refresh token
```

### Auction Lifecycle

```
Seller creates Listing (type=auction)
↓
Seller creates Auction (start_bid, reserve_price, start_time, end_time)
↓
auctionLifecycle.js: resolveStatus() computes status from timestamps (no cron needed)
  → scheduled → active → ended
↓
Bidder must have razorpay_card_token (pre-authorization)
↓
Bidder places bid → auctionService.placeBid() (atomic tx, row lock)
  → bid inserted, current_bid updated, outbid notification sent
↓
auctionJobs.js cron (every 1 min): finds ended auctions
  → settlementService.closeAuction() (idempotent)
  → Winner order created, notifications sent, emails dispatched
↓
Winner pays → escrow held → seller ships → buyer confirms delivery
→ escrow released (90% to seller via Razorpay transfer)
```

### Payment & Escrow Flow

```
Buyer clicks Buy Now / Auction Win
↓
POST /api/orders → order created (awaiting_payment)
↓
POST /api/payments/create-order → Razorpay order created
↓
Razorpay Checkout JS opens in browser
↓
On success → POST /api/payments/verify (HMAC signature checked)
↓
payment.status = 'paid', order.status = 'paid'
↓
INSERT INTO escrow (status='held')
↓
Seller ships → PATCH /api/orders/:id/status {status:'shipped'}
↓
Buyer confirms → PATCH /api/orders/:id/status {status:'delivered'}
↓
Razorpay transfer (90%) → seller's account
escrow.status = 'released'
order.status = 'completed'
↓
Auto-release fallback: if 14 days pass since delivered_at with no dispute
→ escrowAutoRelease.js releases automatically
```

---

## Database Overview

### Tables

| Table | Purpose | Key Columns |
|---|---|---|
| `users` | Core user accounts | id, email, password_hash, google_id, role, avatar_url |
| `profiles` | Extended profile + KYC + Razorpay data | user_id, bio, phone, kyc_status, pan_number, bank_account_number, bank_ifsc, razorpay_customer_id, razorpay_card_token, is_verified, trust_score |
| `verification_codes` | OTP for email verification | user_id, code, purpose, expires_at |
| `refresh_tokens` | Rotating refresh token store | token, user_id, expires_at |
| `categories` | Listing categories (hierarchical) | id, name, slug, parent_id |
| `listings` | Products for sale | seller_id, title, description, category_id, condition, photos (JSONB), listing_type, price, status |
| `auctions` | Auction definitions | listing_id, seller_id, start_bid, current_bid, reserve_price, min_bid_increment, start_time, end_time, status, total_bids |
| `bids` | Bid history | auction_id, bidder_id, bid_amount |
| `orders` | Purchase orders | buyer_id, seller_id, listing_id, auction_id, total_amount, status |
| `payments` | Payment records | order_id, amount, provider_order_id, razorpay_payment_id, status |
| `escrow` | Escrow records | order_id, buyer_id, seller_id, amount_held, status, timeout_at, released_at |
| `escrow_audit_log` | Escrow state history | escrow_id, old_status, new_status, reason |
| `shipments` | Shipment tracking | order_id, tracking_number, carrier, shipped_at, delivered_at, status |
| `reviews` | Post-delivery reviews | order_id, reviewer_id, reviewee_id, rating, comment |
| `disputes` | Escrow disputes | escrow_id, order_id, initiator_id, reason, evidence_urls, status |
| `wishlist` | User saved listings | user_id, listing_id |
| `follows` | Creator follow relationships | follower_id, seller_id |
| `notifications` | In-app notification feed | user_id, type, title, message, data, is_read |
| `reports` | Admin moderation reports | reporter_id, reported_user_id, reported_listing_id, reason, status |

### Key Enums

| Enum | Values |
|---|---|
| `listing_status` | active, paused, sold, archived |
| `auction_status` | active, cancelled, closed |
| `order_status` | pending, awaiting_payment, paid, shipped, completed, cancelled, refunded |
| `payment_status` | pending, paid, failed, refunded |
| `escrow_status` | pending, held, released, cancelled |
| `dispute_status` | open, review, resolved, dismissed |

### Migrations (in order)

1. `20260617_initial_schema.js` — Core tables
2. `20260617174500_seed_categories.js` — Default categories
3. `20260618120000_auction_lifecycle_status.js` — Auction status enum changes
4. `20260618120001_add_profile_fields.js` — Extended profile fields
5. `20260618130000_phase3_schema.js` — Orders, payments, escrow
6. `20260618140000_phase35_hotfixes.js` — Constraint fixes
7. `20260618150000_create_notifications.js` — Notifications table
8. `20260618160000_create_reports_table.js` — Reports table
9. `20260618170000_create_refresh_tokens_table.js` — Token rotation
10. `20260619120000_add_razorpay_account_id.js` — Seller payout account
11. `20260619130000_add_razorpay_customer_and_token.js` — Card tokenization
12. `20260619140000_add_kyc_fields.js` — KYC document fields
13. `20260620120000_add_verification_kyc.js` — OTP table, PAN/bank fields

---

## Backend Overview

**Entry point:** `backend/src/server.js` → `app.js`

### Controllers (16 files)

| Controller | Routes Served |
|---|---|
| `authController.js` | register, login, google login, /me, logout, refresh token, OTP send/verify |
| `profileController.js` | get/update profile, public profile, KYC submission |
| `listingsController.js` | CRUD listings, search/filter |
| `auctionsController.js` | create/list/get/cancel auctions |
| `bidsController.js` | place bid (atomic, pre-auth enforced) |
| `ordersController.js` | create order, list, get, status transitions |
| `paymentsController.js` | create Razorpay order, verify payment, webhook, save card, setup order |
| `disputesController.js` | open/get/list/update disputes |
| `reviewsController.js` | create review, seller reviews with stats, order review |
| `wishlistController.js` | add/remove/list wishlist |
| `followsController.js` | follow/unfollow, get followers/following |
| `notificationsController.js` | list, mark read, mark all read |
| `adminController.js` | users, listings, reports, KYC review, dispute resolution |
| `settlementController.js` | manual auction settle endpoint |
| `imagesController.js` | upload to Cloudinary via buffer |

### Services (6 files)

| Service | Role |
|---|---|
| `paymentService.js` | Razorpay wrapper (order, verify, transfer, customer, mock mode) |
| `settlementService.js` | Atomic auction close: winner order, notifications, emails |
| `auctionService.js` | Atomic bid placement with row-lock, outbid notifications |
| `escrowService.js` | Auto-release: find eligible escrows, release, notify, audit |
| `emailService.js` | SendGrid wrapper with console mock |
| `notificationService.js` | Insert notification row (supports transaction client) |
| `imageService.js` | Cloudinary streaming upload from buffer |

### Background Jobs

| Job | Schedule | What It Does |
|---|---|---|
| `auctionJobs.js` | Every 1 minute | Finds `active` auctions past `end_time`, calls `closeAuction()` |
| `escrowAutoRelease.js` | Every 1 hour | Finds held escrows with `delivered_at > 14 days`, releases |

---

## Frontend Overview

**Framework:** Next.js 16 with App Router. TypeScript throughout.

### Pages

| Route | Component | Status |
|---|---|---|
| `/` | `app/page.tsx` | ✅ Landing page with 9 sections |
| `/listings` | `app/listings/page.tsx` | ✅ Search results + all listings |
| `/listings/[id]` | `app/listings/[id]/page.tsx` | ✅ Full PDP with auction, bidding, buy now, watchlist |
| `/listings/create` | `app/listings/create/page.tsx` | ✅ Guided listing creation with 6-photo upload |
| `/creator/[id]` | `app/creator/[id]/page.tsx` | ✅ Creator storefront with tabs and follow |
| `/watchlist` | `app/watchlist/page.tsx` | ✅ Saved listings grid |
| `/checkout/[id]` | `app/checkout/[id]/page.tsx` | ✅ Buy Now checkout with Razorpay integration |

### Key Components

| Component | Purpose |
|---|---|
| `Navbar` | Navigation with search bar, auth state, user menu |
| `AuthModal` | Login + Registration modal with form |
| `ProductCard` | Listing card with watchlist heart toggle |
| `CreatorCard` | Creator profile card linked to storefront |
| `CountdownTimer` | Live auction countdown display |
| `GuidedUpload` | 6-slot guided photo upload wizard |
| `HeroSection` | Homepage hero with CTA |
| `LiveAuctionsSection` | Fetches live auctions from API |
| `TrendingProductsSection` | Fetches listings from API |
| `CreatorSpotlightSection` | Extracts sellers from live listings |

### State Management

- **Auth state:** React Context (`lib/auth-context.tsx`) — user, token, login, register, logout, refreshUser
- **Page state:** Local `useState` per page (no global store like Zustand/Redux)
- **Token storage:** `localStorage` key `token`
- **API layer:** `lib/api.ts` — typed fetch wrapper, reads token from localStorage

---

## API Reference

All routes are prefixed with `/api`.

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | None | Register with email/password |
| POST | `/auth/login` | None | Login, returns JWT + refresh token |
| POST | `/auth/google` | None | Login/register with Google ID token |
| GET | `/auth/me` | ✓ | Get current user |
| POST | `/auth/logout` | None | Revoke refresh token |
| POST | `/auth/refresh` | None | Rotate refresh token |
| POST | `/auth/send-verification` | ✓ | Send OTP to email |
| POST | `/auth/verify-email` | ✓ | Verify OTP code |

### Profile & KYC
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/profile` | ✓ | Own profile (private) |
| PUT | `/profile` | ✓ | Update name, avatar, bio, phone, social links |
| POST | `/profile/kyc` | ✓ | Submit KYC (doc type, URL, PAN, bank details) |
| GET | `/users/:id` | None | Public seller profile |

### Listings
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/listings` | None | List/search listings. Query: `category_id`, `listing_type`, `status`, `search`, `seller_id` |
| POST | `/listings` | ✓ | Create listing (requires exactly 6 photos) |
| GET | `/listings/:id` | None | Get listing by ID |
| PUT | `/listings/:id` | ✓ | Update listing (owner only) |
| DELETE | `/listings/:id` | ✓ | Delete listing (owner only) |

### Auctions
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/auctions` | None | List auctions (computed status filter) |
| POST | `/auctions` | ✓ | Create auction for an auction-type listing |
| GET | `/auctions/:id` | None | Get auction details + bids history |
| PUT | `/auctions/:id/cancel` | ✓ | Cancel auction (seller only) |
| POST | `/auctions/:id/settle` | ✓ | Manually settle auction |

### Bids
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auctions/:id/bids` | ✓ | Place bid (pre-auth token required) |

### Orders
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/orders` | ✓ | Create order for fixed-price listing |
| GET | `/orders` | ✓ | List user's orders. Query: `role`, `status` |
| GET | `/orders/:id` | ✓ | Get order (buyer or seller) |
| PATCH | `/orders/:id/status` | ✓ | Update status: shipped, delivered, cancelled |

### Payments
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/payments/create-order` | ✓ | Create Razorpay order for an order |
| POST | `/payments/create-setup-order` | ✓ | Create 1 INR Razorpay setup intent for card tokenization |
| POST | `/payments/verify` | ✓ | Verify payment signature, activate escrow |
| POST | `/payments/save-card` | ✓ | Store Razorpay card token for bidding |
| GET | `/payments/order/:orderId` | ✓ | Get payment record for order |
| POST | `/payments/webhook` | None | Razorpay webhook endpoint (raw body) |

### Disputes
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/disputes` | ✓ | Open dispute on an eligible order |
| GET | `/disputes` | ✓ | List current user's disputes |
| GET | `/disputes/:id` | ✓ | Get dispute details |
| PATCH | `/disputes/:id/status` | ✓ | Update dispute status |

### Reviews
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/reviews` | ✓ | Submit review for completed order |
| GET | `/reviews/seller/:userId` | None | Get seller reviews + stats |
| GET | `/reviews/order/:orderId` | None | Get review for specific order |

### Wishlist
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/wishlist` | ✓ | Get user's wishlist |
| POST | `/wishlist/:listingId` | ✓ | Add to wishlist |
| DELETE | `/wishlist/:listingId` | ✓ | Remove from wishlist |

### Follows
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/users/:sellerId/follow` | ✓ | Follow a creator |
| DELETE | `/users/:sellerId/follow` | ✓ | Unfollow |
| GET | `/users/:sellerId/followers` | None | Get followers list |
| GET | `/me/following` | ✓ | Get sellers you follow |

### Notifications
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/notifications` | ✓ | Get user notifications |
| PATCH | `/notifications/:id/read` | ✓ | Mark single notification read |
| PATCH | `/notifications/read-all` | ✓ | Mark all read |

### Images
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/images/upload` | ✓ | Upload up to 5 images (JPEG/PNG/WebP, 5MB max each) |

### Admin
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/admin/users` | Admin | List all users |
| PUT | `/admin/users/:id/role` | Admin | Change user role |
| DELETE | `/admin/users/:id` | Admin | Delete user |
| GET | `/admin/listings` | Admin | List all listings |
| DELETE | `/admin/listings/:id` | Admin | Delete listing |
| GET | `/admin/reports` | Admin | Get all reports |
| PATCH | `/admin/reports/:id` | Admin | Update report status |
| PATCH | `/admin/disputes/:id/resolve` | Admin | Force resolve dispute |
| GET | `/admin/kyc/pending` | Admin | List pending KYC submissions |
| POST | `/admin/kyc/:userId/review` | Admin | Approve/reject KYC |

### Health Check
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | None | Server + DB status |

---

## Authentication & Security

### Token Strategy
- **Access Token:** JWT, 15-minute expiry, signed with `JWT_SECRET`
- **Refresh Token:** 80-char random hex, stored in `refresh_tokens` table, 7-day expiry, rotated on each use
- **Storage:** Access token in `localStorage` (XSS risk — see Known Issues)

### Password Security
- bcryptjs, 10 salt rounds

### Middleware Stack (in order)
1. `helmet` — Sets secure HTTP headers
2. `morgan` — Access logging
3. Raw body capture — Only for `/api/payments/webhook`
4. `express.json()` — Body parsing
5. `cors` — Origin whitelist from `FRONTEND_ORIGIN`
6. `express-rate-limit` — 200 req/15 min globally; auth routes have stricter limits
7. `authMiddleware` — JWT verification on protected routes
8. `adminMiddleware` — DB role check for admin routes

### Webhook Verification
Razorpay webhook signatures verified using HMAC-SHA256 with `RAZORPAY_WEBHOOK_SECRET`. Raw body preserved before JSON parsing. Bypassed in mock mode.

---

## Payment & Escrow System

### Mock Mode
`paymentService.js` auto-detects mock mode when:
- `RAZORPAY_KEY_ID` is absent, `'test'`, or `NODE_ENV==='test'`

In mock mode: orders return `mock_rporder_*` IDs, signatures follow `mock_sig_<order>_<pay>` format accepted by verifySignature.

### Razorpay Flow
1. Backend creates Razorpay Order (amount in paise)
2. Frontend opens Razorpay Checkout JS
3. On success, frontend posts `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature` to backend
4. Backend verifies HMAC signature
5. Payment record updated, escrow record created

### Escrow Payout
- On delivery confirmation: `createTransfer()` sends 90% of order total to seller's `razorpay_account_id`
- 10% platform fee retained
- Auto-release via cron if no dispute within 14 days of delivery

### Test Webhook Locally
```bash
# Terminal 1: start backend
npm run dev

# Terminal 2: expose via ngrok
npm run tunnel

# Terminal 3: fire a test webhook
npm run test:webhook [razorpay_order_id] [bidcraft_order_id]
```

---

## Testing

**Framework:** Jest + Supertest (integration tests hitting real DB via Neon)

**14 test files** covering all major API surface areas:

| Test File | Coverage |
|---|---|
| `auth.test.js` | Register, login, Google OAuth, /me, logout |
| `profile.test.js` | Get/update profile |
| `kyc.test.js` | KYC submission, admin review |
| `listings.test.js` | CRUD, category validation |
| `auctions.test.js` | Create, list, bid, cancel, settlement |
| `orders.test.js` | Create, status transitions, authorization |
| `payments.test.js` | Payment order, verify, save card |
| `settlement.test.js` | closeAuction: no bids, reserve not met, winner |
| `disputes.test.js` | Create, get, update, admin resolve |
| `reviews.test.js` | Submit, get seller reviews, trust score |
| `wishlist.test.js` | Add, remove, list |
| `follows.test.js` | Follow, unfollow, get followers/following |
| `notifications.test.js` | List, mark read, mark all |
| `images.test.js` | Upload validation |

### Run Tests
```bash
cd backend
npm test
```

> **Note:** Tests run against the real Neon database (test data is cleaned up in `afterAll` hooks). No separate test database is configured.

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- A Neon PostgreSQL account (or any PostgreSQL 14+)
- Cloudinary account
- Razorpay test account
- Google Cloud project with OAuth configured

### Backend Setup

```bash
cd backend
npm install

# Copy and configure environment
cp .env.example .env   # (create from template if needed)
# Fill in DATABASE_URL, JWT_SECRET, Cloudinary, Razorpay, Google credentials

# Run database migrations
npm run migrate

# Make yourself admin (run once after registering your account)
node make_admin.js

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install  # or pnpm install

# Set API URL
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`. Backend runs on `http://localhost:8000`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 8000) |
| `FRONTEND_ORIGIN` | Yes | CORS origin (e.g., `http://localhost:3000`) |
| `DATABASE_URL` | **Yes** | PostgreSQL connection string |
| `JWT_SECRET` | **Yes** | Secret for signing JWT tokens (use a long random string) |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth 2.0 client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth 2.0 client secret |
| `RAZORPAY_KEY_ID` | Yes | Razorpay key ID (use `rzp_test_*` for test) |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay key secret |
| `RAZORPAY_WEBHOOK_SECRET` | No | Webhook HMAC secret (for webhook validation) |
| `SENDGRID_API_KEY` | No | SendGrid API key (omit for console mock) |
| `FROM_EMAIL` | No | Sender email (default: noreply@bidcraft.com) |
| `REDIS_URL` | No | Redis URL (configured but unused — reserved for future BullMQ migration) |
| `NODE_ENV` | No | `development` / `test` / `production` |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL (e.g., `http://localhost:8000/api`) |

---

## Repository Structure

```
BidCraft/
├── backend/
│   ├── db/
│   │   └── schema.sql              # Canonical schema definition
│   ├── migrations/                 # 13 node-pg-migrate migration files
│   ├── scripts/
│   │   └── testWebhook.js          # Local webhook test script
│   ├── src/
│   │   ├── app.js                  # Express app setup, middleware, routes
│   │   ├── server.js               # HTTP server + job initialization
│   │   ├── controllers/            # 16 route handlers
│   │   ├── jobs/
│   │   │   ├── auctionJobs.js      # 1-minute auction settlement cron
│   │   │   └── escrowAutoRelease.js # 1-hour escrow auto-release cron
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT verification
│   │   │   ├── admin.js            # Role-based admin guard
│   │   │   └── rateLimiter.js      # Rate limiting configs
│   │   ├── routes/                 # 15 Express router files
│   │   ├── services/               # 7 service modules
│   │   └── utils/
│   │       ├── auctionLifecycle.js # Pure status resolver
│   │       ├── db.js               # pg Pool wrapper
│   │       └── logger.js           # Winston logger
│   ├── tests/                      # 14 integration test files
│   ├── make_admin.js               # One-time admin grant script
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx                # Home page
│   │   ├── layout.tsx              # Root layout with AuthProvider
│   │   ├── listings/
│   │   │   ├── page.tsx            # All listings / search results
│   │   │   ├── [id]/page.tsx       # Product detail page
│   │   │   └── create/page.tsx     # Listing creation wizard
│   │   ├── creator/[id]/page.tsx   # Creator storefront
│   │   ├── checkout/[id]/page.tsx  # Buy Now checkout
│   │   └── watchlist/page.tsx      # Saved listings
│   ├── components/
│   │   ├── auth-modal.tsx          # Login/Register modal
│   │   ├── navbar.tsx              # Navigation + search
│   │   ├── product-card.tsx        # Listing card with watchlist
│   │   ├── creator-card.tsx        # Creator card linked to storefront
│   │   ├── countdown-timer.tsx     # Auction countdown
│   │   ├── sections/               # 9 homepage section components
│   │   ├── upload/
│   │   │   └── guided-upload.tsx   # 6-slot guided photo upload
│   │   └── ui/                     # Shadcn UI primitives
│   ├── lib/
│   │   ├── api.ts                  # Typed fetch API client
│   │   ├── auth-context.tsx        # React auth context + provider
│   │   ├── mock-data.ts            # Static mock data (being phased out)
│   │   └── utils.ts                # cn() utility
│   └── package.json
│
├── EXECUTION_PLAN.md               # Development roadmap document
└── README.md                       # This file
```

---

## Learning Guide

### JWT (JSON Web Tokens)
**What:** Compact, signed tokens for stateless authentication.
**Why BidCraft uses it:** Eliminates server-side session storage. Each request is self-contained.
**Files:** `middleware/auth.js` (verification), `authController.js` (generation)
**Learn:** Token structure (header.payload.signature), `jwt.sign()`, `jwt.verify()`, expiry strategy.

### Refresh Token Rotation
**What:** Short-lived access tokens + long-lived refresh tokens stored in DB.
**Why:** 15-minute access tokens limit exposure if stolen. Refresh tokens allow seamless renewal.
**Files:** `refresh_tokens` table, `authController.js` `refreshToken()`
**Learn:** Why we can't revoke JWTs easily, token rotation security model.

### PostgreSQL Transactions
**What:** ACID-compliant groups of SQL statements that commit or rollback atomically.
**Why BidCraft uses it:** Bidding must be atomic (bid insert + auction update). Escrow creation must be atomic with payment verification.
**Files:** `auctionService.js` (`BEGIN/COMMIT/ROLLBACK`), `settlementService.js`, `escrowService.js`
**Learn:** `client.query('BEGIN')`, row-level locking (`FOR UPDATE`), `ROLLBACK` on error.

### Razorpay
**What:** Indian payment gateway supporting UPI, cards, net banking.
**Why BidCraft uses it:** Primary payment processor for INR marketplace.
**Key concepts:** Order (amount reservation) → Payment (captured) → Transfer (seller payout).
**Files:** `paymentService.js`, `paymentsController.js`
**Learn:** Razorpay order flow, HMAC signature verification, webhook validation, Razorpay.js frontend SDK.

### Escrow
**What:** A trusted third-party holds funds until conditions are met.
**Why BidCraft uses it:** Protects buyers from fraud. Funds are released only after confirmed delivery.
**Files:** `escrow` table, `paymentsController.js` (create on pay), `ordersController.js` (release on delivery), `escrowService.js` (auto-release)
**Learn:** Escrow lifecycle states, dispute integration, payout transfer mechanics.

### node-cron
**What:** Cron-style job scheduler for Node.js.
**Why BidCraft uses it:** Runs periodic tasks (auction settlement, escrow auto-release) without external infrastructure.
**Files:** `auctionJobs.js`, `escrowAutoRelease.js`
**Learn:** Cron expressions (`* * * * *`), `SKIP LOCKED` for concurrent job safety, idempotency.

### Cloudinary
**What:** Cloud image hosting with CDN and transformation pipeline.
**Why BidCraft uses it:** Stores listing photos. Applies quality/size transformations automatically.
**Files:** `imageService.js`, `imagesController.js`
**Learn:** Upload streams (buffer → Cloudinary), folder organisation, CDN URLs.

### React Context API
**What:** Built-in React mechanism for sharing state without prop drilling.
**Why BidCraft uses it:** Global auth state (user, token, login, logout) available to all components.
**Files:** `lib/auth-context.tsx`
**Learn:** `createContext`, `useContext`, `Provider`, when to use Context vs. state management libraries.

### Next.js App Router
**What:** File-based routing system where folders define URL segments.
**Why BidCraft uses it:** Powers all frontend pages with SSR/SSG capabilities.
**Key patterns used:** Dynamic routes (`[id]`), `use(params)` for async params, `use client` for interactive components, `<Suspense>` for search params.
**Files:** All `app/` directories
**Learn:** Server vs. Client components, `useRouter`, `useSearchParams`, dynamic segment naming.

### Webhooks
**What:** HTTP callbacks from a third party when events occur.
**Why BidCraft uses it:** Razorpay sends `payment.captured` and `payment.failed` events to the backend.
**Files:** `paymentsController.js` `handleWebhook()`
**Learn:** Webhook signature verification (HMAC), raw body preservation, idempotent event handling, ngrok for local testing.

---

## Known Issues & Technical Debt

### 🔴 Critical

| Issue | Location | Risk |
|---|---|---|
| Auth token stored in `localStorage` | `auth-context.tsx:40` | XSS attacks can steal the token. Mitigation: HttpOnly cookies. |
| Test suite runs against production DB | `tests/` (all files) | Accidental data corruption. Needs a separate test database. |
| Admin credential exposure | `.env` committed in repo | `JWT_SECRET`, DB password, Razorpay keys, Cloudinary secrets are in a committed `.env` file. |
| `awaitng_payment` order status not in enum | `schema.sql` order_status enum | The enum has `pending` but `ordersController.js` uses `awaiting_payment`. May cause DB errors on INSERT. |

### 🟠 High Priority

| Issue | Location | Impact |
|---|---|---|
| No refresh token rotation on frontend | `auth-context.tsx` | Expired access tokens result in logout, not seamless refresh. |
| Frontend uploads use `createObjectURL` | `guided-upload.tsx` | Mock URLs are not real CDN URLs. Listings created via frontend have non-persistent photo URLs. |
| `/api/orders/buy-now` route does not exist | `checkout/[id]/page.tsx:40` | The checkout page calls this route but it is not defined in `orders.js`. Will 404 on first use. |
| Listings create page has hardcoded categories | `listings/create/page.tsx:84-89` | Only 4 categories shown. Should fetch from `/api/listings/categories` or equivalent. |
| No shipping address storage | `orders` table | Checkout collects address in a textarea but there is no column to store it. |
| Escrow audit log missing on manual release | `ordersController.js:194` | Auto-release writes audit log; manual delivery confirmation does not. |

### 🟡 Medium Priority

| Issue | Location | Impact |
|---|---|---|
| No notification UI | Frontend | In-app notifications accumulate in DB with no way for users to view them. |
| No email verification UI | Frontend | OTP endpoints exist but users cannot complete the flow. |
| No KYC submission UI | Frontend | KYC backend is full-featured but inaccessible to users. |
| No dispute UI | Frontend | Users cannot open disputes from the frontend. |
| No review submission UI | Frontend | Review API exists. No way to submit from frontend. |
| `lib/mock-data.ts` still in codebase | `lib/mock-data.ts` | Stale static data file. Some sections may still use it. |
| `profileApi.getPublic` wrong path | `api.ts:57` | Points to `/users/:id` (public route), which exists. But `getPublic` is also defined in `profileController.js`. Inconsistent. |
| Creator spotlight uses `Math.random()` | `sections/creator-spotlight.tsx` | Random follower counts in live data cause hydration mismatches. |

### 🔵 Low Priority

| Issue | Location | Impact |
|---|---|---|
| No pagination on listings/auctions | `listingsController.js`, `auctionsController.js` | Will degrade with volume. |
| No input sanitization beyond Joi | All controllers | Joi validates shape but not XSS payloads in strings. |
| `winner_bid_id` column referenced but may not exist | `settlementService.js:113` | Schema does not clearly show this column on `orders`. Possible migration gap. |
| No frontend admin panel | — | Admin operations require direct API calls. |
| `REDIS_URL` unused | `.env` | Reserved but no implementation exists. |

---

## Roadmap

### Immediate (Before MVP — Next 30 Days)

1. **Fix critical bug:** Add `POST /api/orders/buy-now` route or update checkout page to use existing `POST /api/orders`
2. **Fix critical bug:** Verify `awaiting_payment` in `order_status` enum is correct (or fix controller to use `pending`)
3. **Build:** Email verification frontend (OTP modal after registration)
4. **Build:** KYC submission frontend form (PAN, bank, document upload)
5. **Build:** Notification bell UI in Navbar with dropdown
6. **Fix:** Connect `GuidedUpload` to real image upload endpoint (`/api/images/upload`)
7. **Fix:** Fetch categories dynamically in create listing page
8. **Fix:** Implement refresh token rotation on the frontend
9. **Move tokens to HttpOnly cookies** (security hardening)
10. **Shipping address:** Add `shipping_address` column to orders or a separate `addresses` table

### Before Public Launch

11. Review submission UI on order completion
12. Dispute opening UI on order page
13. Admin dashboard frontend (user management, KYC queue, reports)
14. Seller payout dashboard (Razorpay account linking)
15. Real-time bid updates (consider Server-Sent Events as Socket.IO alternative if latency allows)
16. Separate test database for CI/CD
17. Remove secrets from committed `.env`
18. Set `NODE_ENV=production` deployment pipeline

### Post-MVP (V2)

19. Make Offer / counter-offer negotiation flow
20. Seller onboarding wizard (KYC + bank + storefront setup)
21. BullMQ + Redis migration for job reliability and retries
22. Real-time WebSocket bidding (Socket.IO)
23. Image similarity detection for guided upload (OpenCV/Rekognition integration point)
24. Mobile-responsive design audit
25. Pagination and infinite scroll on listings
26. Multi-currency support

---

## Contribution Guide

### Branch Naming
- `feature/description` — New features
- `fix/description` — Bug fixes
- `chore/description` — Non-functional changes

### Adding a New Feature

1. **Database first:** Create a migration in `backend/migrations/` with a timestamped name (`YYYYMMDDHHMMSS_name.js`)
2. **Backend:** Add controller → service (if needed) → route → register in `app.js`
3. **Validate:** Use Joi on all request bodies
4. **Test:** Add an integration test in `backend/tests/`
5. **Frontend:** Add API binding to `lib/api.ts`, then build page/component
6. **Type safety:** Define TypeScript interfaces for API responses

### Code Standards
- JavaScript (ES2022) on backend, TypeScript on frontend
- Async/await throughout (no callback-style code)
- All DB operations use parameterized queries (no string interpolation)
- Services handle business logic; controllers handle HTTP concerns
- Use `notificationService.createNotification()` for all user-facing events

### Running the Full Stack Locally
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev

# Optional: run backend tests
cd backend && npm test

# Optional: test webhook locally
cd backend && npm run test:webhook
```

---

*This README was generated from a direct code audit of the repository on 2026-06-20. It reflects what is actually implemented, not what was planned.*
