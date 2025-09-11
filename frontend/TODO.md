You are working inside a monorepo for a web app:
- frontend: React + TypeScript + Vite + Tailwind
- backend: Express + TS
- shared: cross-package types & tokens

Goal: Integrate **Figma design variables** into the frontend codebase and scaffold UI components.

Context:
- Designer has already set up variables in Figma (colors, typography, spacing, radii).
- These should be exported to `shared/design-tokens/tokens.json`.
- From that JSON, generate:
  - `frontend/src/design-system/tokens.css` (CSS vars)
  - `frontend/src/design-system/tokens.d.ts` (type declarations)
  - Tailwind config mapped to those CSS vars.

Steps to follow in code:
1. Create `scripts/build-tokens.ts` using Style Dictionary that transforms `shared/design-tokens/tokens.json` → CSS variables + TS types.
2. Add an npm script `"tokens": "tsx scripts/build-tokens.ts"` to package.json at root.
3. Update `frontend/tailwind.config.ts` so theme values (colors, spacing, radius) map to CSS vars instead of hardcoded values.
4. Import `tokens.css` inside `frontend/src/styles/globals.css` to expose variables.
5. Scaffold a `MainLayout` in `frontend/src/app/layouts/` that matches Figma frame structure (header + left panel + canvas + right panel).
6. Use **shadcn/ui + Radix** components, styled with Tailwind semantic tokens. Start with Button, Input, Dialog.
7. Ensure no raw hex, px, or hardcoded values in code; always reference tokens or Tailwind scale.
8. Add a `/styleguide` route to render a dashboard showing tokens and basic components (sanity check).

When asked to implement UI from Figma:
- Look at Figma variables (semantic names) and auto-layout settings.
- Translate grids, spacing, radius, typography to Tailwind classes using tokens.
- Refactor any hardcoded values into semantic utilities.
- Extract reusable React components for repeated patterns.

When generating JSX:
- Prefer semantic Tailwind utilities (bg-bg, text-fg, rounded-md).
- Use flex/grid layouts that mirror Figma auto-layout.
- Add ARIA attributes where applicable.

Always keep designs and code in sync:
- Figma variables → export JSON → regenerate tokens with `npm run tokens` → components update automatically.

