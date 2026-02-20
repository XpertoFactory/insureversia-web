/**
 * User documents + tier-based rate limiting.
 * Anonymous: localStorage (no Firestore cost).
 * Registered: Firestore users/{uid}.usage.
 */
import type { UserTier } from './auth';

const TIER_LIMITS: Record<UserTier, number> = {
  anonymous: 5,
  registered: 25,
};

const USAGE_KEY = 'insureversia-chat-usage';

// ─── Helpers ──────────────────────────────────────────────────────

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

interface LocalUsage {
  date: string;
  count: number;
}

function getLocalUsage(): LocalUsage {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (!raw) return { date: getTodayStr(), count: 0 };
    const data: LocalUsage = JSON.parse(raw);
    if (data.date !== getTodayStr()) return { date: getTodayStr(), count: 0 };
    return data;
  } catch {
    return { date: getTodayStr(), count: 0 };
  }
}

function saveLocalUsage(data: LocalUsage): void {
  localStorage.setItem(USAGE_KEY, JSON.stringify(data));
}

// ─── Firestore user document ─────────────────────────────────────

/**
 * Creates or updates the Firestore user document on sign-in/sign-up.
 */
export async function ensureUserDocument(
  uid: string,
  email: string | null,
  displayName: string | null,
): Promise<void> {
  const { getDb } = await import('./firebase');
  const { doc, setDoc, Timestamp } = await import('firebase/firestore');
  const db = await getDb();

  await setDoc(
    doc(db, 'users', uid),
    {
      email: email || null,
      displayName: displayName || null,
      updatedAt: Timestamp.now(),
    },
    { merge: true },
  );
}

// ─── Rate limiting API ────────────────────────────────────────────

export function getDailyLimit(tier: UserTier): number {
  return TIER_LIMITS[tier];
}

/**
 * Check if the user can send another message today.
 */
export async function canSendMessage(tier: UserTier, uid?: string): Promise<boolean> {
  const used = await getUsedMessages(tier, uid);
  return used < TIER_LIMITS[tier];
}

/**
 * Increment the daily usage counter.
 */
export async function incrementUsage(tier: UserTier, uid?: string): Promise<void> {
  if (tier === 'anonymous') {
    const data = getLocalUsage();
    data.count += 1;
    saveLocalUsage(data);
    return;
  }

  if (!uid) return;
  const { getDb } = await import('./firebase');
  const { doc, setDoc } = await import('firebase/firestore');
  const db = await getDb();

  const today = getTodayStr();
  const used = await getUsedMessages(tier, uid);

  await setDoc(
    doc(db, 'users', uid),
    { usage: { date: today, messagesUsed: used + 1 } },
    { merge: true },
  );
}

/**
 * Get the number of messages used today.
 */
export async function getUsedMessages(tier: UserTier, uid?: string): Promise<number> {
  if (tier === 'anonymous') {
    return getLocalUsage().count;
  }

  if (!uid) return 0;
  const { getDb } = await import('./firebase');
  const { doc, getDoc } = await import('firebase/firestore');
  const db = await getDb();

  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return 0;
    const usage = snap.data()?.usage;
    if (!usage || usage.date !== getTodayStr()) return 0;
    return usage.messagesUsed ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Get the remaining messages for today.
 */
export async function getRemainingMessages(tier: UserTier, uid?: string): Promise<number> {
  const used = await getUsedMessages(tier, uid);
  return Math.max(0, TIER_LIMITS[tier] - used);
}
