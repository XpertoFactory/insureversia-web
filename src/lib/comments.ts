/**
 * Comments service — reads/writes to Firestore `comments` collection.
 *
 * Schema:
 *   comments/{commentId}
 *     contentType: string
 *     contentId: string
 *     authorUid: string
 *     authorName: string
 *     text: string (max 1000 chars)
 *     status: 'pending' | 'approved' | 'rejected'
 *     locale: 'en' | 'es'
 *     createdAt: Timestamp
 */
import { getDb } from './firebase';

export interface Comment {
  id: string;
  contentType: string;
  contentId: string;
  authorUid: string;
  authorName: string;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  locale: string;
  createdAt: Date;
}

/**
 * Get approved comments for a content item, newest first.
 */
export async function getComments(
  contentType: string,
  contentId: string,
): Promise<Comment[]> {
  try {
    const db = await getDb();
    const { collection, query, where, orderBy, getDocs } = await import(
      'firebase/firestore'
    );

    const q = query(
      collection(db, 'comments'),
      where('contentType', '==', contentType),
      where('contentId', '==', contentId),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc'),
    );

    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() ?? new Date(),
    })) as Comment[];
  } catch {
    return [];
  }
}

/**
 * Get the current user's pending comments for a content item.
 */
export async function getMyPendingComments(
  contentType: string,
  contentId: string,
  uid: string,
): Promise<Comment[]> {
  try {
    const db = await getDb();
    const { collection, query, where, orderBy, getDocs } = await import(
      'firebase/firestore'
    );

    const q = query(
      collection(db, 'comments'),
      where('contentType', '==', contentType),
      where('contentId', '==', contentId),
      where('authorUid', '==', uid),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc'),
    );

    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() ?? new Date(),
    })) as Comment[];
  } catch {
    return [];
  }
}

/**
 * Submit a new comment (status = 'pending').
 */
export async function submitComment(
  contentType: string,
  contentId: string,
  authorUid: string,
  authorName: string,
  text: string,
  locale: string,
): Promise<string> {
  const db = await getDb();
  const { collection, addDoc, Timestamp } = await import(
    'firebase/firestore'
  );

  const docRef = await addDoc(collection(db, 'comments'), {
    contentType,
    contentId,
    authorUid,
    authorName,
    text: text.slice(0, 1000),
    status: 'pending',
    locale,
    createdAt: Timestamp.now(),
  });

  return docRef.id;
}

/**
 * Get count of approved comments for a content item.
 */
export async function getCommentCount(
  contentType: string,
  contentId: string,
): Promise<number> {
  try {
    const db = await getDb();
    const { collection, query, where, getCountFromServer } = await import(
      'firebase/firestore'
    );

    const q = query(
      collection(db, 'comments'),
      where('contentType', '==', contentType),
      where('contentId', '==', contentId),
      where('status', '==', 'approved'),
    );

    const snap = await getCountFromServer(q);
    return snap.data().count;
  } catch {
    return 0;
  }
}
