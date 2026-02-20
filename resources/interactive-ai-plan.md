# Interactive AI Assistant — Implementation Plan

## Status

| Phase | Status | Date | Version |
|-------|--------|------|---------|
| **Phase 1** — Chat UI + Gemini | **COMPLETE** | 2026-02-19 | v0.6.4 |
| **Phase 2** — Auth + Multi-Persona + History | **COMPLETE** | 2026-02-20 | v0.6.6 |
| **Phase 3** — Multi-Provider + RAG | Not started | — | — |
| **Phase 4** — Premium + Panel Mode | Not started | — | — |
| **Phase 5** — Smart FAQ + WebLLM | Not started | — | — |

## Overview

A multi-persona, multi-provider AI chat assistant embedded in a static website, powered by Firebase and supporting a freemium access model. Built for **Insureversia** (AI in Insurance) — adaptable to other domains.

### Core Principles

1. **Value first, registration second** — anonymous users experience the product before any gate
2. **Multi-persona, not multi-chatbot** — one interface, multiple expert voices
3. **Provider-agnostic** — swap or combine LLM providers without changing the UX
4. **Firebase-only backend** — no Vercel, no separate servers, one ecosystem
5. **Phased delivery** — ship a working product at each phase, not a half-built vision

---

## Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────┐
│  Static Site (Astro 5)                              │
│                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ Chat Widget  │  │ Persona      │  │ Provider   │ │
│  │ (floating UI)│  │ Selector     │  │ Selector   │ │
│  └──────┬──────┘  └──────┬───────┘  └─────┬──────┘ │
│         │                │                 │        │
│         └────────────────┼─────────────────┘        │
│                          │                          │
│                   Firebase Client SDK               │
└──────────────────────────┬──────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────┐
│  Firebase                                            │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ Auth         │  │ Firestore    │  │ Cloud      │ │
│  │ (users/tiers)│  │ (state/data) │  │ Functions  │ │
│  └──────────────┘  └──────┬───────┘  └─────┬──────┘ │
│                           │                │        │
│                           │          ┌─────┴──────┐ │
│                           │          │ API Router │ │
│                           │          └─────┬──────┘ │
└───────────────────────────┼────────────────┼────────┘
                            │                │
                            │     ┌──────────┼──────────┐
                            │     │          │          │
                            │     ▼          ▼          ▼
                            │  ┌──────┐ ┌────────┐ ┌────────┐
                            │  │Gemini│ │ Claude │ │ OpenAI │
                            │  └──────┘ └────────┘ └────────┘
                            │
                    ┌───────┴────────┐
                    │  Firestore DB  │
                    ├────────────────┤
                    │ likes/         │ ← content likes (Phase 0)
                    │ submissions/   │ ← contact forms (Phase 0)
                    │ newsletters/   │ ← email subscriptions (Phase 0)
                    │ users/         │ ← tiers, usage (Phase 2) ✅
                    │ conversations/ │ ← chat history (Phase 2) ✅
                    │ personas/      │ ← system prompts (Phase 3, in-code for now)
                    │ faq-answers/   │ ← pre-written (Phase 5)
                    │ site-content/  │ ← RAG embeddings (Phase 3)
                    │ config/        │ ← rate limits, keys (Phase 3)
                    └────────────────┘
