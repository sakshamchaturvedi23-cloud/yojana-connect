"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useSyncExternalStore,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  getStoredToken,
  getStoredUser,
  setStoredSession,
  clearStoredSession,
  subscribeAuth,
  loginApi,
  registerApi,
  logoutApi,
  notifyAuthChanged,
} from "@/lib/auth";
import { getSupabase, isSupabaseClientConfigured } from "@/lib/supabase";

export const YOJANA_USER_KEY = "yojana_user";
export const YOJANA_TOKEN_KEY = "yojana_token";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isLoginOpen: boolean;
  setLoginOpen: (open: boolean) => void;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  loginAsDemo: () => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Reference-stable caches for snapshots to prevent infinite re-render loops in useSyncExternalStore
let cachedCombinedRaw: string | null = null;
let cachedCombinedUser: User | null = null;
let cachedCombinedToken: string | null = null;

function parseUserFromToken(token: string): User | null {
  if (!token) return null;
  if (token.startsWith("jwt_mock_")) {
    try {
      const payloadBase64 = token.replace("jwt_mock_", "");
      const payload = JSON.parse(
        typeof window !== "undefined"
          ? atob(payloadBase64)
          : Buffer.from(payloadBase64, "base64").toString("utf-8")
      );
      return {
        id: payload.id || "citizen",
        name: payload.name || payload.email?.split("@")[0] || "Citizen",
        email: payload.email || "",
      };
    } catch {
      return null;
    }
  }
  if (token.includes(".")) {
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const jsonStr =
          typeof window !== "undefined"
            ? decodeURIComponent(
                atob(base64)
                  .split("")
                  .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                  .join("")
              )
            : Buffer.from(base64, "base64").toString("utf-8");
        const payload = JSON.parse(jsonStr);
        const name =
          payload.user_metadata?.full_name ||
          payload.user_metadata?.name ||
          payload.email?.split("@")[0] ||
          "Citizen";
        return {
          id: payload.sub || payload.id || "citizen",
          name,
          email: payload.email || payload.user_metadata?.email || "",
        };
      }
    } catch {
      return null;
    }
  }
  return null;
}

function getCombinedUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const yojanaRaw = localStorage.getItem(YOJANA_USER_KEY);
    if (yojanaRaw) {
      if (yojanaRaw === cachedCombinedRaw && cachedCombinedUser !== null) {
        return cachedCombinedUser;
      }
      cachedCombinedRaw = yojanaRaw;
      cachedCombinedUser = JSON.parse(yojanaRaw);
      return cachedCombinedUser;
    }
  } catch {
    // Ignore parse errors
  }

  // Fallback to getStoredUser() from lib/auth
  const fallbackUser = getStoredUser();
  if (fallbackUser) {
    const fallbackRaw = JSON.stringify(fallbackUser);
    if (fallbackRaw === cachedCombinedRaw && cachedCombinedUser !== null) {
      return cachedCombinedUser;
    }
    cachedCombinedRaw = fallbackRaw;
    cachedCombinedUser = fallbackUser;
    return cachedCombinedUser;
  }

  // Fallback: parse user identity directly from active token
  const currentToken = getCombinedToken();
  if (currentToken) {
    const userFromToken = parseUserFromToken(currentToken);
    if (userFromToken) {
      const tokenUserRaw = JSON.stringify(userFromToken);
      if (tokenUserRaw === cachedCombinedRaw && cachedCombinedUser !== null) {
        return cachedCombinedUser;
      }
      cachedCombinedRaw = tokenUserRaw;
      cachedCombinedUser = userFromToken;
      return cachedCombinedUser;
    }
  }

  cachedCombinedRaw = null;
  cachedCombinedUser = null;
  return null;
}

function getCombinedToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const yojanaToken = localStorage.getItem(YOJANA_TOKEN_KEY);
    if (yojanaToken) {
      cachedCombinedToken = yojanaToken;
      return cachedCombinedToken;
    }
  } catch {
    // Ignore parse errors
  }

  try {
    const authToken = localStorage.getItem("auth_token");
    if (authToken) {
      cachedCombinedToken = authToken;
      return cachedCombinedToken;
    }
  } catch {
    // Ignore
  }

  cachedCombinedToken = getStoredToken();
  return cachedCombinedToken;
}

