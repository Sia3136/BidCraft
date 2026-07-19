# BidCraft — Comprehensive Security Audit Report

**Scope:** `backend/` (Express + PostgreSQL API) and `frontend/` (Next.js + Prisma)
**Method:** Full static source review — no code modified, no fixes implemented.
**Reviewer stance:** OWASP-aligned production-readiness review.

---

## 1. Executive Summary

BidCraft is a fairly mature auction/marketplace MVP with generally good fundamentals: parameterized SQL everywhere, `SELECT ... FOR UPDATE` transactions around bidding and settlement, Joi input validation on most write endpoints, Helmet + rate limiting + CORS configured, and a real escrow/dispute/KYC model. The core Express bidding and settlement logic (`auctionService.js`, `settlementService.js`) is well engineered and race-condition-safe.

However, the audit found **5 Critical** and **7 High** severity issues that would allow authentication bypass, forged payments, session hijacking, and — most severely — a **second, unguarded bidding endpoint in the Next.js frontend that completely bypasses every business rule enforced by the backend** (deposits, verification, auction timing, minimum increments, self-bidding). Several findings share a common root cause: **insecure fallback defaults for secrets** (`JWT_SECRET`, `CRON_SECRET`, `RAZORPAY_KEY_SECRET`), which turn a simple deployment/config mistake into full compromise.

None of these require exotic exploitation — most are reachable with a browser dev console or a single curl command. This is not production-ready in its current state; the P0/P1 items below should block launch.

**Production Readiness Score: 38 / 100**

---

## 2. Security Architecture Overview

- **Two independent write paths to the same data**: the Express API (`backend/src`) is the "real" backend with business rules, and the Next.js app also talks *directly* to Postgres via Prisma (`frontend/lib/prisma.ts`, `frontend/app/api/**`). This dual-write architecture is the single biggest structural risk in the codebase (see F-02).
- **AuthN**: JWT access tokens (15 min) + opaque refresh tokens (7 days, stored server-side). Google OAuth supported with a test-mode mock path.
- **AuthZ**: Ad-hoc per-route ownership checks (`seller_id = req.userId`, `buyer_id = req.userId`) rather than a centralized policy/RBAC layer. Mostly consistent, but consistency is achieved by convention, not enforcement — which is exactly why the offer-reject IDOR (F-04) slipped through.
- **Payments/Escrow**: Razorpay integration with signature-verified webhooks and a manual escrow release flow (OTP-based delivery confirmation, buyer confirmation, admin dispute resolution with real refund/transfer calls).
- **Trust boundary weak points**: the `/api/cron/end-auctions` endpoint and the Razorpay webhook are the two externally-reachable endpoints not protected by user auth — both rely on shared secrets that have insecure fallbacks.

---

## 3. Threat Model (summary)

| Actor | Goal | Primary paths in this app |
|---|---|---|
| Unauthenticated attacker | Account takeover, forged payments | Weak/default secrets, XSS→token theft, forged webhook |
| Authenticated buyer | Win auctions unfairly, avoid deposit/verification, cheap escrow release | Frontend bid API bypass, OTP brute force |
| Authenticated seller | Manipulate own listing price mid-auction, avoid fees | Listing update endpoint, offer accept/reject |
| Malicious/compromised admin | Full data access, dispute fund manipulation | Already trusted — audit only for logging/traceability |
| Any authenticated user (IDOR) | Interfere with others' offers/orders | Offer reject endpoint, escrow endpoints |

---

## 4. Attack Surface Summary

- Public REST API: `/api/auth/*`, `/api/listings*`, `/api/auctions*`, `/api/payments/webhook`, `/api/cron/end-auctions`, `/api/users/:id`
- Authenticated REST API: `/api/orders`, `/api/bids`, `/api/offers`, `/api/escrow/*`, `/api/cart`, `/api/wishlist`, `/api/profile`, `/api/images/upload`
- Admin API: `/api/admin/*` (role-gated)
- Second attack surface: Next.js `app/api/*` routes with direct Prisma DB access, running under a *separate* process/deployment with its own `JWT_SECRET` validation and its own (much thinner) authorization logic.
- File upload surface: Multer (memory storage) → Cloudinary, MIME-type allow-list only (no content sniffing).

---

## 5. Vulnerabilities Found

### CRITICAL

---

