# BidCraft Codebase Audit Report

**Auditor:** Principal Software Engineer / Technical Architect  
**Date:** July 2026  
**Scope:** Full codebase — frontend (Next.js App Router), database (PostgreSQL + Prisma), auth, state, API layer

---

## 1. Overall Architecture Summary

BidCraft is a Next.js 14 App Router monolith. There is no separate backend — all API logic lives in Next.js route handlers under `app/api/`. The database is PostgreSQL accessed via two competing layers:

- **Prisma ORM** (`lib/prisma.ts`) — used in `app/api/products/`, `lib/dbProducts.ts`
- **Raw `pg.Pool`** (`lib/db.ts`) — used in `app/api/wishlist/`, `app/api/cart/`

Frontend state is managed by two Zustand stores (`lib/store.ts` and `store/authStore.ts`) that partially duplicate each other and both persist to `localStorage`. Authentication is custom JWT (cookie-based), with `lib/auth.ts` issuing/verifying tokens server-side and `store/authStore.ts` persisting them client-side.

---

## 2. Critical Bugs (Production-Breaking)

### BUG 1 — Wishlist and Cart routes query columns that don't exist in the schema

**File:** `app/api/wishlist/route.ts`, `app/api/cart/route.ts`

The raw SQL queries reference `l.cloudinary_public_id`, `l.is_published`, and `l.subcategory` on the `listings` table. **None of these columns exist in `prisma/schema.prisma`.** The schema uses `photos` (JSON), has no `is_published` boolean, and no `subcategory` column. This means every authenticated wishlist GET and POST will throw a PostgreSQL `column does not exist` error.

The wishlist table in the schema is named `wishlist` (singular) but the SQL says `FROM wishlists` (plural). One of these is wrong and it will cause a `relation "wishlists" does not exist` crash.

**Fix required:**
```sql
-- In wishlist GET: replace
l.cloudinary_public_id,
l.subcategory,
AND l.is_published = true
-- with
(l.photos->0)::text as image,
l.category,
-- remove is_published filter (column doesn't exist)

-- Fix table name: FROM wishlists → FROM wishlist
```

**In cart GET/POST:** same `cloudinary_public_id` and `is_published` issues. Also the auction exclusion check compares `listing_type != 'auction'` (lowercase) but actual stored values are `'AUCTION'` (uppercase per Prisma usage in bid route). This means auction items are NOT excluded from carts.

---

### BUG 2 — Hardcoded JWT secret fallback in `lib/auth.ts`

```ts
jwt.verify(token, process.env.JWT_SECRET || 'd7be4a7c8635...')
```

A 128-char hardcoded secret is committed to source. Any token signed with this secret — by anyone who reads the repo — is trusted. This is a **critical security vulnerability**. If `JWT_SECRET` is not set in production, this fallback silently activates.

**Fix:** Remove the fallback. Throw on startup if `JWT_SECRET` is missing.

---

### BUG 3 — Demo user in bid route (`app/api/products/[id]/bid/route.ts`)

```ts
let demoUser = await tx.users.findFirst({ where: { role: 'buyer' } });
if (!demoUser) {
  demoUser = await tx.users.create({ data: { email: 'demobidder@example.com', ... } });
}
await tx.bids.create({ data: { auction_id: ..., bidder_id: demoUser.id, ... } });
```

Every bid is attributed to the first buyer in the database (or a newly created demo user). Real authentication is completely bypassed. This means anyone can bid under any identity, and all bids are owned by the wrong user.

**Fix:** Read the authenticated user's ID from the session before the transaction and use it.

---

### BUG 4 — `profiles` relation treated as array when it's 1-1

In `lib/dbProducts.ts` and `app/api/products/route.ts`:
```ts
listing.users?.profiles?.[0]?.is_verified
```

The Prisma schema defines `profiles` as a one-to-one relation (`profiles profiles?`), not an array. Prisma returns it as a single object or null, not `profiles[]`. Accessing `[0]` on a non-array silently returns `undefined`, so `is_verified` is always `false` for all listings.

**Fix:** `listing.users?.profiles?.is_verified ?? false`

---

### BUG 5 — `listing_type` case mismatch

Cart route checks: `l.listing_type != 'auction'` (lowercase)  
Bid route checks: `listing.listing_type !== 'AUCTION'` (uppercase)  
Prisma mapping returns: `'AUCTION'`, `'BUY_NOW'`, `'NEGOTIABLE'` (uppercase)

The cart's SQL filter uses lowercase `'auction'` so `!= 'auction'` always evaluates to true for uppercase values — auction items slip into carts.

---

## 3. Architecture Issues

### Two data access layers fighting each other

`app/api/wishlist/` and `app/api/cart/` use raw `pg.Pool` SQL. Every other route uses Prisma. This creates two places to maintain schema awareness. The raw SQL routes are also the ones with the broken column names (Bug 1), which is not a coincidence — Prisma's type-safe layer would have caught these at compile time.

**Recommendation:** Migrate wishlist and cart routes to Prisma. The schema already has `wishlist` and `cart_items` models with full relations defined.

---

