import { Pencil, Trash2, ImageOff, UserCircle } from "lucide-react";
import type { Product } from "./ProductForm";

const STATUS_LABEL: Record<string, string> = {
  disponible: "Disponible",
  agotado: "Agotado",
  promocion: "Promoción",
};
const STATUS_CLASS: Record<string, string> = {
  disponible: "bg-green-100 text-green-700",
  agotado: "bg-muted text-muted-foreground",
  promocion: "bg-primary/10 text-primary",
};

interface ProductsTableProps {
  products: Product[];
  deleting: string | null;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductsTable({ products, deleting, onEdit, onDelete }: ProductsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-secondary/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left">Imagen</th>
            <th className="px-4 py-3 text-left">Nombre</th>
            <th className="hidden md:table-cell px-4 py-3 text-left">Categoría</th>
            <th className="hidden sm:table-cell px-4 py-3 text-left">Estado</th>
            <th className="hidden lg:table-cell px-4 py-3 text-left">Creado por</th>
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
                  {p.images?.[0]?.url ? (
                    <img
                      src={p.images[0].url}
                      alt={p.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
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
                  {/* Categoría + estado visible solo en mobile dentro del nombre */}
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 md:hidden">
                    {p.category?.name && (
                      <span className="text-xs text-muted-foreground">{p.category.name}</span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold sm:hidden ${STATUS_CLASS[p.status]}`}
                    >
                      {STATUS_LABEL[p.status]}
                    </span>
                  </div>
                </td>
                <td className="hidden md:table-cell px-4 py-3 text-muted-foreground">
                  {p.category?.name}
                </td>
                <td className="hidden sm:table-cell px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASS[p.status]}`}
                  >
                    {STATUS_LABEL[p.status]}
                  </span>
                </td>
                <td className="hidden lg:table-cell px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <UserCircle className="h-3.5 w-3.5 shrink-0" />
                    {p.createdBy?.email ? (
                      p.createdBy.email.split("@")[0]
                    ) : (
                      <span className="italic">sistema</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(p)}
                      className="rounded-md p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(p._id)}
                      disabled={deleting === p._id}
                      className="rounded-md p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                      aria-label="Eliminar"
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
  );
}
