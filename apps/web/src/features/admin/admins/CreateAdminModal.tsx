import { useState } from "react";
import { X, MailCheck, MailWarning } from "lucide-react";
import { apiClient } from "@/shared/lib/api-client";
import { extractError } from "@/shared/lib/extractError";

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

export function CreateAdminModal({ onSuccess, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await apiClient.post<{ emailSent: boolean }>("/admin", { email, password });
      setEmailSent(data.emailSent);
    } catch (err: unknown) {
      setError(extractError(err, "Error al crear el administrador"));
    } finally {
      setSubmitting(false);
    }
  };

  if (emailSent !== null) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-semibold">Administrador creado</h2>
            <button onClick={() => { onSuccess(); }} className="rounded-md p-1 hover:bg-secondary">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-6 text-center">
            {emailSent ? (
              <>
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-green-100 text-green-600">
                  <MailCheck className="h-7 w-7" />
                </div>
                <h3 className="mb-2 font-semibold text-lg">¡Cuenta creada!</h3>
                <p className="text-sm text-muted-foreground">
                  Se envió un código de verificación a{" "}
                  <span className="font-medium text-foreground">{email}</span>.
                  El administrador debe ingresar ese código la primera vez que inicie sesión.
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-amber-100 text-amber-600">
                  <MailWarning className="h-7 w-7" />
                </div>
                <h3 className="mb-2 font-semibold text-lg">Cuenta creada</h3>
                <p className="text-sm text-muted-foreground">
                  La cuenta fue creada pero no se pudo enviar el código al correo{" "}
                  <span className="font-medium text-foreground">{email}</span>.
                  Usa el botón <strong>Reenviar OTP</strong> desde la lista de administradores para volver a intentarlo.
                </p>
              </>
            )}
            <button
              onClick={onSuccess}
              className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-semibold">Nuevo administrador</h2>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="email">
              Correo electrónico *
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="password">
              Contraseña *{" "}
              <span className="text-xs text-muted-foreground">(mín. 8 caracteres)</span>
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>

          <p className="rounded-md bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
            Se enviará un código de verificación al correo del nuevo administrador. Deberá usarlo la primera vez que inicie sesión.
          </p>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Creando..." : "Crear administrador"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
