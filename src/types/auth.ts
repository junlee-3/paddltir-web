/** Authenticated user fields used by the app shell. */
export interface AuthUser {
  uid: string;
  email: string | null;
  photoURL: string | null;
  displayName: string | null;
}
