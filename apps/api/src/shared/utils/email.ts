import { Resend } from "resend";
import { env } from "@/shared/config/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  await resend.emails.send({
    from: env.RESEND_FROM,
    to,
    subject: "Restablecer contraseña — JTV Admin",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 12px">Restablecer contraseña</h2>
        <p style="color:#374151;margin:0 0 8px">
          Recibimos una solicitud para restablecer la contraseña de tu cuenta en
          <strong>JTV Multiservice Admin</strong>.
        </p>
        <p style="color:#374151;margin:0 0 20px">
          Haz clic en el botón para crear una nueva contraseña. El enlace expira en <strong>1 hora</strong>.
        </p>
        <a href="${resetUrl}"
           style="display:inline-block;background:#2563eb;color:#fff;font-weight:600;
                  padding:12px 24px;border-radius:8px;text-decoration:none;margin:0 0 20px">
          Restablecer contraseña
        </a>
        <p style="color:#6b7280;font-size:0.875rem;margin:0 0 8px">
          Si el botón no funciona, copia y pega este enlace en tu navegador:
        </p>
        <p style="color:#2563eb;font-size:0.8rem;word-break:break-all;margin:0 0 20px">
          ${resetUrl}
        </p>
        <p style="color:#6b7280;font-size:0.875rem;margin:0">
          Si no solicitaste este cambio, ignora este mensaje. Tu contraseña no cambiará.
        </p>
      </div>
    `,
  });
}

export async function sendOtpEmail(to: string, code: string): Promise<void> {
  const loginUrl = `${env.APP_URL}/admin/login`;

  await resend.emails.send({
    from: env.RESEND_FROM,
    to,
    subject: "Código de verificación — JTV Admin",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 12px">Código de verificación</h2>
        <p style="color:#374151;margin:0 0 8px">
          Tu cuenta de administrador en <strong>JTV Multiservice</strong> ha sido creada.
        </p>
        <p style="color:#374151;margin:0 0 20px">
          Usa el siguiente código para verificar tu correo e iniciar sesión:
        </p>
        <div style="font-size:2rem;font-weight:700;letter-spacing:0.4em;text-align:center;
                    padding:20px;background:#f4f4f5;border-radius:10px;margin:0 0 20px">
          ${code}
        </div>
        <p style="color:#374151;margin:0 0 8px">
          Ingresa con tu correo y contraseña en la página de acceso — el sistema te pedirá
          este código para verificar tu cuenta:
        </p>
        <a href="${loginUrl}"
           style="display:inline-block;background:#2563eb;color:#fff;font-weight:600;
                  padding:12px 24px;border-radius:8px;text-decoration:none;margin:0 0 20px">
          Ir a la página de acceso
        </a>
        <p style="color:#6b7280;font-size:0.875rem;margin:0 0 8px">
          Si el botón no funciona, copia y pega este enlace en tu navegador:
        </p>
        <p style="color:#2563eb;font-size:0.8rem;word-break:break-all;margin:0 0 20px">
          ${loginUrl}
        </p>
        <p style="color:#6b7280;font-size:0.875rem;margin:0">
          Este código expira en <strong>15 minutos</strong>.
          Si no solicitaste esta cuenta, ignora este mensaje.
        </p>
      </div>
    `,
  });
}