**C-01 — Hardcoded fallback values for security-critical secrets**
- **Risk:** Authentication bypass, cron endpoint abuse, forged payment webhooks.
- **Impact:** If any of these environment variables is missing or empty in a given deployment (a very common real-world misconfiguration — new environment, missing `.env`, CI/CD secret not wired up), the application silently falls back to a **publicly-known, hardcoded value** instead of failing to start.
- **Root Cause:** `process.env.X || 'hardcoded_default'` pattern used for security-sensitive values.
- **Affected Files:**
  - `backend/src/middleware/auth.js` — `JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'`
  - `backend/src/controllers/authController.js` — same fallback, used to *sign* tokens
  - `backend/src/routes/cron.js` — `CRON_SECRET || 'cron_secret'`
  - `backend/src/services/paymentService.js` — `RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || ''`, used directly as the HMAC key for both payment-signature and **webhook-signature** verification
- **Consequences if triggered:**
  - JWT fallback → anyone can forge a valid access token for any user ID (`jwt.sign({userId: <any>}, 'dev_secret_change_me')`), granting full account takeover for every user in the system.
  - CRON fallback → anyone can call `POST /api/cron/end-auctions` with `Authorization: Bearer cron_secret`, forcing early settlement of auctions.
  - Empty `RAZORPAY_KEY_SECRET` → HMAC computed with an empty key is trivially reproducible. An attacker who notices `verifySignature`/`verifyWebhookSignature` failing to reject empty-secret HMACs can **forge a `payment.captured` webhook** for any `order_id`, marking any order as paid and creating an escrow record without ever paying — directly enabling fraud against sellers or the platform's escrow fund.
