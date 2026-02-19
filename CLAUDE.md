# Insureversia — CLAUDE.md

## Project Overview

Insureversia is an independent educational platform about AI in the insurance industry. Built with **Astro 5 + Svelte 5**, deployed to GitHub Pages at [insureversia.com](https://insureversia.com).

## Tech Stack

- **Framework:** Astro 5 (static output)
- **UI Components:** Svelte 5 (interactive widgets)
- **Styling:** Vanilla CSS design system (10 files in `src/styles/`)
- **i18n:** Custom system (`src/i18n/index.ts`) — English + Spanish only
- **Backend:** Firebase (Firestore, Auth, Analytics via GA4)
- **Search:** Pagefind (runs post-build)
- **Deploy:** GitHub Pages via `.github/workflows/deploy.yml`

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Build + generate Pagefind index
npm run preview   # Preview production build
```

## Project Structure

```
src/
  components/     # Astro + Svelte components
  content/        # Markdown content collections (quick-wins, what-to-do, what-not-to-do, faq)
  i18n/           # en.json, es.json, index.ts
  layouts/        # BaseLayout.astro
  pages/          # File-based routing (28 pages)
  styles/         # Design system CSS
public/
  assets/         # Images, logos, fonts
resources/        # Internal docs, image prompts, site plan (not deployed)
```

## Key Conventions

- **i18n:** All user-facing text uses `t(locale, 'key.path')`. Add keys to both `en.json` and `es.json`.
- **Content collections:** Markdown files in `src/content/{collection}/{locale}/`. Schemas defined in `src/content/config.ts`.
- **CSS:** No CSS framework. Design tokens in `variables.css`. Dark mode via `[data-mode="dark"]`. Theme toggle: Classic/Modern via `[data-theme="modern"]`.
- **Brand colors:** Navy `#0F2B46`, Gold `#C9A84C`, Teal `#00B4D8`
- **localStorage keys:** `insureversia-theme`, `insureversia-mode`, `insureversia-uid`
- **Naming:** `insuranceSector` (not practiceArea), `insureversiasTake` (not lawrasTake)
- **Personas:** 3 fictional voices — Vera (Gold/Strategist), Bruno (Navy/Guardian), Zaira (Teal/Catalyst)

## Workflow Rules

- **Always update CHANGELOG.md** when committing changes
- Always ask before making major technology decisions
- Build must pass (`npm run build`) before committing — expect 28 pages, zero errors
- Firebase client config in `.env` is public by design (security via Firestore rules)
- The `reference/` directory is gitignored — it contains a reference site, not project code
