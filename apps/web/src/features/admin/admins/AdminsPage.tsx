import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  ShieldCheck,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MailWarning,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/shared/lib/api-client";
import { extractError } from "@/shared/lib/extractError";
import { CreateAdminModal } from "./CreateAdminModal";

interface Admin {
  _id: string;
  email: string;
  createdAt: string;
  isRoot?: boolean;
  verified?: boolean;
}

interface PaginatedAdmins {
  items: Admin[];
  total: number;
  page: number;
  totalPages: number;
}

const PAGE_SIZE = 10;

export function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [resendingId, setResendingId] = useState<string | null>(null);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const load = useCallback(async (targetPage: number) => {
    setLoading(true);
    try {
      const { data } = await apiClient.get<PaginatedAdmins>(
        `/admin?page=${targetPage}&limit=${PAGE_SIZE}`,
      );
      setAdmins(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setPage(targetPage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(1);
  }, [load]);

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await apiClient.delete(`/admin/${confirmDeleteId}`);
      toast.success("Administrador eliminado");
      setConfirmDeleteId(null);
      const nextPage = admins.length === 1 && page > 1 ? page - 1 : page;
      load(nextPage);
    } catch (err) {
      setDeleteError(extractError(err, "Error al eliminar el administrador"));
    } finally {
      setDeleting(false);
    }
  };

  const handleResendOtp = async (adminId: string, email: string) => {
    setResendingId(adminId);
    try {
      await apiClient.post(`/admin/${adminId}/resend-otp`);
      toast.success(`Código reenviado a ${email}`);
    } catch (err) {
      toast.error(extractError(err, "No se pudo reenviar el código"));
    } finally {
      setResendingId(null);
    }
  };

  const adminToDelete = admins.find((a) => a._id === confirmDeleteId);
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Administradores</h1>
          <p className="text-sm text-muted-foreground">
            {loading
              ? "Cargando…"
              : `${total} cuenta${total !== 1 ? "s" : ""} registrada${total !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Nuevo administrador
        </button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Administrador</th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left">Correo</th>
                  <th className="hidden md:table-cell px-4 py-3 text-left">Registrado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-muted-foreground">
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
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{a.email.split("@")[0]}</span>
                              {!a.verified && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                                  <MailWarning className="h-3 w-3" />
                                  Pendiente
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground sm:hidden">{a.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3 text-muted-foreground">
                        {a.email}
                      </td>
                      <td className="hidden md:table-cell px-4 py-3 text-muted-foreground">
                        {new Date(a.createdAt).toLocaleDateString("es", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!a.verified && !a.isRoot && (
                            <button
                              onClick={() => handleResendOtp(a._id, a.email)}
                              disabled={resendingId === a._id}
                              title="Reenviar código OTP"
                              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-amber-600 transition hover:bg-amber-50 disabled:opacity-50"
                            >
                              <RefreshCw className={`h-3.5 w-3.5 ${resendingId === a._id ? "animate-spin" : ""}`} />
                              <span className="hidden sm:inline">Reenviar OTP</span>
                            </button>
                          )}
                          {!a.isRoot && (
                            <button
                              onClick={() => {
                                setDeleteError(null);
                                setConfirmDeleteId(a._id);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Eliminar</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Mostrando {from}–{to} de {total}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => load(page - 1)}
                  disabled={page <= 1}
                  className="rounded-md p-1.5 transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1,
                  )
                  .reduce<(number | "…")[]>((acc, n, idx, arr) => {
                    if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push("…");
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((n, i) =>
                    n === "…" ? (
                      <span key={`e-${i}`} className="px-1">…</span>
                    ) : (
                      <button
                        key={n}
                        onClick={() => load(n)}
                        className={`min-w-8 rounded-md px-2 py-1 text-xs font-medium transition ${
                          n === page ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                        }`}
                      >
                        {n}
                      </button>
                    ),
                  )}
                <button
                  onClick={() => load(page + 1)}
                  disabled={page >= totalPages}
                  className="rounded-md p-1.5 transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Página siguiente"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {creating && (
        <CreateAdminModal
          onSuccess={() => {
            setCreating(false);
            load(1);
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
              <span className="font-medium text-foreground">{adminToDelete?.email}</span>?
              Esta acción no se puede deshacer.
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