- **Recommended Fix (no code):** Remove all fallback defaults for secrets. Validate at process startup (fail fast / refuse to boot) that `JWT_SECRET`, `CRON_SECRET`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` are set, non-empty, and meet a minimum entropy/length bar. Mirror the pattern already used correctly in `frontend/lib/auth.ts`, which throws if `JWT_SECRET` is unset.
- **Verification Method:** Unset each variable in a staging environment and confirm the app refuses to start (rather than starting with a working — but insecure — default). Add an automated boot-time secrets check to CI.

---

**C-02 — Duplicate, unguarded bidding endpoint in the Next.js frontend bypasses all backend business logic**
- **Risk:** Complete bypass of auction integrity controls.
- **Impact:** `frontend/app/api/products/[id]/bid/route.ts` writes bids **directly to Postgres via Prisma**, independent of the Express backend's `auctionService.placeBid`. Comparing the two implementations:

  | Control enforced by Express `placeBid` | Enforced in Next.js `bid/route.ts`? |
  |---|---|
  | Auction must be `active` (not scheduled/ended/cancelled) | **No — missing entirely** |
  | Bidder cannot be the seller | **No — missing** |
  | Bidder must have a verified profile | **No — missing** |
  | Bidder must hold a `bid_deposits` row (`status='held'`) | **No — missing** |
  | Bid must meet `min_bid_increment` | **No — only requires `bid > current_bid`** |
  | Reserve price awareness | **No — missing** |
  | Anti-sniping time extension | **No — missing** |

  As written, any authenticated user can call `POST /api/products/<id>/bid` on the Next.js origin to: bid on an **already-ended** auction, bid on a **not-yet-started** auction, bid as the **seller on their own listing**, and bid **without ever placing a deposit or completing identity verification** — all requirements the platform explicitly built and enforces elsewhere.
- **Root Cause:** Two parallel implementations of the same business capability, only one of which carries the business rules; no shared/reusable domain layer.
- **Affected Files:** `frontend/app/api/products/[id]/bid/route.ts`
- **Recommended Fix (no code):** Eliminate the second write path. The Next.js app should call the Express `/api/auctions/:id/bids` endpoint (or a shared internal service) rather than writing to the auctions/bids tables directly. If a direct-DB path must remain for performance reasons, every rule enforced by `auctionService.placeBid` must be re-implemented and kept in lockstep — which is itself a maintenance risk, so consolidation is strongly preferred.
- **Verification Method:** Attempt to place a bid via this route (a) after an auction's `end_time`, (b) as the listing's own seller, and (c) without a `bid_deposits` row. All three should currently succeed and must be blocked after remediation. Add integration tests asserting parity between both bidding entry points, or remove the duplicate entirely.

---

**C-03 — Access tokens stored in localStorage and a non-HttpOnly cookie**
- **Risk:** Full session hijacking via any XSS.
- **Impact:** `frontend/store/authStore.ts` persists `{ user, token, isAuthenticated }` to `localStorage` via Zustand's `persist` middleware, **and** separately sets `document.cookie = session_token=${token}; path=/; max-age=86400` from client-side JavaScript — i.e., a cookie without `HttpOnly`, without an explicit `Secure` flag, and without an explicit `SameSite` attribute. Both storage locations are readable by any JavaScript running on the page. A single stored or reflected XSS anywhere in the app (including in user-generated content such as listing titles/descriptions rendered elsewhere) is sufficient to exfiltrate the token and fully impersonate the victim, including on the payment and escrow endpoints.
- **Root Cause:** Client-managed session token instead of a server-set `HttpOnly` cookie.
- **Affected Files:** `frontend/store/authStore.ts`, `frontend/lib/auth.ts` (which reads the same cookie server-side)
- **Recommended Fix (no code):** Set the session cookie **server-side only**, with `HttpOnly`, `Secure`, and `SameSite=Lax` (or `Strict` where flows allow), on the login/refresh response — never via client JS. Stop persisting the raw token in `localStorage`. If the SPA needs to know auth state, use a short-lived, non-sensitive flag rather than the token itself.
- **Verification Method:** After remediation, confirm `document.cookie` in devtools no longer exposes `session_token`, and confirm `localStorage.getItem('bidcraft-auth')` no longer contains a usable JWT.

---

**C-04 — Broken access control (IDOR) on offer rejection**
- **Risk:** Any authenticated user can reject any other seller's pending offers.
- **Impact:** `PUT /api/offers/:offerId/reject` performs `UPDATE offers SET status='rejected' WHERE id=$1 AND status='pending'` with **no `seller_id` / ownership check at all** — contrast this with the sibling `accept` endpoint two functions above it, which correctly joins to `listings` and filters `l.seller_id = req.userId`. Any logged-in user who can guess or enumerate offer IDs can reject offers on listings they have no relationship to, denying legitimate sales.
- **Root Cause:** Missing authorization check; inconsistency between two adjacent, nearly-identical route handlers in the same file.
- **Affected Files:** `backend/src/routes/offers.js` (reject handler)
- **Recommended Fix (no code):** Add the same ownership join used in the accept handler: only allow the transition when the requesting user is the `seller_id` for the offer's listing.
- **Verification Method:** As User B, call reject on an offer that belongs to a listing owned by User A. Should return 403/404, not 200.

---

**C-05 — Escrow OTP verification: no caller authorization and no rate limiting**
- **Risk:** Premature/fraudulent escrow release; OTP brute force.
- **Impact:** `POST /api/escrow/:orderId/verify-otp` only requires a valid JWT (any user) and a matching 6-digit OTP — it does **not** check that the caller is the buyer, seller, or any designated delivery-partner role for that specific order (contrast with the `/ship` and `/confirm-delivery` handlers in the same file, which both correctly verify the caller is the owning seller/buyer). Combined with:
  - no endpoint-specific rate limiting (only the blanket 200-req/15-min app-wide limiter applies),
  - a 6-digit numeric OTP space (1,000,000 possibilities), and
  - a 14-day validity window,

  an attacker who is logged in as *any* user and knows or enumerates an `orderId` has a large time budget to brute-force the OTP and trigger `escrow.state = 'released'`, releasing held funds toward the seller ahead of legitimate delivery confirmation.
- **Root Cause:** Missing per-order caller authorization; missing rate limiting on a sensitive, brute-forceable endpoint.
- **Affected Files:** `backend/src/routes/escrow.js` (`verify-otp` handler)
- **Recommended Fix (no code):** Restrict who may call `verify-otp` for a given order (e.g., a designated delivery-partner token, or require the buyer's own authenticated session, not an arbitrary authenticated user). Apply a strict per-order/per-IP rate limiter and a lockout after a small number of failed attempts, mirroring standard OTP-verification hardening.
- **Verification Method:** Attempt repeated OTP guesses against a single order from an unrelated authenticated account; confirm lockout/rate-limit triggers well before exhausting the keyspace, and confirm an unrelated user is rejected outright regardless of OTP correctness.

---

### HIGH

---

**H-01 — Price/content tampering on active (including mid-auction) listings**
- **Risk:** Business logic bypass, price manipulation, bait-and-switch.
- **Impact:** `PUT /api/listings/:id` (`updateListing` in `listingsController.js`) allows the owning seller to change `price`, `title`, `description`, `imageUrls`, `buyingMethod`, etc., subject only to an ownership check — with **no restriction based on listing status, buying method, or whether bids already exist**. A seller could lower/raise the price or change the item description of a **live auction with active bids**, undermining the integrity of the auction the bidders committed to. (Note: the separate, narrower `seller.js` route for editing listings *does* correctly restrict edits to `status='active'` fixed-price context, but the general `listingsController.updateListing` route has no equivalent guard and both routes appear reachable.)
- **Affected Files:** `backend/src/controllers/listingsController.js` (`updateListing`)
- **Recommended Fix (no code):** Disallow price/description/image edits once an auction has received its first bid, or once `buying_method === 'Auction'` and status is `active`; allow only non-substantive fields (e.g., shipping notes) to change post-bid.
- **Verification Method:** Place a bid on an auction, then attempt to edit price via this endpoint as the seller; should be rejected.

---

**H-02 — No password-reset ("forgot password") capability**
- **Risk:** Account lockout, likely insecure support-driven workarounds, no self-service credential rotation after suspected compromise.
- **Impact:** `backend/src/routes/auth.js` has registration, login, Google OAuth, email/phone OTP verification, and an authenticated "change password" endpoint — but **no unauthenticated password-reset flow**. Users who forget their password, or who need to recover after a suspected compromise without account access, have no supported path; this often leads to ad-hoc, less-secure workarounds (e.g., support manually resetting via DB access).
- **Affected Files:** `backend/src/routes/auth.js`, `backend/src/controllers/authController.js`
- **Recommended Fix (no code):** Implement a standard token-based reset flow (single-use, short-lived, emailed token; invalidate all refresh tokens on successful reset).
- **Verification Method:** Confirm a `forgot-password` / `reset-password` pair of endpoints exists and that resets invalidate prior sessions.

---

**H-03 — Broken signature check in `verifyCheckout` masks a bypass-prone "MOCK_MODE" reference**
- **Risk:** Feature outage now; latent risk of an unsafe "fix" later.
- **Impact:** `paymentsController.verifyCheckout` calls `paymentService.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)` with three **positional** arguments, but `verifySignature` is defined to take a **single destructured object** `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`. As called, all three destructured values are `undefined`, so `valid` is always `false`. The code then checks `if (!valid && !paymentService.MOCK_MODE)` — but `paymentService.js` **never defines or exports `MOCK_MODE`**, so this is always `true`, and the endpoint currently rejects every checkout attempt, real or fake (fails closed today). This is flagged High rather than Critical because it currently fails safe — but it is exactly the kind of confusing, broken check that gets "fixed" under deadline pressure by simply removing the validation, which would then reintroduce a payment-bypass vulnerability. The referenced `MOCK_MODE` concept doesn't exist anywhere in the codebase, suggesting incomplete/abandoned work here.
- **Affected Files:** `backend/src/controllers/paymentsController.js` (`verifyCheckout`), `backend/src/services/paymentService.js`
- **Recommended Fix (no code):** Fix the call to pass an object (matching `verifyPayment`'s correct usage a few functions below). Remove the dead `MOCK_MODE` reference or implement it explicitly and safely (e.g., only true when `NODE_ENV !== 'production'`), never defaulting to bypass in production.
- **Verification Method:** Unit test `verifyCheckout` with a genuine, correctly-signed Razorpay payload and confirm it now succeeds; confirm a tampered signature is still rejected in all environments including any "mock" mode.

---

**H-04 — Verbose internal error disclosure to API clients**
- **Risk:** Information disclosure aiding reconnaissance.
- **Impact:** Several handlers return raw driver/error messages to the client, e.g. `res.status(500).json({ error: 'Internal server error', detail: err.message })` in `listingsController.js` (`getListings`, `getListingById`, `getLiveAuctions`, `getNewArrivals`), and the global error handler in `app.js` returns `err.message` directly (`res.status(err.status || 500).json({ error: err.message || 'internal_error' })`). Postgres error messages frequently include table/column names, constraint names, and query fragments.
- **Affected Files:** `backend/src/app.js`, `backend/src/controllers/listingsController.js`
- **Recommended Fix (no code):** Return generic, static error messages to clients; log full detail (message + stack) server-side only via the existing Winston logger.
- **Verification Method:** Trigger a DB error (e.g., malformed query param) and confirm the HTTP response no longer contains driver-specific text.

---

**H-05 — Weak PRNG used for all OTP generation**
- **Risk:** Predictable OTPs weaken verification/escrow integrity.
- **Impact:** Email verification, phone verification, and escrow delivery OTPs are all generated with `Math.floor(100000 + Math.random() * 900000)`. `Math.random()` is not cryptographically secure; while not trivially predictable remotely in Node's V8 implementation without additional leakage, it is the wrong primitive for a security control and is explicitly called out by OWASP as unsuitable for tokens/OTPs.
- **Affected Files:** `backend/src/controllers/authController.js`, `backend/src/routes/escrow.js`
- **Recommended Fix (no code):** Use a CSPRNG (e.g., `crypto.randomInt(100000, 1000000)`).
- **Verification Method:** Code review confirms `crypto.randomInt`/`crypto.randomBytes` is used for all OTP generation.

---

**H-06 — No rate limiting on OTP verification endpoints**
- **Risk:** Brute-forcing 6-digit OTPs within their validity window.
- **Impact:** `/api/auth/verify-email`, `/api/auth/verify-phone`, and the escrow OTP endpoints have no dedicated rate limiter (see also C-05); only the blanket global limiter (200 requests / 15 minutes) applies, which is far too permissive to prevent guessing a 6-digit code, especially given 15-minute-to-14-day validity windows.
- **Affected Files:** `backend/src/routes/auth.js`, `backend/src/routes/escrow.js`, `backend/src/middleware/rateLimiter.js`
- **Recommended Fix (no code):** Add a strict per-user/per-IP limiter (e.g., 5 attempts per code) to all OTP-verification routes, mirroring `authLimiter`/`bidLimiter` patterns already established in the codebase.
- **Verification Method:** Submit 10+ incorrect codes in a short window; confirm lockout well before the 1,000,000-value keyspace is threatened.

---

**H-07 — Admin router placement silently breaks the user-facing "report" feature**
- **Risk:** Availability/business-logic defect with a risky likely fix.
- **Impact:** `backend/src/routes/admin.js` applies `router.use(auth); router.use(adminMiddleware);` to the **entire** router, including `POST /reports`. The code even contains a developer comment acknowledging this: *"Any user can create a report, but wait, this route requires admin."* As shipped, **regular users cannot file abuse/listing reports at all** — a core trust & safety feature is unreachable by its intended audience. This is flagged High (not just a bug) because the most likely quick fix — moving the whole router or stripping `adminMiddleware` broadly — could accidentally expose the *other* admin-only endpoints in the same file (user list, role changes, dispute resolution, KYC approval) if done carelessly.
- **Affected Files:** `backend/src/routes/admin.js`, `backend/src/controllers/adminController.js` (`createReport`)
- **Recommended Fix (no code):** Move `POST /reports` (create) to a user-facing router (e.g., mounted under `/api/reports` with only `authMiddleware`), keeping `GET /reports` and `PATCH /reports/:id/status` under the admin-only router.
- **Verification Method:** As a non-admin authenticated user, confirm report creation now succeeds while admin-only endpoints continue to reject non-admins.

---

### MEDIUM

---

**M-01 — Refresh tokens stored in plaintext in the database**
- **Impact:** A database compromise (backup leak, injection elsewhere, insider access) yields immediately usable 7-day session tokens for every user, with no additional protection.
- **Affected Files:** `backend/src/controllers/authController.js`, `refresh_tokens` table
- **Recommended Fix (no code):** Store a SHA-256 hash of the refresh token; compare hashes on lookup, as is standard practice.
- **Verification Method:** Inspect `refresh_tokens` table content after login; token value should not be recoverable in plaintext form.

---

**M-02 — Google OAuth mock-token path is a latent full-auth-bypass if misconfigured**
- **Impact:** `authController.googleLogin` accepts `token.startsWith('mock_token_')` as valid whenever `NODE_ENV === 'test'` **or** `!GOOGLE_CLIENT_ID`. If `GOOGLE_CLIENT_ID` is ever absent in a real deployment (a plausible ops mistake, distinct from `NODE_ENV`), any client can authenticate as an arbitrary (new) account by POSTing `{ "token": "mock_token_anything" }` — no Google verification occurs at all.
- **Affected Files:** `backend/src/controllers/authController.js` (`googleLogin`)
- **Recommended Fix (no code):** Gate the mock path on `NODE_ENV === 'test'` only, never on the mere absence of a config value; fail closed (return `google_oauth_not_configured`) if `GOOGLE_CLIENT_ID` is missing outside test.
- **Verification Method:** In a non-test environment with `GOOGLE_CLIENT_ID` unset, confirm `mock_token_*` values are rejected.

---

**M-03 — Password change does not revoke existing refresh tokens**
- **Impact:** `updatePassword` rotates the password hash but leaves any previously-issued refresh tokens for that user valid, so a stolen refresh token survives a password change intended to lock an attacker out.
- **Affected Files:** `backend/src/controllers/authController.js` (`updatePassword`)
- **Recommended Fix (no code):** On password change (and on password reset, once H-02 is implemented), delete all `refresh_tokens` rows for that user.
- **Verification Method:** Capture a refresh token, change the password, confirm the old refresh token can no longer mint new access tokens.

---

**M-04 — Unbounded pagination parameters**
- **Impact:** `getListings` accepts client-supplied `limit`/`offset` with no server-side ceiling, allowing a very large `limit` to force an expensive full scan/large payload — a low-effort resource-exhaustion vector.
- **Affected Files:** `backend/src/controllers/listingsController.js` (`getListings`)
- **Recommended Fix (no code):** Clamp `limit` to a sane maximum (e.g., 100) server-side regardless of client input.
- **Verification Method:** Request `?limit=999999` and confirm the server caps the result set.

---

**M-05 — Inconsistent database TLS enforcement between runtime and CI/migrations**
- **Impact:** `backend/src/utils/db.js` correctly forces `sslmode=verify-full` and `rejectUnauthorized: true` for the running application in production. However, `.github/workflows/migrations.yml` sets `DB_SSL_REJECT: false` for the migration job. If the migration tooling honors that variable, automated schema migrations could run over a connection with certificate validation disabled, creating a MITM exposure window distinct from (and inconsistent with) the app's own hardened posture.
- **Affected Files:** `.github/workflows/migrations.yml`, `backend/src/utils/db.js`
- **Recommended Fix (no code):** Align migration-time SSL enforcement with runtime enforcement; remove the relaxed flag or confirm (and document) that it is inert.
- **Verification Method:** Confirm the migration job's actual Postgres connection during CI enforces certificate validation.

---

**M-06 — `updateListing` builds SQL column names from camelCase keys that don't match snake_case schema columns**
- **Impact:** Functional defect, not a live injection (Joi restricts the key set to a fixed, known list), but a latent SQL-injection *footgun*: if a future change swaps the current Joi-key-driven approach for anything that accepts arbitrary client-supplied keys, the existing pattern of directly interpolating object keys into `SET ${key} = $n` would become directly exploitable. As it stands, several fields (`buyingMethod`, `offersAllowed`, `minimumOfferPercent`, `imageUrls`, `auctionEndsAt`) likely fail silently or error at the DB layer since the real columns are `buying_method`, `offers_allowed`, etc.
- **Affected Files:** `backend/src/controllers/listingsController.js` (`updateListing`)
- **Recommended Fix (no code):** Use an explicit allow-list mapping from API field name → DB column name (never interpolate arbitrary keys into SQL), and fix the camelCase/snake_case mismatch so the intended fields actually persist.
- **Verification Method:** PUT a payload changing `buyingMethod`/`imageUrls`/etc. and confirm the change is actually persisted (functional test), plus a code-level check that no dynamic key is ever interpolated without going through the allow-list.

---

**M-07 — Debug/diagnostic output committed into route source code**
- **Impact:** `frontend/app/api/wishlist/route.ts` begins with a comment block containing raw internal diagnostic query output ("Diagnosis Results... What's in the wishlists table?..."). This is minor information disclosure (reveals internal DB shape was inspected this way) and signals that other debug artifacts may exist elsewhere; more importantly it indicates ad-hoc production debugging practices that should be tightened.
- **Affected Files:** `frontend/app/api/wishlist/route.ts`
- **Recommended Fix (no code):** Remove debug comments before merge; add a lint/CI check for common debug markers.
- **Verification Method:** Repo-wide grep for similar comment patterns before each release.

---

### LOW

---

**L-01 — Helmet used with default configuration only**
- **Impact:** `app.use(helmet())` with no explicit CSP. Given the app renders user-generated listing content and integrates third-party scripts (Cloudinary, Razorpay Checkout), an explicit Content-Security-Policy would meaningfully reduce XSS blast radius (which matters more given C-03).
- **Affected Files:** `backend/src/app.js`
- **Recommended Fix (no code):** Configure an explicit CSP allow-listing only required origins (Cloudinary, Razorpay, self).

---

**L-02 — MIME-type-only validation on file uploads**
- **Impact:** Both upload paths (`images.js` via Multer, `listingsController.uploadImage`) validate only the client-supplied `Content-Type`/`mimetype`, not file content/magic bytes. Cloudinary's own processing provides some mitigation, but this is not defense-in-depth.
- **Affected Files:** `backend/src/routes/images.js`, `backend/src/routes/listings.js`
- **Recommended Fix (no code):** Add magic-byte sniffing (e.g., `file-type` package) before accepting uploads.

---

**L-03 — Full error objects (including stack traces) sent to the logger without redaction**
- **Impact:** The global error handler logs `{ error: err, stack: err.stack }` via Winston for every error, including on payment/escrow routes. Ensure log storage/aggregation is access-controlled and that PII/payment fields are scrubbed before any third-party log shipping is added.
- **Affected Files:** `backend/src/app.js`, `backend/src/utils/logger.js`

---

## 6. OWASP Top 10 (2021) Mapping

| OWASP Category | Applicable Findings |
|---|---|
| A01 Broken Access Control | C-04, C-05, H-01, H-07 |
| A02 Cryptographic Failures | C-01, C-03, M-01, H-05 |
| A03 Injection | M-06 (latent/footgun only; no live injection found) |
| A04 Insecure Design | C-02 (dual write-path architecture), H-03 |
| A05 Security Misconfiguration | C-01, M-02, M-05, L-01 |
| A07 Identification & Authentication Failures | C-01, C-03, H-02, H-06, M-02, M-03 |
| A08 Software and Data Integrity Failures | C-01 (webhook forgery), H-03 |
| A09 Security Logging & Monitoring Failures | H-04, L-03 |
| A10 SSRF | Not found — no server-side fetch of user-supplied URLs identified |

---

## 7. Dependency Risks

Dependencies (`backend/package.json`) are on reasonably current major versions (Express 4.18, jsonwebtoken 9.x, helmet 6.x, pg 8.11, razorpay 2.9, socket.io 4.8). No obviously ancient/abandoned packages were observed. Recommended actions rather than specific found CVEs (a live `npm audit` / Snyk run against the lockfile was out of scope for this static review and should be run in CI):
- Run `npm audit --production` (backend) and the frontend's package manager equivalent as a CI gate.
- `bcryptjs` (pure-JS bcrypt) is functionally correct but slower than native `bcrypt`; acceptable for current scale, revisit if login throughput becomes a bottleneck.
- Pin exact versions (currently `^`-ranged) for security-critical packages (`jsonwebtoken`, `helmet`, `razorpay`) to avoid unreviewed transitive upgrades.

---

## 8. Configuration Risks

- No `.env`/`.env.example` files found in the archive — good (secrets not committed) — but also means there is **no documented list of required environment variables**, which directly enables the C-01 fallback-secret problem: nothing forces an operator to notice a missing `JWT_SECRET`.
- CORS origin defaults to `http://localhost:3000` if `FRONTEND_URL`/`FRONTEND_ORIGIN` is unset — safe by omission in production (won't accidentally allow prod traffic) but will silently break rather than alert; combine with the fail-fast startup validation recommended in C-01.
- `NODE_ENV` drives both logging verbosity (`morgan`) and the Google OAuth mock bypass (M-02) — a single environment variable controlling two unrelated concerns (log format and auth bypass) is a code-smell worth separating.

