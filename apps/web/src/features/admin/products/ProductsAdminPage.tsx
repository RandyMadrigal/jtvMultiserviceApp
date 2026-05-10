import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ImageOff, Tag, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { apiClient } from "../lib/api-client";
import { ProductForm, type Product } from "./ProductForm";

interface Category { _id: string; name: string; }

const STATUS_LABEL: Record<string, string> = {
  disponible: "Disponible",
  agotado:    "Agotado",
  promocion:  "Promoción",
};
const STATUS_CLASS: Record<string, string> = {
  disponible: "bg-green-100 text-green-700",
  agotado:    "bg-muted text-muted-foreground",
  promocion:  "bg-primary/10 text-primary",
};

export function ProductsAdminPage() {
  const [products, setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]     = useState(true);
  const [editing, setEditing]     = useState<Product | undefined>();
  const [creating, setCreating]   = useState(false);
  const [deleting, setDeleting]   = useState<string | null>(null);

  const hasCategories = categories.length > 0;

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: prods }, { data: cats }] = await Promise.all([
        apiClient.get<Product[]>("/products"),
        apiClient.get<Category[]>("/categories"),
      ]);
      setProducts(prods);
      setCategories(cats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
    setDeleting(id);
    try {
      await apiClient.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Error al eliminar el producto");
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
          <p className="text-sm text-muted-foreground">{products.length} productos en catálogo</p>
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
            title={!hasCategories ? "Debes crear al menos una categoría antes de agregar productos" : undefined}
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
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Imagen</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Creado por</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-muted-foreground">
                    No hay productos. Crea el primero.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-secondary/20">
                    <td className="px-4 py-3">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name}
                          className="h-10 w-10 rounded-md object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                          <ImageOff className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{p.name}</p>
                      {p.description && (
                        <p className="line-clamp-1 text-xs text-muted-foreground">{p.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.category?.name}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASS[p.status]}`}>
                        {STATUS_LABEL[p.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <UserCircle className="h-3.5 w-3.5 shrink-0" />
                        {p.createdBy?.email
                          ? p.createdBy.email.split("@")[0]
                          : <span className="italic">sistema</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditing(p)}
                          className="rounded-md p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          disabled={deleting === p._id}
                          className="rounded-md p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {creating && (
        <ProductForm
          onSuccess={() => { setCreating(false); load(); }}
          onClose={() => setCreating(false)}
        />
      )}
      {editing && (
        <ProductForm
          product={editing}
          onSuccess={() => { setEditing(undefined); load(); }}
          onClose={() => setEditing(undefined)}
        />
      )}
    </div>
  );
}
