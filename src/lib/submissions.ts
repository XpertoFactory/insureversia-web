/**
 * Submission service — writes to Firestore `submissions` collection.
 */
import { getDb, getUid } from './firebase';

export interface SubmissionData {
  type: 'contact' | 'case' | 'idea' | 'request';
  locale: 'en' | 'es';
  name: string;
  email: string;
  message?: string;
  practiceArea?: string;
  jurisdiction?: string;
  caseDescription?: string;
  topic?: string;
  contentType?: string;
}

export async function submitForm(data: SubmissionData): Promise<void> {
  const db = await getDb();
  const { collection, addDoc, Timestamp } = await import(
    'firebase/firestore'
  );
  const uid = await getUid();

  // Strip undefined values — Firestore rejects them
  const clean: Record<string, unknown> = { uid, createdAt: Timestamp.now() };
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) clean[k] = v;
  }

  await addDoc(collection(db, 'submissions'), clean);
}
