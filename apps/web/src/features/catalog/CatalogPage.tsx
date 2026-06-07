import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  SlidersHorizontal,
} from "lucide-react";
import { Layout } from "@/shared/components/Layout";
import { PageHeader } from "@/shared/components/PageHeader";
import { api } from "@/shared/lib/api";
import type { Category, PaginatedProducts } from "@/shared/types/api";

type Status = "disponible" | "agotado" | "promocion";

interface Product {
  _id: string;
  name: string;
  description: string;
  category: Category;
  images: Array<{ url: string }>;
  status: Status;
}

const STATUS_STYLES: Record<Status, string> = {
  disponible: "bg-emerald-500/15 text-emerald-700 border border-emerald-500/20",
  agotado: "bg-muted text-muted-foreground border border-border",
  promocion: "bg-[#C1007E]/12 text-[#C1007E] border border-[#C1007E]/20",
};
const STATUS_LABEL: Record<Status, string> = {
  disponible: "Disponible",
  agotado: "Agotado",
  promocion: "Promoción",
};

const PAGE_SIZE = 12;

// ── Image Modal ────────────────────────────────────────────────────────────────
interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

function ImageModal({ src, alt, onClose }: ImageModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Vista ampliada: ${alt}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-sm"
      style={{ animation: "fadeIn 0.15s ease" }}
      onClick={onClose}
    >
      <div
        className="relative inline-flex max-w-[calc(100vw-2rem)] sm:max-w-5xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "scaleIn 0.15s ease" }}
      >
        <img
          src={src}
          alt={alt}
          className="block max-h-[82vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
        />
        <button
          onClick={onClose}
          aria-label="Cerrar imagen"
          className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg transition hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { transform: scale(0.94); opacity: 0 } to { transform: scale(1); opacity: 1 } }
      `}</style>
    </div>,
    document.body
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function CatalogPage() {
  const [result, setResult] = useState<PaginatedProducts | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("");
  const [q, setQ] = useState("");
  const [inputQ, setInputQ] = useState("");
  const [page, setPage] = useState(1);
  const [modalImage, setModalImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchProducts = useCallback(
    async (search: string, category: string, currentPage: number) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(PAGE_SIZE),
          ...(search && { search }),
          ...(category && { category }),
        });
        const { data } = await api.get<PaginatedProducts>(
          `/products?${params}`,
        );
        setResult(data);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    api
      .get<Category[]>("/categories", { signal: controller.signal })
      .then(({ data }) => setCategories(data))
      .catch((err) => { if (!axios.isCancel(err)) setCategories([]); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(q, cat, page);
    return () => controller.abort();
  }, [q, cat, page, fetchProducts]);

  // Cleanup pending debounce on unmount
  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const handleSearch = (value: string) => {
    setInputQ(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQ(value);
      setPage(1);
    }, 400);
  };

  const handleCatChange = (categoryId: string) => {
    setCat(categoryId);
    setPage(1);
  };

  const products = result?.items ?? [];
  const totalPages = result?.totalPages ?? 1;
  const total = result?.total ?? 0;

  return (
    <Layout>
      {modalImage && (
        <ImageModal
          src={modalImage.src}
          alt={modalImage.alt}
          onClose={() => setModalImage(null)}
        />
      )}

      {/* ── Page Header ────────────────────────────────────────────────── */}
      <PageHeader
        eyebrow="Nuestros productos"
        title="Catálogo"
        subtitle="Descubre todo lo que podemos imprimir para ti. Filtra por categoría o busca por nombre."
      />

      {/* ── Search + Filters ────────────────────────────────────────────── */}
      <section className="border-b border-border bg-secondary/50 px-4 pb-6 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="pt-6 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-300 fill-mode-both">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              {/* Search input */}
              <div className="relative w-full max-w-sm">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={inputQ}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Buscar producto…"
                  aria-label="Buscar producto"
                  className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3.5 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                />
              </div>

              {/* Filter count indicator */}
              {(cat || q) && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  {total} resultado{total !== 1 ? "s" : ""}
                  <button
                    onClick={() => {
                      handleSearch("");
                      handleCatChange("");
                    }}
                    className="ml-1 flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs font-medium transition hover:border-primary/40 hover:text-primary"
                  >
                    <X className="h-3 w-3" /> Limpiar
                  </button>
                </div>
              )}
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCatChange("")}
                aria-pressed={cat === ""}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                  cat === ""
                    ? "border-primary bg-gradient-brand text-white shadow-glass"
                    : "border-border bg-card hover:border-primary/40 hover:text-primary"
                }`}
              >
                Todos
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  onClick={() => handleCatChange(c._id)}
                  aria-pressed={cat === c._id}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                    cat === c._id
                      ? "border-primary bg-gradient-brand text-white shadow-glass"
                      : "border-border bg-card hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Grid ────────────────────────────────────────────────── */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {loading ? (
            <div className="flex h-60 items-center justify-center">
              <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-border border-t-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-24 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-secondary text-muted-foreground">
                <Search className="h-7 w-7" />
              </div>
              <p className="text-muted-foreground">
                {total === 0 && !q && !cat
                  ? "El catálogo está vacío por el momento."
                  : "No encontramos productos para tu búsqueda."}
              </p>
              {(q || cat) && (
                <button
                  onClick={() => {
                    handleSearch("");
                    handleCatChange("");
                  }}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                  <article
                    key={p._id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elegant"
                  >
                    {/* Image */}
                    <div className="relative aspect-4/3 overflow-hidden bg-secondary">
                      <img
                        src={p.images[0]?.url ?? "/placeholder.jpg"}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Status badge */}
                      <span
                        className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm ${STATUS_STYLES[p.status]}`}
                      >
                        {STATUS_LABEL[p.status]}
                      </span>

                      {/* Zoom overlay */}
                      {p.images[0]?.url && (
                        <button
                          onClick={() =>
                            setModalImage({ src: p.images[0].url, alt: p.name })
                          }
                          aria-label={`Ver imagen de ${p.name}`}
                          className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30"
                        >
                          <span className="flex h-11 w-11 scale-75 items-center justify-center rounded-full bg-white/90 text-gray-900 opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                            <ZoomIn className="h-5 w-5" />
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                        {p.category?.name}
                      </p>
                      <h3 className="mt-1.5 font-bold font-display text-base">
                        {p.name}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {p.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-xl border border-border p-2 text-muted-foreground transition hover:border-primary/40 hover:bg-accent hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                    )
                    .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                        acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "..." ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="px-2 text-muted-foreground"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setPage(item as number)}
                          className={`min-w-9 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                            page === item
                              ? "bg-gradient-brand text-white shadow-glass"
                              : "border border-border bg-card hover:border-primary/40 hover:text-primary"
                          }`}
                        >
                          {item}
                        </button>
                      ),
                    )}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-xl border border-border p-2 text-muted-foreground transition hover:border-primary/40 hover:bg-accent hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
