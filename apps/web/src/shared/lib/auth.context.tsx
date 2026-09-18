import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import axios from "axios";
import { apiClient, setToken } from "./api-client";
import { apiBase } from "@/shared/config/env";

interface AuthUser {
  email: string;
  isRoot: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

let initialRefresh: Promise<{ data: { accessToken: string } }> | null = null;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading]             = useState(true);
  const [user, setUser]                       = useState<AuthUser | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await apiClient.get<AuthUser>("/auth/me");
      setUser({ email: data.email, isRoot: data.isRoot });
    } catch {
      setUser(null);
    }
  }, []);

  // Al montar: intenta renovar la sesión con la cookie existente
  useEffect(() => {
    // El refresh token es de un solo uso: StrictMode ejecuta este efecto dos veces en dev,
    // así que ambas ejecuciones comparten la misma petición en vez de enviar dos.
    initialRefresh ??= axios
      .post<{ accessToken: string }>(`${apiBase}/auth/refresh`, {}, { withCredentials: true })
      .finally(() => {
        initialRefresh = null;
      });

    initialRefresh
      .then(async ({ data }) => {
        setToken(data.accessToken);
        setIsAuthenticated(true);
        await fetchUser();
      })
      .catch(() => {
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, [fetchUser]);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await apiClient.post("/auth/login", { email, password });
    setToken(data.accessToken);
    setIsAuthenticated(true);
    await fetchUser();
  }, [fetchUser]);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    const { data } = await apiClient.post("/auth/verify-otp", { email, otp });
    setToken(data.accessToken);
    setIsAuthenticated(true);
    await fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      setToken(null);
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
