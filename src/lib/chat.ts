/**
 * Chat service for Ask Insureversia — Phase 1.
 * Uses Firebase AI (Gemini) via client-side SDK.
 * Lazy-loads all Firebase/AI dependencies on first use.
 */

import { buildSystemPrompt } from './chat-persona';

// ─── Types ────────────────────────────────────────────────────────
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface UsageData {
  date: string;
  count: number;
}

// ─── Constants ────────────────────────────────────────────────────
const DAILY_LIMIT = 5;
const USAGE_KEY = 'insureversia-chat-usage';
const MODEL_NAME = 'gemini-2.5-flash';

// ─── Module-level singletons (survive SPA navigation) ─────────────
let chatSession: any = null;
let currentLocale: string = '';
let currentPageContext: string = '';

// ─── Rate limiting (localStorage) ─────────────────────────────────

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function getUsageData(): UsageData {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (!raw) return { date: getTodayStr(), count: 0 };
    const data: UsageData = JSON.parse(raw);
    if (data.date !== getTodayStr()) {
      return { date: getTodayStr(), count: 0 };
    }
    return data;
  } catch {
    return { date: getTodayStr(), count: 0 };
  }
}

function saveUsageData(data: UsageData): void {
  localStorage.setItem(USAGE_KEY, JSON.stringify(data));
}

export function canSendMessage(): boolean {
  return getUsageData().count < DAILY_LIMIT;
}

export function getRemainingMessages(): number {
  return Math.max(0, DAILY_LIMIT - getUsageData().count);
}

export function getUsedMessages(): number {
  return getUsageData().count;
}

export function incrementUsage(): void {
  const data = getUsageData();
  data.count += 1;
  saveUsageData(data);
}

// ─── Session management ──────────────────────────────────────────

/**
 * Creates or reuses a Gemini chat session.
 * Lazy-loads firebase/ai on first call.
 */
async function getOrCreateSession(
  locale: string,
  pageContext: string,
  pageTitle: string | undefined,
  history: ChatMessage[]
): Promise<any> {
  // Reuse existing session if context hasn't changed
  if (chatSession && currentLocale === locale && currentPageContext === pageContext) {
    return chatSession;
  }

  const { getApp } = await import('./firebase');
  const { getAI, getGenerativeModel, GoogleAIBackend } = await import('firebase/ai');

  const app = await getApp();
  const ai = getAI(app, { backend: new GoogleAIBackend() });

  const systemPrompt = buildSystemPrompt(locale, pageContext, pageTitle);

  const model = getGenerativeModel(ai, {
    model: MODEL_NAME,
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 512,
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
  history: ChatMessage[]
): AsyncGenerator<string> {
  const session = await getOrCreateSession(locale, pageContext, pageTitle, history);
  const result = await session.sendMessageStream(text);

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    if (chunkText) {
      yield chunkText;
    }
  }
}

/**
 * Resets the chat session (for "New Chat" action).
 */
export function resetSession(): void {
  chatSession = null;
  currentLocale = '';
  currentPageContext = '';
}
