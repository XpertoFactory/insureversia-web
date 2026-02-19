# Interactive AI Assistant — Implementation Plan

## Status

| Phase | Status | Date |
|-------|--------|------|
| **Phase 1** — Chat UI + Gemini | **COMPLETE** | 2026-02-19 |
| **Phase 2** — Auth + Multi-Persona + History | **PLANNED** | — |
| **Phase 3** — Multi-Provider + RAG | Not started | — |
| **Phase 4** — Premium + Panel Mode | Not started | — |
| **Phase 5** — Smart FAQ + WebLLM | Not started | — |

## Overview

A multi-persona, multi-provider AI chat assistant embedded in a static website, powered by Firebase and supporting a freemium access model. Designed to be reusable across sites — this document uses **Lawra** (AI in Law) as the reference implementation.

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
│  Static Site (Astro / any SSG)                      │
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
                    │ personas/      │ ← system prompts (Phase 3+)
                    │ conversations/ │ ← chat history (Phase 2)
                    │ users/         │ ← tiers, usage (Phase 2)
                    │ faq-answers/   │ ← pre-written (Phase 5)
                    │ site-content/  │ ← RAG embeddings (Phase 3)
                    │ config/        │ ← rate limits, keys (Phase 3)
                    └────────────────┘
```

### Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Svelte 5 component in Astro (via `@astrojs/svelte`) | Reactive UI with runes, `client:idle` hydration |
| Auth | Firebase Auth | Email, Google, anonymous — built-in |
| Database | Firestore | Real-time, serverless, scales to zero |
| Backend | Firebase Cloud Functions (Node.js) | Same project, no separate deploy |
| LLM (Gemini) | Firebase AI SDK (`firebase/ai` with `GoogleAIBackend`) | Direct client call, no Cloud Function needed |
| LLM (Claude) | Cloud Function → Anthropic API | Key protection |
| LLM (OpenAI) | Cloud Function → OpenAI API | Key protection |
| Payments | Stripe Checkout → Firebase webhook | Industry standard, minimal code |

---

## Personas

### The Multi-Voice Model

Instead of a single chatbot, the assistant presents multiple expert perspectives. Each persona has a distinct voice, expertise area, and system prompt. Users select who they want to talk to.

### Persona Definitions

#### Reference: Lawra Site Personas

| Persona | Voice | Expertise | Tier Required | Avatar |
|---------|-------|-----------|---------------|--------|
| **Lawra** | Warm, balanced, peer-to-peer | General AI-in-law guidance, practical tips | Anonymous | `lawra-logo-icon.png` |
| **Lawrena** | Critical, forensic, demanding | Risk analysis, ethics, liability, compliance | Registered | `lawrena-profile-photo.png` |
| **Lawrelai** | Energetic, optimistic, action-oriented | Access to justice, innovation, Global South, startups | Registered | `lawrelai-profile-photo.png` |
| **Carlos** | Experienced, strategic, direct | Big picture, career guidance, editorial perspective | Registered | `carlos-miranda-levy.jpg` |

> **Replication note:** When adapting for other sites, replace personas with domain-appropriate experts. The architecture supports any number of personas. Phase 2 keeps persona definitions in code (not Firestore) for simplicity; Phase 3 moves them to Firestore for runtime editing.

### System Prompt Structure

Each persona's system prompt follows this template:

```
IDENTITY
You are {name}, {title}. {personality and voice description}.

KNOWLEDGE BOUNDARIES
- You are an expert in {domain areas}
- You do NOT provide {out-of-scope advice, e.g., "specific legal advice"}
- When uncertain, say so honestly
- Always recommend consulting a qualified professional for specific situations

SITE CONTEXT
The user is currently viewing: {page title} ({page path}).
{When RAG is active in Phase 3, retrieved page content is injected here}

