import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/shared/lib/api-client";
import { extractError } from "@/shared/lib/extractError";

interface Category {
  _id: string;
  name: string;
  createdBy?: { _id: string; email: string } | null;
}

export function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get<Category[]>("/categories");
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setName("");
    setError("");
    setEditingId(null);
    setCreating(true);
  };

  const openEdit = (c: Category) => {
    setName(c.name);
    setError("");
    setCreating(false);
    setEditingId(c._id);
  };

  const cancel = () => {
    setCreating(false);
    setEditingId(null);
    setError("");
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("El nombre es requerido");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      if (editingId) {
        await apiClient.put(`/categories/${editingId}`, { name });
        toast.success("Categoría actualizada");
      } else {
        await apiClient.post("/categories", { name });
        toast.success("Categoría creada");
      }
      cancel();
      await load();
    } catch (err: unknown) {
      setError(extractError(err, "Error al guardar la categoría"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`¿Eliminar la categoría "${catName}"?`)) return;
    try {
      await apiClient.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success("Categoría eliminada");
    } catch (err: unknown) {
      toast.error(extractError(err, "Error al eliminar la categoría"));
    }
  };

  const InlineForm = () => (
    <tr className="bg-primary/5">
      <td className="px-4 py-3" colSpan={2}>
        <div className="space-y-2">
          <input
            autoFocus
            placeholder="Nombre de la categoría *"
            value={name}
            maxLength={80}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          <button
            onClick={cancel}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            onClick={handleSave}
            disabled={submitting}
            className="rounded-md p-1.5 text-primary hover:bg-primary/10 disabled:opacity-40"
          >
            <Check className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categorías</h1>
          <p className="text-sm text-muted-foreground">
            {categories.length} categoría(s) creada(s)
          </p>
        </div>
        <button
          onClick={openCreate}
          disabled={creating || !!editingId}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Nueva categoría
        </button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Creado por</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {creating && <InlineForm />}
              {categories.length === 0 && !creating ? (
                <tr>
                  <td
                    colSpan={3}
                    className="py-16 text-center text-muted-foreground"
                  >
                    No hay categorías. Crea la primera.
                  </td>
                </tr>
              ) : (
                categories.map((c) =>
                  editingId === c._id ? (
                    <InlineForm key={c._id} />
                  ) : (
                    <tr key={c._id} className="hover:bg-secondary/20">
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <UserCircle className="h-3.5 w-3.5 shrink-0" />
                          {c.createdBy?.email ? (
                            c.createdBy.email.split("@")[0]
                          ) : (
                            <span className="italic">Admin</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(c)}
                            disabled={creating || !!editingId}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(c._id, c.name)}
                            disabled={creating || !!editingId}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
