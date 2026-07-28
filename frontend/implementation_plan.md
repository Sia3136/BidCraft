# Phase 2 Final Polish Implementation Plan

## Goal
Refine the Phase 2 implementation to production-grade quality, fixing the critical username generation bug, redesigning the onboarding UI, improving the auth illustration, and cleaning up the profile data fields.

## User Review Required
> [!IMPORTANT]
> The backend `updateMyProfile` will be modified to handle username race conditions by automatically appending a suffix if the requested username is taken at the time of submission. This ensures a smooth onboarding flow without forcing the user to retry.

## Proposed Changes

### 1. Fix Username Generation (Critical Bug)
- **Root Cause**: The `useDebounce` hook re-creates its returned function whenever the inline callback changes. This, combined with `setIsCheckingUsername` triggering re-renders, caused an infinite loop where the timeout was constantly cleared and reset, or continuously triggered `useEffect`.
- **Fix**: Update `useDebounce` to use a `useRef` for the callback, stabilizing the returned debounced function.
- **Integration**: On mount, call the backend `/api/profile/suggest-username` with the user's name to generate a clean username (e.g., `siya`, `siya1`), replacing the current `Math.random()` approach.

### 2. Onboarding UI Redesign
- Redesign `app/onboarding/page.tsx` with a premium layout (Etsy/Airbnb style).
- Use a guided, smooth-transition step flow.
- Remove `Bio` and `Country` from the onboarding steps.
- Make the steps:
  1. Welcome
  2. Profile details (Name, Username, City, State)
  3. Interests
  4. Marketplace Role

### 3. Authentication Illustration
- Update `app/auth/page.tsx` to replace the empty/plain side column with a professional, artisan-themed marketplace illustration hosted on Cloudinary (optimized).

### 4. Profile Simplification & Avatar
- Update `app/account/settings/page.tsx` to remove `Bio` and `Country`.
- Add `State` if it was missing (ensure consistency with `City`).
- Ensure no avatar upload functionality is present (we rely strictly on the `Avatar` component).
- Update the Profile Completion calculation in `app/account/page.tsx` to exclude Bio and Country, and include Name, Username, State, City, Interests, and Marketplace Role.

### 5. Backend Updates
- In `backend/src/controllers/profileController.js` (`updateMyProfile`): If a username is provided and it's already taken, instead of returning a 409 error, recursively query for the next available username using the base username, and save that instead.
- Remove Language selection options if they exist anywhere in the frontend.

## Verification Plan
### Automated Tests
- N/A for this sprint, will rely on manual verification.

### Manual Verification
- Test registration and observe auto-generation of the username without infinite loading.
- Test the new premium Onboarding flow visually and functionally.
- Verify Profile Completion score calculates correctly.
- Verify that saving a taken username correctly assigns the fallback (race condition fix).
