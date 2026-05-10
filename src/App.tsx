import { Routes, Route, Link } from "react-router-dom";
import { HomePage } from "./routes/index";
import { CatalogPage } from "./routes/catalogo";
import { ServicesPage } from "./routes/servicios";
import { AboutPage } from "./routes/nosotros";
import { GalleryPage } from "./routes/galeria";
import { ContactPage } from "./routes/contacto";

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
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalogo" element={<CatalogPage />} />
      <Route path="/servicios" element={<ServicesPage />} />
      <Route path="/nosotros" element={<AboutPage />} />
      <Route path="/galeria" element={<GalleryPage />} />
      <Route path="/contacto" element={<ContactPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
