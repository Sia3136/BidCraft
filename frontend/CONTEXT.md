# Frontend Context

## Purpose
The frontend module is responsible for rendering the UI, managing client-side state, and routing user interactions to the backend API.

## Responsibilities
- Rendering pages using Next.js App Router (Server and Client components).
- Managing global state (cart, user session, notifications) via Zustand.
- Handling real-time UI updates for auctions via WebSockets.
- Validating user input before API submission.

## Important Files
- `app/layout.tsx`: Root layout containing global providers and UI wrappers.
- `lib/store.ts`: Zustand global state store.
- `lib/utils.ts`: Shared utility functions (e.g., `cn`).

## Dependencies
- `next`, `react`, `tailwindcss`, `zustand`, `framer-motion`, `lucide-react`.

## Extension Points
- New routes are added in `app/`.
- New UI components belong in `components/` and should use existing design tokens.

## Common Pitfalls
- **Hydration Errors**: Avoid using `window` or browser APIs in Server Components. Ensure Zustand state initialization matches server render.
- **Client vs Server**: Default to Server Components. Add `'use client'` only when hooks (`useState`, `useEffect`) or browser APIs are required.
- **Missing Imports**: Always ensure React hooks are imported from `'react'`.
