import { NavLink } from "react-router-dom";
import { Phone, MapPin, Clock, Mail, Printer } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3 md:px-6">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary">
              <Printer className="h-5 w-5" />
            </span>
            <span className="text-lg">
              JTV<span className="text-primary">.</span>Multiservice
            </span>
          </div>
          <p className="mt-4 text-sm text-brand-foreground/70">
            Imprenta profesional y soluciones gráficas de alto impacto. Calidad
            garantizada, entregas puntuales y atención personalizada.
          </p>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-foreground/90">
            Contacto
          </h4>
          <ul className="space-y-3 text-sm text-brand-foreground/70">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Tel. 809-689-4995 &nbsp;·&nbsp; Cel. 829-429-2714</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a
                href="mailto:jtvmultiservice@gmail.com"
                className="hover:text-brand-foreground transition"
              >
                jtvmultiservice@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                Av. España No. 2, Local 204, Isabel La Católica, Zona Colonial,
                Santo Domingo, D.N.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Lun – Sáb · 8:00 a.m. – 5:00 p.m.</span>
            </li>
          </ul>
        </div>

        {/* WhatsApp CTA */}
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-foreground/90">
            Cotiza ahora
          </h4>
          <p className="text-sm text-brand-foreground/70">
            Cuéntanos tu proyecto y recibe una cotización personalizada sin
            compromiso.
          </p>
          <a
            href="https://wa.me/18096894995"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <svg
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Escribir por WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-brand-foreground/60 md:px-6">
          © {new Date().getFullYear()} JTV Multi-Service, S.R.L. Todos los
          derechos reservados.
        </p>
      </div>
    </footer>
  );
}
