# Insureversia — Site Plan

> **insureversia.com** — Your independent guide to AI in the insurance industry.
> Built with Astro 5 + Svelte 5. Static output. Vanilla CSS. i18n (en/es). Firebase for interactivity. Pagefind for search.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Domain Mapping](#domain-mapping)
- [Site Architecture](#site-architecture)
- [Phase 1: Project Scaffolding + Homepage](#phase-1-project-scaffolding--homepage)
- [Phase 2: Explore + About Pages](#phase-2-explore--about-pages)
- [Phase 3: Learn Section](#phase-3-learn-section)
- [Phase 4: Practice Section](#phase-4-practice-section-interactive-tools)
- [Phase 5: Resources Section](#phase-5-resources-section)
- [Phase 6: Polish & Launch](#phase-6-polish--launch)
- [Complete File Inventory](#complete-file-inventory)
- [Design System](#design-system)
- [Content Collections](#content-collections)
- [i18n System](#i18n-system)
- [Funnel Strategy](#funnel-strategy)

---

## Project Overview

Insureversia is an educational platform that helps insurance professionals — underwriters, claims adjusters, brokers, actuaries, compliance officers, and executives — understand, evaluate, and responsibly adopt AI tools.

**Core thesis**: *The insurance professionals most at risk are not those who will be replaced by AI — they are those who refuse to understand it.*

The site is modeled after [lawra.org](https://lawra.org) (AI for Legal Practice), with all content and tools adapted from the legal domain to the insurance industry.

### Key Principles
1. **Evidence-Based** — Every claim backed by sources
2. **Practitioner-Focused** — Built for working insurance professionals
3. **Ethically Grounded** — Addresses bias, fairness, transparency, accountability
4. **Accessible** — Clear language, structured learning paths
5. **Multilingual** — English and Spanish
6. **Continuously Updated** — Content reflects new developments

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Astro 5** | Static site generator, file-based routing |
| **Svelte 5** | Interactive component islands (future use) |
| **Vanilla CSS** | Design system with custom properties, no CSS framework |
| **Firebase** | Likes, contact form submissions, anonymous auth |
| **Pagefind** | Client-side search, runs post-build |
| **GitHub Pages** | Hosting + CI/CD via GitHub Actions |
| **Google Analytics 4** | Analytics (to be configured) |

### Key Patterns
- **Static output** — All pages pre-rendered at build time
- **Interactive components** — Vanilla JS `<script>` blocks in `.astro` files (not Svelte)
- **Client-side filtering** — `data-*` attributes + CSS class toggling (`is-active`, `is-hidden`)
- **Collection-based pages** — `getCollection('name')` for content from markdown files
- **Inline data pages** — TypeScript arrays for tools, jurisdictions, glossary terms
- **Dual filter pattern** — Two independent filter states applied together (category + pricing, region + status)
- **BaseLayout wrapper** — All pages use `BaseLayout.astro` with locale, title, description props
- **i18n via `t()` function** — `t(locale, 'key.path')` returns translated string
- **Dark mode** — `[data-mode="dark"]` CSS selector, toggled via localStorage

---

## Domain Mapping

### 6 Insurance Sectors (navigation taxonomy)
1. **Prospecting & Underwriting** — Risk evaluation, quote generation, policy issuance
2. **Risk Management** — Risk assessment, mitigation strategies, portfolio analysis
3. **Compliance** — Regulatory monitoring, reporting, governance frameworks
4. **Claims Processing** — Claims intake, assessment, resolution, fraud detection
5. **Customer Service** — Communication, renewals, policy inquiries, onboarding
6. **Marketing & Sales** — Lead generation, market analysis, campaign optimization

### 7 Insurance Types (content tagging)
1. Health and Life Insurance
2. Property Insurance
3. Liability Insurance
4. Cyber Insurance
5. Travel Insurance
6. Vehicle Insurance
7. Business Interruption Insurance

### Domain Adaptations from Reference (lawra.org)
| lawra.org (Legal) | insureversia.com (Insurance) |
|---|---|
| `practiceArea` | `insuranceSector` |
| `lawrasTake` | `insureversiasTake` |
| 10 practice areas | 6 insurance sectors |
| Bar associations | NAIC, state DOIs, EIOPA |
| Courts, judges | Regulators, commissioners |
| Legal briefs, motions | Policies, endorsements, claims |
| Billable hours | Processing time, loss ratios |

---

## Site Architecture

### 28 Pages Total

```
/                                    Homepage
├── explore/
│   ├── new-frontiers/               10 emerging AI frontiers in insurance
│   ├── ai-impact/                   Transformation map across 6 sectors
│   └── challenges/                  6 ethical + 6 practical challenges
├── learn/
│   ├── ai-101/                      7-module learning path
│   ├── what-to-do/                  10 best practices (collection-based)
│   ├── what-not-to-do/              10 dangers (collection-based)
│   ├── prompt-engineering/          CRAFT framework + 6 techniques
│   └── program/
│       ├── index                    Learning Program (Smoother methodology)
│       └── case-studies/            3 immersive case studies
├── practice/
│   ├── quick-wins/                  9 filterable quick-win cards
│   ├── applications/                7 AI application categories
│   ├── prompt-library/              50 prompts across 10 categories
│   ├── prompt-builder/              5-step interactive wizard
│   ├── ai-readiness/                4-dimension assessment (12 questions)
│   ├── ai-help-calculator/          4-step calculator with tool suggestions
│   ├── ai-roadmap/                  5-step personalized roadmap
│   ├── ethics-simulator/            5-scenario ethics quiz (en + es)
│   └── local-ai/                    LM Studio setup guide
├── resources/
│   ├── faq/                         20 FAQs in 5 categories (collection-based)
│   ├── glossary/                    32 terms (17 AI + 15 insurance)
│   ├── success-stories/             5 case studies with filters
│   ├── tool-directory/              17 AI tools with dual filters
│   └── jurisdiction-guide/          15 jurisdictions with dual filters
└── about/
    ├── index                        Hub page with 3 cards
    ├── insureversia/                Identity, mission, principles
    ├── guide/                       Guided tour + sitemap modal
    └── team/                        CEMI.ai, The Curator
```

---

## Phase 1: Project Scaffolding + Homepage

**Version**: 0.1.0 | **Status**: Complete

### What Was Built

#### Root Configuration (6 files)
- `package.json` — Astro 5 + Svelte 5 + Firebase + Pagefind dependencies
- `astro.config.mjs` — site=https://insureversia.com, i18n en/es, static output
- `tsconfig.json` — Strict mode + `@/*` path alias
- `.gitignore` — Standard Astro ignores
- `.env.example` — Firebase public keys placeholder
- `.github/workflows/deploy.yml` — GitHub Pages deployment

#### Design System (10 CSS files)
| File | Purpose | Lines |
|------|---------|-------|
| `variables.css` | Brand colors, spacing, typography tokens | ~134 |
| `layout.css` | Grid, containers, responsive breakpoints | — |
| `typography.css` | Headings, body text, code blocks | — |
| `components.css` | All UI components (cards, badges, buttons, modals, accordions, etc.) | ~3000 |
| `utilities.css` | Helper classes | — |
| `animations.css` | Transitions, keyframes | — |
| `fonts.css` | Playfair Display, Inter, JetBrains Mono, Cormorant Garamond | — |
| `fonts-modern.css` | Modern theme font overrides | — |
| `theme-modern.css` | `[data-theme="modern"]` theme variant | — |
| `dark-mode.css` | `[data-mode="dark"]` dark theme | — |

**Brand Colors**:
- Primary: `#0F2B46` (navy)
- Secondary: `#C9A84C` (gold)
- Accent: `#00B4D8` (teal)
- Warm neutral: `#F7F4EE` (parchment)

#### Core Components (10 files)
| Component | Purpose |
|-----------|---------|
| `BaseLayout.astro` | Master template — HTML head, GA4, JSON-LD, theme/mode localStorage |
| `Navigation.astro` | 5 dropdown menus (Explore, Learn, Practice, Resources, About) |
| `Footer.astro` | Section links, newsletter CTA, Modern/Classic theme toggle |
| `Icon.astro` | 40+ inline SVG icons via name prop |
| `ShareModal.astro` | Share to X, Facebook, LinkedIn, WhatsApp, Email |
| `ContactModal.astro` | Contact form with type selector, insurance sector field |
| `LanguageSelector.astro` | en/es language switcher |
| `QuickWinCard.astro` | Card component for quick-win prompts |
| `DifficultyBadge.astro` | Beginner/Intermediate/Advanced badge |
| `InsuranceSectorTag.astro` | Sector tag with color coding |

#### i18n System (3 files)
- `src/i18n/index.ts` — Locale routing + `t(locale, key)` function
- `src/i18n/en.json` — ~844 translation keys (complete)
- `src/i18n/es.json` — ~120 translation keys (stub)

#### Content Collections
- `src/content/config.ts` — 7 typed schemas (quick-wins, what-to-do, what-not-to-do, faq, success-stories, insurance-challenges, regulations)
- 3 initial quick-win content files

#### Firebase Library (3 files)
- `src/lib/firebase.ts` — Lazy-init singleton with env vars
- `src/lib/likes.ts` — Like/unlike functionality
- `src/lib/submissions.ts` — Contact form submissions

#### Homepage
- Hero section with gradient overlay
- 6 insurance sectors grid
- 3 quick wins preview
- Compliance edge callout
- Newsletter / Learning Program CTA

#### Public Assets
- `robots.txt`, `site.webmanifest`, SVG favicon, `CNAME` (insureversia.com)

---

## Phase 2: Explore + About Pages

**Version**: 0.2.0 | **Status**: Complete

### Explore Section (3 pages)

| Page | Content |
|------|---------|
| `explore/new-frontiers/` | 10 emerging AI frontiers: AI underwriting, predictive claims, fraud detection, parametric insurance, RegTech, catastrophe modeling, telematics, embedded insurance, AI-driven reinsurance |
| `explore/ai-impact/` | Transformation Map — AI impact across 6 insurance sectors with severity badges and transformation timelines |
| `explore/challenges/` | 6 ethical challenges + 6 practical challenges with severity ratings and "Responsible Path Forward" framework |

### About Section (4 pages)

| Page | Content |
|------|---------|
| `about/` | Hub page — "Meet Insureversia" hero + 3 cards linking to sub-pages |
| `about/insureversia/` | What is Insureversia?, Our Mission, The Core Thesis, 6 Principles, Important Notice |
| `about/guide/` | Guided tour with color-coded section headers, interactive sitemap modal with full navigation |
| `about/team/` | Born from CEMI.ai, The Curator (Carlos Miranda Levy — Stanford Fellow, 25+ years, CNN/MIT/Forbes/Google recognition) |

### New Component
- `InsureversiaAvatar.astro` — Reusable avatar with size variants (sm/md/lg/xl) and optional speech bubble

---

## Phase 3: Learn Section

**Version**: 0.3.0 | **Status**: Complete

### Pages (6)

| Page | Content |
|------|---------|
| `learn/ai-101/` | 7-module learning path: AI fundamentals, LLMs, insurance AI tools, ethics & regulation, prompt engineering, AI workflows, future of AI |
| `learn/what-to-do/` | 10 best practices (collection-based from `what-to-do/en/`) |
| `learn/what-not-to-do/` | 10 critical mistakes to avoid (collection-based from `what-not-to-do/en/`, danger styling) |
| `learn/prompt-engineering/` | CRAFT framework, 6 technique comparisons (weak vs. effective), 5 reusable prompt patterns |
| `learn/program/` | Learning Program — Smoother methodology, 5 format categories (accordion), 3 learning modes, 4-step methodology |
| `learn/program/case-studies/` | 3 immersive case studies: Lemonade AI Claims (real), Sterling Data Breach (fictional), Sentient Weather Tribunal (absurd) |

### Content Collections (20 markdown files)

**What to Do** (10 files — `src/content/what-to-do/en/`):
1. Verify every AI output before using it
2. Use AI to accelerate insurance research
3. Establish an AI policy for your organization
4. Disclose AI use to clients and stakeholders
5. Use AI for first-draft generation
6. Leverage AI for document review
7. Build and maintain a prompt library
8. Stay current on AI developments
9. Train your team on AI fundamentals
10. Experiment in low-risk contexts first

**What Not to Do** (10 files — `src/content/what-not-to-do/en/`):
1. Don't submit AI output without reading it
2. Don't paste confidential policyholder data into AI
3. Don't assume AI knows your jurisdiction's regulations
4. Don't replace professional judgment with AI conclusions
5. Don't hide your AI use from clients
6. Don't treat AI output as verified data
7. Don't use AI for emotional intelligence tasks
8. Don't ignore regulatory guidelines on AI
9. Don't let AI write your entire report
10. Don't assume today's AI limitations are permanent

---

## Phase 4: Practice Section (Interactive Tools)

**Version**: 0.4.0 | **Status**: Complete

### Pages (9)

| Page | Type | Details |
|------|------|---------|
| `practice/quick-wins/` | Filterable grid | 9 quick-win cards, difficulty + insurance sector filter chips |
| `practice/applications/` | Static cards | 7 AI application categories (Policy Analysis, Claims, Underwriting, Customer Communication, Compliance, Fraud Detection, Data Analytics) |
| `practice/prompt-library/` | Accordion + filter | 50 insurance prompts across 10 categories with copy-to-clipboard |
| `practice/prompt-builder/` | Interactive wizard | 5 steps: Task Type → Insurance Sector → Specifics → Constraints → Generated Prompt |
| `practice/ai-readiness/` | Interactive assessment | 4 dimensions (Technical, Cultural, Policy, Skills), 12 questions, SVG ring score |
| `practice/ai-help-calculator/` | Interactive calculator | 4 steps, insurance-specific tool suggestions (Cytora, Tractable, Shift Technology, Akur8, FRISS) |
| `practice/ai-roadmap/` | Interactive builder | 5 steps, 7 insurance roles, 6 org sizes, 4-stage progression |
| `practice/ethics-simulator/` | Interactive quiz | 5 scenarios (en + es), scoring, profiles, per-scenario feedback |
| `practice/local-ai/` | Static guide | LM Studio setup for insurance professionals |

### Interactive Components (5)

| Component | Lines | Details |
|-----------|-------|---------|
| `PromptBuilder.astro` | — | Multi-step wizard, 8 task types, 7 insurance sectors |
| `AiReadinessAssessment.astro` | — | 12-question assessment, SVG ring score, dimension bars |
| `AiHelpCalculator.astro` | ~816 | Task-based calculator, SVG gauge, tool recommendations |
| `AiRoadmapBuilder.astro` | ~658 | Role-based roadmap, 4-stage progression, custom SVG icons |
| `EthicsSimulator.astro` | ~398 | 5 insurance ethics scenarios: Automated Denial, Data Enrichment, Pricing Algorithm, AI Underwriting, Predictive Cancellation |

### Quick-Win Content (9 markdown files — `src/content/quick-wins/en/`)

1. Summarize an Insurance Policy
2. Draft a Claim Denial Response Letter
3. Extract Key Dates from a Policy Document
4. Compare Two Insurance Policies
5. Draft a Coverage Recommendation Letter
6. Analyze Loss Run Data
7. Generate Targeted Underwriting Questions
8. Create a Regulatory Compliance Checklist
9. Build a Fraud Investigation Outline

### Prompt Library Categories (50 prompts)
1. Policy Analysis (5)
2. Claims Processing (5)
3. Underwriting (5)
4. Risk Management (5)
5. Compliance & Regulation (5)
6. Customer Communication (5)
7. Fraud Detection (5)
8. Reinsurance (5)
9. Marketing & Sales (5)
10. Actuarial & Data Analytics (5)

---

## Phase 5: Resources Section

**Version**: 0.5.0 | **Status**: Complete

### Pages (5)

| Page | Content | Data Pattern |
|------|---------|-------------|
| `resources/faq/` | 20 FAQs in 5 categories | Collection-based (markdown files) |
| `resources/glossary/` | 32 terms (17 AI + 15 insurance) | Inline TypeScript array |
| `resources/success-stories/` | 5 detailed case studies | Inline TypeScript array |
| `resources/tool-directory/` | 17 AI tools across 5 categories | Inline TypeScript array |
| `resources/jurisdiction-guide/` | 15 jurisdictions across 4 regions | Inline TypeScript array |

### FAQ Content (20 markdown files — `src/content/faq/en/`)

**Skeptical (4)**:
1. Will AI replace insurance professionals?
2. Isn't AI just hype?
3. Can AI understand insurance complexity?
4. Is it safe to use AI with policyholder data?

**Curious (4)**:
5. What's the easiest way to start using AI?
6. Which AI tools are best for insurance?
7. How much does AI cost?
8. Do I need technical skills?

**Using AI (4)**:
9. How to verify AI-generated insurance content?
10. Should I tell clients I'm using AI?
11. How to handle AI hallucinations?
12. Biggest mistakes with AI in insurance?

**Leading (4)**:
13. How to build an AI governance framework?
14. What training does my team need?
15. How to measure AI ROI?
16. Regulatory obligations for AI use?

**Deciding (4)**:
17. Should we build or buy AI solutions?
18. Insurance liability risks of AI?
19. How do competitors use AI?
20. Timeline for AI to change insurance?

### Glossary (32 terms)
- 17 AI terms (Artificial Intelligence, Machine Learning, Deep Learning, NLP, LLM, etc.)
- 15 Insurance-specific terms (Actuarial Science, Loss Ratio, Parametric Insurance, Insurtech, etc.)

### Success Stories (5 case studies)
1. **Lemonade** — AI-first claims processing
2. **Ping An** — AI ecosystem at scale
3. **Tractable** — Computer vision for auto claims
4. **Shift Technology** — AI fraud detection
5. **Root Insurance** — Telematics-based underwriting

### Tool Directory (17 tools across 5 categories)

| Category | Tools |
|----------|-------|
| General LLMs | ChatGPT, Claude, Gemini, Copilot |
| Insurance-Specific | Cytora, Tractable, Shift Technology, Akur8, FRISS |
| Document Review | LegalMation (adapted), Docusign Insight, ABBYY |
| Research | Perplexity, NotebookLM, Elicit |
| Practice Management | Zapier, Make, Power Automate |

Each tool includes: description, strengths, weaknesses, confidentiality rating (high/medium/low), insurance sectors, pricing, and Insureversia's verdict.

### Jurisdiction Guide (15 jurisdictions across 4 regions)

| Region | Jurisdictions |
|--------|--------------|
| North America | US Federal, Colorado, New York, California, Canada |
| Europe | EU, UK, Germany |
| Latin America | Brazil, Mexico |
| Asia-Pacific | China, Japan, Singapore, Australia, India |

Each jurisdiction includes: regulation status (enacted/proposed/pending/none), legislation, regulatory guidance, industry standards, notable cases, and last updated date.

---

## Phase 6: Polish & Launch

**Version**: 0.6.0 | **Status**: Complete (translations); Pending (infrastructure)

### Completed: Spanish Translations

#### `es.json` — Complete i18n (744 keys)
All translation keys matching `en.json` 1:1 across every section: nav, hero, footer, about, promptBuilder, aiCalculator, aiReadiness, aiRoadmap, learningProgram, caseStudies, ethicsSimulator, toolDirectory, jurisdictionGuide, successStories, faq, sources, contact, share, search, common.

#### Spanish Content Files (49 markdown files)

| Collection | Files | Content |
|-----------|-------|---------|
| `quick-wins/es/` | 9 | Policy summary, denial letter, extract dates, compare policies, coverage recommendation, loss run analysis, underwriting questions, compliance checklist, fraud investigation |
| `what-to-do/es/` | 10 | Verify output, accelerate research, establish AI policy, disclose AI use, first-draft generation, document review, prompt library, stay current, train your team, experiment low-risk |
| `what-not-to-do/es/` | 10 | Don't submit unread, don't paste confidential, don't assume jurisdiction, don't replace judgment, don't hide AI use, don't treat as verified, don't use for emotional intelligence, don't ignore regulations, don't let AI write everything, don't assume limitations permanent |
| `faq/es/` | 20 | All 5 categories: skeptical (4), curious (4), using (4), leading (4), deciding (4) |

#### Translation Conventions
- Professional, neutral Latin American Spanish (suitable for international audience)
- Insurance terminology: suscripción, reclamaciones, asegurado, prima, deducible, endoso, cobertura, índice de siniestralidad, reaseguro, cumplimiento normativo
- Proper nouns untranslated: ChatGPT, Claude, NAIC, CRAFT, Smoother, Lemonade, etc.
- Placeholder patterns preserved: `{count}`, `{current}`, `{total}`, `{role}`, `{practice}`
- Enum values preserved: difficulty levels, categories, insurance sectors

### Verified: SEO & Search

| Item | Status | Details |
|------|--------|---------|
| Pagefind search | Verified | 28 pages indexed, 3,531 words |
| Meta description | Complete | Per-page via BaseLayout props |
| Canonical URLs | Complete | Auto-generated from `siteUrl + pathname` |
| Hreflang tags | Complete | en, es, x-default |
| Open Graph | Complete | title, description, type, url, image, locale, site_name |
| Twitter Cards | Complete | summary_large_image with title, description, image |
| JSON-LD | Complete | WebSite schema with SearchAction, creator |
| Sitemap | Complete | `@astrojs/sitemap` integration, referenced in robots.txt |
| robots.txt | Complete | Allow all, sitemap reference |
| Web manifest | Complete | Name, icons, theme color |

### Pending: Infrastructure (requires manual setup)

| Task | Status | Notes |
|------|--------|-------|
| Firebase project | Pending | See `resources/site-plan.md` Firebase instructions or ask for walkthrough |
| GA4 measurement ID | Pending | Uncomment GA4 script in BaseLayout.astro (lines 57-65), replace `G-XXXXXXXXXX` |
| GitHub Actions secrets | Pending | Add `PUBLIC_FIREBASE_*` env vars to repo Settings → Secrets |
| Hero images | Pending | Need actual image assets in `public/assets/images/hero-images/` |
| OG image | Pending | Need `public/assets/images/insureversia-site-image.png` (1200×630) |
| Accessibility audit | Pending | WCAG 2.1 AA review recommended before public launch |

---

## Complete File Inventory

### Components (15 `.astro` files)
```
src/components/
├── AiHelpCalculator.astro
├── AiReadinessAssessment.astro
├── AiRoadmapBuilder.astro
├── ContactModal.astro
├── DifficultyBadge.astro
├── EthicsSimulator.astro
├── Footer.astro
├── Icon.astro
├── InsuranceSectorTag.astro
├── InsureversiaAvatar.astro
├── LanguageSelector.astro
├── Navigation.astro
├── PromptBuilder.astro
├── QuickWinCard.astro
└── ShareModal.astro
```

### Layout (1 file)
```
src/layouts/
└── BaseLayout.astro
```

### Pages (28 `.astro` files)
```
src/pages/
├── index.astro
├── explore/
│   ├── new-frontiers/index.astro
│   ├── ai-impact/index.astro
│   └── challenges/index.astro
├── learn/
│   ├── ai-101/index.astro
│   ├── what-to-do/index.astro
│   ├── what-not-to-do/index.astro
│   ├── prompt-engineering/index.astro
│   └── program/
│       ├── index.astro
│       └── case-studies/index.astro
├── practice/
│   ├── quick-wins/index.astro
│   ├── applications/index.astro
│   ├── prompt-library/index.astro
│   ├── prompt-builder/index.astro
│   ├── ai-readiness/index.astro
│   ├── ai-help-calculator/index.astro
│   ├── ai-roadmap/index.astro
│   ├── ethics-simulator/index.astro
│   └── local-ai/index.astro
├── resources/
│   ├── faq/index.astro
│   ├── glossary/index.astro
│   ├── success-stories/index.astro
│   ├── tool-directory/index.astro
│   └── jurisdiction-guide/index.astro
└── about/
    ├── index.astro
    ├── insureversia/index.astro
    ├── guide/index.astro
    └── team/index.astro
```

### Content Collections (98 markdown files — 49 en + 49 es)
```
src/content/
├── config.ts                          (7 collection schemas)
├── quick-wins/
│   ├── en/                            (9 files: 01-09)
│   └── es/                            (9 files: 01-09)
├── what-to-do/
│   ├── en/                            (10 files: 01-10)
│   └── es/                            (10 files: 01-10)
├── what-not-to-do/
│   ├── en/                            (10 files: 01-10)
│   └── es/                            (10 files: 01-10)
└── faq/
    ├── en/                            (20 files: 01-20)
    └── es/                            (20 files: 01-20)
```

### Styles (10 CSS files)
```
src/styles/
├── variables.css
├── layout.css
├── typography.css
├── components.css
├── utilities.css
├── animations.css
├── fonts.css
├── fonts-modern.css
├── theme-modern.css
└── dark-mode.css
```

### i18n (3 files)
```
src/i18n/
├── index.ts
├── en.json                            (744 keys, complete)
└── es.json                            (744 keys, complete)
```

### Library (3 files)
```
src/lib/
├── firebase.ts
├── likes.ts
└── submissions.ts
```

### Public Assets (4 files)
```
public/
├── CNAME
├── robots.txt
├── site.webmanifest
└── assets/logos/favicon.svg
```

### Root Configuration (6 files)
```
package.json
astro.config.mjs
tsconfig.json
.gitignore
.env.example
.github/workflows/deploy.yml
```

---

## Design System

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#0F2B46` | Navy — headers, text, primary buttons |
| `--color-secondary` | `#C9A84C` | Gold — accents, highlights, badges |
| `--color-accent` | `#00B4D8` | Teal — links, interactive elements, CTAs |
| `--surface-parchment` | `#F7F4EE` | Warm neutral backgrounds |

### Typography
| Font | Usage |
|------|-------|
| **Playfair Display** | Headings (serif, editorial feel) |
| **Inter** | Body text (clean sans-serif) |
| **JetBrains Mono** | Code blocks, prompts |
| **Cormorant Garamond** | Accent text, quotes (elegant serif) |

### Themes
- **Classic** (default): Standard warm design
- **Modern**: Alternative clean/minimal theme via `[data-theme="modern"]`
- **Dark mode**: Full dark variant via `[data-mode="dark"]`, toggled in footer

### Component Classes (from `components.css`)
Key CSS classes used across all pages: `.card`, `.badge`, `.filter-chip`, `.filter-group`, `.accordion`, `.accordion-header`, `.accordion-content`, `.hero-section`, `.section`, `.grid-cols-*`, `.cta-section`, `.callout-box`, `.is-active`, `.is-hidden`

---

## Content Collections

Defined in `src/content/config.ts` with 7 Zod schemas:

| Collection | Key Fields | Pattern |
|-----------|-----------|---------|
| `quick-wins` | title, description, difficulty, insuranceSector, timeMinutes, prompt, steps, tips, cautions, sources | `en/01-slug.md` |
| `what-to-do` | title, number, description, realExample, howTo, insureversiasTake, sources | `en/01-slug.md` |
| `what-not-to-do` | title, number, description, risk, realExample, mitigation, insureversiasTake, sources | `en/01-slug.md` |
| `faq` | title, question, category, order, sources | `en/01-slug.md` |
| `success-stories` | title, organization, category, keyMetric, sources | (future) |
| `insurance-challenges` | title, severity, category, sources | (future) |
| `regulations` | title, jurisdiction, status, effectiveDate, sources | (future) |

### Source Schema
All collections share a source citation schema with types: `regulation`, `industry-report`, `news`, `academic-paper`, `official-report`, `data-source`

---

## i18n System

### Architecture
- `src/i18n/index.ts` exports `t(locale, key)` function and `getLocalePath(locale, path)`
- All pages set `const locale = 'en'` and use `t(locale, 'key.path')`
- Nested keys accessed with dot notation: `t(locale, 'about.mission')`
- Missing keys return the key string as fallback

### Translation Status

| Locale | Keys | Status |
|--------|------|--------|
| `en.json` | 744 | Complete (all sections) |
| `es.json` | 744 | Complete (all sections, 1:1 match) |

### Key Sections in `en.json`
| Section | Keys | Content |
|---------|------|---------|
| `site` | 3 | Title, description, tagline |
| `nav` | 44 | All navigation items |
| `hero` | 4 | Homepage hero |
| `sections` | 10 | Shared section labels |
| `insuranceSectors` | 6 | Sector names |
| `difficulty` | 3 | Difficulty levels |
| `faq` | 7 | FAQ categories |
| `sources` | 9 | Source type labels |
| `search` | 4 | Search UI |
| `footer` | 14 | Footer content |
| `about` | 40 | About section (all sub-pages) |
| `share` | 7 | Share modal |
| `common` | 11 | Shared labels |
| `promptBuilder` | 47 | Prompt Builder wizard |
| `aiCalculator` | 50 | AI Help Calculator |
| `successStories` | 26 | Success Stories page |
| `aiReadiness` | 57 | AI Readiness Assessment |
| `likes` | 2 | Like button |
| `contact` | 28 | Contact modal |
| `aiRoadmap` | 93 | AI Roadmap Builder |
| `learningProgram` | 58 | Learning Program |
| `caseStudies` | 49 | Case Studies page |
| `ethicsSimulator` | 28 | Ethics Simulator |
| `toolDirectory` | 35 | Tool Directory |
| `jurisdictionGuide` | 29 | Jurisdiction Guide |

---

## Funnel Strategy

Every page ends with a CTA section driving users toward deeper engagement:

**Primary CTA**: Learning Program (`/learn/program/`)

**Secondary CTAs** (contextual):
- Quick Wins (`/practice/quick-wins/`)
- Prompt Builder (`/practice/prompt-builder/`)
- AI Readiness Assessment (`/practice/ai-readiness/`)
- AI Help Calculator (`/practice/ai-help-calculator/`)
- AI 101 (`/learn/ai-101/`)
- Contact form (modal)

**Pattern**: Each CTA section uses the `.cta-section` class with title, description, and 1-2 action buttons.

---

## Build & Deploy

### Local Development
```bash
npm install
npm run dev          # Serves at localhost:4321
npm run build        # Produces /dist with static HTML + Pagefind index
npm run preview      # Preview production build
```

### Deployment
- Push to `main` branch triggers GitHub Actions workflow
- Workflow runs `npm run build` and deploys `/dist` to GitHub Pages
- Custom domain: `insureversia.com` (via `public/CNAME`)

### Build Output
- 28 HTML pages
- Pagefind search index (3,531 words indexed)
- All CSS inlined/bundled by Astro
- Zero build errors

---

## Version History

| Version | Date | Phase | Summary |
|---------|------|-------|---------|
| 0.1.0 | 2026-02-18 | Phase 1 | Project scaffolding + homepage |
| 0.1.1 | 2026-02-18 | — | Navigation restructure, About section split |
| 0.2.0 | 2026-02-18 | Phase 2 | Explore (3 pages) + About (4 pages) |
| 0.3.0 | 2026-02-18 | Phase 3 | Learn section (6 pages, 20 content files) |
| 0.3.1 | 2026-02-18 | — | Dark mode speech bubble fix |
| 0.4.0 | 2026-02-18 | Phase 4 | Practice section (9 pages, 5 components, 9 quick-wins) |
| 0.5.0 | 2026-02-18 | Phase 5 | Resources section (5 pages, 20 FAQ files) |
| 0.6.0 | 2026-02-18 | Phase 6 | Spanish translations (es.json 744 keys + 49 content files) |

See `CHANGELOG.md` for detailed change notes per version.
