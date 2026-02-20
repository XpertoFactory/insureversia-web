/**
 * Firebase lazy-init singleton.
 * SDK is only loaded when a feature (likes, submissions) is first used.
 */
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

const UID_KEY = 'insureversia-uid';

// Firebase client config is public by design — security comes from
// Firestore rules and Auth, not from hiding these values.
// Replace these with your actual Firebase project config.
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

async function initApp(): Promise<FirebaseApp> {
  if (app) return app;
  const { initializeApp } = await import('firebase/app');
  app = initializeApp(firebaseConfig);
  return app;
}

export async function getDb(): Promise<Firestore> {
  if (db) return db;
  const firebaseApp = await initApp();
  const { getFirestore } = await import('firebase/firestore');
  db = getFirestore(firebaseApp);
  return db;
}

export async function getApp(): Promise<FirebaseApp> {
  return initApp();
}

export async function getAuth(): Promise<Auth> {
  if (auth) return auth;
  const firebaseApp = await initApp();
  const { getAuth: _getAuth } = await import('firebase/auth');
  auth = _getAuth(firebaseApp);
  return auth;
}

/**
 * Returns a stable anonymous UID.
 * Always signs in with Firebase Auth so Firestore sees auth credentials.
 * Falls back to localStorage + crypto.randomUUID() if Auth fails.
 */
export async function getUid(): Promise<string> {
  try {
    const firebaseAuth = await getAuth();
    if (firebaseAuth.currentUser) {
      return firebaseAuth.currentUser.uid;
    }
    const { signInAnonymously } = await import('firebase/auth');
    const cred = await signInAnonymously(firebaseAuth);
    const uid = cred.user.uid;
    localStorage.setItem(UID_KEY, uid);
    return uid;
  } catch {
    const cached = localStorage.getItem(UID_KEY);
    if (cached) return cached;
    const uid = crypto.randomUUID();
    localStorage.setItem(UID_KEY, uid);
    return uid;
  }
}
