/**
 * Admin service — admin-only operations on Firestore.
 *
 * Admin identity is determined by a `role: 'admin'` field on the
 * user's Firestore document (`users/{uid}`), set manually in Firebase Console.
 */
import { getDb } from './firebase';
import type { Comment } from './comments';

/**
 * Check if a user has the admin role.
 */
export async function checkIsAdmin(uid: string): Promise<boolean> {
  try {
    const db = await getDb();
    const { doc, getDoc } = await import('firebase/firestore');
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() && snap.data().role === 'admin';
  } catch {
    return false;
  }
}

/**
 * Get all comments with a given status, newest first.
 */
export async function getAllComments(
  status: 'pending' | 'approved' | 'rejected',
): Promise<Comment[]> {
  const db = await getDb();
  const { collection, query, where, orderBy, getDocs } = await import(
    'firebase/firestore'
  );

  const q = query(
    collection(db, 'comments'),
    where('status', '==', status),
    orderBy('createdAt', 'desc'),
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate() ?? new Date(),
  })) as Comment[];
}

/**
 * Update a comment's status (approve or reject).
 */
export async function updateCommentStatus(
  commentId: string,
  newStatus: 'approved' | 'rejected',
): Promise<void> {
  const db = await getDb();
  const { doc, updateDoc } = await import('firebase/firestore');
  await updateDoc(doc(db, 'comments', commentId), { status: newStatus });
}

/**
 * Permanently delete a comment.
 */
export async function deleteComment(commentId: string): Promise<void> {
  const db = await getDb();
  const { doc, deleteDoc } = await import('firebase/firestore');
  await deleteDoc(doc(db, 'comments', commentId));
}