```

### Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Svelte 5 component in Astro 5 (via `@astrojs/svelte`) | Reactive UI with runes, `client:idle` hydration |
| Auth | Firebase Auth (Anonymous + Google + Email/Password) | Built-in, supports anonymous upgrade |
| Database | Firestore (full SDK, not lite) | Real-time capable, serverless, scales to zero |
| Backend | Firebase Cloud Functions (Phase 3+) | Same project, no separate deploy |
| LLM (Gemini) | Firebase AI SDK (`firebase/ai` with `GoogleAIBackend`) | Direct client call, no Cloud Function needed |
| LLM (Claude) | Cloud Function → Anthropic API (Phase 3) | Key protection |
| LLM (OpenAI) | Cloud Function → OpenAI API (Phase 3) | Key protection |
| Payments | Stripe Checkout → Firebase webhook (Phase 4) | Industry standard, minimal code |

### Key Implementation Decisions (learned during Phase 1-2)

- **Full Firestore SDK required:** Phase 2 needs `firebase/firestore` (not `firestore/lite`) for real-time listeners. We migrated all existing code (`likes.ts`, `submissions.ts`, `firebase.ts`) from `firestore/lite` to `firestore` in one step. The API surface is identical for the methods we use.
- **Personas in code, not Firestore:** Keeping persona definitions in `chat-persona.ts` avoids Firestore reads on every chat open. Will move to Firestore in Phase 3 when runtime editing becomes valuable.
- **Anonymous auth first, upgrade later:** `getUid()` in `firebase.ts` calls `signInAnonymously()` on first use. Phase 2's `upgradeAnonymous()` uses `linkWithPopup()`/`linkWithCredential()` to convert without losing the UID.
- **Newsletter subscriptions:** Added `newsletters/` Firestore collection for the footer subscribe form. Uses email as document ID for deduplication.

---

## Personas

### The Multi-Voice Model

Instead of a single chatbot, the assistant presents multiple expert perspectives. Each persona has a distinct voice, expertise area, and system prompt. Users select who they want to talk to.

### Insureversia Persona Definitions (Implemented in Phase 2)

| Persona | Voice | Color | Tier | Temperature | Avatar |
|---------|-------|-------|------|-------------|--------|
| **Insureversia** (default) | Warm, balanced, educational | Navy `#0F2B46` | anonymous | 0.7 | `insureversia-just-logo-white-circle.png` |
| **Vera Nakamura-Obi** "The Strategist" | Strategic, data-driven, measured | Gold `#C9A84C` | registered | 0.6 | `personas/vera/vera-profile-photo.png` |
| **Bruno Vasquez-Herrera** "The Guardian" | Cautious, human-centered, protective | Slate-Blue `#5B8DB8` | registered | 0.65 | `personas/bruno/bruno-profile-photo.png` |
| **Zaira Mensah-Okonkwo** "The Catalyst" | Bold, innovative, inclusion-focused | Teal `#00B4D8` | registered | 0.8 | `personas/zaira/zaira-profile-photo.png` |

### System Prompt Structure

Each persona's system prompt follows this template (implemented in `chat-persona.ts`):

```
IDENTITY
You are {name}, {title}. {personality and voice description}.
{Cultural background, professional experience, philosophy.}

KNOWLEDGE BOUNDARIES
- You are an expert in {domain areas}
- All general AI in insurance knowledge shared by Insureversia
- You do NOT provide specific insurance advice
- When uncertain, say so honestly

SITE CONTEXT
The user is currently viewing: {page title} ({page path}).
Use this context to make answers relevant.

INTERACTION STYLE
- Keep responses concise: 150-250 words
- Use markdown formatting: **bold**, bullet points
- {Persona-specific tone guidelines}

GUARDRAILS (shared across all personas)
- Never provide specific insurance advice for real situations
- Never fabricate regulatory citations, statistics, or case studies
- Never claim to be an insurance professional
- Recommend consulting qualified professionals for specific situations
- Include educational disclaimers when discussing insurance topics

LANGUAGE
Always respond in {user's locale language}.
```

**Max output tokens:** 512 (anonymous) / 1024 (registered) — per persona config.

---

## LLM Provider Abstraction

### Current State (Phase 1-2): Gemini Only, Client-Side

Firebase AI SDK calls Gemini directly from the browser — no Cloud Function needed.

```typescript
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
const ai = getAI(app, { backend: new GoogleAIBackend() });
const model = getGenerativeModel(ai, {
  model: 'gemini-2.5-flash',
  systemInstruction: { parts: [{ text: systemPrompt }] },
  generationConfig: { temperature, maxOutputTokens },
});
```

**Benefits:**
- Anonymous users calling Gemini = **no Cloud Function invocation cost**
- Protected by Firebase project credentials (not raw API key exposure)
- Lower latency (one fewer network hop)
- Model: `gemini-2.5-flash` — fast, cost-effective, streaming-capable

### Multi-Provider Router (Phase 3)

A single Cloud Function will handle all providers through a unified interface:

```
POST /api/chat
{
  "provider": "gemini" | "claude" | "openai",
  "persona": "insureversia",
  "messages": [...],
  "userId": "abc123",
  "locale": "en"
}
```

For Claude and OpenAI, the Cloud Function proxy is required to protect API keys.

---

## Freemium Tiers

### Tier Definitions

