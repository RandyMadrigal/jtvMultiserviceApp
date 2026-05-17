import { lazy, Suspense } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { ThemeProvider } from "./shared/lib/theme.context";
import { AuthProvider } from "./features/admin/lib/auth.context";
import { ProtectedRoute } from "./features/admin/components/ProtectedRoute";
import { ErrorBoundary } from "./shared/components/ErrorBoundary";
import { ScrollToTop } from "./shared/components/ScrollToTop";

// Lazy loading — cada ruta se carga solo cuando se navega a ella
const HomePage            = lazy(() => import("./features/home/HomePage")           .then((m) => ({ default: m.HomePage })));
const CatalogPage         = lazy(() => import("./features/catalog/CatalogPage")     .then((m) => ({ default: m.CatalogPage })));
const ServicesPage        = lazy(() => import("./features/services/ServicesPage")   .then((m) => ({ default: m.ServicesPage })));
const AboutPage           = lazy(() => import("./features/about/AboutPage")         .then((m) => ({ default: m.AboutPage })));
const ContactPage         = lazy(() => import("./features/contact/ContactPage")     .then((m) => ({ default: m.ContactPage })));
const LoginPage           = lazy(() => import("./features/admin/auth/LoginPage")    .then((m) => ({ default: m.LoginPage })));
const AdminLayout         = lazy(() => import("./features/admin/components/AdminLayout").then((m) => ({ default: m.AdminLayout })));
const ProductsAdminPage   = lazy(() => import("./features/admin/products/ProductsAdminPage").then((m) => ({ default: m.ProductsAdminPage })));
const CategoriesAdminPage = lazy(() => import("./features/admin/categories/CategoriesAdminPage").then((m) => ({ default: m.CategoriesAdminPage })));
const AdminsPage          = lazy(() => import("./features/admin/admins/AdminsPage") .then((m) => ({ default: m.AdminsPage })));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

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
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <ScrollToTop />
            <Routes>
              {/* ── Sitio público ───────────────────────────────────── */}
              <Route path="/"         element={<HomePage />} />
              <Route path="/catalogo" element={<CatalogPage />} />
              <Route path="/servicios" element={<ServicesPage />} />
              <Route path="/nosotros" element={<AboutPage />} />
              <Route path="/contacto" element={<ContactPage />} />

              {/* ── Panel de administración ─────────────────────────── */}
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
          </Suspense>
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}