INTERACTION STYLE
- {Tone guidelines}
- {Length preferences}
- {Formatting rules — e.g., use markdown, bullet points}
- {Language: respond in the user's language}

GUARDRAILS
- Never generate harmful content
- Never impersonate a licensed professional
- Always include appropriate disclaimers
- Flag when a question is outside your expertise
```

---

## LLM Provider Abstraction

### Multi-Provider Router (Phase 3)

A single Cloud Function handles all providers through a unified interface:

```
POST /api/chat
{
  "provider": "gemini" | "claude" | "openai",
  "persona": "lawra",
  "messages": [...],
  "userId": "abc123",
  "locale": "en"
}
```

### Provider Configuration (Firestore: `config/providers`) — Phase 3

```json
{
  "gemini": {
    "model": "gemini-2.5-flash",
    "active": true,
    "tier": "anonymous",
    "costPer1kTokens": 0.0001
  },
  "claude": {
    "model": "claude-sonnet-4-6",
    "active": true,
    "tier": "registered",
    "costPer1kTokens": 0.003
  },
  "openai": {
    "model": "gpt-4o",
    "active": true,
    "tier": "premium",
    "costPer1kTokens": 0.005
  }
}
```

### Gemini Optimization: Direct Client Call

Firebase offers a **client-side AI SDK** (`firebase/ai` module, imported as `GoogleAIBackend`) that calls Gemini directly from the browser — no Cloud Function needed.

**Setup (Firebase Console):**
1. Go to Firebase Console → your project
2. Navigate to **AI Logic** (formerly "ML" / "Vertex AI") in the left sidebar
3. Click **Get Started** → this enables the Gemini Developer API for your project
4. No API key management needed — the Firebase SDK handles auth via the project's existing config

**Implementation (client-side):**
```typescript
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
const ai = getAI(app, { backend: new GoogleAIBackend() });
const model = getGenerativeModel(ai, { model: 'gemini-2.5-flash' });
```

**Benefits:**
- Anonymous users calling Gemini = **no Cloud Function invocation cost**
- Protected by Firebase project credentials (not raw API key exposure)
- Lower latency (one fewer network hop)
- Model: `gemini-2.5-flash` — fast, cost-effective, streaming-capable

For Claude and OpenAI, the Cloud Function proxy is required to protect API keys.

---

## Freemium Tiers

### Tier Definitions

| Feature | Anonymous | Registered (Free) | Premium |
|---------|-----------|-------------------|---------|
| **Daily messages** | 5 | 25 | Unlimited |
| **Personas** | Primary only | All individual | All + Panel mode |
| **Providers** | Default (Gemini) | Gemini + Claude | All 3 + choose per message |
| **Conversation history** | Current session only (sessionStorage) | 30 days (Firestore) | Unlimited + PDF export |
| **RAG (site knowledge)** | Basic (page title/desc) | Full (page content) | Full + custom document upload |
| **Response length** | Standard (512 tokens) | Extended (1024 tokens) | Full (2048 tokens) |
| **Cost to operator** | ~$0.01/user/day | ~$0.05/user/day | Covered by subscription |
| **Price** | Free | Free | $5-10/month |

### Panel Mode (Premium Feature — Phase 4)

In Panel mode, the user asks a question and **all personas respond** with their perspective. This creates a "roundtable discussion" experience.

### Upgrade Prompts (UX)

The upgrade message adapts to the context:

| Trigger | Message |
|---------|---------|
| Anonymous hits 5 messages | "You've used your 5 free messages today. **Create a free account** to unlock 25 daily messages and all 4 expert personas." |
| Anonymous taps locked persona | "**Lawrena** is available with a free account. Sign up in seconds to unlock all 4 expert personas." |
| Registered tries Panel mode | "Panel mode lets all 4 experts weigh in on your question. **Upgrade to Premium** to unlock roundtable discussions." |
| Registered hits 25 messages | "You've reached today's limit. **Upgrade to Premium** for unlimited conversations, all providers, and PDF export." |
| Registered tries Claude/OpenAI | "Claude and OpenAI are available on the **Premium plan**. Try your question with Gemini, or upgrade for multi-provider access." |

---

## Firestore Data Model

### Collections

```
firestore/
├── likes/                    ← existing (Phase 0)
│   └── {likeId}/users/{uid}
│
├── submissions/              ← existing (Phase 0)
│   └── {submissionId}
│
├── users/                    ← NEW (Phase 2)
│   └── {uid}                → { email, displayName, tier, usage, preferences, createdAt }
│
├── conversations/            ← NEW (Phase 2)
│   └── {conversationId}     → { userId, persona, locale, title, createdAt, updatedAt, messageCount }
│       └── messages/
│           └── {msgId}      → { role, text, timestamp }
│
├── personas/                 ← Phase 3 (in-code for Phase 2)
│   └── {personaId}          → { name, systemPrompt, avatar, tier, order, active }
│
├── faq-answers/              ← Phase 5
│   └── {answerId}           → { question, keywords, answer, relatedPages, locale }
│
├── site-content/             ← Phase 3
│   └── {pageId}             → { url, title, description, body, embedding, locale }
│
├── config/                   ← Phase 3
│   ├── providers             → { gemini: {...}, claude: {...}, openai: {...} }
│   └── rate-limits           → { anonymous: 5, registered: 25, premium: -1 }
│
└── analytics/                ← Phase 3
    └── {date}               → { totalMessages, byProvider, byPersona, byTier, uniqueUsers }
```

### Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Existing: Likes
    match /likes/{likeId} {
      allow read: if true;
      allow create, update: if request.auth != null;
      match /users/{userId} {
        allow read: if true;
        allow create, delete: if request.auth != null && request.auth.uid == userId;
      }
    }

    // Existing: Submissions
    match /submissions/{submissionId} {
      allow create: if request.auth != null;
    }

    // Phase 2: Users — owner only
    match /users/{uid} {
      allow read, update: if request.auth != null && request.auth.uid == uid;
      allow create: if request.auth != null && request.auth.uid == uid;
    }

    // Phase 2: Conversations — owner only
    match /conversations/{convId} {
      allow read, write: if request.auth != null
                         && resource == null  // allow create
                         || resource.data.userId == request.auth.uid;
      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid;

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

### Phase 1: Chat UI + Single Provider ✅ COMPLETE (2026-02-19)

**Goal:** A working chat with Lawra using Gemini, anonymous access, 5 messages/day.

**Deliverables (all shipped):**

| # | Task | Implementation |
|---|------|---------------|
| 1 | Firebase project setup | `lawra-org` project, Firebase SDK v12.9.0, Gemini enabled via Console → AI Logic → Get Started |
| 2 | Chat UI component | `src/components/AskLawra/ChatWidget.svelte` — Svelte 5 with runes, FAB + panel, streaming, dark mode, mobile full-screen |
| 3 | Gemini integration | `src/lib/chat.ts` — `firebase/ai` with `GoogleAIBackend`, model `gemini-2.5-flash`, temp 0.7, 512 max tokens |
| 4 | Lawra persona | `src/lib/chat-persona.ts` — system prompt built in code (locale-aware, page-context-aware), not Firestore |
| 5 | Anonymous rate limiting | localStorage key `lawra-chat-usage` as `{ date, count }`, 5 msgs/day, resets at midnight |
| 6 | Suggested questions | `src/lib/chat-suggestions.ts` — 10 page-specific sets + 1 default, trilingual (EN/ES/FR) |
| 7 | Basic styling | CSS custom properties, dark mode via `:global([data-mode="dark"])`, responsive at 768px breakpoint |
| 8 | Astro integration | `src/components/AskLawra/AskLawra.astro` wrapper, `client:idle` hydration, added to `BaseLayout.astro` |
| 9 | i18n | 18 `askLawra.*` keys in `en.json`, `es.json`, `fr.json` |
| 10 | Session persistence | Messages in `sessionStorage` (survives navigation), chat session singleton in module scope |

**Not included in Phase 1:** Registration, Firestore conversation storage, other personas, other providers, RAG.

**Actual Firebase cost:** Near zero (Gemini client SDK, no Cloud Functions, no Firestore reads/writes for chat).

---

### Phase 2: Auth + Multi-Persona + Conversation History

**Goal:** Registration flow, all 4 personas, persistent conversations, 25 messages/day for registered users.

**Design decisions:**
- Personas stay **in code** (not Firestore) — simpler, no extra reads, avoids cold-start latency. Moves to Firestore in Phase 3 when runtime editing becomes valuable.
- Auth UI is **embedded in the chat panel** — no separate auth page. Sign-in appears inline when the user hits a gate (rate limit or locked persona).
- **Anonymous → registered upgrade** uses Firebase Auth `linkWithCredential()` — preserves the anonymous UID so in-progress sessionStorage chat and localStorage usage are seamlessly retained.
- Conversation history in Firestore uses **full `firebase/firestore`** (not `firestore/lite`) for real-time listeners to keep the conversation list updated across tabs.
- Still **Gemini-only** via client SDK. No Cloud Functions needed yet.
- Max output tokens increased to **1024** for registered users (512 for anonymous).

#### Step 1: Expand persona system (`src/lib/chat-persona.ts`)

Refactor from single `buildSystemPrompt()` to multi-persona architecture:

```typescript
export type PersonaId = 'lawra' | 'lawrena' | 'lawrelai' | 'carlos';

export interface PersonaDef {
  id: PersonaId;
  name: string;
  title: Record<string, string>;           // { en, es, fr }
  subtitle: Record<string, string>;        // { en, es, fr } — e.g. "The Moderate"
  avatar: string;                          // path to avatar image
  color: string;                           // CSS color for UI accent
  tier: 'anonymous' | 'registered';
  temperature: number;
  maxOutputTokens: { anonymous: number; registered: number };
  buildPrompt: (locale: string, pageContext: string, pageTitle?: string) => string;
}

export const PERSONAS: Record<PersonaId, PersonaDef> = {
  lawra: { /* ... */ },
  lawrena: { /* ... */ },
  lawrelai: { /* ... */ },
  carlos: { /* ... */ },
};

export const DEFAULT_PERSONA: PersonaId = 'lawra';
export const PERSONA_ORDER: PersonaId[] = ['lawra', 'lawrena', 'lawrelai', 'carlos'];
```

**Lawra** — warm, balanced, practical. Same system prompt as Phase 1.

**Lawrena** — the skeptic. System prompt emphasizes:
- Critical analysis of AI claims, demands evidence
- Risk assessment, liability concerns, ethics
- European/civil law perspective, human rights
- Challenges the user to think carefully before adopting AI tools
- Tone: forensic, precise, occasionally blunt

**Lawrelai** — the enthusiast. System prompt emphasizes:
- Innovation, access to justice, Global South perspective
- Practical applications, startups, legal aid technology
- Encourages experimentation with clear-eyed optimism
- Tone: energetic, inspiring, action-oriented

**Carlos** (The Curator) — experienced strategist. System prompt emphasizes:
- Big-picture perspective on AI transformation
- Career strategy, firm-level decisions, leadership
- Cross-disciplinary insight (tech + law + social impact)
- References his own frameworks (100+ Things to Do with AI, SiteCraft)
- Tone: experienced, direct, mentoring

#### Step 2: Auth service (`src/lib/auth.ts`)

New file handling all authentication logic:

```typescript
export type UserTier = 'anonymous' | 'registered';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  tier: UserTier;
  photoURL: string | null;
}

