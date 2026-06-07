const _whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined;
const _apiUrl   = import.meta.env.VITE_API_URL         as string | undefined;

if (import.meta.env.DEV) {
  if (!_whatsapp) console.warn("[env] VITE_WHATSAPP_NUMBER no está definido — el botón de WhatsApp no funcionará");
  if (!_apiUrl)   console.warn("[env] VITE_API_URL no está definido — usando proxy de Vite (/api)");
}

export const clientEnv = {
  whatsappNumber: _whatsapp ?? "",
  apiUrl:         _apiUrl   ?? "",
} as const;

// Base URL para todas las llamadas a la API.
// Dev:  VITE_API_URL no definido → "" → Vite proxea /api/* a localhost:3000
// Prod: VITE_API_URL=https://api.jtvmultiservice.com → se antepone a /api/*
export const apiBase = clientEnv.apiUrl ? `${clientEnv.apiUrl}/api` : "/api";
