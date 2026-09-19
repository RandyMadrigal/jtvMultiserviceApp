import { useEffect } from "react";
import { siteConfig } from "@/shared/config/site";

interface SeoProps {
  /** Título de la página. Se le añade el sufijo " | JTV Multiservice" salvo con `fullTitle`. */
  title: string;
  description: string;
  /** Ruta canónica ("/catalogo"). Omitir en páginas `noindex`. */
  path?: string;
  /** Excluye la página de los buscadores (admin, 404). */
  noindex?: boolean;
  /** Usa `title` tal cual, sin el sufijo de marca (p. ej. el inicio). */
  fullTitle?: boolean;
}

// Actualiza las etiquetas que ya existen en index.html (o las crea) en lugar de renderizar
// <title>/<meta> nuevos: con React 19 los hoisted se añadirían junto a los estáticos y los
// navegadores usan el primer <title> del documento, así que ganaría el del index.html.
function upsertMeta(attr: "name" | "property", key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function removeMeta(attr: "name" | "property", key: string): void {
  document.head.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

function setCanonical(href: string | null): void {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    link?.remove();
    return;
  }
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

export function Seo({ title, description, path, noindex = false, fullTitle = false }: SeoProps) {
  useEffect(() => {
    const finalTitle = fullTitle ? title : `${title} | ${siteConfig.name}`;
    const url = path !== undefined && !noindex ? `${siteConfig.url}${path}` : null;

    document.title = finalTitle;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", finalTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("name", "twitter:title", finalTitle);
    upsertMeta("name", "twitter:description", description);

    setCanonical(url);
    if (url) upsertMeta("property", "og:url", url);
    else removeMeta("property", "og:url");

    if (noindex) upsertMeta("name", "robots", "noindex, nofollow");
    else removeMeta("name", "robots");
  }, [title, description, path, noindex, fullTitle]);

  return null;
}
