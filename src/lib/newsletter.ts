/**
 * Newsletter subscription service — writes to Firestore `newsletters` collection.
 * Deduplicates by email (uses email hash as document ID).
 */
import { getDb, getUid } from './firebase';

export async function subscribe(email: string, locale: string): Promise<void> {
  const db = await getDb();
  const { doc, setDoc, Timestamp } = await import('firebase/firestore');
  const uid = await getUid();

  // Use a simple hash of the email as document ID for deduplication
  const docId = email.toLowerCase().trim().replace(/[^a-z0-9@.+_-]/g, '_');

  const ref = doc(db, 'newsletters', docId);

  // Use merge so re-subscribing just updates the timestamp without error.
  // Firestore rules deny reads on newsletters, so we cannot getDoc() first.
  await setDoc(ref, {
    email: email.toLowerCase().trim(),
    locale,
    uid,
    subscribedAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }, { merge: true });
}
