import { ZoomIn } from "lucide-react";
import { STATUS_STYLES, STATUS_LABEL, type Product } from "./catalog.constants";

interface ProductCardProps {
  product: Product;
  onZoom: (image: { src: string; alt: string }) => void;
}

export function ProductCard({ product: p, onZoom }: ProductCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elegant">
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-secondary">
        <img
          src={p.images[0]?.url ?? "/placeholder.jpg"}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Status badge */}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm ${STATUS_STYLES[p.status]}`}
        >
          {STATUS_LABEL[p.status]}
        </span>

        {/* Zoom overlay */}
        {p.images[0]?.url && (
          <button
            onClick={() => onZoom({ src: p.images[0].url, alt: p.name })}
            aria-label={`Ver imagen de ${p.name}`}
            className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30"
          >
            <span className="flex h-11 w-11 scale-75 items-center justify-center rounded-full bg-white/90 text-gray-900 opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
              <ZoomIn className="h-5 w-5" />
            </span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
          {p.category?.name}
        </p>
        <h3 className="mt-1.5 font-bold font-display text-base">{p.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {p.description}
        </p>
      </div>
    </article>
  );
}
