import axios from "axios";

// Token guardado en memoria del módulo — invisible para XSS
let accessToken: string | null = null;

export function setToken(token: string | null): void {
  accessToken = token;
}

export const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true, // envía la cookie del refresh token
});

// Añade el access token a cada petición
apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Si recibe 401 intenta renovar el access token una sola vez
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config as typeof error.config & { _retry?: boolean };

    if (error.response?.status === 401 && !config._retry) {
      config._retry = true;
      try {
        const { data } = await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true },
        );
        setToken(data.accessToken);
        config.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(config);
      } catch {
        setToken(null);
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  },
);
