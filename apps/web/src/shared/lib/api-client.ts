import axios from "axios";
import { apiBase } from "@/shared/config/env";

// Token guardado en memoria del módulo — invisible para XSS
let accessToken: string | null = null;

// Promise compartida entre requests concurrentes que fallen con 401
// Evita múltiples llamadas paralelas al endpoint de refresh
let refreshPromise: Promise<string> | null = null;

export function setToken(token: string | null): void {
  accessToken = token;
}

export const apiClient = axios.create({
  baseURL: apiBase,
  withCredentials: true, // envía la cookie del refresh token
});

// Añade el access token a cada petición
apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Si recibe 401 intenta renovar el access token una sola vez.
// Múltiples requests concurrentes comparten el mismo refresh promise.
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config as typeof error.config & { _retry?: boolean };

    if (error.response?.status !== 401 || config._retry) {
      return Promise.reject(error);
    }

    config._retry = true;

    if (!refreshPromise) {
      refreshPromise = axios
        .post<{ accessToken: string }>(
          "/api/auth/refresh",
          {},
          { withCredentials: true },
        )
        .then(({ data }) => {
          setToken(data.accessToken);
          return data.accessToken;
        })
        .catch((err) => {
          setToken(null);
          window.location.href = "/admin/login";
          return Promise.reject(err);
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    try {
      const newToken = await refreshPromise;
      config.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(config);
    } catch {
      return Promise.reject(error);
    }
  },
);