### Two Zustand stores with overlapping responsibility

`lib/store.ts` holds `user`, `token`, `cart`, `wishlistIds`, and auth actions (`login`, `logout`).  
`store/authStore.ts` holds `user`, `token`, `isAuthenticated`, `setAuth`, `clearAuth`.

Both stores persist to localStorage. Both hold `user` and `token`. They are manually synced via `authStore.setAuth` calling `useStore.getState().mergeWithServer()`. This is fragile — if one store updates without the other, state diverges.

`AuthProvider` in `lib/auth-context.tsx` wraps `useAuthStore` and re-exposes `login/logout/register`, adding a third layer over the same data. `loading` is hardcoded to `false`, so there is no real loading state during auth rehydration.

**Recommendation:** Collapse to a single auth store. Use `AuthContext` only for legacy compatibility shims during migration.

---

### `lib/api.ts` points at `localhost:8000` — a server that doesn't exist

All auth functions (`login`, `register`, `getMe`), payment functions, order functions, auction deposit functions, and listing upload functions call `${API_BASE}/api/...` where `API_BASE = 'http://localhost:8000'`. There is no FastAPI or Express server at port 8000. The Next.js routes are at `/api/...` (same origin). This means **authentication, payments, and orders are all broken** unless `NEXT_PUBLIC_API_URL` is set to the same Next.js origin.

The cart and wishlist routes (the ones that work at all) correctly hit `/api/cart` and `/api/wishlist` relative URLs. The pattern is inconsistent across the codebase.

---

### `lib/exploreProducts.js` and `lib/exploreProducts.ts` both exist

Two versions of the same file — one JS, one TS. TypeScript project will resolve `.ts` first, but the `.js` file is dead weight that can cause confusion.

---

## 4. Code Quality Issues

### Dead/migration scripts committed to repo root

20+ `.js` files in `frontend/`: `add_art_listings.js`, `cleanup_listings.js`, `update-navbar.js`, `stagger-auctions.js`, `fix-imports.js`, etc. These are one-off data migration and seeding scripts that ran during development. They should not be in the repo root and should not ship to production. Move to `scripts/` or gitignore.

Also: `client-explore-old.txt`, `extracted_listings.txt`, `git_history.txt`, `user_prompts.json`, `user_prompts_full.json`, `summary.json` — none of these belong in the repo.

---

### `app/api/products/route.ts` — category filter is broken

```ts
if (category) {
  // Just returning everything for now or filter if needed
}
```

The category parameter is read but silently ignored. The comment was never removed. Category filtering returns all listings regardless.

---

### `offersAllowed: listing.listing_type === 'NEGOTIABLE' || true`

In both `app/api/products/route.ts` and `[id]/route.ts`:
```ts
offersAllowed: listing.listing_type === 'NEGOTIABLE' || true,
```

`|| true` makes this always `true`. Every listing appears to accept offers regardless of type. This is either a logic bug or a development shortcut never cleaned up.

---

### `sort` parameter in `lib/dbProducts.ts` doesn't actually sort differently

```ts
orderBy: sort === 'newest' ? { created_at: 'desc' } : { created_at: 'desc' },
```

Both branches are identical. The sort parameter is accepted but has no effect.

---

### Magic `alert()` calls in `product-card.tsx`

```ts
alert('Added to cart!')
alert('Failed to add to cart')
```

Browser `alert()` is blocking and visually jarring. Should use the toast/notification system.

---

### `loading: false` hardcoded in `AuthProvider`

```ts
<AuthContext.Provider value={{ user, token, loading: false, ... }}>
```

Auth rehydration from `localStorage` via Zustand's `persist` middleware is async. During the initial hydration frame, `user` is `null` even for logged-in users. Any component that checks `if (!user)` during this frame will flash a "not logged in" state. This is the classic auth flash problem. The fix is tracking hydration state (`useAuthStore.persist.hasHydrated()`).

---

## 5. Database Design Observations

The schema is well-structured overall. Key observations:

**Good:**
- Proper escrow FSM with `escrow_audit_log` for transition history
- `@@unique([user_id, listing_id])` on both `wishlist` and `cart_items` prevents duplicates
- Composite indexes on hot query paths (e.g., `idx_notifications_user_feed`)
- Cascade deletes where appropriate (cart_items, wishlist on listing delete)

**Issues:**
- `dispute_status` enum has both `under_review` and `review` — appears to be a duplicate state
- `wishlist` uses `onDelete: NoAction` for both user and listing FKs — a deleted listing leaves orphaned wishlist rows visible to the user. Should be `Cascade`
- `listings.photos` is `Json` but treated as `string[]` everywhere in code — no enforced structure
- No full-text search index on `title`/`description` — the current `ILIKE` search in `dbProducts.ts` will do sequential scans on large datasets. Add a GIN index with `tsvector` for production.
- `min_bid_increment` has a default of `10.00` at the DB level — fine — but it's never validated in the bid route. A bidder could place `current_bid + 0.01` and it would succeed.

---

## 6. Performance Issues