| Feature | Anonymous | Registered (Free) | Premium (Phase 4) |
|---------|-----------|-------------------|---------|
| **Daily messages** | 5 | 25 | Unlimited |
| **Personas** | Insureversia only | All 4 | All + Panel mode |
| **Providers** | Gemini | Gemini (+ Claude Phase 3) | All 3 + choose per message |
| **Conversation history** | sessionStorage only | Firestore (persistent) | Unlimited + PDF export |
| **RAG (site knowledge)** | Page title/path only | Full (Phase 3) | Full + custom uploads |
| **Response length** | 512 tokens | 1024 tokens | 2048 tokens |
| **Cost to operator** | ~$0.01/user/day | ~$0.05/user/day | Covered by subscription |
| **Price** | Free | Free | $5-10/month |

### Rate Limiting Implementation (Phase 2) ✅

- **Anonymous:** localStorage key `insureversia-chat-usage` as `{ date, count }`. Resets daily. No Firestore cost.
- **Registered:** Firestore `users/{uid}.usage` as `{ date, messagesUsed }`. Single doc read+write per check.
- Both paths behind same API in `tiers.ts` — tier determines which backend is used.

### Upgrade Prompts (Implemented)

| Trigger | Behavior |
|---------|---------|
| Anonymous hits 5 messages | Rate limit banner with "Create Account" button → opens inline auth |
| Anonymous taps locked persona | Inline auth form appears in chat panel |
| Registered hits 25 messages | "Daily limit reached" banner (no upgrade path yet — Phase 4) |

---

## Firestore Data Model

### Collections (Current — Phase 2)

```
firestore/
├── likes/                    ← content likes (Phase 0)
│   └── {docId}/users/{uid}
│
├── submissions/              ← contact forms (Phase 0)
│   └── {submissionId}
│
├── newsletters/              ← email subscriptions ✅
│   └── {emailId}           → { email, locale, uid, subscribedAt, updatedAt }
│
├── users/                    ← user profiles + usage (Phase 2) ✅
│   └── {uid}               → { email, displayName, updatedAt, usage: { date, messagesUsed } }
│
└── conversations/            ← chat history (Phase 2) ✅
    └── {conversationId}     → { userId, personaId, locale, title, createdAt, updatedAt, messageCount }
        └── messages/
            └── {msgId}      → { role, text, createdAt }
```

### Indexes (Deployed)

| Collection | Fields | Purpose |
|------------|--------|---------|
| `conversations` | `userId` ASC + `updatedAt` DESC | List user's recent conversations |

### Security Rules (Deployed)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Likes: anyone can read, authenticated users can write their own
    match /likes/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
      match /users/{userId} {
        allow read: if true;
        allow write: if request.auth != null && request.auth.uid == userId;
      }
    }

    // Submissions: anyone authenticated can create, no one can read/update/delete
    match /submissions/{docId} {
      allow create: if request.auth != null;
      allow read, update, delete: if false;
    }

    // Newsletters: authenticated users can create/update, no public reads
    match /newsletters/{docId} {
      allow create, update: if request.auth != null;
      allow read, delete: if false;
    }

    // Users — owner only
    match /users/{uid} {
      allow read, update: if request.auth != null && request.auth.uid == uid;
      allow create: if request.auth != null && request.auth.uid == uid;
    }

    // Conversations — owner only
    match /conversations/{convId} {
      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null
                    && resource.data.userId == request.auth.uid;
      match /messages/{msgId} {
        allow read: if request.auth != null
                    && get(/databases/$(database)/documents/conversations/$(convId)).data.userId == request.auth.uid;
        allow create: if request.auth != null
                      && get(/databases/$(database)/documents/conversations/$(convId)).data.userId == request.auth.uid;
      }
    }

    // Deny everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Phased Implementation

### Phase 1: Chat UI + Single Provider ✅ COMPLETE (v0.6.4, 2026-02-19)

**Goal:** A working chat with Insureversia using Gemini, anonymous access, 5 messages/day.

**Deliverables (all shipped):**

