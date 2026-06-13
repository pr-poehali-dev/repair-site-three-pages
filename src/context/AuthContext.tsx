import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, AUTH_URL, getToken, setToken, clearToken, User } from "@/lib/api";

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (data: { email: string; password: string; full_name: string; phone: string }) => Promise<string | null>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    const { ok, data } = await api<{ user: User }>(AUTH_URL, "me", "GET");
    setUser(ok ? data.user : null);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    const { ok, data } = await api<{ token: string; user: User; error?: string }>(
      AUTH_URL,
      "login",
      "POST",
      { email, password }
    );
    if (ok && data.token) {
      setToken(data.token);
      setUser(data.user);
      return null;
    }
    return data.error || "Ошибка входа";
  };

  const register = async (d: { email: string; password: string; full_name: string; phone: string }): Promise<string | null> => {
    const { ok, data } = await api<{ token: string; user: User; error?: string }>(
      AUTH_URL,
      "register",
      "POST",
      d
    );
    if (ok && data.token) {
      setToken(data.token);
      setUser(data.user);
      return null;
    }
    return data.error || "Ошибка регистрации";
  };

  const logout = () => {
    api(AUTH_URL, "logout", "POST").catch(() => {});
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
