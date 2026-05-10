import { useEffect, useState } from "react";
import { Plus, ShieldCheck } from "lucide-react";
import { apiClient } from "../lib/api-client";
import { CreateAdminModal } from "./CreateAdminModal";

interface Admin {
  _id: string;
  email: string;
  createdAt: string;
}

export function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

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
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {admins.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
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
    </div>
  );
}
