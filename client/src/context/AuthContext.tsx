import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, getErrorMessage } from "../lib/api";
import type { ApiResponse, User, UserRole } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  booting: boolean;
  login(email: string, password: string): Promise<void>;
  register(name: string, email: string, password: string, role: UserRole): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("smart-leads-token"));
  const [booting, setBooting] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setBooting(false);
      return;
    }

    api
      .get<ApiResponse<{ user: User }>>("/auth/me")
      .then((response) => setUser(response.data.data.user))
      .catch(() => {
        localStorage.removeItem("smart-leads-token");
        setToken(null);
      })
      .finally(() => setBooting(false));
  }, [token]);

  const persistSession = (nextUser: User, nextToken: string) => {
    localStorage.setItem("smart-leads-token", nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      booting,
      async login(email, password) {
        try {
          const response = await api.post<ApiResponse<{ user: User; token: string }>>("api/auth/login", { email, password });
          persistSession(response.data.data.user, response.data.data.token);
        } catch (error) {
          throw new Error(getErrorMessage(error));
        }
      },
      async register(name, email, password, role) {
        try {
          const response = await api.post<ApiResponse<{ user: User; token: string }>>("api/auth/register", {
            name,
            email,
            password,
            role
          });
          persistSession(response.data.data.user, response.data.data.token);
        } catch (error) {
          throw new Error(getErrorMessage(error));
        }
      },
      logout() {
        localStorage.removeItem("smart-leads-token");
        setToken(null);
        setUser(null);
      }
    }),
    [booting, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
