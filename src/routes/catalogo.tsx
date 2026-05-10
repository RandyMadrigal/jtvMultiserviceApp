import { Layout } from "@/components/Layout";
import { products, categories, type ProductStatus } from "@/data/products";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

const statusStyles: Record<ProductStatus, string> = {
  disponible: "bg-success/15 text-[oklch(0.45_0.17_150)]",
  agotado: "bg-muted text-muted-foreground",
  promocion: "bg-primary/15 text-primary",
};
const statusLabel: Record<ProductStatus, string> = {
  disponible: "Disponible",
  agotado: "Agotado",
  promocion: "Promoción",
};

export function CatalogPage() {
  const [cat, setCat] = useState<string>("Todos");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return products.filter(
      (p) =>
        (cat === "Todos" || p.category === cat) &&
        (q.trim() === "" || p.name.toLowerCase().includes(q.toLowerCase())),
    );
  }, [cat, q]);

  const allCats = ["Todos", ...categories];

  return (
    <Layout>
      <section className="border-b border-border bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="text-4xl font-bold md:text-5xl">Catálogo</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Descubre todo lo que podemos imprimir para ti. Filtra por categoría
            o busca por nombre.
          </p>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar producto…"
                className="w-full rounded-md border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none ring-ring/50 focus:ring-2"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {allCats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition " +
                  (cat === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary/40 hover:text-primary")
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {filtered.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">
              No encontramos productos para tu búsqueda.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <article
                  key={p.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span
                      className={
                        "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider " +
                        statusStyles[p.status]
                      }
                    >
                      {statusLabel[p.status]}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {p.category}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">{p.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {p.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
