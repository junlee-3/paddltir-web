import { createClient, type User as SupabaseUser } from "@supabase/supabase-js";
import type { AuthUser } from "./types/auth";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env.local and fill in your Supabase project keys."
  );
}

export const supabase = createClient(
  supabaseUrl ?? "https://placeholder.supabase.co",
  supabaseAnonKey ?? "placeholder"
);

export function mapAuthUser(user: SupabaseUser | null): AuthUser | null {
  if (!user) return null;
  const meta = user.user_metadata ?? {};
  return {
    uid: user.id,
    email: user.email ?? null,
    photoURL:
      (typeof meta.photo_url === "string" ? meta.photo_url : null) ??
      (typeof meta.avatar_url === "string" ? meta.avatar_url : null),
    displayName:
      (typeof meta.display_name === "string" ? meta.display_name : null) ??
      (typeof meta.full_name === "string" ? meta.full_name : null),
  };
}