// Reactive auth state (observable)
export function onAuthChange(callback: (user: UserProfile | null) => void): () => void;

// Sign in methods
export async function signInWithGoogle(): Promise<UserProfile>;
export async function signInWithEmail(email: string, password: string): Promise<UserProfile>;
export async function signUpWithEmail(email: string, password: string, displayName: string): Promise<UserProfile>;

// Anonymous → registered upgrade (preserves UID)
export async function upgradeAnonymous(method: 'google' | 'email', ...args): Promise<UserProfile>;

// Sign out (reverts to anonymous)
export async function signOut(): Promise<void>;

// Get current user (sync, from cache)
export function getCurrentUser(): UserProfile | null;

// Check if user is anonymous
export function isAnonymous(): boolean;
```

**Key implementation details:**
- Uses `firebase/auth` (already available via `src/lib/firebase.ts`)
- On sign-in, calls `ensureUserDocument()` to create/update `users/{uid}` in Firestore
- `upgradeAnonymous()` uses `linkWithPopup()` (Google) or `linkWithCredential()` (email) to convert the anonymous account, preserving the UID
- `signOut()` signs out then calls `signInAnonymously()` to maintain a valid auth state for likes/submissions
- Auth state cached in module-level variable for sync access by ChatWidget

#### Step 3: User document + usage tracking (`src/lib/tiers.ts`)

New file managing user documents and tier-based rate limiting:

```typescript
// Firestore user document schema
interface UserDoc {
  uid: string;
  email: string | null;
  displayName: string | null;
  tier: UserTier;
  createdAt: Timestamp;
  usage: {
    date: string;        // "YYYY-MM-DD"
    messagesUsed: number;
  };
  preferences: {
    defaultPersona: PersonaId;
    locale: string;
  };
}

