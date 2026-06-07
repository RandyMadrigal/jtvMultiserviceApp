import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Printer, ArrowLeft, Mail } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/shared/lib/auth.context";
import { extractError } from "@/shared/lib/extractError";
import { apiBase } from "@/shared/config/env";

type Step = "credentials" | "otp";

export function LoginPage() {
  const { login, verifyOtp, isAuthenticated, isLoading } = useAuth();

  const [step, setStep]         = useState<Step>("credentials");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp]           = useState("");
  const [error, setError]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending]   = useState(false);
  const [resendMsg, setResendMsg]   = useState("");

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/admin/products" replace />;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      const raw = err as { response?: { data?: { code?: string } } };
      if (raw?.response?.data?.code === "EMAIL_NOT_VERIFIED") {
        setStep("otp");
      } else {
        setError("Email o contraseña incorrectos");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await verifyOtp(email, otp);
    } catch (err) {
      setError(extractError(err, "Código inválido o expirado"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendMsg("");
    setError("");
    try {
      await axios.post(`${apiBase}/auth/resend-otp`, { email });
      setResendMsg("Código reenviado. Revisa tu correo.");
    } catch (err) {
      setError(extractError(err, "No se pudo reenviar el código"));
    } finally {
      setResending(false);
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

        {step === "credentials" ? (
          <>
            <h1 className="mb-1 text-xl font-bold">Iniciar sesión</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              Accede al panel de administración
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="email">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/50"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="password">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/50"
                />
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
                {submitting ? "Ingresando..." : "Ingresar"}
              </button>
            </form>

            <div className="mt-3 text-center">
              <Link
                to="/admin/forgot-password"
                className="text-sm text-muted-foreground hover:text-primary transition"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mb-5 flex flex-col items-center gap-2 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold">Verifica tu correo</h1>
              <p className="text-sm text-muted-foreground">
                Ingresa el código de 6 dígitos enviado a{" "}
                <span className="font-medium text-foreground">{email}</span>
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="otp">
                  Código de verificación
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-center text-lg font-mono tracking-widest outline-none focus:ring-2 focus:ring-ring/50"
                />
              </div>

              {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
              {resendMsg && (
                <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
                  {resendMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || otp.length !== 6}
                className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Verificando..." : "Verificar"}
              </button>
            </form>

            <div className="mt-4 flex items-center justify-between text-sm">
              <button
                onClick={() => { setStep("credentials"); setError(""); setOtp(""); }}
                className="text-muted-foreground hover:text-foreground transition"
              >
                ← Volver
              </button>
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-primary hover:opacity-80 transition disabled:opacity-50"
              >
                {resending ? "Reenviando..." : "Reenviar código"}
              </button>
            </div>
          </>
        )}

        <div className="mt-5 border-t border-border pt-5">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al sitio web
          </Link>
        </div>
      </div>
    </div>
  );
}