---

## 9. Authentication Review

Covered in detail under C-01, C-03, H-02, H-05, H-06, M-01, M-02, M-03. Summary posture: **password hashing (bcrypt, cost 10) is sound**; **token lifecycle (short-lived access + rotating refresh) is a reasonable design**; the failures are all in secret management, storage location of tokens on the client, and missing recovery/revocation flows — not in the core cryptographic choices.

## 10. Authorization Review

Per-endpoint ownership checks are present and correct on the majority of sensitive routes (`ordersController`, `listingsController.updateListing`/`deleteListing`, `offers accept`, `escrow ship`/`confirm-delivery`/`dispute`, `admin` router). The exceptions are concentrated and specific: the offer-reject IDOR (C-04) and the escrow OTP caller check (C-05). Recommend a lightweight internal checklist/lint rule requiring every mutating route to state, in a comment or shared helper, which column it checks against `req.userId`.

## 11. Business Logic Review

The Express-side auction lifecycle (`auctionService.placeBid`, `settlementService.closeAuction`, `processDecline`) is the strongest part of the codebase: correct row locking, idempotent settlement, reserve-price handling, deposit-forfeiture-and-next-bidder cascade on buyer decline. The business-logic risk in this app is almost entirely concentrated in **H-01** (listing tampering during live auctions) and, most importantly, **C-02** (the parallel Next.js bid path that reimplements the same feature without the rules).

