import { Trash2 } from "lucide-react";

interface DeleteAdminDialogProps {
  email?: string;
  error: string | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteAdminDialog({
  email,
  error: deleteError,
  deleting,
  onCancel,
  onConfirm,
}: DeleteAdminDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl">
        <h2 className="mb-1 text-lg font-semibold">Eliminar administrador</h2>
        <p className="mb-5 text-sm text-muted-foreground">
          ¿Estás seguro de que quieres eliminar a{" "}
          <span className="font-medium text-foreground">{email}</span>? Esta acción no se puede
          deshacer.
        </p>
        {deleteError && (
          <p className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {deleteError}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => onCancel()}
            disabled={deleting}
            className="rounded-md px-4 py-2 text-sm font-medium transition hover:bg-secondary disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
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
  );
}
