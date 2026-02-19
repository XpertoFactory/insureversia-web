# Changelog

All notable changes to the Insureversia website will be documented in this file.

## [0.6.5] - 2026-02-19

### Changed

- **Persona profile photos**: Replaced placeholder SVGs with real AI-generated portrait PNGs for Vera, Bruno, and Zaira on both EN and ES team pages
- Removed old placeholder SVG files from `public/assets/images/personas/`

### Added

- **Vera meeting images**: 4 additional scene images (`vera-meeting-01` through `04`) for future use

---

## [0.6.4] - 2026-02-19

### Added

- **Ask Insureversia** — Interactive AI chat assistant (Phase 1)
  - Floating action button (FAB) on all pages with Insureversia logo
  - Full chat panel with streaming Gemini responses via Firebase AI SDK
  - Page-context-aware suggested questions (12 page sets, EN + ES)
  - Insurance-domain system prompt with guardrails and educational disclaimers
  - 5 messages/day rate limiting (localStorage-based)
  - Dark mode support, mobile full-screen, copy button, new chat
  - Session persistence via sessionStorage
  - Bilingual UI (English + Spanish) with 18 i18n keys per language
- **New files:** `src/lib/chat.ts`, `src/lib/chat-persona.ts`, `src/lib/chat-suggestions.ts`, `src/components/AskInsureversia/AskInsureversia.astro`, `src/components/AskInsureversia/ChatWidget.svelte`
- **Modified:** `src/lib/firebase.ts` (added `getApp()` export), `src/layouts/BaseLayout.astro`, `src/i18n/en.json`, `src/i18n/es.json`

### Prerequisites

- Firebase Console: Enable **AI Logic** (Gemini Developer API) in the `insureversia-web` project
- Install `firebase` npm package with AI support (`firebase/ai` module)

---

## [0.6.3] - 2026-02-19

### Added

- **CLAUDE.md**: Project instructions for Claude Code — tech stack, conventions, structure, workflow rules
- **README.md**: Project README with site overview, tech stack, structure, personas, brand, and getting started
- **Spanish pages** (`src/pages/es/`): 28 mirror pages for full `/es/` routing — site now builds 56 pages across 2 languages

### Changed

- **Logo images in nav/footer**: Replaced text logos with actual PNG image logos (light + dark variants)
- **Logo dark mode**: Added `.logo-light`/`.logo-dark` CSS toggle in `layout.css`
- **Rounded corner logos**: Applied elegant rounded corners with transparent background to `insureversia-logo-horizontal-white.png`, `insureversia-just-logo-white.png`, and `apple-touch-icon.png`

### Fixed

- **Bruno persona dark mode**: Lightened navy `#0F2B46` to slate-blue `#5B8DB8` for archetype badge, card border, and quote border in dark mode for contrast

---

## [0.6.2] - 2026-02-19

### Added

- **3 Insureversia Personas**: Fictional voices representing the real spectrum of perspectives on AI in insurance
  - **Vera Nakamura-Obi** — "The Strategist" (Gold): Japanese-Nigerian CSO in Singapore, strategic AI adoption
  - **Bruno Vasquez-Herrera** — "The Guardian" (Navy): Chilean-Costa Rican Claims Director, human-centered caution
  - **Zaira Mensah-Okonkwo** — "The Catalyst" (Teal): Ghanaian-South African InsurTech lead, urgency for inclusion
- **Persona section on Team page** (`/about/team/`): 3-column card grid with color-coded archetype badges, blockquotes, and bios
- **i18n**: Full EN and ES translations for all 3 personas (`personas` key block in both `en.json` and `es.json`)
- **Placeholder SVG images**: Color-coded persona placeholders at `public/assets/images/personas/` (gold/navy/teal)
- **Midjourney prompts**: 6 image generation prompts (profile + action shot per persona) at `resources/personas-image-prompts.md`

---

## [0.6.1] - 2026-02-18

### Added

- **Favicon set**: Generated favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png (180x180, white bg), and multi-resolution favicon.ico (16+32+48) from logomark
- **OG social image**: Generated `insureversia-site-image.png` (1200x630) with navy background and centered horizontal logo for social sharing previews
- **BaseLayout favicon links**: Full favicon set with ICO, SVG, PNG, and Apple Touch Icon declarations
- **Web manifest icons**: Updated `site.webmanifest` with four icon sizes (16, 32, 180, 512)

---

## [0.6.0] - 2026-02-18

### Added

**Phase 6: Spanish Translations (i18n Completion)**

- **Complete Spanish i18n** (`es.json`): All 744 translation keys — matching en.json 1:1 across all sections (nav, hero, footer, about, promptBuilder, aiCalculator, aiReadiness, aiRoadmap, learningProgram, caseStudies, ethicsSimulator, toolDirectory, jurisdictionGuide, successStories, faq, sources, contact, share, search, common)
- **Spanish content collections** (49 markdown files):
  - `quick-wins/es/` — 9 files: policy summary, denial letter, extract dates, compare policies, coverage recommendation, loss run analysis, underwriting questions, compliance checklist, fraud investigation
  - `what-to-do/es/` — 10 files: verify output, accelerate research, establish AI policy, disclose AI use, first-draft generation, document review, prompt library, stay current, train your team, experiment low-risk
  - `what-not-to-do/es/` — 10 files: don't submit unread, don't paste confidential data, don't assume jurisdiction, don't replace judgment, don't hide AI use, don't treat as verified, don't use for emotional intelligence, don't ignore regulations, don't let AI write everything, don't assume limitations permanent
  - `faq/es/` — 20 files across 5 categories (skeptical, curious, using, leading, deciding)
