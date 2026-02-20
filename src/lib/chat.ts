/**
 * Chat service for Ask Insureversia — Phase 2.
 * Uses Firebase AI (Gemini) via client-side SDK.
 * Supports multi-persona, tier-based limits, and conversation persistence.
 */

import { PERSONAS, DEFAULT_PERSONA, type PersonaId } from './chat-persona';
import type { UserTier } from './auth';

// ─── Types ────────────────────────────────────────────────────────
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// ─── Constants ────────────────────────────────────────────────────
const MODEL_NAME = 'gemini-2.5-flash';

// ─── Module-level singletons (survive SPA navigation) ─────────────
let chatSession: any = null;
let currentLocale: string = '';
let currentPageContext: string = '';
let currentPersonaId: PersonaId = DEFAULT_PERSONA;

// ─── Session management ──────────────────────────────────────────

/**
 * Creates or reuses a Gemini chat session.
 * Session is invalidated when locale, page context, or persona changes.
 */
async function getOrCreateSession(
  locale: string,
  pageContext: string,
  pageTitle: string | undefined,
  history: ChatMessage[],
  personaId: PersonaId = DEFAULT_PERSONA,
  tier: UserTier = 'anonymous',
): Promise<any> {
  // Reuse existing session if context hasn't changed
  if (
    chatSession &&
    currentLocale === locale &&
    currentPageContext === pageContext &&
    currentPersonaId === personaId
  ) {
    return chatSession;
  }

  const { getApp } = await import('./firebase');
  const { getAI, getGenerativeModel, GoogleAIBackend } = await import('firebase/ai');

  const app = await getApp();
  const ai = getAI(app, { backend: new GoogleAIBackend() });

  const persona = PERSONAS[personaId] || PERSONAS[DEFAULT_PERSONA];
  const systemPrompt = persona.buildPrompt(locale, pageContext, pageTitle);
  const maxTokens = persona.maxOutputTokens[tier] || persona.maxOutputTokens.anonymous;

  const model = getGenerativeModel(ai, {
    model: MODEL_NAME,
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      temperature: persona.temperature,
      maxOutputTokens: maxTokens,
    },
  });

  // Convert history to Gemini format
  const geminiHistory = history.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.text }],
  }));

  chatSession = model.startChat({ history: geminiHistory });
  currentLocale = locale;
  currentPageContext = pageContext;
  currentPersonaId = personaId;

  return chatSession;
}

// ─── Public API ──────────────────────────────────────────────────

/**
 * Sends a message and returns a streaming response.
 * Yields text chunks as they arrive.
 */
export async function* sendMessageStream(
  text: string,
  locale: string,
  pageContext: string,
  pageTitle: string | undefined,
  history: ChatMessage[],
  personaId: PersonaId = DEFAULT_PERSONA,
  tier: UserTier = 'anonymous',
  conversationId?: string,
): AsyncGenerator<string> {
  const session = await getOrCreateSession(
    locale,
    pageContext,
    pageTitle,
    history,
    personaId,
    tier,
  );

  // Save user message to Firestore if conversation exists
  if (conversationId) {
    import('./conversations').then(({ addMessage }) => addMessage(conversationId, 'user', text));
  }

  const result = await session.sendMessageStream(text);
  let fullText = '';

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    if (chunkText) {
      fullText += chunkText;
      yield chunkText;
    }
  }

  // Save model response to Firestore if conversation exists
  if (conversationId && fullText) {
    import('./conversations').then(({ addMessage }) =>
      addMessage(conversationId, 'model', fullText),
    );
  }
}

/**
 * Resets the chat session (for "New Chat" or persona switch).
 */
export function resetSession(): void {
  chatSession = null;
  currentLocale = '';
  currentPageContext = '';
  currentPersonaId = DEFAULT_PERSONA;
}
