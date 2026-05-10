import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Printer } from "lucide-react";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/servicios", label: "Servicios" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/galeria", label: "Galería" },
  { to: "/contacto", label: "Contacto" },
] as const;

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "rounded-md px-3 py-2 text-sm font-medium text-primary bg-accent"
    : "rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground";

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "rounded-md px-3 py-2.5 text-sm font-medium text-primary bg-accent"
    : "rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary";

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-brand">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand text-brand-foreground shadow-card">
            <Printer className="h-5 w-5" />
          </span>
          <span className="text-lg tracking-tight">
            JTV<span className="text-primary">.</span>Multiservice
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={navLinkClass}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/contacto"
          className="hidden rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:scale-105 md:inline-flex"
        >
          Cotizar ahora
        </Link>

        <button
          aria-label="Abrir menú"
          className="rounded-md p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={mobileNavLinkClass}
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/contacto"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
            >
              Cotizar ahora
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
