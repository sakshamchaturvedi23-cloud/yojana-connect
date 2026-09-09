import { getSupabase, isSupabaseClientConfigured } from "./supabase";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
  message?: string;
}

export const AUTH_TOKEN_KEY = "auth_token";
export const AUTH_USER_KEY = "auth_user";
export const YOJANA_TOKEN_KEY = "yojana_token";
export const YOJANA_USER_KEY = "yojana_user";

// Client-side cookie helpers
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
  return match ? decodeURIComponent(match[3]) : null;
}

export function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

// Subscription listeners for auth store synchronization
const authListeners = new Set<() => void>();

export function subscribeAuth(callback: () => void) {
  authListeners.add(callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
  }
  return () => {
    authListeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", callback);
    }
  };
}

export function notifyAuthChanged() {
  authListeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // Ignore listener errors
    }
  });
}

let cachedUserRaw: string | null = null;
let cachedUserObj: User | null = null;

// Client-side storage helpers
export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY) || localStorage.getItem(YOJANA_USER_KEY);
    if (raw === cachedUserRaw) {
      return cachedUserObj;
    }
    cachedUserRaw = raw;
    cachedUserObj = raw ? JSON.parse(raw) : null;
    return cachedUserObj;
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(AUTH_TOKEN_KEY) ||
    localStorage.getItem(YOJANA_TOKEN_KEY) ||
    getCookie(AUTH_TOKEN_KEY)
  );
}

export function setStoredSession(token: string, user: User, rememberMe = true) {
  if (typeof window === "undefined") return;
  const days = rememberMe ? 30 : 1;
  const userJson = JSON.stringify(user);

  setCookie(AUTH_TOKEN_KEY, token, days);
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, userJson);
  localStorage.setItem(YOJANA_TOKEN_KEY, token);
  localStorage.setItem(YOJANA_USER_KEY, userJson);

  cachedUserRaw = userJson;
  cachedUserObj = user;
  notifyAuthChanged();
}

export function clearStoredSession() {
  if (typeof window === "undefined") return;
  deleteCookie(AUTH_TOKEN_KEY);
  deleteCookie(YOJANA_TOKEN_KEY);
  deleteCookie("sb-access-token");
  deleteCookie("sb-refresh-token");

  if (typeof document !== "undefined") {
    try {
      const cookies = document.cookie.split(";");
      for (const c of cookies) {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substring(0, eqPos).trim() : c.trim();
        if (name.startsWith("sb-") || name.toLowerCase().includes("token")) {
          deleteCookie(name);
        }
      }
    } catch {
      // Ignore cookie parsing errors
    }
  }

  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(YOJANA_TOKEN_KEY);
  localStorage.removeItem(YOJANA_USER_KEY);

  cachedUserRaw = null;
  cachedUserObj = null;
  notifyAuthChanged();
}

/**
 * Hook up login with Supabase session management & fallback to Next.js auth backend
 */
export async function loginApi(credentials: LoginCredentials): Promise<AuthResponse> {
  const isEmail = credentials.emailOrUsername.includes("@");

  // 1. Authenticate with Supabase if configured and user entered an email
  if (isSupabaseClientConfigured() && isEmail) {
    try {
      const client = getSupabase();
      const { data, error } = await client.auth.signInWithPassword({
        email: credentials.emailOrUsername.trim().toLowerCase(),
        password: credentials.password,
      });

      if (!error && data.session && data.user) {
        const mappedUser: User = {
          id: data.user.id,
          name:
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            data.user.email?.split("@")[0] ||
            "Citizen",
          email: data.user.email || credentials.emailOrUsername.trim().toLowerCase(),
        };

        const token = data.session.access_token;
        setStoredSession(token, mappedUser, credentials.rememberMe ?? true);

        // Notify server route to establish session cookie as well
        try {
          await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });
        } catch {
          // Non-blocking
        }

        return {
          success: true,
          token,
          user: mappedUser,
        };
      }

      if (error) {
        return {
          success: false,
          error: error.message || "Invalid credentials. Please verify your email and password.",
        };
      }
    } catch (err) {
      console.warn("[auth] Supabase signInWithPassword exception, checking backend:", err);
    }
  }

  // 2. Next.js backend auth endpoint fallback
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || "Authentication failed. Please check your credentials.",
      };
    }

    if (data.token && data.user) {
      setStoredSession(data.token, data.user, credentials.rememberMe ?? true);
    }

    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error. Please try again.";
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Hook up registration with Supabase session management & fallback to Next.js auth backend
 */
export async function registerApi(credentials: RegisterCredentials): Promise<AuthResponse> {
  // 1. Register with Supabase if configured
  if (isSupabaseClientConfigured()) {
    try {
      const client = getSupabase();
      const { data, error } = await client.auth.signUp({
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.fullName.trim(),
          },
        },
      });

      if (!error && data.user) {
        const mappedUser: User = {
          id: data.user.id,
          name: credentials.fullName.trim(),
          email: data.user.email || credentials.email.trim().toLowerCase(),
        };

        const token = data.session?.access_token || `jwt_supabase_${data.user.id}`;
        setStoredSession(token, mappedUser, true);

        // Sync with backend API
        try {
          await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });
        } catch {
          // Non-blocking
        }

        return {
          success: true,
          token,
          user: mappedUser,
        };
      }

      if (error) {
        return {
          success: false,
          error: error.message || "Registration failed. Please try again.",
        };
      }
    } catch (err) {
      console.warn("[auth] Supabase signUp exception, checking backend:", err);
    }
  }

  // 2. Next.js backend registration fallback
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || "Registration failed. Please try again.",
      };
    }

    if (data.token && data.user) {
      setStoredSession(data.token, data.user, true);
    }

    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error. Please try again.";
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Logout of both Supabase and Next.js backend session
 */
export async function logoutApi(): Promise<void> {
  try {
    const client = getSupabase();
    await client.auth.signOut();
  } catch {
    // Ignore error
  }

  try {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
  } catch {
    // Ignore network failure on logout
  } finally {
    clearStoredSession();
  }
}

export async function googleSignInApi(from = "/"): Promise<AuthResponse> {
  if (typeof window !== "undefined") {
    window.location.href = `/api/auth/oauth?provider=google&from=${encodeURIComponent(from)}`;
    return { success: true };
  }
  return { success: false, error: "Browser window is not available." };
}

export async function githubSignInApi(from = "/"): Promise<AuthResponse> {
  if (typeof window !== "undefined") {
    window.location.href = `/api/auth/oauth?provider=github&from=${encodeURIComponent(from)}`;
    return { success: true };
  }
  return { success: false, error: "Browser window is not available." };
}

export async function magicLinkApi(email: string, from = "/"): Promise<AuthResponse> {
  if (isSupabaseClientConfigured()) {
    try {
      const client = getSupabase();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { data, error } = await client.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${origin}/auth/callback?from=${encodeURIComponent(from)}`,
        },
      });
      if (error) return { success: false, error: error.message };
      return { success: true, message: "Magic link sent to your email! Please check your inbox." };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Magic link error";
      console.warn("[auth] Magic link exception:", message);
      return { success: false, error: message };
    }
  }

  return {
    success: false,
    error: "Email magic link requires configured Supabase credentials. Please use Demo Citizen or standard login.",
  };
}
