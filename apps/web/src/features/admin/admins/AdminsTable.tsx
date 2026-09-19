import { ShieldCheck, Trash2, MailWarning, RefreshCw } from "lucide-react";
import type { Admin } from "./admins.types";

interface AdminsTableProps {
  admins: Admin[];
  isRoot: boolean;
  resendingId: string | null;
  onResendOtp: (adminId: string, email: string) => void;
  onDelete: (adminId: string) => void;
}

export function AdminsTable({
  admins,
  isRoot,
  resendingId,
  onResendOtp,
  onDelete,
}: AdminsTableProps) {
  return (
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
                <td className="hidden sm:table-cell px-4 py-3 text-muted-foreground">{a.email}</td>
                <td className="hidden md:table-cell px-4 py-3 text-muted-foreground">
                  {new Date(a.createdAt).toLocaleDateString("es", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {isRoot && !a.verified && !a.isRoot && (
                      <button
                        onClick={() => onResendOtp(a._id, a.email)}
                        disabled={resendingId === a._id}
                        title="Reenviar código OTP"
                        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-amber-600 transition hover:bg-amber-50 disabled:opacity-50"
                      >
                        <RefreshCw
                          className={`h-3.5 w-3.5 ${resendingId === a._id ? "animate-spin" : ""}`}
                        />
                        <span className="hidden sm:inline">Reenviar OTP</span>
                      </button>
                    )}
                    {isRoot && !a.isRoot && (
                      <button
                        onClick={() => onDelete(a._id)}
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
  );
}
