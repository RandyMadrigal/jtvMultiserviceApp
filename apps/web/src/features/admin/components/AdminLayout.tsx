import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, Users, LogOut, Printer, Tag, Sun, Moon } from "lucide-react";
import { useAuth } from "../lib/auth.context";
import { useTheme } from "@/shared/lib/theme.context";

const navItems = [
  { to: "/admin/products",   icon: Package, label: "Productos" },
  { to: "/admin/categories", icon: Tag,     label: "Categorías" },
  { to: "/admin/admins",     icon: Users,   label: "Administradores" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
  }`;

export function AdminLayout() {
  const { logout } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-card">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-4 font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-linear-to-br from-primary to-primary/70 text-primary-foreground">
            <Printer className="h-4 w-4" />
          </span>
          <span className="text-sm">JTV <span className="text-primary">Admin</span></span>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Theme toggle + Logout */}
        <div className="border-t border-border p-3 space-y-1">
          <button
            onClick={toggle}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {theme === "dark"
              ? <Sun className="h-4 w-4" />
              : <Moon className="h-4 w-4" />}
            {theme === "dark" ? "Modo claro" : "Modo oscuro"}
          </button>

          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-auto">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Panel de administración</span>
          </div>
        </header>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
