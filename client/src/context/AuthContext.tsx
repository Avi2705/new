import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { User, AuthContextType } from "../types";
import { getUserProfile, getVendorProfile } from "../api";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem("refreshToken"));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  });

  const [role, setRole] = useState<"user" | "vendor" | null>(() => {
    const raw = localStorage.getItem("role");
    return raw === "user" || raw === "vendor" ? raw : null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    return Boolean(localStorage.getItem("token") || localStorage.getItem("refreshToken"));
  });

  const [networkError, setNetworkError] = useState<string | null>(null);

  const verifySession = useCallback(async () => {
    const storedToken = localStorage.getItem("token");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedRole = localStorage.getItem("role");

    if ((!storedToken && !storedRefreshToken) || !storedRole) {
      setIsLoading(false);
      setNetworkError(null);
      return;
    }

    try {
      if (storedRole === "vendor") {
        const res = await getVendorProfile();
        if (res.vendor) {
          setUser(res.vendor);
          localStorage.setItem("user", JSON.stringify(res.vendor));
        }
      } else {
        const res = await getUserProfile();
        if (res.user) {
          setUser(res.user);
          localStorage.setItem("user", JSON.stringify(res.user));
        }
      }
      setNetworkError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      const isAuthError =
        msg.toLowerCase().includes("jwt") ||
        msg.toLowerCase().includes("unauthorized") ||
        msg.toLowerCase().includes("invalid token") ||
        msg.toLowerCase().includes("token expired") ||
        msg.toLowerCase().includes("forbidden");

      if (isAuthError) {
        logout();
      } else {
        setNetworkError("Cannot reach server. Running with cached credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  function login(t: string, u: User, r: "user" | "vendor", rf?: string) {
    setToken(t);
    setUser(u);
    setRole(r);
    setNetworkError(null);
    setIsLoading(false);
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("role", r);
    if (rf) {
      setRefreshToken(rf);
      localStorage.setItem("refreshToken", rf);
    }
  }

  function logout() {
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setRole(null);
    setNetworkError(null);
    setIsLoading(false);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        user,
        role,
        isLoading,
        networkError,
        login,
        logout,
        retrySession: verifySession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
