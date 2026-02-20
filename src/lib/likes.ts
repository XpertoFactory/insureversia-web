/**
 * Like service — reads/writes to Firestore `likes` collection.
 *
 * Document ID pattern: `{contentType}_{contentId}`
 * Schema:
 *   likes/{docId}
 *     ├── count: number
 *     └── users/{uid}: { likedAt: Timestamp }
 */
import { getDb, getUid } from './firebase';

function docKey(contentType: string, contentId: string): string {
  return `${contentType}_${contentId}`.replace(/[/.]/g, '_');
}

export async function getLikeStatus(
  contentType: string,
  contentId: string,
): Promise<{ count: number; liked: boolean }> {
  try {
    const db = await getDb();
    const { doc, getDoc } = await import('firebase/firestore');

    const key = docKey(contentType, contentId);
    const likeRef = doc(db, 'likes', key);
    const snap = await getDoc(likeRef);

    const count = snap.exists() ? (snap.data().count ?? 0) : 0;

    const uid = await getUid();
    const userRef = doc(db, 'likes', key, 'users', uid);
    const userSnap = await getDoc(userRef);

    return { count, liked: userSnap.exists() };
  } catch {
    return { count: 0, liked: false };
  }
}

export async function toggleLike(
  contentType: string,
  contentId: string,
): Promise<{ count: number; liked: boolean }> {
  const db = await getDb();
  const { doc, getDoc, setDoc, deleteDoc, increment } = await import(
    'firebase/firestore'
  );

  const uid = await getUid();
  const key = docKey(contentType, contentId);
  const likeRef = doc(db, 'likes', key);
  const userRef = doc(db, 'likes', key, 'users', uid);

  const userSnap = await getDoc(userRef);
  const wasLiked = userSnap.exists();

  if (wasLiked) {
    // Unlike
    await deleteDoc(userRef);
    await setDoc(likeRef, { count: increment(-1) }, { merge: true });
  } else {
    // Like
    const { Timestamp } = await import('firebase/firestore');
    await setDoc(userRef, { likedAt: Timestamp.now() });
    await setDoc(likeRef, { count: increment(1) }, { merge: true });
  }

  const snap = await getDoc(likeRef);
  const newCount = Math.max(0, snap.exists() ? (snap.data().count ?? 0) : 0);
  return { count: newCount, liked: !wasLiked };
}
