# AI Context & Coding Conventions

This document contains rules and conventions for AI assistants working on this repository.

## Coding Conventions
- **TypeScript**: Use strict typing. Avoid `any`. Use interfaces over types where possible.
- **React**: Use functional components and hooks. Prefer server components in Next.js where state isn't needed.
- **Styling**: Use Tailwind CSS utility classes and CSS variables (e.g., `var(--color-ink-900)`). Avoid arbitrary values when a design token exists.

## Naming Conventions
- **Files/Folders**: `kebab-case` (e.g., `product-card.tsx`, `auth-controller.js`).
- **Variables/Functions**: `camelCase`.
- **Components**: `PascalCase`.
- **Constants**: `UPPER_SNAKE_CASE`.

## Reusable Patterns & Utilities
- **State Management**: Use Zustand (`frontend/lib/store.ts`) for global client state.
- **Class Merging**: Use `cn()` utility (`frontend/lib/utils.ts`) for merging Tailwind classes safely.
- **Data Fetching**: Use standard `fetch` API in server components or inside `useEffect`/`SWR` in client components.

## Architectural Principles
- **Separation of Concerns**: Keep UI logic in components, business logic in backend services, and database queries in repositories/models.
- **Escrow First**: All monetary transactions must route through the simulated escrow flow.

## AI Editing Rules
- Do NOT rewrite working code unless explicitly requested.
- Audit code first before making changes.
- Ensure all React hooks are properly imported from `react`.
- Maintain existing UI aesthetics (spacing, colors, animations) precisely.
- Read this file and the specific `CONTEXT.md` of the module you are modifying before starting.
