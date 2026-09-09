/** App auth user shape — mirrors former Firebase User fields used by the UI. */
export interface AuthUser {
  uid: string;
  email: string | null;
  photoURL: string | null;
  displayName: string | null;
}
