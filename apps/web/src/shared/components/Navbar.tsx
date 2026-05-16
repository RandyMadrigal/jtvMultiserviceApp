import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Printer, Sun, Moon } from "lucide-react";
import { useTheme } from "@/shared/lib/theme.context";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/servicios", label: "Servicios" },
  { to: "/nosotros", label: "Nosotros" },
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
  const { theme, toggle } = useTheme();

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
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={navLinkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={toggle}
            aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            className="rounded-md p-2 text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            to="/contacto"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:scale-105"
          >
            Cotizar ahora
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={toggle}
            aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            className="rounded-md p-2 text-foreground/70 transition-colors hover:bg-secondary"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            aria-label="Abrir menú"
            className="rounded-md p-2"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
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
