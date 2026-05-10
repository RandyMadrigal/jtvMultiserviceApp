import { Phone, MapPin, Clock, Printer } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-foreground">
      <div className="mx-auto grid place-items-center max-w-7xl gap-10 px-4 py-14 md:grid-cols-3 md:px-6">
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
            Imprenta profesional y servicios gráficos. Calidad, rapidez y
            atención personalizada.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-foreground/90">
            Contacto
          </h4>
          <ul className="space-y-2 text-sm text-brand-foreground/70">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 text-primary" /> +1 (000)
              000-0000
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" /> lorem ipsum
              123, Ciudad, País
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 text-primary" /> Lun – Sáb · 8:00
              A.M a 05:00 P.M
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-foreground/90">
            Síguenos
          </h4>
          <div className="flex justify-center gap-3">
            <a
              aria-label="Instagram"
              href="#"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-primary"
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-brand-foreground/60 md:px-6">
          © {new Date().getFullYear()} JTV Multiservice. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
