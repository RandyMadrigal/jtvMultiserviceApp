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

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading]             = useState(true);

  // Al montar: intenta renovar la sesión con la cookie existente
  useEffect(() => {
    axios
      .post(`${apiBase}/auth/refresh`, {}, { withCredentials: true })
      .then(({ data }) => {
        setToken(data.accessToken);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setToken(null);
        setIsAuthenticated(false);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await apiClient.post("/auth/login", { email, password });
    setToken(data.accessToken);
    setIsAuthenticated(true);
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    const { data } = await apiClient.post("/auth/verify-otp", { email, otp });
    setToken(data.accessToken);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      setToken(null);
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