// Tier limits
const TIER_LIMITS: Record<UserTier, number> = {
  anonymous: 5,
  registered: 25,
};

// Create user document on first registration
export async function ensureUserDocument(uid: string, email: string | null, displayName: string | null): Promise<void>;

// Rate limiting (replaces Phase 1's localStorage-only approach)
export async function canSendMessage(tier: UserTier): Promise<boolean>;
export async function incrementUsage(tier: UserTier): Promise<void>;
export async function getRemainingMessages(tier: UserTier): Promise<number>;
export async function getUsedMessages(tier: UserTier): Promise<number>;
export function getDailyLimit(tier: UserTier): number;
```

**Rate limiting strategy:**
- **Anonymous users:** Continue using localStorage (no Firestore cost). Unchanged from Phase 1.
- **Registered users:** Usage tracked in Firestore `users/{uid}.usage`. On each message: read usage, check limit, increment, write back. Single document read+write per message.
- Both paths exposed through the same `canSendMessage()` / `incrementUsage()` API — the tier determines which storage backend is used.

#### Step 4: Conversation history (`src/lib/conversations.ts`)

New file for Firestore conversation CRUD:

```typescript
export interface Conversation {
  id: string;
  userId: string;
  persona: PersonaId;
  locale: string;
  title: string;           // Auto-generated from first user message (first 60 chars)
  createdAt: Timestamp;
  updatedAt: Timestamp;
  messageCount: number;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Timestamp;
}

