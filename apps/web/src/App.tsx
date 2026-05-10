import { Routes, Route, Link, Navigate } from "react-router-dom";
import { HomePage } from "./features/home/HomePage";
import { CatalogPage } from "./features/catalog/CatalogPage";
import { ServicesPage } from "./features/services/ServicesPage";
import { AboutPage } from "./features/about/AboutPage";
import { GalleryPage } from "./features/gallery/GalleryPage";
import { ContactPage } from "./features/contact/ContactPage";
import { AuthProvider } from "./features/admin/lib/auth.context";
import { ProtectedRoute } from "./features/admin/components/ProtectedRoute";
import { AdminLayout } from "./features/admin/components/AdminLayout";
import { LoginPage } from "./features/admin/auth/LoginPage";
import { ProductsAdminPage } from "./features/admin/products/ProductsAdminPage";
import { CategoriesAdminPage } from "./features/admin/categories/CategoriesAdminPage";
import { AdminsPage } from "./features/admin/admins/AdminsPage";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Página no encontrada
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La página que buscas no existe o fue movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ── Sitio público ─────────────────────────────────────── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/servicios" element={<ServicesPage />} />
        <Route path="/nosotros" element={<AboutPage />} />
        <Route path="/galeria" element={<GalleryPage />} />
        <Route path="/contacto" element={<ContactPage />} />

        {/* ── Panel de administración ───────────────────────────── */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/products" replace />} />
          <Route path="products"   element={<ProductsAdminPage />} />
          <Route path="categories" element={<CategoriesAdminPage />} />
          <Route path="admins"     element={<AdminsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
