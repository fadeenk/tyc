# Copilot Instructions for AI Agents

## Project Overview

- This is a Nuxt 3 landing page template using Nuxt UI and Nuxt Content.
- The main app is in `app/` (pages, components, assets, types).
- Shared components are in `components/`.
- Composables (custom hooks) are in `composables/`.
- Content (editable site data) is in `content/`.
- Supabase integration (database migrations) is in `supabase/migrations/`.
- Specs and requirements are in `specs/` (see `001-legal-intake-website/`).

## Key Workflows

- **Install dependencies:** `npm install`
- **Start dev server:** `npm run dev` (localhost:3000)
- **Build for production:** `npm run build`
- **Preview production build:** `npm run preview`
- **Nuxt config:** `nuxt.config.ts` and `app/app.config.ts`
- **TypeScript:** Project uses strict typing (`tsconfig.json`).
- **Linting:** See `eslint.config.mjs` for rules.

## Patterns & Conventions

- **Pages:** Use `app/pages/` for route-based views.
- **Components:** Use `app/components/` for UI, `components/` for shared/global.
- **Assets:** CSS in `app/assets/css/`, images in `public/images/`.
- **Composables:** Place reusable logic in `composables/` (e.g., `useIntakeForm.ts`).
- **Types:** Centralize types in `app/types/`.
- **Content:** Markdown/YAML in `content/` for site data.
- **Specs:** Project requirements, data models, and API specs in `specs/`.
- **Database:** Migrations in `supabase/migrations/` (SQL files).

## Integration Points

- **Nuxt UI:** For UI components and theming.
- **Supabase:** For backend/database (see migrations and types).
- **Renovate:** Automated dependency updates (`renovate.json`).

## Examples

- To add a new page: create a `.vue` file in `app/pages/`.
- To add a new composable: create a `.ts` file in `composables/` and import as needed.
- To update database schema: add/edit SQL files in `supabase/migrations/`.

## References

- [Nuxt UI Docs](https://ui.nuxt.com/docs/getting-started/installation/nuxt)
- [Nuxt Deployment Docs](https://nuxt.com/docs/getting-started/deployment)

---

If any conventions or workflows are unclear, ask for clarification or examples from the user before proceeding.
