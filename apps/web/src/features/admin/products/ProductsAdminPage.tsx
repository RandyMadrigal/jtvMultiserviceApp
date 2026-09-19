import { useEffect, useState, useCallback } from "react";
import { Plus, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { apiClient } from "@/shared/lib/api-client";
import { extractError } from "@/shared/lib/extractError";
import { AdminPagination } from "../components/AdminPagination";
import { ProductForm, type Product } from "./ProductForm";
import { ProductsTable } from "./ProductsTable";

interface Category {
  _id: string;
  name: string;
}
interface PaginatedProducts {
  items: Product[];
  total: number;
  totalPages: number;
  page: number;
}

const PAGE_SIZE = 15;

export function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | undefined>();
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const hasCategories = categories.length > 0;

  const load = useCallback(async (targetPage: number) => {
    setLoading(true);
    try {
      const [{ data: paginated }, { data: cats }] = await Promise.all([
        apiClient.get<PaginatedProducts>(`/products?limit=${PAGE_SIZE}&page=${targetPage}`),
        apiClient.get<Category[]>("/categories"),
      ]);
      setProducts(paginated.items);
      setCategories(cats);
      setTotal(paginated.total);
      setTotalPages(paginated.totalPages);
      setPage(targetPage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(1);
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
    setDeleting(id);
    try {
      await apiClient.delete(`/products/${id}`);
      toast.success("Producto eliminado");
      const nextPage = products.length === 1 && page > 1 ? page - 1 : page;
      await load(nextPage);
    } catch (err) {
      toast.error(extractError(err, "Error al eliminar el producto"));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Cargando…" : `${total} productos en catálogo`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!loading && !hasCategories && (
            <p className="flex items-center gap-1.5 text-xs text-amber-600">
              <Tag className="h-3.5 w-3.5" />
              Crea al menos una{" "}
              <Link to="/admin/categories" className="font-semibold underline underline-offset-2">
                categoría
              </Link>{" "}
              primero
            </p>
          )}
          <button
            onClick={() => setCreating(true)}
            disabled={!hasCategories}
            title={
              !hasCategories
                ? "Debes crear al menos una categoría antes de agregar productos"
                : undefined
            }
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-4 w-4" /> Nuevo producto
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          <ProductsTable
            products={products}
            deleting={deleting}
            onEdit={setEditing}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          <AdminPagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            onPageChange={load}
          />
        </>
      )}

      {/* Modals */}
      {creating && (
        <ProductForm
          categories={categories}
          onSuccess={() => {
            setCreating(false);
            load(page);
          }}
          onClose={() => setCreating(false)}
        />
      )}
      {editing && (
        <ProductForm
          categories={categories}
          product={editing}
          onSuccess={() => {
            setEditing(undefined);
            load(page);
          }}
          onClose={() => setEditing(undefined)}
        />
      )}
    </div>
  );
}
