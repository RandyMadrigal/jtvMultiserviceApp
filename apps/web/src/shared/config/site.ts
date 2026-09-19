// URL pública del sitio, sin barra final. Se usa para canonical, og:url y el sitemap.
// Si cambia el dominio, actualizarlo también en: index.html (og:image y JSON-LD),
// public/robots.txt y public/sitemap.xml (son archivos estáticos y no leen esta variable).
const rawUrl =
  (import.meta.env.VITE_SITE_URL as string | undefined) || "https://jtvmultiservice.com";

export const siteConfig = {
  name: "JTV Multiservice",
  url: rawUrl.replace(/\/+$/, ""),
  locale: "es_DO",
  ogImage: "/og-image.jpg",
} as const;