## 12. API Security Review

Rate limiting exists (global + auth-specific + bid-specific) but is not applied to OTP-verification or escrow endpoints (H-06, C-05). Error handling leaks internal detail (H-04). CORS and Helmet are present with sane defaults but not hardened (L-01). No API versioning strategy observed — acceptable at current maturity, revisit before a public third-party integration surface is exposed.

## 13. Database Security Review

Parameterized queries are used consistently throughout the reviewed codebase — no live SQL injection was identified in either the Express or Prisma layers. `db.js` correctly enforces `verify-full` SSL in production. Transactions and row locks are used appropriately around money-moving operations. The main gaps are M-01 (plaintext refresh tokens) and M-06 (a non-exploitable-today SQL-construction pattern that should still be corrected before it becomes exploitable).

## 14. Infrastructure Security Review

No Dockerfiles or infra-as-code were present in the archive to review directly. CI workflows are minimal (migration + a largely-empty test job with no lint configured yet). The one infra-relevant finding is M-05 (SSL enforcement inconsistency between the app runtime and the migration CI job).

## 15. Secrets & Environment Review

This is the thread connecting the most severe findings in the report (C-01 and its downstream consequences). No secrets were found committed to the repository. The risk is entirely in **fallback behavior at runtime**, not in the source control hygiene, which is otherwise clean.

