/**
 * Newsletter subscription service — writes to Firestore `newsletters` collection.
 * Deduplicates by email (uses email hash as document ID).
 */
import { getDb, getUid } from './firebase';

export async function subscribe(email: string, locale: string): Promise<void> {
  const db = await getDb();
  const { doc, getDoc, setDoc, Timestamp } = await import('firebase/firestore');
  const uid = await getUid();

  // Use a simple hash of the email as document ID for deduplication
  const docId = email.toLowerCase().trim().replace(/[^a-z0-9@.+_-]/g, '_');

  const ref = doc(db, 'newsletters', docId);
  const existing = await getDoc(ref);

  if (existing.exists()) {
    // Already subscribed — update timestamp silently
    await setDoc(ref, { updatedAt: Timestamp.now() }, { merge: true });
    return;
  }

  await setDoc(ref, {
    email: email.toLowerCase().trim(),
    locale,
    uid,
    subscribedAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}
