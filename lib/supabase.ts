import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { User } from "./auth";

let supabaseClient: SupabaseClient | null = null;

/**
 * Checks whether live Supabase credentials are configured in the environment.
 */
export function isSupabaseClientConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(url && key && url.trim().length > 0 && key.trim().length > 0);
}

/**
 * Returns the singleton Supabase client instance.
 * Strictly requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error(
        "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined."
      );
    }

    supabaseClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseClient;
}

export const supabase = {
  get auth() {
    return getSupabase().auth;
  },
  from(...args: Parameters<SupabaseClient["from"]>) {
    return getSupabase().from(...args);
  },
};

function getStoredClientToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("yojana_token") ||
    localStorage.getItem("auth_token") ||
    null
  );
}

function getStoredClientUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("yojana_user") || localStorage.getItem("auth_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Extracts active auth session token.
 * 1. Checks Supabase session via supabase.auth.getSession()
 * 2. Falls back to stored token in localStorage / cookies
 */
export async function getAuthSessionToken(): Promise<string | null> {
  if (isSupabaseClientConfigured()) {
    try {
      const client = getSupabase();
      const { data, error } = await client.auth.getSession();
      if (!error && data?.session?.access_token) {
        return data.session.access_token;
      }
    } catch (err) {
      console.warn("[supabase] Unable to retrieve Supabase session:", err);
    }
  }

  // Graceful fallback to client-side cookie / localStorage stored token
  return getStoredClientToken();
}

/**
 * Resolves current user details from Supabase or stored session.
 */
export async function getAuthSessionUser(): Promise<User | null> {
  if (isSupabaseClientConfigured()) {
    try {
      const client = getSupabase();
      const { data, error } = await client.auth.getUser();
      if (!error && data?.user) {
        return {
          id: data.user.id,
          name:
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            data.user.email?.split("@")[0] ||
            "Citizen",
          email: data.user.email || "",
        };
      }
    } catch (err) {
      console.warn("[supabase] Unable to retrieve Supabase user:", err);
    }
  }

  return getStoredClientUser();
}