## 16. Logging & Monitoring Review

Winston + Morgan are configured with environment-aware formats. No structured audit trail beyond the existing `escrow_audit_log` table (which is a good pattern — recommend extending it: e.g., an equivalent `auth_audit_log` for login/refresh/role-change events would materially help incident response for the C-01/C-04/C-05 class of issues).

## 17. Remaining Risks

- No independent dependency-vulnerability scan (`npm audit`/Snyk) was run as part of this static review — recommended as a follow-up automated step.
- No dynamic testing (DAST) or live penetration test was performed; this review is source-level only.
- Frontend components beyond the listed `app/api` routes (client-side React) were not individually re-audited for reflected XSS sinks (e.g., `dangerouslySetInnerHTML`), which is directly relevant given C-03's blast radius — recommended as a focused follow-up grep/review.

## 18. Production Readiness Score: 38 / 100

Rationale: strong core transactional/auction logic and clean SQL practices are offset by five critical, directly-exploitable issues (forgeable secrets, a full business-logic bypass via a duplicate endpoint, insecure token storage, and two authorization gaps) that are individually launch-blocking. The score reflects "good bones, not yet safe to expose to real money and real users."

---

## 19. Prioritized Remediation Roadmap

### Phase P0 (Critical — block launch)
1. Remove all hardcoded secret fallbacks; add fail-fast startup validation (C-01).
2. Eliminate or fully re-guard the duplicate Next.js bidding endpoint (C-02).
3. Move session token to a server-set `HttpOnly`/`Secure`/`SameSite` cookie; stop persisting to localStorage (C-03).
4. Fix the offer-reject IDOR (C-04).
5. Add caller authorization + rate limiting to escrow OTP verification (C-05).

