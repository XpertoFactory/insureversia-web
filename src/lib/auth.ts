/**
 * Firebase Auth service — sign-in, sign-up, anonymous upgrade, sign-out.
 * Provides auth state listener and sync access to current user profile.
 */
import { getAuth } from './firebase';

export type UserTier = 'anonymous' | 'registered';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  tier: UserTier;
  photoURL: string | null;
}

// Module-level cache for sync access
let cachedProfile: UserProfile | null = null;

function toProfile(user: any): UserProfile {
  const isAnon = user.isAnonymous ?? (!user.email);
  return {
    uid: user.uid,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    tier: isAnon ? 'anonymous' : 'registered',
    photoURL: user.photoURL ?? null,
  };
}

/**
 * Subscribe to auth state changes. Returns unsubscribe function.
 */
export function onAuthChange(cb: (user: UserProfile | null) => void): () => void {
  let unsubscribe = () => {};

  getAuth().then(async (auth) => {
    const { onAuthStateChanged } = await import('firebase/auth');
    unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        cachedProfile = toProfile(firebaseUser);
        cb(cachedProfile);
      } else {
        cachedProfile = null;
        cb(null);
      }
    });
  });

  return () => unsubscribe();
}

/**
 * Sign in with Google popup.
 */
export async function signInWithGoogle(): Promise<UserProfile> {
  const auth = await getAuth();
  const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  cachedProfile = toProfile(cred.user);

  // Create/update user document
  const { ensureUserDocument } = await import('./tiers');
  await ensureUserDocument(cred.user.uid, cred.user.email, cred.user.displayName);

  return cachedProfile;
}

/**
 * Sign in with email and password.
 */
export async function signInWithEmail(email: string, password: string): Promise<UserProfile> {
  const auth = await getAuth();
  const { signInWithEmailAndPassword } = await import('firebase/auth');
  const cred = await signInWithEmailAndPassword(auth, email, password);
  cachedProfile = toProfile(cred.user);

  const { ensureUserDocument } = await import('./tiers');
  await ensureUserDocument(cred.user.uid, cred.user.email, cred.user.displayName);

  return cachedProfile;
}

/**
 * Create account with email, password, and display name.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
): Promise<UserProfile> {
  const auth = await getAuth();
  const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  cachedProfile = toProfile({ ...cred.user, displayName });

  const { ensureUserDocument } = await import('./tiers');
  await ensureUserDocument(cred.user.uid, email, displayName);

  return cachedProfile;
}

/**
 * Upgrade an anonymous user to a registered account.
 * Preserves the anonymous UID so localStorage-based data stays intact.
 */
export async function upgradeAnonymous(
  method: 'google' | 'email',
  email?: string,
  password?: string,
  displayName?: string,
): Promise<UserProfile> {
  const auth = await getAuth();
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('No current user to upgrade');

  if (method === 'google') {
    const { linkWithPopup, GoogleAuthProvider } = await import('firebase/auth');
    const provider = new GoogleAuthProvider();
    const cred = await linkWithPopup(currentUser, provider);
    cachedProfile = toProfile(cred.user);
  } else {
    const { linkWithCredential, EmailAuthProvider, updateProfile } = await import('firebase/auth');
    if (!email || !password) throw new Error('Email and password required');
    const credential = EmailAuthProvider.credential(email, password);
    const cred = await linkWithCredential(currentUser, credential);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    cachedProfile = toProfile({ ...cred.user, displayName: displayName || cred.user.displayName });
  }

  const { ensureUserDocument } = await import('./tiers');
  await ensureUserDocument(
    cachedProfile.uid,
    cachedProfile.email,
    cachedProfile.displayName,
  );

  return cachedProfile;
}

/**
 * Sign out, then re-sign-in anonymously to maintain valid auth for likes/submissions.
 */
export async function signOut(): Promise<void> {
  const auth = await getAuth();
  const { signOut: _signOut, signInAnonymously } = await import('firebase/auth');
  await _signOut(auth);
  await signInAnonymously(auth);
  // cachedProfile will be updated by onAuthStateChanged
}

/**
 * Sync access to current user profile.
 */
export function getCurrentUser(): UserProfile | null {
  return cachedProfile;
}

/**
 * Returns true if the current user is anonymous (or no user).
 */
export function isAnonymous(): boolean {
  return !cachedProfile || cachedProfile.tier === 'anonymous';
}
