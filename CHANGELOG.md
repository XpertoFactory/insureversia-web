# Changelog

All notable changes to the Insureversia website will be documented in this file.

## [0.3.1] - 2026-02-18

### Fixed

- **InsureversiaAvatar**: Fixed speech bubble text unreadable in dark mode — moved inline styles to CSS class with dark mode override (`--color-primary` → `--text-secondary`)

---

## [0.3.0] - 2026-02-18

### Added

**Phase 3: Learn Section**

- **Learn section** (6 pages):
  - `learn/ai-101/` — 7-module learning path for insurance professionals (AI fundamentals, LLMs, insurance AI tools, ethics & regulation, prompt engineering, AI workflows, future of AI in insurance)
  - `learn/what-to-do/` — 10 best practices for AI in insurance (collection-based, rendered from content files)
  - `learn/what-not-to-do/` — 10 critical mistakes to avoid (collection-based, rendered from content files with danger styling)
  - `learn/prompt-engineering/` — CRAFT framework with 6 technique comparisons (weak vs. effective), 5 reusable prompt patterns for insurance tasks
  - `learn/program/` — Learning Program page with pillars, 5 format categories (accordion), 3 learning modes, 4-step methodology, Smoother framework
  - `learn/program/case-studies/` — 3 case study cards (Lemonade AI Claims, Sterling Data Breach, Sentient Weather Tribunal)
- **Content collections** (20 markdown files):
  - `what-to-do/en/` — 10 best practices: verify output, accelerate research, establish AI policy, disclose AI use, first-draft generation, document review, prompt library, stay current, train your team, experiment low-risk
  - `what-not-to-do/en/` — 10 dangers: don't submit unread, don't paste confidential data, don't assume jurisdiction, don't replace judgment, don't hide AI use, don't treat as verified data, don't use for emotional intelligence, don't ignore regulations, don't let AI write everything, don't assume limitations permanent

---

## [0.2.0] - 2026-02-18

### Added

**Phase 2: Explore + About Pages**

- **Explore section** (3 pages):
  - `explore/new-frontiers/` — 10 emerging AI frontiers in insurance (AI underwriting, predictive claims, fraud detection, parametric insurance, RegTech, cat modeling, telematics, embedded insurance, AI-driven reinsurance)
  - `explore/ai-impact/` — Transformation Map showing AI impact across 6 insurance sectors with severity badges and transformation timelines
  - `explore/challenges/` — 6 ethical + 6 practical challenges with severity ratings and "Responsible Path Forward" framework
- **About section** (4 pages):
  - `about/` — Hub page with hero and 3 cards linking to sub-pages
  - `about/insureversia/` — Identity, mission, core thesis, 6 principles, important notice
  - `about/guide/` — Guided tour with color-coded section headers, interactive sitemap modal with full site navigation
  - `about/team/` — Born from CEMI.ai, The Curator (Carlos Miranda Levy)
- **InsureversiaAvatar component** — Reusable avatar with size variants and optional speech bubble

---

## [0.1.1] - 2026-02-18

### Changed

**Site structure: new pages and About section split**

- **Navigation & Footer**: Added Ethics Simulator (Practice), Tool Directory and Jurisdiction Guide (Resources) to all nav menus; About changed from single link to dropdown with 3 sub-pages
- **About section**: Split into hub page + 3 sub-pages: `/about/insureversia/` (identity, mission, principles), `/about/guide/` (guided tour, site map), `/about/team/` (CEMI.ai, curator)
- **i18n (en.json)**: Added ~135 new keys — nav items for new pages, full `about` sub-page content, `ethicsSimulator`, `toolDirectory`, and `jurisdictionGuide` sections
- **Logo prompts**: Added `resources/auxiliary-images-prompts.md` with 9 Gemini prompt variations for brand logo

---

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
