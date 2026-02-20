/**
 * Firestore conversation CRUD — registered users only.
 * Stores chat history with persona info for resumable conversations.
 */
import type { PersonaId } from './chat-persona';

export interface ConversationMessage {
  role: 'user' | 'model';
  text: string;
  createdAt: any; // Firestore Timestamp
}

export interface Conversation {
  id: string;
  userId: string;
  personaId: PersonaId;
  locale: string;
  title: string;
  messageCount: number;
  createdAt: any;
  updatedAt: any;
}

/**
 * Create a new conversation and return its ID.
 */
export async function createConversation(
  userId: string,
  personaId: PersonaId,
  locale: string,
  firstMessage: string,
): Promise<string> {
  const { getDb } = await import('./firebase');
  const { collection, addDoc, Timestamp } = await import('firebase/firestore');
  const db = await getDb();

  const title = firstMessage.length > 60
    ? firstMessage.slice(0, 57) + '...'
    : firstMessage;

  const docRef = await addDoc(collection(db, 'conversations'), {
    userId,
    personaId,
    locale,
    title,
    messageCount: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return docRef.id;
}

/**
 * Add a message to an existing conversation.
 */
export async function addMessage(
  conversationId: string,
  role: 'user' | 'model',
  text: string,
): Promise<void> {
  const { getDb } = await import('./firebase');
  const { collection, addDoc, doc, updateDoc, increment, Timestamp } = await import(
    'firebase/firestore'
  );
  const db = await getDb();

  // Add message to subcollection
  await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
    role,
    text,
    createdAt: Timestamp.now(),
  });

  // Update conversation metadata
  await updateDoc(doc(db, 'conversations', conversationId), {
    updatedAt: Timestamp.now(),
    messageCount: increment(1),
  });
}

/**
 * List recent conversations for a user, ordered by most recent.
 */
export async function listConversations(
  userId: string,
  maxResults = 20,
): Promise<Conversation[]> {
  const { getDb } = await import('./firebase');
  const { collection, query, where, orderBy, limit, getDocs } = await import(
    'firebase/firestore'
  );
  const db = await getDb();

  const q = query(
    collection(db, 'conversations'),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc'),
    limit(maxResults),
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Conversation));
}

/**
 * Load all messages for a conversation, ordered chronologically.
 */
export async function loadMessages(
  conversationId: string,
): Promise<ConversationMessage[]> {
  const { getDb } = await import('./firebase');
  const { collection, query, orderBy, getDocs } = await import('firebase/firestore');
  const db = await getDb();

  const q = query(
    collection(db, 'conversations', conversationId, 'messages'),
    orderBy('createdAt', 'asc'),
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as ConversationMessage);
}

/**
 * Delete a conversation and its messages.
 */
export async function deleteConversation(conversationId: string): Promise<void> {
  const { getDb } = await import('./firebase');
  const { doc, deleteDoc, collection, getDocs } = await import('firebase/firestore');
  const db = await getDb();

  // Delete all messages in subcollection first
  const msgSnap = await getDocs(
    collection(db, 'conversations', conversationId, 'messages'),
  );
  const deletePromises = msgSnap.docs.map((d) => deleteDoc(d.ref));
  await Promise.all(deletePromises);

  // Delete the conversation document
  await deleteDoc(doc(db, 'conversations', conversationId));
}