- **Firebase configuration** (`.env`): Client config for Firestore, Auth, and Analytics
- **Google Analytics 4**: Enabled GA4 (`G-YZG6M16837`) in BaseLayout — active on all 28 pages
- **Curator photo**: Replaced placeholder on `/about/team/` with actual profile image
- **Site plan**: Comprehensive 721-line project reference at `resources/site-plan.md`

---

## [0.5.0] - 2026-02-18

### Added

**Phase 5: Resources Section**

- **Resources section** (5 pages):
  - `resources/faq/` — 20 FAQ items across 5 categories (Skeptical, Curious, Using AI, Leading Adoption, Making Decisions) with collection-based accordion layout, tab filtering, and source citations
  - `resources/glossary/` — 32 AI and insurance terms (17 AI + 15 insurance-specific) with alphabetical navigation
  - `resources/success-stories/` — 5 detailed case studies (Lemonade, Ping An, Tractable, Shift Technology, Root Insurance) with category filters, context/challenge/approach/results/lessons structure
  - `resources/tool-directory/` — 17 AI tools across 5 categories (General LLM, Insurance-Specific, Document Review, Research, Practice Management) with dual filters (category + pricing), confidentiality ratings, and independence disclaimer
  - `resources/jurisdiction-guide/` — 15 jurisdictions across 4 regions with insurance-focused AI regulation data (legislation, regulatory guidance, industry standards, notable cases), dual filters (region + status)
- **FAQ content collection** (20 markdown files):
  - `faq/en/01-04` — Skeptical: AI replacement fears, hype concerns, complexity understanding, data safety
  - `faq/en/05-08` — Curious: getting started, best tools, costs, technical skills
  - `faq/en/09-12` — Using AI: content verification, client disclosure, hallucinations, common mistakes
  - `faq/en/13-16` — Leading: governance frameworks, team training, ROI measurement, regulatory obligations
  - `faq/en/17-20` — Deciding: build vs buy, liability risks, competitor analysis, transformation timeline

---

## [0.4.0] - 2026-02-18

### Added

**Phase 4: Practice Section (Interactive Tools)**

- **Practice section** (9 pages):
  - `practice/quick-wins/` — Filterable grid of 9 quick-win cards with difficulty and insurance sector filters
  - `practice/applications/` — 7 AI application categories for insurance (Policy Analysis, Claims Processing, Underwriting, Customer Communication, Compliance, Fraud Detection, Data Analytics)
  - `practice/prompt-library/` — 50 insurance prompts across 10 categories (Policy Analysis, Claims, Underwriting, Risk Management, Compliance, Customer Communication, Fraud Detection, Reinsurance, Marketing, Actuarial) with copy-to-clipboard
  - `practice/prompt-builder/` — 5-step interactive prompt wizard (Task Type → Insurance Sector → Specifics → Constraints → Generated Prompt)
  - `practice/ai-readiness/` — 4-dimension AI readiness assessment (Technical, Cultural, Policy, Skills) with SVG score visualization
  - `practice/ai-help-calculator/` — 4-step AI assistance calculator with insurance-specific tool suggestions (Cytora, Tractable, Shift Technology, Akur8, FRISS)
  - `practice/ai-roadmap/` — 5-step personalized AI adoption roadmap builder with 7 insurance roles and 6 org sizes
  - `practice/ethics-simulator/` — 5-scenario interactive ethics quiz with scoring, profiles, and per-scenario feedback (en + es)
  - `practice/local-ai/` — Step-by-step LM Studio guide for local AI with insurance-specific use cases
- **Interactive components** (5 new):
  - `PromptBuilder.astro` — Multi-step wizard with 8 task types and 7 insurance sectors
  - `AiReadinessAssessment.astro` — 12-question assessment with SVG ring score and dimension bars
  - `AiHelpCalculator.astro` — Task-based calculator with SVG gauge and insurance tool recommendations
  - `AiRoadmapBuilder.astro` — Role-based roadmap with 4-stage progression and custom SVG icons
  - `EthicsSimulator.astro` — 5 insurance ethics scenarios (Automated Denial, Data Enrichment, Pricing Algorithm, AI Underwriting, Predictive Cancellation)
- **Quick-win content** (6 new markdown files, 9 total):
  - `04-compare-policies.md` — Compare Two Insurance Policies
  - `05-coverage-recommendation.md` — Draft a Coverage Recommendation Letter
  - `06-loss-run-analysis.md` — Analyze Loss Run Data
  - `07-underwriting-questions.md` — Generate Targeted Underwriting Questions
  - `08-compliance-checklist.md` — Create a Regulatory Compliance Checklist
  - `09-fraud-investigation.md` — Build a Fraud Investigation Outline
- **Icon.astro**: Added 3 new SVG icons (layers, calculator, copy)

---

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
