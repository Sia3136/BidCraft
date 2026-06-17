# BidCraft — Comprehensive Technical & Strategic Execution Plan
**Prepared by: Senior Product Architect, Startup Strategist & Staff Software Engineer**  
**Date:** June 2026  
**Status:** Ready for Development

---

## TABLE OF CONTENTS
1. [SECTION 1: Product Understanding](#section-1--product-understanding)
2. [SECTION 2: MVP Definition](#section-2--mvp-definition)
3. [SECTION 3: System Architecture](#section-3--system-architecture)
4. [SECTION 4: Development Roadmap](#section-4--development-roadmap)
5. [SECTION 5: Database Design](#section-5--database-design)
6. [SECTION 6: Tech Stack Review](#section-6--tech-stack-review)
7. [SECTION 7: Development Order](#section-7--development-order)
8. [SECTION 8: Information Required from You](#section-8--information-required-from-you)
9. [SECTION 9: GitHub Project Setup](#section-9--github-project-setup)
10. [SECTION 10: Final Execution Plan](#section-10--final-execution-plan)

---

## SECTION 1: PRODUCT UNDERSTANDING

### One-Paragraph Summary
**BidCraft** is India's first creator-first, escrow-protected auction and marketplace platform designed specifically for student entrepreneurs, hobbyist collectors, and emerging artists (₹99–₹5000 price range). It solves the trust crisis in India's P2P transaction ecosystem by combining real-time auctions, secure escrow, creator storefronts, and community-driven features—filling the gap left by Etsy (no auctions), OLX (no escrow), and eBay (abandoned India).

### Target Users

| User Segment | Description | Size | Pain Point |
|---|---|---|---|
| **Student Sellers (18–24)** | Art students, hobbyist crafters, college resellers | ~2.5M in India | "How do I safely sell my creations online?" |
| **Hobbyist Collectors** | Hot Wheels enthusiasts, book collectors, art buyers | ~800K active | "How do I trust a stranger selling to me?" |
| **Craft Entrepreneurs** | Indie makers, jewelers, customization artists | ~1.2M | "Etsy takes 5% + shipping complexity; no auctions." |
| **Gift Buyers** | Unique, personalized items for occasions | ~5M+ (seasonal) | "Instagram DMs aren't safe; I need a platform." |
| **Art Enthusiasts** | Students/young professionals buying emerging artists | ~600K engaged | "Auction houses ignore us unless we spend ₹1L+" |

### Core Problem Being Solved

| Problem | Evidence | BidCraft Answer |
|---|---|---|
| **Trust Crisis in P2P** | OLX = 41% scam complaints; Facebook Marketplace = no recourse | Simulated escrow: funds held until buyer confirms receipt |
| **No Auctions at Scale** | ₹99–₹5000 price range has no auction option in India | Real-time auction engine with Socket.IO, anti-sniping, race condition handling |
| **Etsy is Friction-Heavy** | Global platform; USD pricing; 6–8 week shipping; no auctions | Local payment (UPI), local logistics, Indian creator context |
| **OLX Destroyed Creator Trust** | "Meet the seller in person"; cash-on-delivery; rampant fraud | Structured transaction flow; verified seller badges; tracked shipping |
| **Instagram ≠ Commerce** | Billions of DMs; zero transaction infrastructure; no buyer protection | Checkout, payments, dispute resolution all in one place |

### Unique Selling Proposition (USP)

**"Escrow-Protected, Auction-Powered Marketplace for Indian Creators — Where Your Money is Safe Until Your Item Arrives"**

What makes BidCraft unique:
1. **Escrow as the hero feature** — Not just a nice-to-have; it's the #1 differentiator vs. every Indian P2P platform
2. **Real-time auctions at scale** — Combined with escrow; no one else in India does both at this price point
3. **Creator Profiles + Community** — Not just transactions; reputation, followers, trust scores, creator drops
4. **Student-First Design** — College verification badges, campus campaigns, creator showcases
5. **Anti-Snipe Auction Logic** — Bid in last 60s? Auction extends 2 min. Fairer, increases final price, signals maturity.

### Core Features (MVP + Advanced)

#### Must-Have Features (MVP — Build Immediately)
1. **User Authentication & Profiles**
   - Email/password signup + Google OAuth
   - Creator profile with photo, bio, social links, verification status

2. **Product Listings (Fixed-Price + Auction)**
   - Photo upload (Cloudinary)
   - Description, category, price/auction params
   - Category system: Art, Crafts, Collectibles, Hot Wheels, Books, Electronics, etc.

3. **Search & Discovery**
   - Full-text search (PostgreSQL FTS)
   - Filter by category, price, condition, seller rating
   - Watchlist + price-drop alerts

4. **Auction Engine**
   - Bid placement with real-time updates (Socket.IO)
   - Race condition handling (atomic bid validation)
   - Anti-sniping (auto-extend if bid in last 60s)
   - Auction countdown (Redis TTL)

5. **Make-an-Offer Flow**
   - Submit offer with 24h expiry
   - Counter-offer negotiation
   - Structured accept/decline

6. **Escrow State Machine**
   - PENDING → HELD → SHIPPED → DELIVERED → RELEASED
   - Full audit log of every state change
   - Dispute resolution interface

7. **Payments (Razorpay)**
   - Card, UPI, Netbanking checkout
   - Seller payout via Route API
   - Payment webhook handling

8. **Orders & Shipping**
   - Order tracking
   - Seller uploads tracking number
   - Buyer confirms receipt
   - Dispute initiation

9. **Review System**
   - Buyer → Seller reviews (rating + comment)
   - Seller → Buyer reviews
   - Trust score calculation (composite)

10. **Admin Dashboard**
    - Dispute resolution interface
    - Seller verification
    - Listing moderation
    - Revenue/metrics overview

#### Advanced Features (Phase 4–6)
- Creator followers & storefronts
- Scheduled "Creator Drops"
- Live auction event pages
- Analytics dashboard (conversion, revenue, engagement)
- AI price suggestion

#### Future Moonshots (Post-MVP)
- Live video auctions (BidCraft Live)
- Peer collectible authentication
- AI image description generator
- Creator fund / micro-grants

---

## SECTION 2: MVP DEFINITION

### What Is the MVP?

**Minimum Viable Product = A platform where:**
1. ✅ A student can upload 3 photos, write a description, and list an item for auction in <5 minutes
2. ✅ A buyer can search, bid in real-time, and win an auction
3. ✅ Both can transact safely (escrow protects both sides)
4. ✅ The platform can be demoed to users and investors
5. ✅ Technical complexity is real enough to build a portfolio

### MVP Features (Build These First)

| Feature | Why Essential | Effort | Week |
|---|---|---|---|
| **Auth + Profiles** | Can't sell/buy without identity | Medium | 1–3 |
| **Fixed-Price Listings** | Simpler than auctions; proves upload/search works | Low | 4–5 |
| **Search + Filter** | Necessary to build discovery | Medium | 5–6 |
| **Auction Bidding** | Core product; real-time; race conditions | High | 7–10 |
| **Escrow Flow** | THE moat; HELD → SHIPPED → RELEASED | Medium | 11–13 |
| **Payments (Razorpay)** | Real money; necessary for credibility | Medium | 6–8 |
| **Order Tracking** | Seller ships → buyer confirms | Low | 11–12 |
| **Basic Reviews** | Trust signals; simple 1–5 star | Low | 13–14 |

### Features to Postpone (Don't Build Yet)

| Feature | Why Postpone | Better Time |
|---|---|---|
| **Live Video Auctions** | Complex (WebRTC + streaming); 20% of users will use it | Phase 7+ (after 1K users) |
| **AI Price Suggestion** | Nice-to-have; start with median of similar items | Phase 6 (after 500+ completed auctions) |
| **Creator Drops** | Event scheduling; low priority; build after analytics | Phase 6+ |
| **Mobile App** | Web works fine on mobile; native app is expensive | Phase 8+ (after product-market fit) |
| **AI Image Description** | Nice polish; not table stakes; too complex for MVP | Phase 7+ |
| **Advanced Analytics** | Aggregate queries; useful but not blocking | Phase 6+ |
| **Collectible Authentication** | Requires partner network; not MVP scope | Phase 7+ |

### Features to Remove Entirely (Don't Build)

| Feature | Why Remove | Reality Check |
|---|---|---|
| **Seller Subscription Tiers** | No LTV data yet; can monetize via commission | Complexity for no revenue |
| **Marketplace Moderation ML** | Manual review is fine at <10K listings | Add later when needed |
| **Inventory Management** | 99% of sellers have <100 items; overkill | Revisit if seller pain arises |
| **Multi-Language Support** | English is fine for MVP; Hindi later if demand exists | Adds 40% effort for <5% gain |
| **Advanced Fraud Detection ML** | Manual disputes + admin review works at scale <100K | Add when fraud rate is measurable |
| **SMS Notifications** | Push notifications + email sufficient | SMS costs ₹0.50/message |

### MVP Feature Roadmap

```
Week 1–3:   Auth, User Profiles, RBAC
Week 4–6:   Fixed-Price Listings, Search, Payments
Week 7–10:  Auction Engine (Bidding, Real-Time, Anti-Snipe)
Week 11–13: Escrow (Full FSM, Audit Log, Dispute Resolution)
Week 14–16: Creator Profiles, Reviews, Trust Scores
Week 17–20: Polish, Bug Fixes, Documentation, Demo Prep
```

### MVP Success Criteria

**Launch when:**
1. ✅ A user can complete a 60-second onboarding
2. ✅ A seller can list and auction an item
3. ✅ A buyer can bid and win
4. ✅ Escrow completes a full cycle (HELD → RELEASED)
5. ✅ 10 test users can use it without encountering critical bugs
6. ✅ Registrar/admin can resolve a dispute
7. ✅ Zero false positives in bid race condition tests

---

## SECTION 3: SYSTEM ARCHITECTURE

### User Flows

#### Buyer Journey
```
1. Browse / Search
   ↓
2. View Listing
   ├─ Fixed Price Item
   ├─ Live Auction
   └─ Make-an-Offer Option
   ↓
3. [AUCTION PATH]
   ├─ Place Bid
   ├─ Receive Outbid Notification (Socket.IO push)
   ├─ Re-bid
   └─ Win Auction
   ↓
4. Checkout (Razorpay)
   ├─ Card / UPI / Netbanking
   └─ Payment Captured
   ↓
5. Escrow Enters HELD State
   ├─ Seller notified to ship
   ├─ Buyer sees "Awaiting Shipment"
   └─ 7-day timer starts
   ↓
6. Seller Ships
   ├─ Uploads tracking number
   └─ Buyer notified
   ↓
7. Buyer Confirms Receipt
   ├─ Can upload proof (photo/video of unboxing)
   └─ Escrow → RELEASED
   ↓
8. Funds Released to Seller
   ├─ Razorpay Route transfer
   └─ Both receive confirmation
   ↓
9. Leave Review
   ├─ Rating (1–5 stars)
   ├─ Comment
   └─ Seller can reply
```

#### Seller Journey
```
1. Create Profile
   ├─ Email verification
   ├─ Photo + bio
   └─ Identity verification (optional for MVP)
   ↓
2. Create Listing
   ├─ Upload 3–10 photos (Cloudinary)
   ├─ Write description
   ├─ Select category
   ├─ Set price (fixed) OR auction params
   │  (Start bid: ₹99, Duration: 7 days, Reserve: ₹500)
   └─ Publish
   ↓
3. [AUCTION PATH]
   ├─ Real-time bid notifications (Socket.IO)
   ├─ See bid count, highest bid, time remaining
   └─ 48h before auction end: "Auction ending soon" banner
   ↓
4. Auction Ends
   ├─ Winner determined
   ├─ Seller receives "Auction Won" notification
   └─ Order created automatically
   ↓
5. Shipping
   ├─ 72-hour window to ship
   ├─ Upload tracking number (Shiprocket API or manual)
   ├─ Escrow → SHIPPED state
   └─ Buyer notified with tracking
   ↓
6. Buyer Confirms Receipt
   ├─ Escrow → RELEASED
   ├─ Razorpay Route transfer to seller
   └─ Seller receives payout notification
   ↓
7. Respond to Review (optional)
   └─ Reply to buyer's comment
```

#### Auction Engine (Technical Flow)
```
CREATE AUCTION
  ↓
Store in PostgreSQL: id, seller_id, item_id, start_bid, current_bid, 
                     end_time, status, created_at
  ↓
Set Redis key: auctions:{auction_id} = {current_bid_value}
Set Redis TTL: (end_time - now) seconds
  ↓
Emit Socket.IO event: auction:created to room "auctions"
┌────────────────────────────────────────────────────────────┐
│                      AUCTION LIVE                          │
└────────────────────────────────────────────────────────────┘
BUYER PLACES BID
  ↓
Validate: bid_amount > (current_bid + min_increment)
  ↓
Atomic Operation (PostgreSQL FOR UPDATE or Redis Lua):
  SELECT bid_amount FROM auctions WHERE id=X FOR UPDATE
  ← Check: bid > current_bid + increment?
  → If yes: UPDATE auctions SET current_bid=bid_amount WHERE id=X
  → If no: ABORT, return "Bid too low"
  ↓
If Successful:
  ├─ Insert into bid_history table
  ├─ Redis: auctions:{auction_id} = new_bid
  ├─ Emit Socket.IO to room "auctions:{auction_id}": 
  │    { event: "bid_placed", bid: new_bid, bidder: user_id }
  ├─ All other bidders in room receive real-time update
  ├─ Current highest bidder receives "You've been outbid" alert
  └─ Check: is (now + 60 seconds) >= end_time?
       └─ If YES: extend end_time += 120 seconds
          ├─ Redis TTL update
          └─ Broadcast: "Auction extended!"
  ↓
If Failed:
  └─ Return error: "Bid too low" or "Auction ended"

AUCTION ENDS (TTL expires or scheduled job)
  ↓
BullMQ Job: "auction_end" triggered
  ├─ Query: SELECT * FROM auctions WHERE id=X
  ├─ Query: SELECT user_id FROM bid_history WHERE auction_id=X 
  │          ORDER BY bid_amount DESC LIMIT 1 (winner)
  ├─ Create Order: status=PENDING
  ├─ Create Escrow record: status=HELD, timer=7days
  ├─ Socket.IO broadcast: "Auction ended, winner is [user_id]"
  ├─ Send notifications:
  │  ├─ Winner: "You won! Checkout here"
  │  ├─ Seller: "[Item] sold for ₹X"
  │  └─ Other bidders: "Auction ended"
  └─ Auction status → CLOSED
```

### Escrow State Machine

```
                    ┌─────────────┐
                    │   PENDING   │
                    │ (Buyer Pays)│
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    HELD     │◄─── Razorpay webhook: payment.captured
                    │(Funds Locked)│      Escrow created, 7-day timer starts
                    └──────┬──────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
         ┌─────────────┐        ┌──────────────┐
         │  SHIPPED    │        │  DISPUTED    │◄─ Buyer raises issue
         │(Tracking    │        │(Awaiting     │    within 7 days
         │ uploaded)   │        │ resolution)  │
         └──────┬──────┘        └───────┬──────┘
                │                       │
                ▼                ┌──────┴──────────┐
         ┌─────────────┐         │                │
         │ DELIVERED   │         ▼                ▼
         │(Buyer       │   ┌──────────────┐ ┌──────────────┐
         │ confirms)   │   │  REFUNDED    │ │  RELEASED    │
         └──────┬──────┘   │(Refund issued)│ │(Admin sided  │
                │          └──────────────┘ │ with seller) │
                ▼                           └──────────────┘
         ┌─────────────┐
         │ RELEASED    │
         │(Funds to    │
         │ seller)     │
         └─────────────┘

TRANSITIONS & ACTORS:
PENDING → HELD         [System] Payment webhook received
HELD → SHIPPED        [Seller] Upload tracking number
SHIPPED → DELIVERED   [Buyer] Confirm receipt
DELIVERED → RELEASED  [System] Auto-release after confirmation
HELD → DISPUTED       [Buyer] Raise dispute
DISPUTED → REFUNDED   [Admin] Resolve in buyer's favor
DISPUTED → RELEASED   [Admin] Resolve in seller's favor

TIMEOUT RULES:
- If no payment in 30 min: Cancel order, release reservation
- If no shipment in 72h: Auto-notify seller, extend by 24h
- If unconfirmed delivery after 7d: Auto-release to seller
- Dispute max 48h response time per actor
```

### Payment Flow (Razorpay)

```
1. CHECKOUT
   ├─ Buyer clicks "Pay Now"
   ├─ Order created: status=PENDING
   └─ Razorpay order API called
      └─ Returns: razorpay_order_id
   
2. CUSTOMER ENTERS PAYMENT DETAILS
   ├─ Razorpay Checkout modal opens
   ├─ Buyer selects: Card/UPI/NetBanking/Wallet
   └─ Payment processed
   
3. PAYMENT WEBHOOK (razorpay.com → your backend)
   ├─ Event: payment.captured (or payment.failed)
   ├─ Webhook signature verified
   ├─ If captured:
   │  ├─ Order status → PAID
   │  ├─ Escrow created: status=HELD
   │  ├─ Funds locked (not yet released)
   │  ├─ Seller notified to ship
   │  └─ Buyer receives order confirmation
   └─ If failed:
      └─ Order status → CANCELLED
   
4. SHIPPING & CONFIRMATION
   ├─ Seller uploads tracking
   └─ Buyer confirms receipt
      └─ Escrow → RELEASED
   
5. SELLER PAYOUT (Razorpay Route API)
   ├─ Batch job runs daily/weekly
   ├─ Query: Escrow records with status=RELEASED (not yet paid_out)
   ├─ For each:
   │  ├─ Calculate: total_amount - commission (15% default)
   │  ├─ Razorpay Route: transfer to seller's bank account
   │  └─ Create payout_record
   └─ Seller receives SMS + email notification

COMMISSION MODEL (MVP):
- BidCraft takes: 15% of final sale price
- Razorpay payment processing: ~2% (built into commission)
- Seller receives: 85% of final sale price
- Example: Auction final price ₹1000
  - BidCraft: ₹150
  - Seller: ₹850
```

### Architecture Diagram (High-Level)

```
┌────────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER                             │
│  ┌──────────────────┐              ┌──────────────────┐        │
│  │  React Web App   │              │ Mobile Browser   │        │
│  │ (Vite + Redux)   │              │ (Responsive)     │        │
│  └────────┬─────────┘              └────────┬─────────┘        │
└───────────┼──────────────────────────────────┼─────────────────┘
            │ HTTPS REST                       │ WebSocket
            │                                  │
┌───────────▼──────────────────────────────────▼─────────────────┐
│                   API GATEWAY LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Nginx (Load Balancer, Rate Limiting, SSL Termination)  │  │
│  └────────────────┬────────────────────┬───────────────────┘  │
└─────────────────┼──────────────────────┼──────────────────────┘
                  │                      │
        ┌─────────▼──────┐      ┌────────▼──────────┐
        │   REST API     │      │   WebSocket Svr   │
        │  (Express)     │      │  (Socket.IO)      │
        │  8000          │      │  8001             │
        │                │      │                   │
        │ Routes:        │      │ Rooms:            │
        │ /auth          │      │ auctions:{id}     │
        │ /listings      │      │ notifications     │
        │ /bids          │      │ orders:{id}       │
        │ /orders        │      │                   │
        │ /payments      │      │ Events:           │
        │ /disputes      │      │ bid_placed        │
        │ /reviews       │      │ outbid            │
        │ /admin         │      │ auction_ended     │
        └────────┬───────┘      └────────┬──────────┘
                 │                       │
        ┌────────▼───────────────────────▼────────┐
        │         CORE SERVICES LAYER             │
        │  ┌──────────────────────────────────┐  │
        │  │ Auth Service (JWT + OAuth)       │  │
        │  │ Listing Service (CRUD, Upload)   │  │
        │  │ Auction Service (Bid validation) │  │
        │  │ Escrow Service (State machine)   │  │
        │  │ Payment Service (Razorpay)       │  │
        │  │ Order Service (Tracking)         │  │
        │  │ Notification Service (Bull Queue)│  │
        │  │ Review Service (Ratings, Comments)
        │  │ Admin Service (Disputes, Moderation)
        │  └──────────────────────────────────┘  │
        └─────────────┬────────────────────────┘
                      │
        ┌─────────────▼──────────────────┐
        │     DATA ACCESS LAYER          │
        │                                │
        │  PostgreSQL (Primary DB)       │
        │  ├─ Users table                │
        │  ├─ Listings table             │
        │  ├─ Auctions table             │
        │  ├─ Bids table                 │
        │  ├─ Orders table               │
        │  ├─ Escrow records             │
        │  ├─ Reviews table              │
        │  ├─ Transactions table         │
        │  └─ Dispute records            │
        │                                │
        │  Redis (Cache + PubSub)        │
        │  ├─ auctions:{id} (TTL)        │
        │  ├─ User sessions              │
        │  ├─ Rate limit counters        │
        │  └─ Socket.IO adapter          │
        └────────┬─────────────────────┘
                 │
        ┌────────▼──────────────────────┐
        │   ASYNC JOB QUEUE              │
        │   (BullMQ + Redis)             │
        │                                │
        │  Jobs:                         │
        │  ├─ auction:end (process wins) │
        │  ├─ escrow:timeout (auto-rel)  │
        │  ├─ email:send (notifs)        │
        │  ├─ payment:payout (seller $)  │
        │  └─ cleanup:old_sessions       │
        └────────┬─────────────────────┘
                 │
        ┌────────▼──────────────────────┐
        │    EXTERNAL SERVICES           │
        │                                │
        │  ├─ Razorpay (Payments)        │
        │  ├─ Cloudinary (Image CDN)     │
        │  ├─ Resend (Email)             │
        │  ├─ Google OAuth (Auth)        │
        │  ├─ Shiprocket (Tracking)      │
        │  └─ Sentry (Error Tracking)    │
        └────────────────────────────────┘
```

### Authentication Flow

```
SIGNUP
  ├─ User enters email + password
  ├─ Hash password (bcrypt)
  ├─ Create user record
  ├─ Send verification email
  └─ Return: jwt_token (temporary, 1h expiry)

LOGIN
  ├─ User enters email + password
  ├─ Query user by email
  ├─ Compare password hash
  ├─ If match:
  │  ├─ Generate JWT: { user_id, role, email, exp: now+24h }
  │  ├─ Generate refresh token (stored in Redis with TTL 7d)
  │  └─ Return: { access_token, refresh_token }
  └─ If no match: 401 Unauthorized

OAUTH (Google)
  ├─ User clicks "Sign in with Google"
  ├─ Redirect to Google OAuth
  ├─ Google returns auth code
  ├─ Exchange code for Google ID token
  ├─ Extract: { email, name, picture }
  ├─ Check: does user exist in DB?
  │  ├─ If yes: Login (generate JWT)
  │  └─ If no: Create account + Login
  └─ Return: { access_token, refresh_token }

TOKEN REFRESH
  ├─ Client sends refresh_token to /auth/refresh
  ├─ Validate refresh_token (check Redis)
  ├─ If valid: Generate new access_token
  └─ Return: new { access_token }

LOGOUT
  ├─ Delete refresh_token from Redis
  └─ Client clears access_token from localStorage

PROTECTED ROUTE EXAMPLE
  GET /api/listings/user/:user_id
  ├─ Header: Authorization: Bearer {access_token}
  ├─ Extract JWT from header
  ├─ Verify signature (secret key)
  ├─ Check expiry
  ├─ If valid:
  │  └─ Attach user object to request.user
  │     and proceed
  └─ If invalid: 401 Unauthorized
```

---

## SECTION 4: DEVELOPMENT ROADMAP

### Phase Overview

```
Phase 0 (Week 0): Planning & Setup
Phase 1 (Weeks 1-3): Foundation (Auth, Profiles, RBAC)
Phase 2 (Weeks 4-6): Fixed-Price Marketplace
Phase 3 (Weeks 7-10): Real-Time Auction Engine
Phase 4 (Weeks 11-13): Escrow + Payments
Phase 5 (Weeks 14-16): Creator Economy (Followers, Reviews, Trust)
Phase 6 (Weeks 17-18): Analytics & Creator Dashboard
Phase 7 (Weeks 19-22): Polish, Testing, Demo Prep
Phase 8 (Week 23): Beta Launch Prep
Phase 9 (Week 24+): Post-Launch Monitoring & Hotfixes
```

### Phase 0: Planning & Setup (Week 0)

**Deliverables:**
- [ ] GitHub repository created (public for portfolio)
- [ ] Repository structure set up
- [ ] Development environment documented (README)
- [ ] Tech stack installed locally (Node.js, PostgreSQL, Redis)
- [ ] Environment variables template created (.env.example)
- [ ] Figma design mockups for core flows (auth, listing, bid, escrow)
- [ ] Database schema drafted (ERD)
- [ ] Deployment plan documented (Vercel + Railway)

**Dependencies:**
- None (starter phase)

**Estimated Effort:**
- 3–5 days solo

**Risks:**
- Scope creep on design; use Figma templates, don't redesign
- Environment setup delays; document as you go

**Definition of Done:**
- [ ] Team can clone repo, run `npm install` + `npm run dev`, see running local app
- [ ] Database schema documented
- [ ] All env vars defined in .env.example

---

### Phase 1: Foundation — Auth, Profiles, RBAC (Weeks 1–3)

**Deliverables:**
- [ ] User signup/login (email + password)
- [ ] Google OAuth integration
- [ ] JWT token generation + refresh flow
- [ ] RBAC: Buyer, Seller, Admin roles
- [ ] User profile CRUD (photo upload to Cloudinary, bio, social links)
- [ ] Protected routes middleware
- [ ] Email verification flow (Resend)
- [ ] Password reset flow
- [ ] Session management (Redis + JWT)
- [ ] Authentication tests (Jest)

**Dependencies:**
- Razorpay account (no payment yet, just account setup)
- Google OAuth credentials
- Cloudinary account + API keys
- Resend or SendGrid account

**Estimated Effort:**
- 60–80 hours solo
- **Hours: 10 (auth) + 5 (OAuth) + 8 (RBAC) + 8 (profile CRUD) + 5 (email) + 10 (tests)**

**Risks:**
- JWT expiry/refresh token issues; test thoroughly
- OAuth redirect URIs misconfigured; test in production domain early
- Cloudinary image upload failing; test with multiple file types

**Definition of Done:**
- [ ] New user can sign up via email
- [ ] Existing user can log in
- [ ] User can log in via Google
- [ ] JWT refresh works (24h + 7d refresh)
- [ ] User can update profile (photo + bio)
- [ ] Admin user can see user list
- [ ] All auth routes have integration tests passing
- [ ] Passwords are never logged or visible in error messages

---

### Phase 2: Fixed-Price Marketplace (Weeks 4–6)

**Deliverables:**
- [ ] Listing CRUD (create, read, update, delete)
- [ ] Multi-photo upload (Cloudinary)
- [ ] Category system (Art, Crafts, Collectibles, Hot Wheels, Books, Electronics, Other)
- [ ] Product search (PostgreSQL FTS)
- [ ] Filters (category, price range, condition, seller rating)
- [ ] Wishlist / watchlist feature
- [ ] Price-drop alert notifications (Bull queue + email)
- [ ] Razorpay checkout integration (but no escrow yet)
- [ ] Order creation (status: PENDING)
- [ ] Basic order tracking UI
- [ ] Admin listing moderation panel

**Dependencies:**
- Phase 1 (Auth, Profiles)
- Razorpay API keys

**Estimated Effort:**
- 70–90 hours solo
- **Hours: 15 (listing CRUD) + 12 (search) + 8 (wishlist) + 15 (Razorpay) + 10 (order tracking) + 8 (notifications) + 12 (tests)**

**Risks:**
- Image upload slow; test Cloudinary transforms
- Search queries slow on large datasets; test with 10K+ listings
- Payment webhook timing issues; test webhook replay scenarios

**Definition of Done:**
- [ ] Seller can create listing with 5 photos in <3 minutes
- [ ] Buyer can search by keyword, filter by category + price
- [ ] Buyer can add item to wishlist
- [ ] Buyer receives email notification if item price drops
- [ ] Buyer can check out and complete payment (funds held, not released yet)
- [ ] Seller receives notification of new order
- [ ] Admin can moderate listings (approve/reject)
- [ ] Search returns results in <500ms for 10K listings

---

### Phase 3: Real-Time Auction Engine (Weeks 7–10)

**Deliverables:**
- [ ] Auction creation (start bid, duration, optional reserve)
- [ ] Bid placement API (validates: bid > current_high + min_increment)
- [ ] Race condition handling (PostgreSQL FOR UPDATE or Redis Lua)
- [ ] Real-time bid updates (Socket.IO rooms per auction)
- [ ] Countdown timer (Redis TTL)
- [ ] Anti-snipe protection (extend 120s if bid in last 60s)
- [ ] Outbid notifications (Socket.IO + email)
- [ ] Auction end processing (BullMQ job queue)
- [ ] Winner determination + order creation
- [ ] Bid history display
- [ ] Seller auction management dashboard
- [ ] Tests for race conditions (concurrent bids)

**Dependencies:**
- Phase 2 (Listings, Payments)
- Redis instance with TTL support
- Socket.IO infrastructure
- BullMQ job queue setup

**Estimated Effort:**
- 100–130 hours solo
- **Hours: 20 (bid API + validation) + 18 (race condition handling) + 15 (Socket.IO) + 10 (TTL countdown) + 8 (anti-snipe) + 12 (auction end job) + 20 (tests for concurrency) + 12 (frontend UI)**

**Risks:**
- **Critical: Race conditions at high concurrency.** Test with artillery.io (1000 concurrent bidders)
- Socket.IO sticky sessions needed for horizontal scaling; plan for this
- TTL miscalculation; test edge cases (bid at 59s, 60s, 61s mark)
- BullMQ job failure; test retry logic and dead-letter queue

**Definition of Done:**
- [ ] Two users can bid on same item simultaneously; only highest bid wins
- [ ] Auction countdown visible to all watchers in real-time
- [ ] Bid placed in final 60s extends auction by 2 minutes
- [ ] All outbid users receive notification
- [ ] Auction end job runs, winner notified, order created
- [ ] Artillery test: 1000 concurrent bids on same auction; zero race conditions
- [ ] Bid history page shows all bids chronologically

---

### Phase 4: Escrow + Payments (Weeks 11–13)

**Deliverables:**
- [ ] Escrow state machine implementation (PENDING → HELD → SHIPPED → DELIVERED → RELEASED)
- [ ] Full audit log (every state change logged with timestamp, actor, reason)
- [ ] Escrow timeout handling (auto-release after 7 days)
- [ ] Shipping label integration (Shiprocket API, or manual tracking upload)
- [ ] Buyer confirm receipt flow
- [ ] Dispute initiation (buyer can open dispute within 7 days)
- [ ] Admin dispute resolution panel (side with buyer or seller)
- [ ] Razorpay payout processing (Route API, seller settlement)
- [ ] Seller payout dashboard (earnings, pending payouts)
- [ ] Daily/weekly settlement job (BullMQ)
- [ ] Payout confirmation emails + SMS
- [ ] Escrow tests (state machine, timeouts, disputes)

**Dependencies:**
- Phase 3 (Auctions)
- Razorpay Route API credentials
- Shiprocket or similar tracking API

**Estimated Effort:**
- 90–120 hours solo
- **Hours: 25 (escrow FSM + audit log) + 15 (timeout handling) + 12 (shipping integration) + 20 (dispute flow + admin panel) + 15 (Razorpay payout) + 12 (settlement job) + 12 (tests)**

**Risks:**
- Escrow state corruption if not properly transactional; use DB transactions
- Payout delays; test Razorpay Route in test mode thoroughly
- Dispute resolution bias; log all admin actions
- Edge case: what if buyer confirms receipt but funds aren't released? Test all paths

**Definition of Done:**
- [ ] End-to-end escrow flow: Payment → HELD → Seller ships → Buyer confirms → RELEASED
- [ ] Full audit log of each escrow record (every state transition visible)
- [ ] Seller can view payout status and withdraw on demand
- [ ] Buyer can open dispute; admin can side with buyer or seller
- [ ] Seller receives payout email after 7 days (if no dispute)
- [ ] Simulated escrow flow tested with real Razorpay webhooks (test mode)

---

### Phase 5: Creator Economy (Weeks 14–16)

**Deliverables:**
- [ ] Follower system (follow/unfollow creators)
- [ ] Creator storefront (public profile page: avatar, bio, followers, items, reviews)
- [ ] Creator portfolio page (all items sold, auctions, followers)
- [ ] Review system (buyer → seller: rating + comment; seller → buyer: optional reply)
- [ ] Trust score calculation (composite: delivery speed, description accuracy, escrow completion rate)
- [ ] Verified Creator badge (admin-assigned, visible on profile)
- [ ] Seller analytics (total sales, revenue, items listed, follower growth)
- [ ] Buyer can follow sellers for new listings
- [ ] New listing notification to followers (Bull queue + email + Socket.IO)
- [ ] Creator discover page (sort by: new, trending, top-rated)
- [ ] Tests for trust score calculation, review aggregation

**Dependencies:**
- Phase 4 (Escrow, Orders)

**Estimated Effort:**
- 80–100 hours solo
- **Hours: 10 (follower system) + 12 (creator storefront) + 10 (review system) + 12 (trust score algo) + 8 (verified badge) + 8 (notifications) + 15 (analytics queries) + 15 (tests)**

**Risks:**
- Trust score gaming (sellers creating fake reviews); rate-limit review creation
- Analytics queries slow on large datasets; add caching + materialized views
- Follower notification spam; implement digest or opt-in

**Definition of Done:**
- [ ] Buyer can follow a creator
- [ ] Creator profile page shows: followers, total items, avg rating, reviews
- [ ] New listing by followed creator triggers notification
- [ ] Trust score visible on seller profile (composite of deliveries, ratings)
- [ ] Admin can assign "Verified Creator" badge
- [ ] Creator discover page works (sort by followers, avg rating, newest)
- [ ] Analytics show: total sales, revenue, conversion rate

---

### Phase 6: Analytics & Dashboard (Weeks 17–18)

**Deliverables:**
- [ ] Seller dashboard homepage (key metrics summary)
- [ ] Sales chart (revenue by day/week/month)
- [ ] Product performance (views, wishlists, conversion rate per item)
- [ ] Auction analytics (total bids, highest bid, engagement rate)
- [ ] Follower growth chart
- [ ] Top-performing items (by revenue or bids)
- [ ] Admin dashboard (platform metrics: GMV, total users, active auctions)
- [ ] Analytics caching (Redis) for fast queries
- [ ] Export to CSV (monthly sales report)

**Dependencies:**
- Phase 5 (Creator ecosystem)

**Estimated Effort:**
- 40–60 hours solo
- **Hours: 15 (dashboard UI) + 20 (analytics queries + caching) + 10 (charts library) + 5 (export)**

**Risks:**
- Slow queries on large datasets; use aggregation tables or materialized views
- Chart library bloat; use Recharts (lightweight)

**Definition of Done:**
- [ ] Seller can view dashboard with sales summary
- [ ] Charts render in <1 second
- [ ] Can filter by date range
- [ ] CSV export includes all transactions from selected period

---

### Phase 7: Polish, Testing, Demo Prep (Weeks 19–22)

**Deliverables:**
- [ ] Mobile responsiveness polish (tested on iOS Safari, Android Chrome)
- [ ] 404, 500 error pages
- [ ] Loading states for all async operations
- [ ] Form validation (client + server)
- [ ] Accessibility audit (a11y: color contrast, ARIA labels, keyboard nav)
- [ ] End-to-end tests (Playwright: auth → listing → bid → escrow → payout)
- [ ] Load testing (k6: 100 concurrent users)
- [ ] Security audit (SQL injection, XSS, CSRF, rate limiting)
- [ ] Documentation (API docs with Swagger, deployment guide)
- [ ] Demo script + walkthrough video (3 min)
- [ ] GitHub README with project overview, setup, architecture diagrams

**Dependencies:**
- All previous phases

**Estimated Effort:**
- 60–80 hours solo

**Risks:**
- Last-minute bugs; stabilize codebase early
- Demo day performance; test on slow network (3G)
- Documentation incomplete; assign owner early

**Definition of Done:**
- [ ] App works smoothly on mobile (375px viewport)
- [ ] All CTA buttons have loading states
- [ ] E2E test passes: new user → list item → bid → win → escrow → payout
- [ ] Load test: 100 concurrent users, p95 latency <500ms
- [ ] No SQL injection or XSS vulnerabilities (security audit)
- [ ] API documentation complete (Swagger)
- [ ] 3-minute demo video available
- [ ] README includes: architecture diagram, feature list, setup instructions

---

### Phase 8: Beta Launch Prep (Week 23)

**Deliverables:**
- [ ] Seed data: 50 test auctions, 20 test users
- [ ] Launch checklist (monitoring, alerts, rollback plan)
- [ ] Error tracking (Sentry) configured
- [ ] Analytics (Google Analytics or Plausible)
- [ ] Feedback collection (Typeform or email)
- [ ] Terms of Service + Privacy Policy (legal)
- [ ] Community guidelines
- [ ] Beta invite email list (50 target users from college)

**Definition of Done:**
- [ ] All systems monitored; alerts configured for errors, slow queries
- [ ] Deployment is one-click; rollback is one-click
- [ ] 50 beta testers recruited

---

### Phase 9: Soft Launch & Hotfix (Week 24+)

**Deliverables:**
- [ ] Deploy to production
- [ ] Monitor for errors, performance issues
- [ ] Fix critical bugs within 24h
- [ ] Collect user feedback
- [ ] Plan Phase 2 features based on feedback

---

### Dependency Graph

```
Phase 0 (Planning)
  ↓
Phase 1 (Auth & Profiles)
  ├→ Phase 2 (Fixed-Price Listings)
  │  ├→ Phase 3 (Auction Engine)
  │  │  └→ Phase 4 (Escrow + Payments)
  │  │     └→ Phase 5 (Creator Economy)
  │  │        └→ Phase 6 (Analytics)
  │  │           └→ Phase 7 (Polish + Testing)
  │  │              └→ Phase 8 (Launch Prep)
  │  │                 └→ Phase 9 (Go Live)
```

---

## SECTION 5: DATABASE DESIGN

### Entity List

| Entity | Purpose | Key Fields |
|---|---|---|
| **User** | Platform user (buyer, seller, admin) | id, email, password_hash, name, avatar_url, role, bio, created_at |
| **Profile** | Extended user info | user_id, bio, social_links (JSON), verification_status, verified_at |
| **Listing** | Sellable item | id, seller_id, title, description, photos (JSON), category, condition, status |
| **Auction** | Auction metadata | id, listing_id, start_bid, current_bid, end_time, reserve_price, status |
| **Bid** | Individual bid on an auction | id, auction_id, bidder_id, bid_amount, created_at |
| **Order** | Purchase record | id, buyer_id, seller_id, item_id, auction_id, total_price, status |
| **Escrow** | Escrow transaction | id, order_id, status (PENDING/HELD/SHIPPED/DELIVERED/RELEASED/DISPUTED), created_at |
| **Escrow_Audit** | Full audit trail of escrow | id, escrow_id, old_status, new_status, actor_id, reason, created_at |
| **Review** | Buyer → Seller feedback | id, order_id, reviewer_id, reviewee_id, rating, comment, created_at |
| **Wishlist** | User's saved items | id, user_id, listing_id, created_at |
| **Follow** | Buyer following seller | id, follower_id, seller_id, created_at |
| **Payment** | Payment transaction | id, order_id, amount, razorpay_order_id, status, created_at |
| **Payout** | Seller payout via Razorpay Route | id, seller_id, amount, razorpay_transfer_id, status, created_at |
| **Dispute** | Escrow dispute | id, escrow_id, initiator_id, reason, status, resolution, resolved_by, resolved_at |

### Table Schema

```sql
-- USERS
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url VARCHAR(500),
  role VARCHAR(20) DEFAULT 'buyer', -- buyer, seller, admin
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PROFILES
CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id),
  social_links JSONB, -- { twitter, instagram, website }
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  verification_method VARCHAR(50), -- email, sms, manual_admin
  college_name VARCHAR(255),
  college_verified BOOLEAN DEFAULT FALSE,
  trust_score NUMERIC(3, 2) DEFAULT 0.00, -- 0.00 to 5.00
  total_sales INTEGER DEFAULT 0,
  total_revenue NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- LISTINGS
CREATE TABLE listings (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER NOT NULL REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL, -- art, crafts, collectibles, hot_wheels, books, etc.
  condition VARCHAR(20), -- new, like_new, good, fair, poor
  photos JSONB NOT NULL, -- [{ cloudinary_url, order: 1 }, ...]
  listing_type VARCHAR(20) NOT NULL, -- fixed_price, auction
  price NUMERIC(10, 2), -- for fixed-price listings
  status VARCHAR(20) DEFAULT 'active', -- active, sold, delisted, draft
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_type CHECK (listing_type IN ('fixed_price', 'auction'))
);

-- AUCTIONS
CREATE TABLE auctions (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER UNIQUE NOT NULL REFERENCES listings(id),
  seller_id INTEGER NOT NULL REFERENCES users(id),
  start_bid NUMERIC(10, 2) NOT NULL,
  current_bid NUMERIC(10, 2),
  reserve_price NUMERIC(10, 2),
  min_bid_increment NUMERIC(10, 2) DEFAULT 10.00,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- active, ended, cancelled
  total_bids INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- BIDS
CREATE TABLE bids (
  id SERIAL PRIMARY KEY,
  auction_id INTEGER NOT NULL REFERENCES auctions(id),
  bidder_id INTEGER NOT NULL REFERENCES users(id),
  bid_amount NUMERIC(10, 2) NOT NULL,
  is_winning BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (auction_id, bidder_id, created_at) -- prevent exact duplicate bids
);

-- ORDERS
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  buyer_id INTEGER NOT NULL REFERENCES users(id),
  seller_id INTEGER NOT NULL REFERENCES users(id),
  listing_id INTEGER REFERENCES listings(id),
  auction_id INTEGER REFERENCES auctions(id),
  total_amount NUMERIC(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, paid, shipped, delivered, completed
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PAYMENTS
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  amount NUMERIC(10, 2) NOT NULL,
  razorpay_order_id VARCHAR(100) UNIQUE NOT NULL,
  razorpay_payment_id VARCHAR(100),
  status VARCHAR(20), -- created, captured, failed, refunded
  payment_method VARCHAR(50), -- card, upi, netbanking, wallet
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ESCROW
CREATE TABLE escrow (
  id SERIAL PRIMARY KEY,
  order_id INTEGER UNIQUE NOT NULL REFERENCES orders(id),
  status VARCHAR(20) DEFAULT 'pending', 
    -- pending, held, shipped, delivered, released, disputed, refunded
  buyer_id INTEGER NOT NULL REFERENCES users(id),
  seller_id INTEGER NOT NULL REFERENCES users(id),
  amount_held NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  released_at TIMESTAMP,
  timeout_at TIMESTAMP -- auto-release if no activity
);

-- ESCROW AUDIT LOG (Full history)
CREATE TABLE escrow_audit_log (
  id SERIAL PRIMARY KEY,
  escrow_id INTEGER NOT NULL REFERENCES escrow(id),
  old_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  actor_id INTEGER REFERENCES users(id), -- who triggered the change
  reason TEXT, -- "buyer_confirmed_receipt", "admin_sided_with_buyer", etc.
  created_at TIMESTAMP DEFAULT NOW()
);

-- SHIPMENT TRACKING
CREATE TABLE shipments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  tracking_number VARCHAR(100),
  carrier VARCHAR(50), -- shiprocket, bluedart, delhivery, etc.
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  status VARCHAR(20), -- pending, in_transit, delivered, failed
  created_at TIMESTAMP DEFAULT NOW()
);

-- REVIEWS
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  reviewer_id INTEGER NOT NULL REFERENCES users(id),
  reviewee_id INTEGER NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  categories JSONB, -- { accuracy: 5, delivery_speed: 4, communication: 5 }
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- DISPUTES
CREATE TABLE disputes (
  id SERIAL PRIMARY KEY,
  escrow_id INTEGER NOT NULL REFERENCES escrow(id),
  initiator_id INTEGER NOT NULL REFERENCES users(id),
  reason TEXT NOT NULL,
  description TEXT,
  evidence_urls JSONB, -- photos/videos
  status VARCHAR(20) DEFAULT 'open', -- open, awaiting_seller_response, awaiting_admin, resolved
  seller_response TEXT,
  seller_response_at TIMESTAMP,
  resolution VARCHAR(20), -- favor_buyer, favor_seller
  resolved_by INTEGER REFERENCES users(id), -- admin who resolved
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- WISHLIST
CREATE TABLE wishlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  listing_id INTEGER NOT NULL REFERENCES listings(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, listing_id)
);

-- FOLLOWERS
CREATE TABLE follows (
  id SERIAL PRIMARY KEY,
  follower_id INTEGER NOT NULL REFERENCES users(id),
  seller_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (follower_id, seller_id),
  CONSTRAINT no_self_follow CHECK (follower_id != seller_id)
);
```

### Key Indexes

```sql
-- PERFORMANCE CRITICAL INDEXES

-- Auction queries
CREATE INDEX idx_auctions_end_time ON auctions(end_time);
CREATE INDEX idx_auctions_status ON auctions(status);
CREATE INDEX idx_auctions_seller_id ON auctions(seller_id);

-- Bid queries (real-time)
CREATE INDEX idx_bids_auction_id ON bids(auction_id);
CREATE INDEX idx_bids_created_at ON bids(created_at DESC);
CREATE INDEX idx_bids_bidder_id ON bids(bidder_id);
CREATE INDEX idx_bids_auction_id_amount 
  ON bids(auction_id, bid_amount DESC); -- find highest bid

-- Order queries
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_seller_id ON orders(seller_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Escrow queries
CREATE INDEX idx_escrow_status ON escrow(status);
CREATE INDEX idx_escrow_created_at ON escrow(created_at);
CREATE INDEX idx_escrow_timeout_at ON escrow(timeout_at); -- for auto-release job

-- Listing queries (search heavy)
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_seller_id ON listings(seller_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_listings_title_fts ON listings USING GIN(to_tsvector('english', title));

-- User queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Review queries
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_reviews_order_id ON reviews(order_id);

-- Follow queries
CREATE INDEX idx_follows_seller_id ON follows(seller_id);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
```

### Entity-Relationship Diagram (Mermaid)

```mermaid
erDiagram
  USERS ||--o{ LISTINGS : "sells"
  USERS ||--o{ PROFILES : "has"
  USERS ||--o{ BIDS : "places"
  USERS ||--o{ ORDERS : "buys_and_sells"
  USERS ||--o{ REVIEWS : "writes"
  USERS ||--o{ WISHLIST : "saves"
  USERS ||--o{ FOLLOWS : "followers_and_following"
  USERS ||--o{ DISPUTES : "initiates"
  
  LISTINGS ||--|| AUCTIONS : "can_be"
  LISTINGS ||--o{ ORDERS : "purchased_via"
  LISTINGS ||--o{ WISHLIST : "saved_in"
  
  AUCTIONS ||--o{ BIDS : "receives"
  BIDS ||--|| AUCTIONS : "placed_on"
  
  ORDERS ||--|| PAYMENTS : "has"
  ORDERS ||--|| ESCROW : "creates"
  ORDERS ||--|| SHIPMENTS : "has"
  ORDERS ||--o{ REVIEWS : "reviewed_after"
  
  ESCROW ||--o{ ESCROW_AUDIT_LOG : "logs"
  ESCROW ||--|| DISPUTES : "may_have"
  
  PROFILES ||--|| USERS : "extends"

  USERS {
    int id PK
    string email UK
    string password_hash
    string google_id UK
    string first_name
    string last_name
    string avatar_url
    string role
    text bio
    timestamp created_at
  }

  PROFILES {
    int id PK
    int user_id FK "UK"
    jsonb social_links
    boolean is_verified
    timestamp verified_at
    string verification_method
    string college_name
    boolean college_verified
    decimal trust_score
    int total_sales
    decimal total_revenue
    timestamp created_at
  }

  LISTINGS {
    int id PK
    int seller_id FK
    string title
    text description
    string category
    string condition
    jsonb photos
    string listing_type
    decimal price
    string status
    int view_count
    timestamp created_at
  }

  AUCTIONS {
    int id PK
    int listing_id FK "UK"
    int seller_id FK
    decimal start_bid
    decimal current_bid
    decimal reserve_price
    decimal min_bid_increment
    timestamp start_time
    timestamp end_time
    string status
    int total_bids
    timestamp created_at
  }

  BIDS {
    int id PK
    int auction_id FK
    int bidder_id FK
    decimal bid_amount
    boolean is_winning
    timestamp created_at
  }

  ORDERS {
    int id PK
    int buyer_id FK
    int seller_id FK
    int listing_id FK
    int auction_id FK
    decimal total_amount
    string status
    timestamp created_at
  }

  PAYMENTS {
    int id PK
    int order_id FK
    decimal amount
    string razorpay_order_id UK
    string razorpay_payment_id
    string status
    string payment_method
    timestamp created_at
  }

  ESCROW {
    int id PK
    int order_id FK "UK"
    int buyer_id FK
    int seller_id FK
    decimal amount_held
    string status
    timestamp created_at
    timestamp released_at
    timestamp timeout_at
  }

  ESCROW_AUDIT_LOG {
    int id PK
    int escrow_id FK
    string old_status
    string new_status
    int actor_id FK
    text reason
    timestamp created_at
  }

  SHIPMENTS {
    int id PK
    int order_id FK
    string tracking_number
    string carrier
    timestamp shipped_at
    timestamp delivered_at
    string status
    timestamp created_at
  }

  REVIEWS {
    int id PK
    int order_id FK
    int reviewer_id FK
    int reviewee_id FK
    int rating
    text comment
    jsonb categories
    int helpful_count
    timestamp created_at
  }

  DISPUTES {
    int id PK
    int escrow_id FK
    int initiator_id FK
    text reason
    text description
    jsonb evidence_urls
    string status
    text seller_response
    timestamp seller_response_at
    string resolution
    int resolved_by FK
    timestamp resolved_at
    timestamp created_at
  }

  WISHLIST {
    int id PK
    int user_id FK
    int listing_id FK
    timestamp created_at
  }

  FOLLOWS {
    int id PK
    int follower_id FK
    int seller_id FK
    timestamp created_at
  }
```

### Query Patterns & Optimization

| Query | Optimization | Notes |
|---|---|---|
| Find highest bid for auction | `idx_bids_auction_id_amount` — retrieves in O(log n) | Critical for real-time bidding |
| Find active auctions ending soon | `idx_auctions_end_time` — WHERE end_time BETWEEN now AND now+1h | Job runs every 10 min |
| Get seller's listings | `idx_listings_seller_id` + category filter | Paginate: 20 per page |
| Full-text search listings | `idx_listings_title_fts` — PostgreSQL GIN index | `SELECT * FROM listings WHERE title @@ to_tsquery(...)` |
| Get user's reviews | `idx_reviews_reviewee_id` — quick lookup | Aggregate: avg(rating) in Redis |
| Get user's followers | `idx_follows_seller_id` — COUNT(*) query | Cache follower count in user.profiles |

### Scalability Considerations

**Short-term (first 10K users):**
- Current schema is fine
- Monitor slow queries; add indexes as needed
- Cache review aggregates in Redis

**Medium-term (10K–100K users):**
- Add read replicas for analytics queries
- Consider materialized views for: seller_stats (total_sales, avg_rating), auction_stats
- Shard users by region if needed

**Long-term (100K+ users):**
- Partition by date: listings by created_at, bids by auction_id
- Move analytics to separate OLAP database (DuckDB, BigQuery)
- Archive old auctions/disputes to cold storage

---

## SECTION 6: TECH STACK REVIEW

### Recommended Tech Stack

| Layer | Technology | Version | Why This Choice |
|---|---|---|---|
| **Frontend** | React 18 + Vite | 18.x | Fast build, HMR, huge ecosystem. Next.js is overkill for MVP. |
| **Frontend Build** | Vite | 5.x | 10x faster than Webpack; ESM-based; great DX. |
| **Styling** | TailwindCSS | 4.x | Utility-first; no CSS bloat; rapid prototyping. |
| **State Mgmt** | Redux Toolkit | 2.x | Predictable state for complex auction + escrow flows. |
| **HTTP Client** | Axios | 1.x | Simple, widely known, good interceptor support. |
| **Real-Time** | Socket.IO (Client) | 4.x | Handles reconnection, fallbacks. Easiest WebSocket library. |
| **UI Components** | shadcn/ui + Radix | latest | Headless, accessible, zero dependencies. |
| **Backend** | Node.js + Express | 20.x LTS | Fast prototyping, JavaScript throughout, good for startups. |
| **API Design** | REST + WebSocket | — | REST for CRUD, WebSocket only for real-time (auctions, notifications). |
| **Database** | PostgreSQL | 15.x | Relational data perfect for marketplace. ACID transactions for bidding. |
| **Cache** | Redis | 7.x | Session store, auction TTLs, real-time data. |
| **Job Queue** | BullMQ (Node.js) | 5.x | Redis-backed; runs on same Node.js process. Simple, reliable. |
| **Authentication** | JWT + bcrypt | — | Stateless; scales horizontally. Standard for APIs. |
| **OAuth** | Passport.js | 0.7.x | Mature, battle-tested. Handles Google OAuth easily. |
| **File Upload** | Cloudinary | — | CDN, image transforms, free tier. No need for S3 complexity at MVP. |
| **Payments** | Razorpay | API v2 | Indian payments, UPI, escrow-friendly Route API. No alternatives for INR at this scale. |
| **Shipping** | Shiprocket API | v1 | Integrates 15+ Indian couriers. Auto-tracking updates. |
| **Email** | Resend or Brevo | — | Resend: modern, good DX. Brevo: better for bulk emails. Start with Resend. |
| **Error Tracking** | Sentry | latest | Real-time error monitoring, alerts, sourcemap support. |
| **Testing** | Jest (unit), Playwright (E2E) | latest | Jest: fast, good DX. Playwright: reliable, supports all browsers. |
| **API Docs** | Swagger (OpenAPI) | 3.1 | Auto-generates docs from JSDoc comments. Impressive for interviews. |
| **Deployment** | Vercel (frontend), Railway (backend) | — | Vercel: instant deploys, free tier. Railway: PostgreSQL + Redis + Node included. |
| **CI/CD** | GitHub Actions | — | Free, native to GitHub, easy setup. |
| **Monitoring** | Datadog (future) | — | Logs, metrics, APM. For now, Sentry + Railway logs sufficient. |

### Why NOT Other Technologies

| Technology | Why Avoided | Better Alternative |
|---|---|---|
| **Next.js** | Overkill for MVP; adds complexity (SSR, ISR). React + Vite is faster to iterate. | React 18 + Vite |
| **Vue.js** | Good but smaller ecosystem than React. Less hiring pool for future team. | React |
| **Django / FastAPI** | Python slower than Node for startup pace. Escrow requires real-time (WebSockets). | Node.js + Express |
| **MongoDB** | Document DB not ideal for complex relational data (orders, escrow, bids). ACID txns critical. | PostgreSQL |
| **Firebase** | Lock-in risk; limited control over auction logic; expensive at scale. | PostgreSQL + Railway |
| **AWS Lambda** | Overkill; cold starts hurt real-time. Railway is simpler. | Railway |
| **GraphQL** | Over-engineered for MVP. REST + WebSocket is clearer, easier to debug. | REST |
| **Socket.IO v3** | Use v4; v3 has reconnection bugs. | Socket.IO v4 |

### Architecture Decisions (Justified for Interviews)

#### Decision 1: PostgreSQL for Bids (Not NoSQL)
**Problem:** Bids arrive at 100+ per second. Need atomic updates.

**Solution:** PostgreSQL `FOR UPDATE` (row-level locking) or transactions.

```sql
BEGIN TRANSACTION;
  SELECT bid_amount FROM auctions WHERE id=$1 FOR UPDATE;
  -- Check: is new_bid > current_bid + increment?
  UPDATE auctions SET current_bid=$2 WHERE id=$1;
COMMIT;
```

**Why not NoSQL?** MongoDB transactions are slower, not ACID-compliant for all scenarios.

**Interview answer:** "We use PostgreSQL because auction bids require atomic operations. In a NoSQL DB, we risk race conditions where two bids arrive simultaneously and both 'win'. PostgreSQL's row-level locking ensures only one bid wins."

#### Decision 2: Redis for Auction TTL (Not Cron Jobs)
**Problem:** Auctions end at specific times. Need reliable countdown.

**Solution:** Redis `SET key EX seconds`. When TTL expires, triggers a job.

```javascript
// Set auction TTL
redis.setex(`auction:${auctionId}`, AUCTION_DURATION, auctionEndTime);

// BullMQ job fires when TTL expires
queue.add('auction_end', { auctionId }, {
  delay: AUCTION_DURATION * 1000,
  attempts: 3
});
```

**Why not Cron?** Cron jobs are fragile at scale; can miss auctions if server is down.

**Interview answer:** "We use Redis TTLs + BullMQ for reliability. If a cron job misses an auction end, users are left hanging. With Redis + queue, we have retries and persistence."

#### Decision 3: Socket.IO for Real-Time (Not Raw WebSockets)
**Problem:** Browsers need fallback if WebSocket fails.

**Solution:** Socket.IO handles this automatically (polling as fallback).

**Interview answer:** "Socket.IO is a wrapper around WebSockets with fallbacks (long-polling, polling). If WebSocket is blocked by a proxy, Socket.IO degrades gracefully. Raw WebSockets would break in restrictive networks."

#### Decision 4: Simulated Escrow for MVP (Not Real NBFC Escrow)
**Problem:** Real escrow requires NBFC license (regulatory, expensive).

**Solution:** Platform-held escrow (HELD state, funds in BidCraft bank account).

**Future:** Once we have users and revenue, apply for NBFC license.

**Interview answer:** "We use simulated escrow initially: funds are held in our Razorpay merchant account, not a regulated escrow. This is transparent to users. It lets us launch fast, validate the idea, then transition to regulated escrow."

---

## SECTION 7: DEVELOPMENT ORDER

### What to Build First (Ranked by Value)

**Top 3 Critical Path Items:**

1. **Authentication + User Profiles** (Weeks 1–3)
   - Nothing else works without this
   - Blocks all downstream features
   - Unblock Phase 2 as soon as possible

2. **Fixed-Price Listings + Search** (Weeks 4–6)
   - Proves the marketplace can work
   - Buyers can browse; sellers can list
   - Supports simpler checkout flow before auctions

3. **Auction Engine with Real-Time Bidding** (Weeks 7–10)
   - This is the hero feature
   - Race condition handling is the technical moat
   - Takes longest; most complex

**Why this order:**
- **Build sellers first:** They need to list items. Without listings, there's nothing to bid on.
- **Build buyers second:** They need to find items. Search + discovery comes before checkout.
- **Auctions last but hero:** Once the marketplace core works, add the complexity of real-time auctions.

### Build Second (Dependency Chain)

4. **Escrow + Dispute Resolution** (Weeks 11–13)
   - Depends on: Orders, Payments, Shipping
   - Builds trust in the platform
   - Enables real money transactions

5. **Creator Profiles + Reviews** (Weeks 14–16)
   - Depends on: Orders
   - Sellers need to look trustworthy
   - Followers = retention loop

6. **Analytics** (Weeks 17–18)
   - Depends on: Orders, Reviews
   - Nice-to-have for MVP
   - Helps sellers understand performance

### Never Build Until Users Exist

**These are vanity features without users:**

- ❌ Live Video Auctions (BidCraft Live)
- ❌ AI Price Suggestion (nice-to-have)
- ❌ Mobile App (web works; native is expensive)
- ❌ Advanced Fraud Detection ML (manual review is fine at 100 users)
- ❌ Email Marketing Automation (premature; focus on product)
- ❌ Collectible Authentication Network (build community first)

**When to build these:**
- **Live Video:** After 500+ active sellers + product-market fit
- **AI:** After 1000+ completed auctions (data exists)
- **Mobile App:** After 50K+ DAU on web
- **Fraud ML:** After 10+ disputes (patterns emerge)

### Development Parallel Tracks (To Speed Up)

Some tasks can run in parallel:

```
Week 1–3: Auth (1 dev)
Week 4–6: Listings + Payments (1 dev) IN PARALLEL with Auth
Week 7–10: Auction Engine (1 dev) IN PARALLEL with everything else
```

**If solo:** Do them sequentially. Each phase is a blocker for the next.

**If 2+ devs:** 
- Dev 1: Auth → Listings → Payments
- Dev 2: Auction Engine (uses existing DB schema from Phase 2)
- They can work in parallel after Phase 1.

---

## SECTION 8: INFORMATION REQUIRED FROM YOU

**Before development starts, I need these decisions & assets from you.**

### SECTION 8A: Business Decisions

| Item | Decision | Impact | Timeline |
|---|---|---|---|
| **Revenue Model** | What % commission? | Affects payout calculations, seller pricing | Before Phase 4 |
| **Commission Structure** | 15% platform? 2% payment processing? Or bundled? | Affects seller earnings, competitiveness | Before Phase 4 |
| **Seller Payout Frequency** | Weekly? Daily? On-demand? | Affects cash flow, complexity | Before Phase 4 |
| **Launch Categories** | Which 5 categories first? (Art, Crafts, Hot Wheels, etc.) | Affects listing category dropdowns | Before Phase 2 |
| **Seller Verification Process** | Manual admin review? Email + ID? Automated checks? | Affects seller onboarding UX | Before Phase 5 |
| **Dispute Policies** | Max dispute value? Time window? Who decides? | Affects admin workload, legal risk | Before Phase 4 |
| **Return Policy** | Returnable or final sale? Return window? | Affects buyer confidence | Before MVP launch |
| **Buyer Protections** | Item not as described? Item lost? What's covered? | Affects dispute resolution | Before Phase 4 |

### SECTION 8B: Technical Decisions

| Item | Decision | Options | Impact |
|---|---|---|---|
| **Hosting Budget** | $/month for compute? | $0–50 (Railway free tier) vs $50–200 (production setup) | Affects scalability, monitoring |
| **Database** | PostgreSQL provider? | Railway (included), Neon (managed), AWS RDS | Affects cost, maintenance |
| **Preferred Frameworks** | Agree with React + Node? Any objections? | React, Vue, Svelte; Node, Python, Go | Affects hiring, team dynamics |
| **Payment Processor** | Razorpay? Instamojo? Cashfree? | Razorpay (best UPI support) vs alternatives | Affects UX, fees, settlement |
| **Email Service** | Resend or Brevo? | Resend (modern, $20/month) vs Brevo (bulk, $0–50) | Affects notification reliability |
| **Image CDN** | Cloudinary? Imgix? AWS S3 + CloudFront? | Cloudinary (free tier, transforms) vs S3 (complex) | Affects image performance, cost |

### SECTION 8C: Design & Brand

| Item | Deliverable | Needed By | Notes |
|---|---|---|---|
| **Logo** | PNG, SVG | Phase 7 (polish) | For favicon, header, emails |
| **Color Scheme** | Primary, secondary, accent colors | Phase 2 (listings UI) | Affects Tailwind config |
| **Typography** | Font family (Google Fonts?) | Phase 2 | Affects brand identity |
| **Figma Design File** | Wireframes/mockups for: Auth, Listing, Auction, Escrow pages | Phase 1 | Will I design or do you? |
| **Branding Guidelines** | Tone of voice, imagery style | Phase 2 | For marketing copy, help text |
| **UI Reference Sites** | Examples of style you like | Before Phase 2 | Dribbble, Awwwards, Etsy UX |

**Note:** If you don't have design assets, I'll use Bootstrap/Tailwind defaults. Not pretty, but functional. You can hire a designer later.

### SECTION 8D: Legal & Compliance

| Item | Deliverable | Needed By | Notes |
|---|---|---|---|
| **Terms of Service** | Legal document (or template) | Before launch | Covers: user obligations, disputes, escrow |
| **Privacy Policy** | Legal document (or template) | Before launch | GDPR-ish (India doesn't have strict privacy law, but be safe) |
| **Escrow Disclaimer** | Legal text in UI | Phase 4 | Must state: "Not regulated escrow. Platform-held funds." |
| **AML/KYC Requirements** | Do sellers need government ID verification? | Phase 1 | Affects seller onboarding complexity |
| **Seller Policies** | What's forbidden? (counterfeit, weapons, etc.) | Before launch | For community guidelines |
| **Shipping Policies** | Seller responsibility? Platform responsibility? | Before Phase 4 | Affects dispute resolution |
| **Chargebacks Handling** | How will you handle payment disputes with Razorpay? | Phase 4 | Razorpay reverses charges; your policy matters |

**Note:** I can write template versions if you don't have a lawyer. Better to iterate with legal later.

### SECTION 8E: Infrastructure & Credentials

**You'll need these accounts (all free tier eligible for MVP):**

| Service | Free Tier | What To Provide | By When |
|---|---|---|---|
| **GitHub** | ✅ Unlimited public repos | Repository name + access | Week 0 |
| **PostgreSQL** | Railway ✅ $5/month | Connection string | Week 1 |
| **Redis** | Railway ✅ included | Connection string | Week 3 |
| **Cloudinary** | ✅ 25GB storage/month | API credentials | Week 4 |
| **Razorpay** | ✅ Free for testing | API keys (test mode) | Week 4 |
| **Google OAuth** | ✅ Free | OAuth client ID & secret | Week 1 |
| **Resend / Brevo** | ✅ Free tier | API key | Week 2 |
| **Shiprocket** | Free trial, then $99/month | API key | Week 11 |
| **Sentry** | ✅ 5K errors/month free | Organization ID | Week 7 |

### SECTION 8F: Market Research / User Input

**Before launching, get user feedback on:**

1. **Name Validation:** Do students/creators like the name "BidCraft"?
2. **Category Preferences:** Which categories matter most? (Art, Crafts, Hot Wheels, Books, Electronics, Other?)
3. **Price Range:** Confirm ₹99–₹5000 is the right range. (Or ₹50–₹10,000?)
4. **Commission Tolerance:** Would sellers accept 15% commission? (Etsy is 6.5% + payment fees; eBay is 2–5% + fees.)
5. **Escrow vs Cash-on-Delivery:** Do buyers prefer escrow? Or do they want COD?
6. **Feature Priorities:** Rate these features: Auctions, Creator profiles, Reviews, Analytics, Live events.

**Get this feedback by:** Surveying 20–30 potential users in your college. Qualtrics / Typeform / WhatsApp.

---

## SECTION 9: GITHUB PROJECT SETUP

### Repository Structure

```
bidcraft/
├── .github/
│   ├── workflows/
│   │   ├── test.yml (Run tests on PR)
│   │   ├── deploy.yml (Deploy on main branch)
│   │   └── lint.yml (ESLint + Prettier)
│   └── ISSUE_TEMPLATE/
│       ├── bug.md
│       ├── feature.md
│       └── epic.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Listing/
│   │   │   ├── Auction/
│   │   │   ├── Escrow/
│   │   │   ├── Dashboard/
│   │   │   └── Common/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── redux/
│   │   │   ├── slices/
│   │   │   └── store.js
│   │   ├── socket/
│   │   │   └── socketClient.js
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   ├── listings.js
│   │   │   ├── auctions.js
│   │   │   └── orders.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── listings.js
│   │   │   ├── auctions.js
│   │   │   ├── orders.js
│   │   │   ├── payments.js
│   │   │   ├── disputes.js
│   │   │   ├── admin.js
│   │   │   └── index.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── listingController.js
│   │   │   ├── auctionController.js
│   │   │   ├── orderController.js
│   │   │   ├── paymentController.js
│   │   │   ├── escrowController.js
│   │   │   └── disputeController.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── listingService.js
│   │   │   ├── auctionService.js
│   │   │   ├── escrowService.js
│   │   │   ├── paymentService.js
│   │   │   └── notificationService.js
│   │   ├── models/
│   │   │   └── (if using ORM; I recommend raw SQL for control)
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimiter.js
│   │   │   └── validator.js
│   │   ├── utils/
│   │   │   ├── db.js
│   │   │   ├── logger.js
│   │   │   ├── constants.js
│   │   │   └── helpers.js
│   │   ├── jobs/
│   │   │   ├── auctionEnd.js
│   │   │   ├── escrowTimeout.js
│   │   │   ├── sendNotification.js
│   │   │   └── payoutsettlement.js
│   │   ├── socket/
│   │   │   └── socketHandlers.js
│   │   ├── app.js
│   │   └── server.js
│   ├── db/
│   │   ├── schema.sql (Full DB schema)
│   │   ├── seeds.sql (Test data)
│   │   └── migrations/
│   │       ├── 001_init_users.sql
│   │       ├── 002_init_listings.sql
│   │       └── ... (Flyway or migrate.js)
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── authController.test.js
│   │   │   ├── auctionService.test.js
│   │   │   └── escrowService.test.js
│   │   ├── integration/
│   │   │   ├── auth.integration.test.js
│   │   │   ├── auction.integration.test.js
│   │   │   └── payment.integration.test.js
│   │   └── e2e/
│   │       ├── fullFlow.e2e.test.js (User signup → list → bid → win)
│   │       └── escrow.e2e.test.js (Full escrow cycle)
│   ├── .env.example
│   ├── package.json
│   ├── swagger.js (OpenAPI spec)
│   ├── README.md
│   └── docker-compose.yml (optional; for local dev)
├── docs/
│   ├── API.md (Endpoint reference)
│   ├── ARCHITECTURE.md (System design)
│   ├── DEVELOPMENT.md (Setup guide)
│   ├── ESCROW.md (Escrow FSM explained)
│   └── DEPLOYMENT.md (How to deploy)
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── README.md (Root-level overview)
└── ROADMAP.md (This document)
```

### Environment Variables

**Backend (.env.example)**
```env
# Server
NODE_ENV=development
PORT=8000
CORS_ORIGIN=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/bidcraft
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key_here_min_32_chars
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Payments
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email
RESEND_API_KEY=your_resend_api_key
SENDER_EMAIL=noreply@bidcraft.in

# Cloud Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Shipping
SHIPROCKET_API_KEY=your_shiprocket_api_key

# Error Tracking
SENTRY_DSN=your_sentry_dsn

# Auction Settings
AUCTION_DURATION_HOURS=7
BID_INCREMENT_MIN=10
ANTI_SNIPE_EXTENSION_SECONDS=120
ANTI_SNIPE_THRESHOLD_SECONDS=60

# Commission
PLATFORM_COMMISSION_PERCENT=15
```

**Frontend (.env.example)**
```env
# API
VITE_API_BASE_URL=http://localhost:8000/api
VITE_SOCKET_URL=http://localhost:8000

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Cloudinary (for image upload)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### GitHub Issues Template (Initial Backlog)

**Phase 1 Epic: User Authentication**
```
## Objective
Implement user authentication with email/password and Google OAuth.

## Issues
- [ ] Auth-001: Email/password signup endpoint + validation
- [ ] Auth-002: Email/password login endpoint + JWT generation
- [ ] Auth-003: Google OAuth integration (frontend + backend)
- [ ] Auth-004: JWT refresh token flow
- [ ] Auth-005: Password reset flow + email
- [ ] Auth-006: Protected route middleware
- [ ] Auth-007: User profile CRUD
- [ ] Auth-008: Authentication tests
```

**Phase 3 Epic: Auction Engine**
```
## Objective
Implement real-time auction bidding with race condition handling.

## Issues
- [ ] Auction-001: Create auction endpoint
- [ ] Auction-002: Bid placement API with validation
- [ ] Auction-003: Race condition handling (PostgreSQL locking)
- [ ] Auction-004: Redis TTL countdown for auction duration
- [ ] Auction-005: Anti-snipe bid extension (last 60s)
- [ ] Auction-006: Socket.IO rooms + real-time bid broadcasts
- [ ] Auction-007: Auction end job (BullMQ)
- [ ] Auction-008: Winner notification + order creation
- [ ] Auction-009: Bid history endpoint
- [ ] Auction-010: Concurrency tests (artillery, Jest)
```

### GitHub Projects Board (Kanban)

**Columns:**
- Backlog
- Ready (scoped, assigned)
- In Progress
- In Review (awaiting code review)
- Done

**Initial board:**
```
Backlog (30 items)
├── Phase 1: Foundation
├── Phase 2: Listings
├── Phase 3: Auctions
└── Phase 4+: Future

Ready (Sprint 1 — 5 items)
├── Auth-001
├── Auth-002
├── Auth-004
├── User-Profile-001
└── DB-Schema-001
```

### CI/CD Pipeline (.github/workflows/test.yml)

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: bidcraft
          POSTGRES_PASSWORD: testpass
          POSTGRES_DB: bidcraft_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies (backend)
        run: cd backend && npm install

      - name: Install dependencies (frontend)
        run: cd frontend && npm install

      - name: Run linter
        run: cd backend && npm run lint

      - name: Run unit tests (backend)
        run: cd backend && npm run test:unit
        env:
          DATABASE_URL: postgresql://bidcraft:testpass@localhost:5432/bidcraft_test
          REDIS_URL: redis://localhost:6379

      - name: Run integration tests (backend)
        run: cd backend && npm run test:integration
        env:
          DATABASE_URL: postgresql://bidcraft:testpass@localhost:5432/bidcraft_test
          REDIS_URL: redis://localhost:6379

      - name: Run E2E tests (frontend)
        run: cd frontend && npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: always()
```

### Milestones

**GitHub Milestones (v1.0 MVP Release)**

| Milestone | ETA | Issues | Success Criteria |
|---|---|---|---|
| **Foundation (v0.1)** | Week 3 | 8 issues (Auth, Profiles, RBAC) | User can signup, login, edit profile |
| **Marketplace (v0.2)** | Week 6 | 10 issues (Listings, Search, Payments) | Seller can list; buyer can search & checkout |
| **Auctions (v0.3)** | Week 10 | 10 issues (Bidding, Real-time, Anti-snipe) | Two users bid; highest wins; no race conditions |
| **Escrow (v0.4)** | Week 13 | 8 issues (FSM, Disputes, Payout) | Full HELD → SHIPPED → RELEASED flow |
| **Creator Economy (v0.5)** | Week 16 | 8 issues (Followers, Reviews, Analytics) | Creator profiles visible; reviews aggregate |
| **Analytics (v0.6)** | Week 18 | 6 issues (Dashboard, Charts) | Seller can view sales data |
| **Polish & Testing (v0.7)** | Week 22 | 15 issues (Bug fixes, UX, Security) | Mobile-responsive; no critical bugs |
| **Launch (v1.0)** | Week 24 | Deployment, monitoring, beta invites | Live at bidcraft.in; 50 beta users |

---

## SECTION 10: FINAL EXECUTION PLAN

### Week-by-Week Breakdown

#### WEEK 1: Setup & Foundation
**Tasks:**
- [ ] Create GitHub repository; set branch protection
- [ ] Set up development environment locally (Node, PostgreSQL, Redis, Vite)
- [ ] Create `.env.example` and document all config
- [ ] Design database schema; run initial SQL schema creation
- [ ] Set up Express server with basic middleware (CORS, logger, error handler)
- [ ] Create first REST endpoint: `GET /api/health` (returns uptime)
- [ ] Set up Redis connection
- [ ] Configure Prettier + ESLint for code style
- [ ] Create GitHub Actions CI/CD skeleton

**Deliverable:** A running backend that responds to health check. Frontend renders "Hello World" from Vite. Database schema in place.

**Time Estimate:** 40 hours

---

#### WEEK 2: Auth (Email + Password)
**Tasks:**
- [ ] Implement signup endpoint (email, password validation)
- [ ] Hash passwords with bcrypt
- [ ] Create `users` table; verify schema
- [ ] Implement login endpoint (email lookup, password compare)
- [ ] Generate JWT tokens (access + refresh)
- [ ] Implement JWT verification middleware
- [ ] Create protected route example
- [ ] Add password reset flow (email verification)
- [ ] Write unit tests for auth service

**Deliverable:** A user can signup with email/password, login, and receive a JWT. Protected routes reject unauthenticated requests.

**Time Estimate:** 35 hours

---

#### WEEK 3: OAuth + Profiles
**Tasks:**
- [ ] Set up Google OAuth (client ID, secret)
- [ ] Implement Passport.js Google strategy
- [ ] Create OAuth callback route (create user if doesn't exist)
- [ ] Implement user profile CRUD endpoint
- [ ] Cloudinary image upload integration
- [ ] Create `profiles` table schema
- [ ] Frontend: Signup form, Login form, Google button, Profile edit page
- [ ] Session management (Redis + JWT refresh)
- [ ] Write integration tests

**Deliverable:** User can sign up via Google. User can edit profile (photo, bio). Frontend has forms and displays user info.

**Time Estimate:** 35 hours

**WEEK 1–3 Total: 110 hours (~3.7 days/week solo)**

---

#### WEEK 4: Listings CRUD
**Tasks:**
- [ ] Create `listings` table schema
- [ ] Implement listing creation API (title, description, photos, category, price, type)
- [ ] Implement listing read (single + list with pagination)
- [ ] Implement listing update + delete (seller only)
- [ ] Cloudinary multi-photo upload
- [ ] Product image CDN transforms (thumbnail, full-size)
- [ ] Frontend: Listing creation form, listing detail page, seller dashboard

**Deliverable:** Seller can create listing with photos. Buyer can view listing details. Listings persist in DB.

**Time Estimate:** 30 hours

---

#### WEEK 5: Search + Discovery
**Tasks:**
- [ ] Implement PostgreSQL full-text search (FTS)
- [ ] Create search endpoint (keyword + filters: category, price range, condition)
- [ ] Add indexes for search performance
- [ ] Implement pagination (offset/limit)
- [ ] Frontend: Search bar, filter sidebar, results list
- [ ] Add sorting (newest, price low-to-high, rating)

**Deliverable:** Buyer can search by keyword, filter by category/price, see paginated results.

**Time Estimate:** 20 hours

---

#### WEEK 6: Wishlist + Payments Setup
**Tasks:**
- [ ] Create `wishlist` table schema
- [ ] Implement add-to-wishlist, remove-from-wishlist endpoints
- [ ] Price-drop alert notifications (Bull queue)
- [ ] Razorpay integration (test mode)
- [ ] Implement checkout endpoint (create Razorpay order)
- [ ] Webhook handler for `payment.captured`
- [ ] Create `orders` + `payments` tables
- [ ] Frontend: Wishlist button, checkout flow (Razorpay modal)
- [ ] Tests for payment flow

**Deliverable:** Buyer can add item to wishlist. Buyer can checkout and complete payment (funds held, not yet released). Seller sees new order.

**Time Estimate:** 35 hours

**WEEK 4–6 Total: 85 hours (~2.8 days/week solo)**

---

#### WEEK 7–8: Auction Core Logic
**Tasks:**
- [ ] Create `auctions` + `bids` tables
- [ ] Implement auction creation (start bid, duration, reserve, min increment)
- [ ] Implement bid placement with validation (bid > current + increment)
- [ ] **Race condition handling:** PostgreSQL `FOR UPDATE` row lock OR Redis Lua script
- [ ] Redis TTL auction countdown
- [ ] Atomic bid update (no two bids win simultaneously)
- [ ] Tests for race conditions (Jest + concurrent bid simulation)

**Deliverable:** Two concurrent bids on same auction; highest wins. Zero race conditions.

**Time Estimate:** 40 hours

---

#### WEEK 9: Real-Time Auction Updates
**Tasks:**
- [ ] Socket.IO server setup
- [ ] Create Socket.IO rooms per auction (e.g., `auction:123`)
- [ ] Implement bid broadcast (new bid → all watchers in room)
- [ ] Outbid notification (Socket.IO + email)
- [ ] Countdown timer (Socket.IO client displays real-time countdown)
- [ ] Frontend: Auction detail page, real-time bid list, bid form, countdown
- [ ] Tests for Socket.IO connections + message delivery

**Deliverable:** Multiple browsers can watch same auction, see bid updates in real-time. Countdown updates every second.

**Time Estimate:** 35 hours

---

#### WEEK 10: Auction Anti-Snipe + End
**Tasks:**
- [ ] Anti-snipe logic: If bid in final 60s, extend by 120s
- [ ] Auction end job (BullMQ)
- [ ] Winner determination (highest bid)
- [ ] Order creation from auction win
- [ ] Winner notification + payment prompt
- [ ] All bidders notification ("Auction ended")
- [ ] Bid history endpoint
- [ ] Tests for anti-snipe, auction end edge cases

**Deliverable:** Auction ends. Winner gets notified. Can checkout. Auction cannot be sniped at last second.

**Time Estimate:** 30 hours

**WEEK 7–10 Total: 105 hours (~3.75 days/week solo)**

---

#### WEEK 11: Escrow State Machine
**Tasks:**
- [ ] Create `escrow` + `escrow_audit_log` tables
- [ ] Implement escrow FSM (PENDING → HELD → SHIPPED → DELIVERED → RELEASED)
- [ ] Every state change logged in `escrow_audit_log` with timestamp + actor
- [ ] Create order immediately after payment (escrow status: HELD)
- [ ] Seller receives order with shipping instructions
- [ ] Escrow timeout (auto-release after 7 days)

**Deliverable:** Payment captured → Escrow created (HELD) → Seller can ship → Full audit log.

**Time Estimate:** 30 hours

---

#### WEEK 12: Shipping + Dispute Resolution
**Tasks:**
- [ ] Create `shipments` table
- [ ] Seller uploads tracking number (Shiprocket API or manual)
- [ ] Escrow state → SHIPPED
- [ ] Buyer sees tracking info
- [ ] Buyer confirms receipt → Escrow → DELIVERED → RELEASED
- [ ] Create `disputes` table
- [ ] Buyer can open dispute within 7 days
- [ ] Admin dispute resolution panel (side with buyer or seller)
- [ ] Dispute escalation workflow (48h response time)

**Deliverable:** Buyer confirms receipt; funds released to seller. Buyer can open dispute; admin resolves.

**Time Estimate:** 35 hours

---

#### WEEK 13: Razorpay Payout
**Tasks:**
- [ ] Razorpay Route API integration (seller settlement)
- [ ] Create `payouts` table
- [ ] Batch payout job (BullMQ, runs daily)
- [ ] Calculate: amount - 15% commission
- [ ] Route transfer to seller bank account
- [ ] Payout confirmation email + SMS
- [ ] Seller payout dashboard (earnings, pending payouts)
- [ ] Tests for payout flow (Razorpay test mode)

**Deliverable:** Buyer confirms receipt → Funds released → Seller receives payout. Seller sees "₹X pending" → "₹X paid out" status.

**Time Estimate:** 30 hours

**WEEK 11–13 Total: 95 hours (~3.2 days/week solo)**

---

#### WEEK 14: Creator Profiles + Followers
**Tasks:**
- [ ] Create `follows` table
- [ ] Implement follow/unfollow endpoints
- [ ] Create creator storefront page (avatar, bio, followers, items, reviews)
- [ ] New listing notification to followers (Bull queue + email)
- [ ] Follower count visible on profile
- [ ] Tests for follow system

**Deliverable:** Buyer can follow creator. New listing by creator → follower gets notification.

**Time Estimate:** 25 hours

---

#### WEEK 15: Review System
**Tasks:**
- [ ] Create `reviews` table
- [ ] Buyer leaves review after order completion (rating + comment)
- [ ] Seller can reply to review
- [ ] Review aggregation: avg rating, total reviews
- [ ] Display reviews on seller profile
- [ ] Tests for review aggregation

**Deliverable:** After escrow released, buyer can leave review. Seller profile shows avg rating + review count.

**Time Estimate:** 20 hours

---

#### WEEK 16: Trust Score + Verified Badge
**Tasks:**
- [ ] Implement trust score calculation (composite):
   - Delivery speed (avg days from shipped → confirmed)
   - Description accuracy (review ratings > 4.5 = good)
   - Response time (avg hours to respond to messages)
   - Escrow completion rate (% of orders completed without dispute)
- [ ] Admin panel: assign "Verified Creator" badge
- [ ] Display trust score + badge on profile
- [ ] Creator discovery page (sort by trust score, followers, new)
- [ ] Tests for trust score algorithm

**Deliverable:** Seller profile shows trust score + "Verified" badge. Buyers can discover creators by trust.

**Time Estimate:** 25 hours

**WEEK 14–16 Total: 70 hours (~2.3 days/week solo)**

---

#### WEEK 17: Analytics Dashboard
**Tasks:**
- [ ] Seller dashboard overview (total sales, revenue, active listings)
- [ ] Sales chart (revenue by day/week/month)
- [ ] Product performance (views, wishlist count, conversion rate)
- [ ] Auction analytics (total bids, avg bid, engagement)
- [ ] Follower growth chart
- [ ] Admin dashboard (platform metrics: GMV, user count, auction count)
- [ ] Add Redis caching for slow queries
- [ ] CSV export (monthly sales report)

**Deliverable:** Seller can view dashboard with sales data. Charts render in <1s.

**Time Estimate:** 35 hours

---

#### WEEK 18: Analytics Polish
**Tasks:**
- [ ] Date range filtering on all charts
- [ ] Mobile-responsive dashboard
- [ ] Tests for analytics queries
- [ ] Performance optimization (materialized views if needed)

**Deliverable:** Analytics dashboard complete + mobile-friendly.

**Time Estimate:** 20 hours

**WEEK 17–18 Total: 55 hours (~1.8 days/week solo)**

---

#### WEEK 19–20: Mobile Responsiveness + UX Polish
**Tasks:**
- [ ] Test on mobile (iOS Safari, Android Chrome)
- [ ] Fix responsive issues (buttons, forms, images)
- [ ] Loading states for all async operations
- [ ] Error states (404, 500, etc.)
- [ ] Form validation (client + server)
- [ ] Accessibility audit (ARIA labels, color contrast, keyboard nav)
- [ ] User feedback collection (Typeform)

**Deliverable:** App works on 375px viewport. All forms have validation. No layout breaks on mobile.

**Time Estimate:** 40 hours

---

#### WEEK 21: E2E Testing + Security
**Tasks:**
- [ ] Write end-to-end test (Playwright): signup → list → bid → win → escrow → payout
- [ ] Load test (k6): 100 concurrent users on auction page
- [ ] Security audit:
   - SQL injection (parameterized queries)
   - XSS (sanitize HTML)
   - CSRF tokens
   - Rate limiting
- [ ] Fix any security issues found

**Deliverable:** Full E2E test passes. Load test passes (p95 latency <500ms). No security vulnerabilities.

**Time Estimate:** 35 hours

---

#### WEEK 22: Documentation + Demo
**Tasks:**
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Deployment guide (Railway)
- [ ] Architecture diagram + explanation
- [ ] Escrow FSM documentation
- [ ] Code comments for complex logic
- [ ] GitHub README (setup, features, architecture)
- [ ] Create 3-minute demo video (signup → list → bid → win)
- [ ] Prepare demo script for demo day

**Deliverable:** Complete API docs. README is comprehensive. Demo video available. Code is well-commented.

**Time Estimate:** 30 hours

**WEEK 19–22 Total: 105 hours (~3.75 days/week solo)**

---

#### WEEK 23: Launch Prep
**Tasks:**
- [ ] Set up production database (Railway PostgreSQL)
- [ ] Set up production Redis (Railway)
- [ ] Create `.env` for production
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Set up error tracking (Sentry)
- [ ] Create Terms of Service + Privacy Policy
- [ ] Recruit 50 beta testers (email, WhatsApp)
- [ ] Create launch checklist (monitoring, alerts, rollback)

**Deliverable:** App is live at bidcraft.in (or custom domain). Monitoring configured. 50 beta testers invited.

**Time Estimate:** 25 hours

---

#### WEEK 24+: Soft Launch + Hotfixes
**Tasks:**
- [ ] Go live
- [ ] Monitor for errors (Sentry, logs)
- [ ] Fix critical bugs within 24h
- [ ] Collect user feedback
- [ ] Document learnings
- [ ] Plan Phase 2 (live auctions, AI, etc.)

**Deliverable:** Beta users can transact. Feedback collected. No critical bugs.

**Time Estimate:** 20 hours (ongoing)

---

### Total Development Effort

| Phase | Weeks | Hours | Notes |
|---|---|---|---|
| Phase 0 (Planning) | 0.5 | 20 | Parallel with everything |
| Phase 1 (Auth + Profiles) | 3 | 110 | Critical path |
| Phase 2 (Listings + Payments) | 3 | 85 | Marketplace MVP |
| Phase 3 (Auctions) | 4 | 105 | Hero feature; most complex |
| Phase 4 (Escrow + Payout) | 3 | 95 | Trust layer |
| Phase 5 (Creator Economy) | 3 | 70 | Retention loops |
| Phase 6 (Analytics) | 2 | 55 | Seller insights |
| Phase 7 (Polish + Testing) | 4 | 105 | Quality assurance |
| Phase 8 (Launch Prep) | 1 | 25 | Deployment |
| Phase 9 (Go Live + Hotfixes) | Ongoing | 20 | First 2 weeks |
| **TOTAL** | **24** | **690** | **~28 days solo** |

**For a student founder (25 hrs/week):** 690 ÷ 25 = **27–28 weeks (~7 months)**

**For a team (2 devs, 25 hrs/week each):** ~14 weeks (~3.5 months), but with coordination overhead.

---

### What You Must Do TODAY (In Order)

#### Task 1 (Today, 2 hours)
**Create GitHub repository + initial setup**

Checklist:
- [ ] Create public GitHub repo: `bidcraft` (portfolio-worthy)
- [ ] Create branches: `main` (production), `develop` (staging), `feature/*` (work)
- [ ] Add `.gitignore` (Node, PostgreSQL, env files)
- [ ] Create `README.md` with project overview (one-liner, features, roadmap link)
- [ ] Create folder structure: `/frontend`, `/backend`, `/docs`
- [ ] Create `.env.example` files (both frontend + backend)

**Deliverable:** Pushable repository. `git clone` works. Can create feature branches.

---

#### Task 2 (Today, 3 hours)
**Create database schema SQL file**

Checklist:
- [ ] Create `/backend/db/schema.sql`
- [ ] Add all tables from [SECTION 5](#section-5--database-design)
- [ ] Add all indexes
- [ ] Add foreign keys + constraints
- [ ] Add comments explaining each table
- [ ] Test schema creation locally (PostgreSQL)

**Deliverable:** `/backend/db/schema.sql` is complete. You can run `psql < schema.sql` and DB is set up.

---

#### Task 3 (Today, 3 hours)
**Set up Node.js backend skeleton**

Checklist:
- [ ] `cd backend && npm init -y`
- [ ] Install dependencies: `npm install express cors dotenv pg redis socket.io bullmq bcryptjs jsonwebtoken`
- [ ] Create `/backend/src/app.js` (Express app setup)
- [ ] Create `/backend/src/server.js` (start server)
- [ ] Create `/backend/src/routes/index.js` (empty router)
- [ ] Create `/backend/src/middleware/errorHandler.js` (catch errors)
- [ ] Add `npm run dev` script (nodemon)
- [ ] Create `/backend/README.md` (setup instructions)

**Deliverable:** `npm run dev` starts server on port 8000. `GET http://localhost:8000/health` returns JSON.

---

#### Task 4 (Today – Tomorrow, 4 hours)
**Set up React frontend skeleton + Vite**

Checklist:
- [ ] `npm create vite@latest frontend -- --template react`
- [ ] `cd frontend && npm install`
- [ ] Install: `npm install axios socket.io-client react-redux @reduxjs/toolkit tailwindcss`
- [ ] Create Tailwind config
- [ ] Create folder structure: `/src/components`, `/src/pages`, `/src/api`, `/src/redux`, `/src/socket`
- [ ] Create basic layout: header, sidebar, main content
- [ ] Create `/frontend/README.md` (setup instructions)

**Deliverable:** `npm run dev` in frontend folder. App loads in browser at http://localhost:5173. Displays "BidCraft" header.

---

#### Task 5 (This Week, 5 hours)
**Deploy skeleton to production (Vercel + Railway)**

Checklist:
- [ ] Frontend: Deploy to Vercel (connect GitHub, auto-deploy on `main` push)
- [ ] Backend: Deploy to Railway (PostgreSQL + Node.js + Redis)
- [ ] Set production environment variables
- [ ] Test: `GET https://bidcraft-api.railway.app/health` returns JSON
- [ ] Test: Frontend loads, can see header

**Deliverable:** Skeleton app is live. You have production URLs to share. 

---

### What You Must Decide TODAY

1. **GitHub username?** (for public portfolio repo)
2. **Domain name?** (bidcraft.in? Or redirect later?)
3. **College name?** (for "College Verified" badge program)
4. **Target categories?** (Top 5 to start: Art, Crafts, Hot Wheels, Books, Electronics, Other?)
5. **Commission rate?** (Default 15%? Open to adjust?)
6. **Confirm tech stack?** (React + Node + Postgres? Or changes?)

---

### Critical Risks That Could Kill This

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Cold Start Problem** | Very High | No users, no sellers, no revenue | Manually seed 10 listings day 1. Recruit 10 friends as beta testers before launch. |
| **Escrow Complexity** | High | Funds get stuck; users refund. Trust destroyed. | Use simulated escrow (funds in Razorpay). Test HELD → RELEASED flow 50 times before launch. |
| **Race Conditions in Auctions** | High | Two users think they won same item. Major bug. | Test with 1000 concurrent bids. Use `FOR UPDATE` row lock. Load test with artillery.io. |
| **Shipping Disputes** | High | "Item not as described" / "Item lost". Buyer blames platform. | Require seller to upload 5+ photos (standardized). Integrate Shiprocket for tracked shipping. Admin disputes must be resolved in <48h. |
| **Payments Webhook Delays** | Medium | Escrow doesn't release; seller frustrated. | Implement retry logic. Log all webhook failures. Manual override in admin panel. |
| **WebSocket Scalability** | Medium | Real-time bids break when 100 users on same auction. | Use Socket.IO with Redis adapter (planned for Phase 3). Test with k6. |
| **Seller Verification Gaming** | Medium | Fake sellers list items, scam buyers, disappear. | Manual admin review of first 50 sellers. Require seller to sell 1 item perfectly before "trusted" status. |
| **Team Disagreement on Scope** | Low (solo) | Timeline slips. Features bloat. | Keep phases rigid. No scope creep. MVP = Phase 1–4 only. |
| **Burnout (Solo Dev)** | Medium | You quit; project dies. | Take 2 days off/week. Ship incrementally (demo every 2 weeks). Celebrate wins. |

---

### Success Metrics for Week 1

**By end of Week 1, you should have:**

✅ GitHub repo created + pushed to remote  
✅ Backend running locally (responds to /health)  
✅ Frontend running locally (Vite loads)  
✅ Database schema created (schema.sql executable)  
✅ `.env.example` documented  
✅ README updated  
✅ 1 deployment to Vercel + Railway (skeleton)  

**If you don't have all of these by Friday EOD, something is wrong. Pivot immediately.**

---

### Success Metrics for Month 1

**By end of Month 1, you should have:**

✅ Full auth system (email + Google OAuth)  
✅ Listing CRUD + search  
✅ Fixed-price checkout (payments working)  
✅ Auction bidding (real-time, no race conditions)  
✅ Escrow flow (HELD → RELEASED cycle)  
✅ 10 beta testers using the platform  
✅ First real transaction completed  
✅ Zero critical bugs  

**If you don't have these by end of Month 1, you're off track.**

---

## FINAL WORDS: HONEST ASSESSMENT

### Why This Idea Will Succeed

1. **Market Timing:** India's creator economy is exploding. Escrow-based transactions are chronically underserved.
2. **Real Problem:** Students and collectors have nowhere safe to transact P2P. You're solving it.
3. **Technical Portfolio:** Real-time auctions, escrow FSM, race condition handling = interview gold.
4. **Low Competition:** Whatnot doesn't exist in India. eBay left. Etsy has no auctions. You have a window.
5. **Execution Feasible:** 24 weeks is realistic for an MVP solo.

### Why This Idea Could Fail

1. **Chicken-and-Egg Problem:** Marketplace needs both buyers and sellers. If you only build tech and don't recruit users, it dies.
2. **Fraud:** Without good verification, fake sellers will destroy trust immediately.
3. **Shipping Complexity:** India's logistics are unreliable. Disputes over "item lost in shipping" will be constant.
4. **Regulatory:** If you grow big, NBFC licensing (escrow) becomes mandatory. Expensive and slow.
5. **You Burn Out:** Building solo is lonely. If you don't have co-founders or community support, 24 weeks is demoralizing.

### How to De-Risk

**Before building anything:**
- [ ] Survey 30 potential users: "Would you buy/sell on BidCraft?" Get 20+ yeses.
- [ ] Manually test P2P transactions on Instagram to understand the pain. (Buy from a creator; screenshot the friction.)
- [ ] Reach out to 10 student creators; ask what platform they want.

**During development:**
- [ ] Ship features iteratively. Every 2 weeks, show progress to 5 users.
- [ ] Track ONE metric obsessively: # of completed transactions. If it's not growing, pause and figure out why.
- [ ] Build the "boring" stuff first (escrow, disputes, payments). Features are secondary.

**At launch:**
- [ ] Don't wait for 10K users. Launch with 50. Recruit them manually. Personally know the first 100 users.
- [ ] Be obsessed with NPS (Net Promoter Score). If users don't love it, they'll leave. Fix immediately.

---

## EXECUTION PLAN SUMMARY

| Phase | Timeline | Goal | Effort |
|---|---|---|---|
| **Phase 0** | Week 0 | GitHub + Setup | 20 hrs |
| **Phase 1** | Weeks 1–3 | Auth + Profiles | 110 hrs |
| **Phase 2** | Weeks 4–6 | Listings + Payments | 85 hrs |
| **Phase 3** | Weeks 7–10 | Auctions (Hero Feature) | 105 hrs |
| **Phase 4** | Weeks 11–13 | Escrow (Trust Layer) | 95 hrs |
| **Phase 5** | Weeks 14–16 | Creator Economy | 70 hrs |
| **Phase 6** | Weeks 17–18 | Analytics | 55 hrs |
| **Phase 7** | Weeks 19–22 | Polish + Testing | 105 hrs |
| **Phase 8** | Week 23 | Launch Prep | 25 hrs |
| **Phase 9** | Week 24+ | Go Live + Iterate | 20 hrs |
| **TOTAL** | **24 weeks** | **MVP Live** | **690 hrs** |

**To accelerate:**
- Hire co-founder (shared effort → 12–14 weeks)
- Offshore some frontend (e.g., template themes) → saves 10%

**Do NOT skip:**
- Phase 1 (Auth) — blocker for everything
- Phase 3 (Auctions) — your moat
- Phase 4 (Escrow) — your trust
- Phase 7 (Testing) — your credibility

---

**You're ready. Start today. Ship incrementally. Talk to users constantly. Build the escrow; everything else is secondary.**

**Good luck. This is a good idea, executed well. Go build it.**

---

## APPENDIX A: Quick Reference Checklists

### Pre-Development Checklist

- [ ] GitHub repo created + pushed
- [ ] Database schema SQL written
- [ ] `.env.example` documented
- [ ] Backend skeleton (Express + routes)
- [ ] Frontend skeleton (React + Vite)
- [ ] Local PostgreSQL + Redis running
- [ ] Deployment (Vercel + Railway) set up
- [ ] Decision: Commission rate (15%?)
- [ ] Decision: Target categories (Art, Crafts, Hot Wheels, etc.?)
- [ ] Decision: Seller verification method (manual, email, ID?)
- [ ] Decision: Payment processor (Razorpay confirmed?)

### Week 1 Verification

- [ ] `npm run dev` (backend) → health check responds
- [ ] `npm run dev` (frontend) → Vite loads
- [ ] Database schema executes without errors
- [ ] GitHub Actions CI configured
- [ ] Vercel deployment succeeds (skeleton loads)
- [ ] Railway deployment succeeds (API responds)
- [ ] README updated with setup instructions
- [ ] Initial GitHub issues created (Phase 1 tasks)

### Pre-Launch Checklist (Week 23)

- [ ] End-to-end test passes (signup → list → bid → win → escrow → payout)
- [ ] Load test passes (100 concurrent users, p95 < 500ms)
- [ ] Security audit completed (no XSS, SQL injection, CSRF)
- [ ] Mobile responsiveness verified (iOS + Android)
- [ ] Error tracking (Sentry) configured
- [ ] Terms of Service + Privacy Policy written
- [ ] 50 beta testers recruited + sent invite link
- [ ] Demo video recorded (3 min)
- [ ] Deployment checklist created (rollback plan)
- [ ] Database backed up
- [ ] Monitoring alerts configured (error rate, latency, DB CPU)

---

**END OF EXECUTION PLAN**

This document is your north star. Print it. Reference it daily. Adjust phases based on learnings, but maintain momentum.

**Now: Make your first commit. Push to GitHub. Deploy to Vercel + Railway. Show the world you're building.**

🚀

