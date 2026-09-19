import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import { Layout } from "@/shared/components/Layout";
import { PageHeader } from "@/shared/components/PageHeader";
import { api } from "@/shared/lib/api";
import type { Category, PaginatedProducts } from "@/shared/types/api";
import { PAGE_SIZE } from "./catalog.constants";
import { ImageModal } from "./ImageModal";
import { CatalogFilters } from "./CatalogFilters";
import { ProductCard } from "./ProductCard";
import { CatalogPagination } from "./CatalogPagination";

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
        const { data } = await api.get<PaginatedProducts>(`/products?${params}`);
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
      .catch((err) => {
        if (!axios.isCancel(err)) setCategories([]);
      });
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
        <ImageModal src={modalImage.src} alt={modalImage.alt} onClose={() => setModalImage(null)} />
      )}

      {/* ── Page Header ────────────────────────────────────────────────── */}
      <PageHeader
        eyebrow="Nuestros productos"
        title="Catálogo"
        subtitle="Descubre todo lo que podemos imprimir para ti. Filtra por categoría o busca por nombre."
      />

      <CatalogFilters
        inputQ={inputQ}
        q={q}
        cat={cat}
        total={total}
        categories={categories}
        onSearch={handleSearch}
        onCategoryChange={handleCatChange}
      />

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
                  <ProductCard key={p._id} product={p} onZoom={setModalImage} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <CatalogPagination page={page} totalPages={totalPages} onPageChange={setPage} />
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
