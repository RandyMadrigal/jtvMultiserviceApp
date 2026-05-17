import { NavLink } from "react-router-dom";
import { Phone, MapPin, Clock, Mail } from "lucide-react";

const WhatsAppIcon = () => (
  <svg
    className="h-4 w-4"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const navLinks = [
  { to: "/catalogo", label: "Catálogo" },
  { to: "/servicios", label: "Servicios" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/contacto", label: "Contacto" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-dark text-white">
      {/* Subtle gradient mesh in footer */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 10% 110%, rgba(0,153,217,0.5) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 90% 0%, rgba(193,0,126,0.4) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto grid justify-items-center-safe max-w-7xl gap-10 px-4 py-16 md:grid-cols-2  md:px-6">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
            </span>
            <div className="leading-none">
              <span className="block text-base font-bold font-display">
                JTV<span className="text-[#C1007E]">.</span>Multiservice
              </span>
              <span className="block text-[10px] font-medium text-white/50 tracking-widest uppercase mt-0.5">
                Imprenta &amp; Diseño
              </span>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-white/60">
            Imprenta profesional y soluciones gráficas de alto impacto en Santo
            Domingo. Calidad garantizada, entregas puntuales y atención
            personalizada en cada proyecto.
          </p>
          <div className="mt-5 flex gap-2">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className="text-xs text-white/50 transition-colors hover:text-white"
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white/40">
            Contacto
          </h4>
          <ul className="space-y-4 text-sm text-white/65">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-white">
                <Phone className="h-3.5 w-3.5" />
              </span>
              <span className="leading-relaxed">
                Tel. 809-689-4995
                <br />
                Cel. 829-429-2714
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-white">
                <Mail className="h-3.5 w-3.5" />
              </span>
              <a
                href="mailto:jtvmultiservice@gmail.com"
                className="transition-colors hover:text-white"
              >
                jtvmultiservice@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-white">
                <MapPin className="h-3.5 w-3.5" />
              </span>
              <span className="leading-relaxed">
                Av. España No. 2, Local 204
                <br />
                Zona Colonial, Santo Domingo, D.N.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-white">
                <Clock className="h-3.5 w-3.5" />
              </span>
              <span>Lun – Sáb · 8:00 a.m. – 5:00 p.m.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-white/35 md:px-6">
          © {new Date().getFullYear()} JTV Multi-Service, S.R.L. · Todos los
          derechos reservados.
        </p>
      </div>
    </footer>
  );
}