### Phase P1 (High — fix before general availability)
6. Lock listing edits once an auction has bids (H-01).
7. Implement password reset/recovery flow (H-02).
8. Fix `verifyCheckout`'s broken signature call; remove the dead `MOCK_MODE` reference (H-03).
9. Sanitize client-facing error responses (H-04).
10. Switch OTP generation to a CSPRNG (H-05).
11. Add rate limiting to all OTP-verification endpoints (H-06).
12. Move report-creation off the admin-only router (H-07).

### Phase P2 (Medium — pre-scale hardening)
13. Hash refresh tokens at rest (M-01).
14. Remove the Google-mock auth path outside of `NODE_ENV==='test'` (M-02).
15. Revoke refresh tokens on password change (M-03).
16. Cap pagination limits server-side (M-04).
17. Align CI migration SSL enforcement with runtime (M-05).
18. Fix the camelCase/snake_case column mismatch in `updateListing` via an explicit field allow-list (M-06).
19. Strip debug artifacts from source (M-07).

### Phase P3 (Low — continuous improvement)
20. Configure an explicit CSP via Helmet (L-01).
21. Add magic-byte validation to file uploads (L-02).
22. Review log redaction policy before adding any external log sink (L-03).

---

## 20. Implementation Plan

For each roadmap item, the same checklist applies; details vary by item (see the corresponding finding above for the specific fix and affected files):

| Step | What to verify before merging a fix |
|---|---|
| Files to modify | Listed per-finding above; most P0/P1 items touch 1–2 files only |
| Why the change is needed | See "Risk"/"Impact" in each finding |
| Expected impact | Closes the specific bypass without changing intended user-facing behavior for legitimate flows |
| Regression risk | **C-02** carries the highest regression risk — removing/replacing the duplicate bid endpoint touches live checkout UI flows and needs coordinated frontend/backend release. **H-07** carries moderate regression risk — re-routing `createReport` must not accidentally widen access to the other admin-only routes in the same file. All other items are narrowly scoped, low-regression-risk, single-endpoint changes. |
| Verification checklist | Each finding above lists a concrete verification method; in addition, add regression/integration tests asserting: (a) forged tokens/secrets are rejected when env vars are unset, (b) the Next.js bid route enforces the same rules as the Express route (or no longer exists), (c) offer/escrow ownership checks reject unrelated users, (d) OTP brute-force is rate-limited. |

**General recommendation:** Treat P0 items as a single coordinated release with a security-focused code review and a repeat of this audit's verification steps before re-enabling public traffic to payments/escrow endpoints.
