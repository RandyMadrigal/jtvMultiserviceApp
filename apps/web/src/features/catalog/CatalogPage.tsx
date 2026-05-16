import { useEffect, useState, useCallback, useRef } from "react";
import { Search, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Layout } from "@/shared/components/Layout";
import { api } from "@/shared/lib/api";

type Status = "disponible" | "agotado" | "promocion";

interface Category {
  _id: string;
  name: string;
}
interface Product {
  _id: string;
  name: string;
  description: string;
  category: Category;
  images: Array<{ url: string }>;
  status: Status;
}
interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const STATUS_STYLES: Record<Status, string> = {
  disponible: "bg-success/15 text-black",
  agotado: "bg-muted text-muted-foreground",
  promocion: "bg-primary/15 text-primary",
};
const STATUS_LABEL: Record<Status, string> = {
  disponible: "Disponible",
  agotado: "Agotado",
  promocion: "Promoción",
};

const PAGE_SIZE = 12;

// ── Modal de imagen ───────────────────────────────────────────────────────────
interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

function ImageModal({ src, alt, onClose }: ImageModalProps) {
  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Evitar scroll del body mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Vista ampliada: ${alt}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      style={{ animation: "fadeIn 0.15s ease" }}
      onClick={onClose}
    >
      {/* Contenedor de imagen — detiene propagación para no cerrar al hacer click en la imagen */}
      <div
        className="relative max-h-[90vh] max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl"
          style={{ animation: "scaleIn 0.15s ease" }}
        />
        <button
          onClick={onClose}
          aria-label="Cerrar imagen"
          className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background text-foreground shadow-lg transition hover:bg-secondary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { transform: scale(0.93); opacity: 0 } to { transform: scale(1); opacity: 1 } }
      `}</style>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
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
    api.get<Category[]>("/categories").then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    fetchProducts(q, cat, page);
  }, [q, cat, page, fetchProducts]);

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
      {/* Modal de imagen ampliada */}
      {modalImage && (
        <ImageModal
          src={modalImage.src}
          alt={modalImage.alt}
          onClose={() => setModalImage(null)}
        />
      )}

      <section className="border-b border-border bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="text-4xl font-bold md:text-5xl">Catálogo</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Descubre todo lo que podemos imprimir para ti. Filtra por categoría
            o busca por nombre.
          </p>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={inputQ}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar producto…"
                className="w-full rounded-md border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none ring-ring/50 focus:ring-2"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => handleCatChange("")}
              className={
                "rounded-full border px-4 py-1.5 text-sm font-medium transition " +
                (cat === ""
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:border-primary/40 hover:text-primary")
              }
            >
              Todos
            </button>
            {categories.map((c) => (
              <button
                key={c._id}
                onClick={() => handleCatChange(c._id)}
                className={
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition " +
                  (cat === c._id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary/40 hover:text-primary")
                }
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : products.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">
              {total === 0 && !q && !cat
                ? "El catálogo está vacío por el momento."
                : "No encontramos productos para tu búsqueda."}
            </p>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                  <article
                    key={p._id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
                  >
                    {/* Imagen — clickeable para abrir modal */}
                    <div className="relative aspect-4/3 overflow-hidden bg-secondary">
                      <img
                        src={p.images[0]?.url ?? ""}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span
                        className={
                          "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider " +
                          STATUS_STYLES[p.status]
                        }
                      >
                        {STATUS_LABEL[p.status]}
                      </span>

                      {/* Overlay de zoom — solo visible si hay imagen */}
                      {p.images[0]?.url && (
                        <button
                          onClick={() =>
                            setModalImage({ src: p.images[0].url, alt: p.name })
                          }
                          aria-label={`Ver imagen de ${p.name}`}
                          className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/30"
                        >
                          <span className="flex h-10 w-10 scale-75 items-center justify-center rounded-full bg-white/90 text-foreground opacity-0 shadow-lg transition duration-300 group-hover:scale-100 group-hover:opacity-100">
                            <ZoomIn className="h-5 w-5" />
                          </span>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {p.category?.name}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold">{p.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {p.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-md p-2 text-muted-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-5 w-5" />
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
                          className="px-1 text-muted-foreground"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setPage(item as number)}
                          className={
                            "min-w-8 rounded-md px-3 py-1.5 text-sm font-medium transition " +
                            (page === item
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-secondary text-foreground")
                          }
                        >
                          {item}
                        </button>
                      ),
                    )}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-md p-2 text-muted-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight className="h-5 w-5" />
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
