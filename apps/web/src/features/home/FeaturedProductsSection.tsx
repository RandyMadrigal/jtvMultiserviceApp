import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useInView } from "@/shared/hooks/useInView";
import type { Product } from "@/shared/types/api";
import { fadeUp, fadeIn } from "./animations";

export function FeaturedProductsSection({ featured }: { featured: Product[] }) {
  const { ref: featuredRef, inView: featuredInView } = useInView();

  if (featured.length === 0) return null;

  return (
    <section className="py-24">
      <div ref={featuredRef} className="mx-auto max-w-7xl px-4 md:px-6">
        <div className={`flex items-end justify-between gap-4 ${fadeUp(featuredInView)}`}>
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Del catálogo
            </span>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Productos destacados</h2>
            <p className="mt-2 text-muted-foreground">Una muestra de lo que producimos a diario.</p>
          </div>
          <Link
            to="/catalogo"
            className="hidden items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/40 hover:text-primary md:inline-flex"
          >
            Ver todo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <article
              key={p._id}
              className={`group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-[box-shadow,transform] duration-300 hover:-translate-y-1.5 hover:shadow-elegant ${fadeUp(featuredInView)}`}
              style={featuredInView ? { animationDelay: `${100 + i * 80}ms` } : undefined}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                <img
                  src={p.images[0]?.url ?? ""}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-white/80">
                    {p.category?.name}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold font-display text-base">{p.name}</h3>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div
          className={`mt-8 flex justify-center md:hidden ${fadeIn(featuredInView)}`}
          style={featuredInView ? { animationDelay: "600ms" } : undefined}
        >
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground"
          >
            Ver catálogo completo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
