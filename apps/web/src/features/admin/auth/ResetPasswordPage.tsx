import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Printer, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import axios from "axios";
import { extractError } from "@/shared/lib/extractError";
import { apiBase } from "@/shared/config/env";

export function ResetPasswordPage() {
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();
  const token           = searchParams.get("token") ?? "";

  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [showConf, setShowConf]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");
  const [done, setDone]             = useState(false);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-card">
          <p className="mb-4 text-sm text-destructive">
            Enlace de restablecimiento inválido o expirado.
          </p>
          <Link
            to="/admin/forgot-password"
            className="text-sm font-medium text-primary underline underline-offset-2 hover:opacity-80"
          >
            Solicitar un nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${apiBase}/auth/reset-password`, { token, password });
      setDone(true);
      setTimeout(() => navigate("/admin/login"), 3000);
    } catch (err) {
      setError(extractError(err, "No se pudo restablecer la contraseña"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-card">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2 font-bold">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-card">
            <Printer className="h-5 w-5" />
          </span>
          <span className="text-xl">
            JTV <span className="text-primary">Admin</span>
          </span>
        </div>

        {done ? (
          <div className="text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-green-100 text-green-600">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="mb-2 text-xl font-bold">¡Contraseña actualizada!</h1>
            <p className="text-sm text-muted-foreground">
              Tu contraseña fue cambiada correctamente. Redirigiendo al inicio de sesión…
            </p>
          </div>
        ) : (
          <>
            <h1 className="mb-1 text-xl font-bold">Nueva contraseña</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              Crea una contraseña segura para tu cuenta.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="password">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Mín. 8 caracteres, una mayúscula, un número y un carácter especial.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="confirm">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirm"
                    type={showConf ? "text" : "password"}
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConf((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showConf ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Guardando..." : "Guardar nueva contraseña"}
              </button>
            </form>
          </>
        )}

        {!done && (
          <div className="mt-6 border-t border-border pt-5">
            <Link
              to="/admin/login"
              className="flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