// Stable snapshot getters for SSR & hydration
const getServerUserSnapshot = () => null;
const getServerTokenSnapshot = () => null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isActionPending, setIsActionPending] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpenState] = useState<boolean>(false);

  // Synchronize with live Supabase auth session if configured
  useEffect(() => {
    if (!isSupabaseClientConfigured()) return;
    try {
      const client = getSupabase();

      // 1. Initial session sync on mount
      client.auth.getSession().then(({ data: { session }, error }) => {
        if (!error && session?.user && session.access_token) {
          const mappedUser: User = {
            id: session.user.id,
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email?.split("@")[0] ||
              "Citizen",
            email: session.user.email || "",
          };
          const userStr = JSON.stringify(mappedUser);
          try {
            localStorage.setItem(YOJANA_USER_KEY, userStr);
            localStorage.setItem(YOJANA_TOKEN_KEY, session.access_token);
            localStorage.setItem("auth_user", userStr);
            localStorage.setItem("auth_token", session.access_token);
          } catch {
            // Ignore
          }
          cachedCombinedRaw = userStr;
          cachedCombinedUser = mappedUser;
          cachedCombinedToken = session.access_token;
          notifyAuthChanged();
        }
      }).catch((err) => {
        console.warn("[AuthContext] Error getting initial Supabase session:", err);
      });

      // 2. Subscription for live auth changes (login, logout, token refresh)
      const {
        data: { subscription },
      } = client.auth.onAuthStateChange((event, session) => {
        if (session?.user && session.access_token) {
          const mappedUser: User = {
            id: session.user.id,
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email?.split("@")[0] ||
              "Citizen",
            email: session.user.email || "",
          };
          const userStr = JSON.stringify(mappedUser);
          try {
            localStorage.setItem(YOJANA_USER_KEY, userStr);
            localStorage.setItem(YOJANA_TOKEN_KEY, session.access_token);
            localStorage.setItem("auth_user", userStr);
            localStorage.setItem("auth_token", session.access_token);
          } catch {
            // Ignore
          }
          cachedCombinedRaw = userStr;
          cachedCombinedUser = mappedUser;
          cachedCombinedToken = session.access_token;
          notifyAuthChanged();
        } else if (event === "SIGNED_OUT") {
          cachedCombinedRaw = null;
          cachedCombinedUser = null;
          cachedCombinedToken = null;
          clearStoredSession();
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch {
      // Ignore
    }
  }, []);

  // Sync token and user reactively with stable snapshot getters
  const token = useSyncExternalStore(
    subscribeAuth,
    getCombinedToken,
    getServerTokenSnapshot
  );

  const user = useSyncExternalStore(
    subscribeAuth,
    getCombinedUser,
    getServerUserSnapshot
  );

  // Reliable client-side hydration check
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isLoading = !isHydrated || isActionPending;

  // Whenever login is requested programmatically, navigate cleanly to dedicated /login page
  const setLoginOpen = useCallback(
    (open: boolean) => {
      setIsLoginOpenState(open);
      if (open) {
        router.push("/login");
      }
    },
    [router]
  );

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsActionPending(true);
    try {
      const res = await loginApi(credentials);
      if (res.success && res.user && res.token) {
        try {
          const userStr = JSON.stringify(res.user);
          localStorage.setItem(YOJANA_USER_KEY, userStr);
          localStorage.setItem(YOJANA_TOKEN_KEY, res.token);
          cachedCombinedRaw = userStr;
          cachedCombinedUser = res.user;
          cachedCombinedToken = res.token;
        } catch {
          // Ignore storage error
        }
        notifyAuthChanged();
        setIsLoginOpenState(false);
      }
      return res;
    } finally {
      setIsActionPending(false);
    }
  }, []);

  const loginAsDemo = useCallback(async (): Promise<AuthResponse> => {
    setIsActionPending(true);
    try {
      const demoUser: User = {
        id: "usr_citizen_demo",
        name: "Aarav Sharma",
        email: "aarav.sharma@example.com",
      };
      const demoToken = `jwt_citizen_demo_${Date.now()}`;

      setStoredSession(demoToken, demoUser, true);
      try {
        const userStr = JSON.stringify(demoUser);
        localStorage.setItem(YOJANA_USER_KEY, userStr);
        localStorage.setItem(YOJANA_TOKEN_KEY, demoToken);
        cachedCombinedRaw = userStr;
        cachedCombinedUser = demoUser;
        cachedCombinedToken = demoToken;
      } catch {
        // Ignore
      }
      notifyAuthChanged();
      setIsLoginOpenState(false);
      return { success: true, token: demoToken, user: demoUser };
    } finally {
      setIsActionPending(false);
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    setIsActionPending(true);
    try {
      const res = await registerApi(credentials);
      if (res.success && res.user && res.token) {
        try {
          const userStr = JSON.stringify(res.user);
          localStorage.setItem(YOJANA_USER_KEY, userStr);
          localStorage.setItem(YOJANA_TOKEN_KEY, res.token);
          cachedCombinedRaw = userStr;
          cachedCombinedUser = res.user;
          cachedCombinedToken = res.token;
        } catch {
          // Ignore
        }
        notifyAuthChanged();
        setIsLoginOpenState(false);
      }
      return res;
    } finally {
      setIsActionPending(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsActionPending(true);
    try {
      if (isSupabaseClientConfigured()) {
        try {
          const client = getSupabase();
          await client.auth.signOut();
        } catch (err) {
          console.warn("[AuthContext] Supabase signOut error:", err);
        }
      }

      cachedCombinedRaw = null;
      cachedCombinedUser = null;
      cachedCombinedToken = null;

      try {
        localStorage.removeItem(YOJANA_USER_KEY);
        localStorage.removeItem(YOJANA_TOKEN_KEY);
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
      } catch {
        // Ignore
      }

      await logoutApi();
      clearStoredSession();
      notifyAuthChanged();

      if (typeof window !== "undefined") {
        window.location.replace("/login");
      } else {
        router.replace("/login");
      }
    } finally {
      setIsActionPending(false);
    }
  }, [router]);

  const contextValue = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!token,
      isLoginOpen,
      setLoginOpen,
      login,
      loginAsDemo,
      register,
      logout,
    }),
    [user, token, isLoading, isLoginOpen, setLoginOpen, login, loginAsDemo, register, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
