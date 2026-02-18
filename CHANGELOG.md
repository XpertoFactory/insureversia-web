# Changelog

All notable changes to the Insureversia website will be documented in this file.

## [0.1.0] - 2026-02-18

### Added

**Phase 1: Project Scaffolding + Homepage (Deployable Shell)**

- **Root configuration**: `package.json` (Astro 5 + Svelte 5), `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `.env.example`, GitHub Pages deploy workflow
- **Design system**: 10 CSS files — `variables.css` (brand colors: navy #0F2B46, gold #C9A84C, teal #00B4D8), `layout.css`, `typography.css`, `components.css`, `utilities.css`, `animations.css`, `fonts.css`, `fonts-modern.css`, `theme-modern.css`, `dark-mode.css`
- **Core components**: `BaseLayout.astro`, `Navigation.astro` (5 dropdown menus), `Footer.astro` (Classic/Modern theme toggle), `Icon.astro` (40+ SVG icons), `ShareModal.astro`, `ContactModal.astro`, `LanguageSelector.astro` (en/es), `QuickWinCard.astro`, `DifficultyBadge.astro`, `InsuranceSectorTag.astro`
- **i18n system**: `index.ts` (locale routing + `t()` function), `en.json` (~700 keys), `es.json` (stub with essential keys)
- **Content collections**: `config.ts` with 7 typed schemas (quick-wins, what-to-do, what-not-to-do, faq, success-stories, insurance-challenges, regulations)
- **Initial content**: 3 quick-win guides (policy summary, denial letter, extract dates)
- **Firebase library**: `firebase.ts` (lazy-init singleton with env vars), `likes.ts`, `submissions.ts`
- **Homepage**: Hero section, 6 insurance sectors grid, 3 quick wins preview, compliance edge callout, newsletter/learning program CTA
- **Public assets**: `robots.txt`, `site.webmanifest`, SVG favicon, `CNAME` (insureversia.com)
