# Insureversia

**Your independent guide to AI in insurance — practical, ethical, and built for insurance professionals.**

[insureversia.com](https://insureversia.com)

## What is Insureversia?

Insureversia helps insurance professionals — underwriters, claims adjusters, brokers, actuaries, compliance officers, and executives — understand, evaluate, and responsibly adopt AI tools. It is a project of [CEMI.ai](https://cemi.ai) (Center for Meaningful Innovation in Artificial Intelligence).

## Site Sections

| Section | Pages | Description |
|---------|-------|-------------|
| **Explore** | 3 | New Frontiers, AI Impact Map, Challenges & Risks |
| **Learn** | 6 | AI 101, What to Do, What Not to Do, Prompt Engineering, Learning Program, Case Studies |
| **Practice** | 9 | Quick Wins, Applications, Prompt Library, Prompt Builder, AI Readiness, AI Help Calculator, AI Roadmap, Ethics Simulator, Local AI |
| **Resources** | 5 | FAQ, Glossary, Success Stories, Tool Directory, Jurisdiction Guide |
| **About** | 4 | Hub, What is Insureversia, Site Guide, Our Team (+ 3 Personas) |

**56 pages** total (28 EN + 28 ES). Fully bilingual: English and Spanish.

### Ask Insureversia (AI Chat Assistant)

An embedded AI chat widget powered by Gemini via Firebase AI SDK. Available on every page:
- Page-context-aware suggested questions
- Streaming responses with insurance-domain system prompt
- 5 messages/day free tier, dark mode, mobile full-screen
- Bilingual (EN + ES)

## Tech Stack

- [Astro 5](https://astro.build) — Static site generator
- [Svelte 5](https://svelte.dev) — Interactive components
- [Firebase](https://firebase.google.com) — Firestore, Auth, Analytics (GA4), AI Logic (Gemini)
- [Pagefind](https://pagefind.app) — Client-side search
- Vanilla CSS design system with dark mode and Classic/Modern theme toggle

## Getting Started

```bash
npm install
npm run dev       # Dev server at localhost:4321
npm run build     # Production build + Pagefind index
npm run preview   # Preview production build
```

## Project Structure

```
src/
  components/     # Astro + Svelte components
    AskInsureversia/  # AI chat assistant widget
  content/        # Markdown collections — quick-wins, what-to-do, what-not-to-do, faq (EN + ES)
  i18n/           # Translation files (en.json, es.json) + routing
  layouts/        # BaseLayout.astro
  lib/            # Shared utilities (firebase, chat, chat-persona, chat-suggestions)
  pages/          # File-based routing (28 EN pages)
    es/           # Spanish mirror pages (28 ES pages)
  styles/         # Design system (10 CSS files)
public/
  assets/         # Images, logos, fonts
resources/        # Internal docs and image prompts (not deployed)
```

## Brand

| Element | Value |
|---------|-------|
| Navy | `#0F2B46` |
| Gold | `#C9A84C` |
| Teal | `#00B4D8` |
| Fonts | DM Serif Display (headings), Inter (body) |

## Personas

Three fictional voices represent the spectrum of perspectives on AI in insurance:

- **Vera Nakamura-Obi** — "The Strategist" (Gold) — CSO, Singapore
- **Bruno Vasquez-Herrera** — "The Guardian" (Navy) — Claims Director, Costa Rica
- **Zaira Mensah-Okonkwo** — "The Catalyst" (Teal) — InsurTech Lead, Cape Town

## Deployment

Automated via GitHub Actions to GitHub Pages. Push to `main` triggers build and deploy.

## License

All rights reserved. Educational content about AI in insurance. Nothing on this site constitutes insurance advice or professional recommendations.

---

Curated by [Carlos Miranda Levy](https://thesocialentrepreneur.com) | A [CEMI.ai](https://cemi.ai) project