| # | Task | Implementation | Status |
|---|------|---------------|--------|
| 1 | Firebase project setup | `insureversia-web` project, Firebase SDK, Gemini enabled via Console → AI Logic | ✅ |
| 2 | Chat UI component | `src/components/AskInsureversia/ChatWidget.svelte` — Svelte 5, FAB + panel, streaming, dark mode, mobile full-screen | ✅ |
| 3 | Gemini integration | `src/lib/chat.ts` — `firebase/ai` with `GoogleAIBackend`, model `gemini-2.5-flash`, temp 0.7, 512 max tokens | ✅ |
| 4 | Insureversia persona | `src/lib/chat-persona.ts` — system prompt (locale-aware, page-context-aware) | ✅ |
| 5 | Anonymous rate limiting | localStorage key `insureversia-chat-usage`, 5 msgs/day | ✅ |
| 6 | Suggested questions | `src/lib/chat-suggestions.ts` — 12 page-specific sets + default, bilingual (EN/ES) | ✅ |
| 7 | Styling | CSS custom properties, dark mode, responsive at 768px breakpoint | ✅ |
| 8 | Astro integration | `AskInsureversia.astro` wrapper, `client:idle` hydration, added to `BaseLayout.astro` | ✅ |
| 9 | i18n | 18 `askInsureversia.*` keys in `en.json` and `es.json` | ✅ |
| 10 | Session persistence | Messages in `sessionStorage`, chat session singleton in module scope | ✅ |

**Actual Firebase cost:** Near zero (Gemini client SDK, no Cloud Functions, no Firestore reads/writes for chat).

---

### Phase 2: Auth + Multi-Persona + Conversation History ✅ COMPLETE (v0.6.6, 2026-02-20)

**Goal:** Registration flow, all 4 personas, persistent conversations, 25 messages/day for registered users.

**Design decisions (confirmed during implementation):**
- Personas stay **in code** (not Firestore) — simpler, no extra reads.
- Auth UI is **embedded in the chat panel** — no separate auth page.
- **Anonymous → registered upgrade** uses `linkWithPopup()` (Google) or `linkWithCredential()` (email) — preserves UID.
- **Full `firebase/firestore`** replaces `firestore/lite` across entire project (likes.ts, submissions.ts, firebase.ts).
- Still **Gemini-only** via client SDK. No Cloud Functions needed.
- Max output tokens: **512** anonymous / **1024** registered.
- Each persona has its own temperature (0.6–0.8) tuned to its voice.

**Deliverables (all shipped):**

| # | Task | Files | Status |
|---|------|-------|--------|
| 1 | Migrate `firestore/lite` → `firestore` | `firebase.ts`, `likes.ts`, `submissions.ts` | ✅ |
| 2 | Expand persona system (4 personas) | `chat-persona.ts` (rewrite) | ✅ |
| 3 | Auth service | `auth.ts` (new) | ✅ |
| 4 | User docs + usage tracking | `tiers.ts` (new) | ✅ |
| 5 | Conversation history | `conversations.ts` (new) | ✅ |
| 6 | Update chat service | `chat.ts` (modify — persona + tier + conversationId params) | ✅ |
| 7 | Chat UI: personas + auth + history | `ChatWidget.svelte` (major rewrite) | ✅ |
| 8 | i18n: ~30 new keys × 2 locales | `en.json`, `es.json` | ✅ |
| 9 | Firestore security rules | `firestore.rules` (modify) | ✅ Deployed |
| 10 | Firestore composite index | `firestore.indexes.json` (new) | ✅ Deployed |
| 11 | Astro wrapper: pass new i18n | `AskInsureversia.astro` (modify) | ✅ |
| 12 | Fix Bruno filename typo | `bruno-profile-hoto.png` → `bruno-profile-photo.png` + team pages | ✅ |

**Firebase Console setup (completed):**
- ✅ Firestore rules deployed
- ✅ Composite index deployed (`conversations` → `userId` ASC + `updatedAt` DESC)
- ⬜ Authentication → Sign-in methods: Enable Email/Password + Google (manual step needed)

**New files (3):** `auth.ts`, `tiers.ts`, `conversations.ts`
**Modified files (11):** `firebase.ts`, `likes.ts`, `submissions.ts`, `chat-persona.ts`, `chat.ts`, `ChatWidget.svelte`, `AskInsureversia.astro`, `firestore.rules`, `en.json`, `es.json`, team pages (EN + ES)
**Config files (2):** `firebase.json` (added indexes ref), `firestore.indexes.json` (new)

**Verification checklist:**