**N+1 risk in `getProducts`:** The function runs `prisma.listings.findMany` with `include: { users: { include: { profiles: true } }, auctions: true }`. Prisma handles this with JOINs so there's no N+1, but the full user object (including all relations) is loaded for every listing. Only `name` and `is_verified` are used.

**Redis cache keys not namespaced by environment:** `cacheGet('explore:all:all:1:recent')` will collide between staging and production if they share an Upstash instance.

**`mergeWithServer` in authStore runs on every login** — it fetches `/api/cart` and `/api/wishlist` sequentially in `Promise.all`, which is fine, but if the wishlist route crashes (Bug 1), the error is swallowed silently with `console.error`. The cart state remains stale.

---

## 7. Scalability Notes

The architecture is appropriate for an early-stage platform. Next.js API routes on Vercel will scale horizontally. Redis caching is already in place for hot reads. The main scaling risks are:

- **Auction bid race conditions:** The bid route uses a Prisma transaction but `current_bid` is updated with `{ current_bid: bidAmount }` not with a conditional check inside the transaction. Under concurrent bids, two requests could both pass the `bidAmount > currentHighestBid` check simultaneously before either commits. Fix: use a `WHERE current_bid < $bidAmount` conditional update and check affected rows.
- **No WebSocket auth:** `lib/useSocket.ts` connects to a socket server but there's no auth token sent on connect. Anyone can subscribe to auction events.

---

## 8. Files Modified

This is a read-only audit. No files were modified. All findings are documented for the dev to implement.

---

## 9. Prioritized Fix List

### P0 — Fix immediately (data loss / security)

| # | File | Issue |
|---|------|-------|
| 1 | `lib/auth.ts` | Remove hardcoded JWT secret fallback |
| 2 | `app/api/wishlist/route.ts` | Fix nonexistent columns (`cloudinary_public_id`, `is_published`, `subcategory`) and wrong table name (`wishlists` → `wishlist`) |
| 3 | `app/api/cart/route.ts` | Fix nonexistent columns, fix `listing_type` case (`'auction'` → `'AUCTION'`) |
| 4 | `app/api/products/[id]/bid/route.ts` | Replace demo user with authenticated user from session |

### P1 — Fix before launch (incorrect behavior)

| # | File | Issue |
|---|------|-------|
| 5 | `lib/dbProducts.ts` + `app/api/products/route.ts` | `profiles?.[0]` → `profiles?.` (1-1 relation) |
| 6 | `app/api/products/route.ts` | Implement category filter (currently no-op) |
| 7 | Both products routes | Remove `|| true` from `offersAllowed` |
| 8 | `lib/dbProducts.ts` | Fix sort — two branches are identical |
| 9 | `lib/api.ts` | All auth/payment/order functions point to `localhost:8000` — must be fixed for production |
| 10 | `lib/auth-context.tsx` | Fix `loading: false` — track Zustand hydration state |

### P2 — Clean up (maintainability)

| # | Issue |
|---|-------|
| 11 | Delete `lib/exploreProducts.js` (duplicate of `.ts`) |
| 12 | Move 20+ root-level `.js` scripts to `scripts/` |
| 13 | Delete `*.txt`, `*.json` dev artifacts from repo root |
| 14 | Replace `alert()` in `product-card.tsx` with toast |
| 15 | Migrate wishlist/cart routes from raw SQL to Prisma |
| 16 | Collapse dual Zustand stores into one |

### P3 — Future (scalability)

| # | Issue |
|---|-------|
| 17 | Auction bid: add conditional `WHERE current_bid < $bid` to prevent race conditions |
| 18 | Add `tsvector` GIN index for product search |
| 19 | Namespace Redis keys by environment |
| 20 | Fix `dispute_status` enum duplicate (`under_review` vs `review`) |
| 21 | Change `wishlist` FK to `onDelete: Cascade` for listing |

---

## 10. Lessons Learned

**Mixing raw SQL and ORM on the same tables is the root cause of the column-name bugs.** Prisma's type-safe query builder would have caught `cloudinary_public_id` at compile time. The two raw SQL routes bypassed that safety net and immediately went out of sync with the schema.

**Demo scaffolding left in production paths is a security risk.** The demo bidder pattern in the bid route is the kind of thing that gets written during early testing and forgotten. A CI check that greps for `demobidder` or `Demo Bidder` in API routes would catch this.

**Two stores managing the same auth state is a ticking time bomb.** Every time login/logout behavior needs to change, both stores need updating in sync. One should own the data; the other should be deleted.

---

## 11. Remaining Technical Debt After P0+P1 Fixes

- WebSocket auth (no token on socket connect)
- Auction bid race condition (concurrent bids possible)
- No rate limiting on bid endpoint (spam bids)
- No email verification enforcement at login (codes table exists, flow unclear)
- KYC flow: `profiles.kyc_status` exists but no API routes to drive the KYC state machine
- `lib/mock-data.ts` — static mock data likely still used in some sections components; should be fully replaced by real API calls

---

*End of audit. All findings are non-destructive — no files were changed. Implement P0 fixes first; the wishlist/cart data corruption and the JWT secret are the most urgent.*
