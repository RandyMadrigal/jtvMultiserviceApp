import { useEffect, useState } from "react";
import { Plus, ShieldCheck, Trash2 } from "lucide-react";
import { apiClient } from "../lib/api-client";
import { CreateAdminModal } from "./CreateAdminModal";

interface Admin {
  _id: string;
  email: string;
  createdAt: string;
  isRoot?: boolean;
}

export function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get<Admin[]>("/admin");
      setAdmins(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await apiClient.delete(`/admin/${confirmDeleteId}`);
      setConfirmDeleteId(null);
      load();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        "Error al eliminar el administrador";
      setDeleteError(msg);
    } finally {
      setDeleting(false);
    }
  };

  const adminToDelete = admins.find((a) => a._id === confirmDeleteId);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Administradores</h1>
          <p className="text-sm text-muted-foreground">
            {admins.length} cuenta{admins.length !== 1 ? "s" : ""} registrada
            {admins.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Nuevo administrador
        </button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Administrador</th>
                <th className="px-4 py-3 text-left">Correo</th>
                <th className="px-4 py-3 text-left">Registrado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {admins.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-16 text-center text-muted-foreground"
                  >
                    No hay administradores registrados.
                  </td>
                </tr>
              ) : (
                admins.map((a) => (
                  <tr key={a._id} className="hover:bg-secondary/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        <span className="font-medium">
                          {a.email.split("@")[0]}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {a.email}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(a.createdAt).toLocaleDateString("es", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!a.isRoot && (
                        <button
                          onClick={() => {
                            setDeleteError(null);
                            setConfirmDeleteId(a._id);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {creating && (
        <CreateAdminModal
          onSuccess={() => {
            setCreating(false);
            load();
          }}
          onClose={() => setCreating(false)}
        />
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl">
            <h2 className="mb-1 text-lg font-semibold">Eliminar administrador</h2>
            <p className="mb-5 text-sm text-muted-foreground">
              ¿Estás seguro de que quieres eliminar a{" "}
              <span className="font-medium text-foreground">
                {adminToDelete?.email}
              </span>
              ? Esta acción no se puede deshacer.
            </p>

            {deleteError && (
              <p className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {deleteError}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                disabled={deleting}
                className="rounded-md px-4 py-2 text-sm font-medium transition hover:bg-secondary disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {deleting ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-destructive-foreground border-t-transparent" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