- [x] Anonymous user: 5 msgs/day, only Insureversia persona — same as Phase 1
- [x] Persona chips visible below header — Insureversia active, others locked with lock icon
- [x] Anonymous taps locked persona → inline auth form appears
- [ ] Google sign-in works → personas unlock, limit becomes 25 *(requires Console setup)*
- [ ] Email sign-up works → same result *(requires Console setup)*
- [x] Anonymous → registered upgrade preserves UID via `linkWithPopup`/`linkWithCredential`
- [x] Switching persona: clears chat, new greeting from selected persona
- [x] Each persona has distinct voice and temperature
- [x] Registered user: messages auto-saved to Firestore conversation
- [x] History button (clock icon) → lists recent conversations with title + persona + date
- [x] Tap conversation → loads its messages
- [x] New Chat creates fresh Firestore conversation
- [x] Sign out → reverts to anonymous, personas lock, limit drops to 5
- [x] Dark mode: all new UI elements readable (persona chips, auth form, history panel)
- [x] Mobile: persona chips scrollable, auth form usable
- [x] Build passes: `npm run build` — 56 pages, zero errors

---

### Phase 3: Multi-Provider + RAG

**Goal:** Claude and OpenAI support via Cloud Functions, site knowledge in responses.

**Deliverables:**

| # | Task | Details |
|---|------|---------|
| 1 | Cloud Function: chat proxy | Unified `/api/chat` endpoint routing to Gemini/Claude/OpenAI |
| 2 | Provider selector in UI | Dropdown in chat footer (tier-gated) |
| 3 | Persona configs to Firestore | Move persona definitions from code to `personas/` collection for runtime editing |
| 4 | Site content indexing | Build-time script: extract pages → generate embeddings → Firestore |
| 5 | RAG retrieval | On each message: embed query → find similar content → inject context |
| 6 | Citation links in responses | Persona references site pages with working links |
| 7 | Provider fallback | If one provider fails, auto-fallback to another with notice |

---

### Phase 4: Premium + Panel Mode

**Goal:** Paid tier, panel discussions, PDF export, Stripe integration.

**Deliverables:**

| # | Task | Details |
|---|------|---------|
| 1 | Stripe integration | Checkout flow, webhook → update Firestore tier |
| 2 | Panel mode UI | Question input → 4 parallel responses displayed as cards |
| 3 | Panel mode backend | Cloud Function calls all 4 personas, streams results |
| 4 | PDF export | Client-side PDF generation from conversation |
| 5 | Usage dashboard | Simple page showing messages used, history, subscription status |
| 6 | Unlimited tier enforcement | Premium users bypass daily limits |

---

### Phase 5: Smart FAQ + WebLLM (Bonus Modes)

**Goal:** Fallback mode and experimental in-browser mode.

**Deliverables:**

| # | Task | Details |
|---|------|---------|
| 1 | FAQ answer collection | Populate `faq-answers/` with 50-100 pre-written responses |
| 2 | FAQ matching engine | Keyword + semantic search over pre-written answers |
| 3 | Mode B UI | Same chat interface, "offline mode" indicator, related page links |
| 4 | WebLLM integration | Load small model in browser, basic chat (no RAG, no personas) |
| 5 | Mode C UI | Download progress bar, quality disclaimer, "experimental" badge |
| 6 | Mode switching | Auto (API fail → FAQ fallback) + manual toggle |

---

## Analytics & Monitoring

### What to Track (Phase 3: Firestore `analytics/`)

| Metric | Why |
|--------|-----|
| Messages per day (by tier) | Understand usage patterns, validate tier limits |
| Provider distribution | Which providers do users prefer? |
| Persona distribution | Which personas are most popular? |
| Conversion: anonymous → registered | Is the free tier compelling enough? |
| Conversion: registered → premium | Is premium worth paying for? |
| Average messages per session | Are users engaged or bouncing? |
| Top questions | Content gaps — what should the site cover? |
| API costs per day | Financial monitoring |

### Cost Monitoring

Set up Firebase budget alerts:
- Warning at $10/day
- Hard stop at $50/day (disable API mode, fall back to FAQ)

---

## Security Considerations

