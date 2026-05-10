import { useEffect, useState } from "react";
import { Layout } from "@/shared/components/Layout";
import { api } from "@/shared/lib/api";

interface Product {
  _id: string;
  name: string;
  image_url: string;
}

export function GalleryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get<Product[]>("/products")
      .then(({ data }) => setProducts(data.filter((p) => p.image_url)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <section className="border-b border-border bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="text-4xl font-bold md:text-5xl">Galería de trabajos</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Una muestra de los proyectos que hemos producido para nuestros clientes.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : products.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">
              La galería está vacía por el momento.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <figure key={p._id} className="group overflow-hidden rounded-2xl bg-card shadow-card">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