// Create a new conversation
export async function createConversation(userId: string, persona: PersonaId, locale: string, firstMessage: string): Promise<string>;

// Add a message to conversation
export async function addMessage(conversationId: string, role: 'user' | 'model', text: string): Promise<void>;

// List user's recent conversations (last 30 days)
export async function listConversations(userId: string, limit?: number): Promise<Conversation[]>;

// Load messages for a conversation
export async function loadMessages(conversationId: string): Promise<ConversationMessage[]>;

// Delete a conversation
export async function deleteConversation(conversationId: string): Promise<void>;
```

**Implementation details:**
- Uses full `firebase/firestore` (NOT `firestore/lite`) for real-time capability
- Conversations auto-titled from first user message (truncated to 60 chars)
- `updatedAt` updated on each new message for sorting
- `messageCount` incremented atomically via `increment(1)` for display without loading all messages
- Only available for registered users — anonymous users keep sessionStorage
- Max 50 conversations per user (soft limit, enforced in UI not rules)
- Conversations older than 30 days shown with a "30-day history with free account" note

**Firestore cost estimate:** ~2 reads + 2 writes per message exchange (user msg write, model msg write, conversation metadata update, occasional conversation list read). At 25 msgs/day: ~100 operations/user/day → well within free tier for moderate traffic.

#### Step 5: Modify chat service (`src/lib/chat.ts`)

Extend existing service to support multiple personas and tier-aware configuration:

**Changes:**
- `sendMessageStream()` accepts `personaId` parameter (defaults to `'lawra'`)
- System prompt built from `PERSONAS[personaId].buildPrompt()` instead of `buildSystemPrompt()`
- `maxOutputTokens` pulled from persona config based on tier (512 anonymous, 1024 registered)
- Session keyed by `personaId + locale + pageContext` (changing persona creates new session)
- Rate limiting delegated to `tiers.ts` (which handles localStorage vs Firestore based on tier)
- New: `sendMessageStream()` optionally saves messages to Firestore conversation (for registered users)

**Updated signature:**
```typescript
export async function* sendMessageStream(
  text: string,
  locale: string,
  pageContext: string,
  pageTitle: string | undefined,
  history: ChatMessage[],
  personaId?: PersonaId,       // NEW — defaults to 'lawra'
  tier?: UserTier,             // NEW — defaults to 'anonymous'
  conversationId?: string,     // NEW — if set, saves to Firestore
): AsyncGenerator<string>;
```

#### Step 6: Auth UI in chat panel (`ChatWidget.svelte` modifications)

Add inline auth and persona selection to the existing Svelte component.

**New UI elements:**

```
┌──────────────────────────────────┐
│ Ask Lawra            [+] [—] [×] │  ← header (unchanged)
├──────────────────────────────────┤
│ [🟢Lawra] [🔴Lawrena] [🟢L...] │  ← persona chips (NEW)
│ [🔒Carlos]                       │  ← locked = grayed + lock icon
├──────────────────────────────────┤
│                                  │
│  Messages area (unchanged)       │
│                                  │
├──────────────────────────────────┤
│ [Type your message...] [➤]      │  ← input (unchanged)
├──────────────────────────────────┤
│ 3/25 msgs │ Signed in as J... │⚙│  ← footer (updated)
└──────────────────────────────────┘
```

**Persona selector behavior:**
- Horizontal scrollable chip strip below header
- Active persona highlighted with its accent color
- Locked personas show lock icon + tooltip "Sign up to unlock"
- Tapping a locked persona shows inline auth prompt (not a modal)
- Changing persona: resets chat, creates new Gemini session with new system prompt
- Suggested questions update per persona (optional per-persona suggestions)

**Auth integration in chat panel:**
- When anonymous user hits 5-message limit: rate limit banner shows "Create free account" button
- When anonymous user taps locked persona: inline auth form replaces suggestion area
- Auth form: two tabs — "Google" (one-click) and "Email" (email + password fields)
- On successful registration: banner slides away, persona unlocks, limit increases to 25
- Footer shows: "Signed in as {name}" with gear icon for sign-out
- Sign-out reverts to anonymous (5 msgs, primary persona only)

**Conversation history UI:**
- New "History" button in header (clock icon) — only visible for registered users
- Opens a slide-over panel listing recent conversations: title + persona + date
- Tapping a conversation loads its messages and resumes the Gemini session with that history
- "New Chat" button (existing) works as before — for registered users, also creates a new Firestore conversation
- Current conversation auto-saved on each message exchange

**New Svelte state:**
```javascript
let currentPersona = $state('lawra');       // PersonaId
let userProfile = $state(null);             // UserProfile | null
let showAuth = $state(false);               // inline auth form visible
let showHistory = $state(false);            // conversation list visible
let conversations = $state([]);             // recent conversations
let currentConversationId = $state(null);   // active Firestore conversation
let tier = $derived(userProfile?.tier ?? 'anonymous');
let dailyLimit = $derived(tier === 'registered' ? 25 : 5);
```

#### Step 7: i18n additions

Add ~25 new keys to each locale file under `askLawra.*`:

```json
{
  "askLawra": {
    // ... existing 18 keys ...

    // Personas
    "personaLawra": "Lawra",
    "personaLawrena": "Lawrena",
    "personaLawrelai": "Lawrelai",
    "personaCarlos": "Carlos",
    "personaLocked": "Sign up to unlock",
    "switchPersona": "Switching to {name}...",

    // Auth
    "signIn": "Sign In",
    "signUp": "Create Account",
    "signInGoogle": "Continue with Google",
    "signInEmail": "Sign in with email",
    "signUpEmail": "Create account with email",
    "emailLabel": "Email",
    "passwordLabel": "Password",
    "nameLabel": "Display name",
    "signOut": "Sign Out",
    "signedInAs": "Signed in as {name}",
    "authError": "Could not sign in. Please try again.",

    // Upgrade prompts
    "upgradeForPersonas": "Create a free account to unlock all 4 expert personas and 25 daily messages.",
    "upgradeForMore": "You've used your {limit} free messages today. Create a free account to get {newLimit} daily messages.",

    // Conversations
    "history": "History",
    "noHistory": "No previous conversations",
    "resumeChat": "Resume",
    "deleteChat": "Delete",
    "conversationsTitle": "Recent Conversations"
  }
}
```

#### Step 8: Firestore rules update

Update `firestore.rules` with the Phase 2 rules as specified in the Firestore Data Model section above.

#### Step 9: Update Astro wrapper (`AskLawra.astro`)

Pass additional i18n keys for personas, auth, and conversations to the Svelte component. No structural changes to the wrapper — just expand the `i18n` object.

#### Step 10: Firebase setup (one-time)

**Firebase Console actions:**
1. **Authentication → Sign-in method** → Enable:
   - Email/Password
   - Google (configure OAuth consent screen if needed)
   - Anonymous (already enabled from Phase 1)
2. **Firestore → Rules** → Deploy updated rules
3. **Firestore → Indexes** → Create composite index:
   - Collection: `conversations`, fields: `userId` ASC, `updatedAt` DESC

**No new npm dependencies.** `firebase/auth` and `firebase/firestore` are already available in the Firebase SDK v12.9.0.

#### Deliverables summary

| # | Task | Files | Status |
|---|------|-------|--------|
| 1 | Expand persona system | `src/lib/chat-persona.ts` (modify) | |
| 2 | Auth service | `src/lib/auth.ts` (new) | |
| 3 | User docs + usage tracking | `src/lib/tiers.ts` (new) | |
| 4 | Conversation history | `src/lib/conversations.ts` (new) | |
| 5 | Update chat service | `src/lib/chat.ts` (modify) | |
| 6 | Chat UI: personas + auth + history | `src/components/AskLawra/ChatWidget.svelte` (modify) | |
| 7 | i18n: ~25 new keys × 3 locales | `src/i18n/{en,es,fr}.json` (modify) | |
| 8 | Firestore security rules | `firestore.rules` (modify) | |
| 9 | Astro wrapper: pass new i18n | `src/components/AskLawra/AskLawra.astro` (modify) | |
| 10 | Firebase Console: enable auth providers + deploy rules | Console (manual) | |

**New files (3):** `auth.ts`, `tiers.ts`, `conversations.ts`
**Modified files (6):** `chat-persona.ts`, `chat.ts`, `ChatWidget.svelte`, `AskLawra.astro`, `firestore.rules`, `{en,es,fr}.json`

**Not included in Phase 2:** Cloud Functions, Claude/OpenAI providers, RAG, Stripe, Panel mode.

**Expected Firebase cost:** Low. Gemini via client SDK (near zero). Firestore: ~100 ops/registered user/day (conversations). Auth: free tier covers 10K monthly users.

#### Verification Checklist

- [ ] Anonymous user: 5 msgs/day, only Lawra persona, no history — same as Phase 1
- [ ] Anonymous taps locked persona → inline auth prompt appears
- [ ] Google sign-in works → persona unlocks, limit becomes 25
- [ ] Email sign-up works → same result
- [ ] Anonymous → registered upgrade preserves UID (localStorage data intact)
- [ ] Switching persona: clears chat, new greeting, new suggestions
- [ ] Each persona has distinct voice (test: same question, 4 different answers)
- [ ] Registered user: messages saved to Firestore conversation
- [ ] History panel: lists recent conversations with title + persona + date
- [ ] Tapping a conversation loads its messages
- [ ] New Chat creates fresh Firestore conversation
- [ ] Sign out → reverts to anonymous, personas lock, limit drops to 5
- [ ] Dark mode: all new UI elements readable
- [ ] Mobile: persona chips scrollable, auth form usable
- [ ] Build passes: `npm run build`
- [ ] Firestore rules: registered user can only read/write own data

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
| 4 | PDF export | Client-side PDF generation from conversation (jsPDF or similar) |
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

### What to Track (Firestore: `analytics/`)

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

Cloud Function environment variable: `MAX_DAILY_SPEND` — when Firestore analytics show cumulative cost exceeding this, all API calls return Mode B (FAQ) responses until the next day.

---

## Security Considerations

| Risk | Mitigation |
|------|-----------|
| API key exposure | Cloud Functions proxy for Claude/OpenAI; Firebase App Check for Gemini |
| Prompt injection | System prompt includes guardrails; input sanitization in Cloud Function |
| Abuse / spam | Rate limiting per tier; anonymous = device fingerprint + IP |
| Cost runaway | Daily spend cap with auto-fallback to Mode B |
| Data privacy | Conversations encrypted at rest (Firestore default); clear data retention policy |
| GDPR / privacy | Account deletion deletes all Firestore data; export feature for data portability |
| XSS in responses | Sanitize LLM output before rendering; use safe markdown renderer |

---

## Replication Guide

To replicate this system for another site:

1. **Replace personas** — Define your domain experts with appropriate system prompts in `chat-persona.ts`
2. **Replace suggested questions** — Update `chat-suggestions.ts` with your site's page-specific suggestions
3. **Replace site content** — Re-index your site's pages for RAG (Phase 3)
4. **Adjust tier limits** — Modify `TIER_LIMITS` in `tiers.ts` based on your budget
5. **Customize UI** — Match your site's design system (CSS custom properties in `ChatWidget.svelte`)
6. **Configure providers** — Enable/disable providers based on your API keys
7. **Update i18n** — Translate `askLawra.*` keys, adjust persona names/descriptions
8. **Firebase project** — Create new project, enable Auth + Firestore + AI Logic, deploy rules
9. **Set budget alerts** — Based on your financial constraints

Everything else (Firebase SDK init, auth flow, rate limiting, chat UI, conversation storage) is reusable as-is.

---

## File Structure

### Phase 1 (shipped)

```
src/
├── components/
│   └── AskLawra/
│       ├── AskLawra.astro         ← Astro wrapper, passes locale/i18n/pageContext to Svelte
│       └── ChatWidget.svelte      ← Svelte 5 component: FAB, panel, streaming, all UI states
│
├── lib/
│   ├── firebase.ts                ← Firebase lazy-init singleton (getApp, getDb, getAuth, getUid)
│   ├── chat.ts                    ← Gemini chat service: session mgmt, streaming, rate limiting
│   ├── chat-persona.ts            ← Lawra system prompt builder (locale + page-context aware)
│   └── chat-suggestions.ts        ← Page-specific suggested questions (10 sets, trilingual)
│
├── layouts/
│   └── BaseLayout.astro           ← Renders <AskLawra /> on every page
│
├── i18n/
│   ├── en.json                    ← askLawra.* section (18 keys)
│   ├── es.json                    ← askLawra.* section (18 keys)
│   └── fr.json                    ← askLawra.* section (18 keys)
│
firestore.rules                    ← likes + submissions rules
```

### Phase 2 (planned)

```
src/
├── components/
│   └── AskLawra/
│       ├── AskLawra.astro         ← MODIFIED: pass new i18n keys
│       └── ChatWidget.svelte      ← MODIFIED: persona selector, auth UI, history panel
│
├── lib/
│   ├── firebase.ts                ← unchanged
│   ├── chat.ts                    ← MODIFIED: persona + tier params, optional Firestore save
│   ├── chat-persona.ts            ← MODIFIED: 4 personas with PersonaDef type
│   ├── chat-suggestions.ts        ← unchanged (optional: per-persona suggestions)
│   ├── auth.ts                    ← NEW: sign-in, sign-up, upgrade, sign-out
│   ├── tiers.ts                   ← NEW: user docs, usage tracking, tier limits
│   └── conversations.ts           ← NEW: Firestore conversation CRUD
│
├── i18n/
│   ├── en.json                    ← MODIFIED: +25 askLawra.* keys (~43 total)
│   ├── es.json                    ← MODIFIED: same
│   └── fr.json                    ← MODIFIED: same
│
firestore.rules                    ← MODIFIED: +users, +conversations rules
```

### Future (Phase 3+)

```
src/
├── lib/
│   ├── providers.ts               ← provider abstraction (Gemini/Claude/OpenAI)
│   ├── rag.ts                     ← retrieval logic (embed query, find matches)
│   └── personas.ts                ← fetch persona configs from Firestore (replaces in-code)
│
firebase/
├── functions/
│   ├── src/
│   │   ├── index.ts               ← Cloud Function exports
│   │   ├── chat.ts                ← /api/chat handler
│   │   ├── providers/
│   │   │   ├── gemini.ts
│   │   │   ├── claude.ts
│   │   │   └── openai.ts
│   │   ├── rag.ts                 ← server-side retrieval
│   │   └── stripe-webhook.ts      ← subscription management
│   └── package.json
├── firestore.rules
├── firestore.indexes.json
└── firebase.json
│
scripts/
└── index-site-content.ts          ← build-time: extract pages → embeddings → Firestore
```

---

*This plan is designed to be implemented incrementally. Each phase delivers a usable product. Ship Phase 1, learn from real usage, then iterate.*
