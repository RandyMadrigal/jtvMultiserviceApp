import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/shared/lib/auth.context";
import { apiClient } from "@/shared/lib/api-client";
import { extractError } from "@/shared/lib/extractError";
import { AdminPagination } from "../components/AdminPagination";
import { CreateAdminModal } from "./CreateAdminModal";
import { AdminsTable } from "./AdminsTable";
import { DeleteAdminDialog } from "./DeleteAdminDialog";
import { PAGE_SIZE, type Admin, type PaginatedAdmins } from "./admins.types";

export function AdminsPage() {
  const { user } = useAuth();
  const isRoot = user?.isRoot ?? false;

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
        {isRoot && (
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Nuevo administrador
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          <AdminsTable
            admins={admins}
            isRoot={isRoot}
            resendingId={resendingId}
            onResendOtp={handleResendOtp}
            onDelete={(id) => {
              setDeleteError(null);
              setConfirmDeleteId(id);
            }}
          />

          <AdminPagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            onPageChange={load}
          />
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
        <DeleteAdminDialog
          email={adminToDelete?.email}
          error={deleteError}
          deleting={deleting}
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