| Risk | Mitigation |
|------|-----------|
| API key exposure | Cloud Functions proxy for Claude/OpenAI (Phase 3); Firebase project credentials for Gemini |
| Prompt injection | System prompt includes guardrails; persona-specific boundaries |
| Abuse / spam | Rate limiting per tier (5/25/unlimited); anonymous = localStorage cap |
| Cost runaway | Daily spend cap with auto-fallback to Mode B (Phase 3) |
| Data privacy | Conversations encrypted at rest (Firestore default) |
| GDPR / privacy | Account deletion deletes all Firestore data (Phase 3: export feature) |
| XSS in responses | Simple markdown renderer (bold, italic, code, line breaks only) |

---

## Replication Guide

To replicate this system for another site:

1. **Replace personas** — Define your domain experts in `chat-persona.ts` (update `PersonaId`, `PERSONAS`, `PERSONA_ORDER`)
2. **Replace suggested questions** — Update `chat-suggestions.ts` with your site's page-specific suggestions
3. **Replace site content** — Re-index your site's pages for RAG (Phase 3)
4. **Adjust tier limits** — Modify `TIER_LIMITS` in `tiers.ts` based on your budget
5. **Customize UI** — Match your site's design system (CSS custom properties in `ChatWidget.svelte`)
6. **Configure providers** — Enable/disable providers based on your API keys
7. **Update i18n** — Translate `askInsureversia.*` keys, adjust persona names/descriptions
8. **Firebase project** — Create new project, enable Auth + Firestore + AI Logic, deploy rules
9. **Set budget alerts** — Based on your financial constraints

Everything else (Firebase SDK init, auth flow, rate limiting, chat UI, conversation storage) is reusable as-is.

---

## File Structure

### Phase 1-2 (shipped)

```
src/
├── components/
│   └── AskInsureversia/
│       ├── AskInsureversia.astro         ← Astro wrapper: passes locale/i18n/pageContext/suggestions
│       └── ChatWidget.svelte             ← Svelte 5: FAB, panel, personas, auth, history, streaming
│
├── lib/
│   ├── firebase.ts                       ← Firebase lazy-init singleton (getApp, getDb, getAuth, getUid)
│   ├── auth.ts                           ← Firebase Auth: sign-in, sign-up, upgrade, sign-out
│   ├── tiers.ts                          ← User docs, tier-based rate limiting (localStorage + Firestore)
│   ├── conversations.ts                  ← Firestore conversation CRUD (registered users)
│   ├── chat.ts                           ← Gemini chat: session mgmt, streaming, persona/tier params
│   ├── chat-persona.ts                   ← 4 persona definitions with PersonaDef type + system prompts
│   ├── chat-suggestions.ts               ← Page-specific suggested questions (12 sets, bilingual)
│   ├── likes.ts                          ← Content likes (Firestore)
│   ├── submissions.ts                    ← Contact form submissions (Firestore)
│   └── newsletter.ts                     ← Newsletter subscriptions (Firestore)
│
├── layouts/
│   └── BaseLayout.astro                  ← Renders <AskInsureversia /> on every page
│
├── i18n/
│   ├── en.json                           ← askInsureversia.* section (~48 keys)
│   └── es.json                           ← askInsureversia.* section (~48 keys)
│
firestore.rules                           ← likes + submissions + newsletters + users + conversations
firestore.indexes.json                    ← conversations composite index
firebase.json                             ← rules + indexes config
```

### Future (Phase 3+)

```
src/
├── lib/
│   ├── providers.ts                      ← Provider abstraction (Gemini/Claude/OpenAI)
│   ├── rag.ts                            ← Retrieval logic (embed query, find matches)
│   └── personas.ts                       ← Fetch persona configs from Firestore (replaces in-code)
│
firebase/
├── functions/
│   ├── src/
│   │   ├── index.ts                      ← Cloud Function exports
│   │   ├── chat.ts                       ← /api/chat handler
│   │   ├── providers/
│   │   │   ├── gemini.ts
│   │   │   ├── claude.ts
│   │   │   └── openai.ts
│   │   ├── rag.ts                        ← Server-side retrieval
│   │   └── stripe-webhook.ts            ← Subscription management
│   └── package.json
│
scripts/
└── index-site-content.ts                 ← Build-time: extract pages → embeddings → Firestore
```

---

*This plan is designed to be implemented incrementally. Each phase delivers a usable product. Phase 1 and Phase 2 are shipped. Learn from real usage, then iterate.*
